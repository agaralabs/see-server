package com.agaralabs.sieve;

import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SQLContext;
import org.apache.spark.sql.SaveMode;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.SparkConf;
import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URLEncodedUtils;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.List;
import java.util.Properties;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Arrays;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class Task 
{
    private final static int NUM_PARTITIONS = 30;
    private final static String DB_TYPE = System.getenv("DB_TYPE");
    private final static String DB_HOST = System.getenv("DB_HOST");
    private final static String DB_PORT = System.getenv("DB_PORT");
    private final static String DB_USER = System.getenv("DB_USER");
    private final static String DB_PASS = System.getenv("DB_PASS");
    private final static String DB_NAME = System.getenv("DB_NAME");
    private final static String DB_TEMP = System.getenv("DB_TEMP");

    public static void main(String[] args)
    {
        if (args.length != 4) {
            System.out.println("Arguments: INPUT_PREFIX OUTPUT_PREFIX FROM_DATE TO_DATE");
            System.exit(1);
        }

        ZonedDateTime from = ZonedDateTime.parse(args[2]).withZoneSameInstant(ZoneId.of("UTC"));
        ZonedDateTime to   = ZonedDateTime.parse(args[3]).withZoneSameInstant(ZoneId.of("UTC"));

        // build path
        ArrayList<String> path_parts = new ArrayList<String>();
        path_parts.add(args[0]);

        if (from.getYear() == to.getYear()) {
            path_parts.add(String.format("%d", from.getYear()));

            if (from.getMonthValue() == to.getMonthValue()) {
                path_parts.add(String.format("%02d", from.getMonthValue()));

                if (from.getDayOfMonth() == to.getDayOfMonth()) {
                    path_parts.add(String.format("%02d", from.getDayOfMonth()));

                    if (from.getHour() == to.getHour()) {
                        path_parts.add(String.format("%02d", from.getHour()));
                    } else {
                        path_parts.add("*");
                    }
                } else {
                    path_parts.add("*/*");
                }
            } else {
                path_parts.add("*/*/*");
            }
        } else {
            path_parts.add("*/*/*/*");
        }
        path_parts.add("*.gz");

        String input_path = String.join("/", path_parts);
        System.out.println("Getting files from: " + input_path);

        SparkConf conf       = new SparkConf().setAppName("Sieve - nginx parser");
        JavaSparkContext sc  = new JavaSparkContext(conf);
        SQLContext sqlCtx    = new SQLContext(sc);

        JavaRDD<Record> recRDD = sc.textFile(input_path)
            .map(Record::parseFromJsonString)
            .filter((ev) -> {
                ZonedDateTime candidate = ZonedDateTime.parse(ev.time).withZoneSameInstant(ZoneId.of("UTC"));
                return !candidate.toLocalDateTime().isBefore(from.toLocalDateTime()) && !candidate.toLocalDateTime().isAfter(to.toLocalDateTime());
            })
            .flatMap((parsed) -> {
                ArrayList<Record> records = new ArrayList<Record>();

                try {
                    final List<NameValuePair> params = URLEncodedUtils.parse(parsed.path.substring(7), StandardCharsets.UTF_8);
                    HashMap<String, String> paramMap = new HashMap<String, String>();

                    for (final NameValuePair nv: params) {
                        paramMap.put(nv.getName(), nv.getValue());
                    }

                    parsed.uid               = paramMap.get("uid");
                    parsed.event_name        = paramMap.get("event");
                    final List<String> parts = Arrays.asList(paramMap.get("alloc").split(","));

                    for (final String exp: parts) {
                        try {
                            final List<String> segments = Arrays.asList(exp.split(":"));
                            Record ev                   = new Record(parsed);
                            ev.experiment_id            = Integer.parseInt(segments.get(0));
                            ev.experiment_version       = Integer.parseInt(segments.get(1));
                            ev.variation_id             = Integer.parseInt(segments.get(2));
                            records.add(ev);
                        } catch(NumberFormatException e) {
                            System.out.println("## ERROR in path: " + parsed.path);
                            continue;
                        }
                    }
                } catch(Exception e) {
                    System.out.println("## ERROR in line: " + parsed.toString());
                    System.out.println(e.getMessage());
                }
                return records.iterator();
            }).repartition(NUM_PARTITIONS);

        // recRDD.saveAsTextFile(args[1]);

        Dataset<Row> ds = sqlCtx.createDataFrame(recRDD, Record.class);

        if (DB_TYPE.equals("redshift"))
            writeDatasetToRedshift(ds, from, to);
        else
            writeDatasetToPostgres(ds, from, to);

        sc.stop();
    }

    private static void writeDatasetToRedshift(Dataset<Row> ds, ZonedDateTime from, ZonedDateTime to)
    {
        System.out.println("USING REDSHIFT");
        String jdbcUrl = String.format("jdbc:postgresql://%s:%s/%s?user=%s&password=%s", DB_HOST, DB_PORT == null ? "5439" : DB_PORT, DB_NAME, DB_USER, DB_PASS);
        ds.write().mode(SaveMode.Append).format("com.databricks.spark.redshift").option("url", jdbcUrl).option("query", "DELETE FROM ").save();
        ds.write()
            .mode(SaveMode.Append)
            .format("com.databricks.spark.redshift")
            .option("url", jdbcUrl)
            .option("tempdir", DB_TEMP)
            .option("dbtable", "records")
            .option("extracopyoptions", "dateformat 'auto' timeformat 'auto'")
            .save();
    }

    private static void writeDatasetToPostgres(Dataset<Row> ds, ZonedDateTime from, ZonedDateTime to)
    {
        System.out.println("USING POSTGRES");
        System.out.println(System.getenv());
        String jdbcUrl = String.format("jdbc:postgresql://%s:%s/%s", DB_HOST, DB_PORT == null ? "5432" : DB_PORT, DB_NAME);

        Properties connectionProperties = new Properties();
        connectionProperties.put("user", DB_USER);
        connectionProperties.put("password", DB_PASS);
        connectionProperties.put("driver", "org.postgresql.Driver");

        Connection conn = null;
        PreparedStatement st = null;

        // Clean records
        try {
            Class.forName("org.postgresql.Driver");
            conn = DriverManager.getConnection(jdbcUrl);
            st = conn.prepareStatement("DELETE FROM records WHERE time >= ? AND time <= ?");
            st.setTimestamp(1, new Timestamp(from.toEpochSecond()));
            st.setTimestamp(2, new Timestamp(to.toEpochSecond()));
            int res = st.executeUpdate();
            System.out.println(String.format("DELETED %d ROWS", res));
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try { st.close(); } catch (Exception e) {}
            try { conn.close(); } catch (Exception e) {}
        }

        // Write to database
        ds.write().mode(SaveMode.Append).jdbc(jdbcUrl, "records", connectionProperties);
    }

}
