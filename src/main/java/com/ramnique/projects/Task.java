package com.ramnique.projects;

import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.SparkConf;
import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.commons.lang3.StringEscapeUtils;
import com.google.gson.Gson;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Arrays;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

class Event {
    String uid;
    int experiment_id;
    int experiment_version;
    int variation_id;
    String event_name;
    String time;
    String remote;
    String method;
    String path;
    String referer;
    String agent;

    Event() {
    }

    Event(Event other) {
        uid                = other.uid;
        experiment_id      = other.experiment_id;
        experiment_version = other.experiment_version;
        variation_id       = other.variation_id;
        event_name         = other.event_name;
        time               = other.time;
        remote             = other.remote;
        method             = other.method;
        path               = other.path;
        referer            = other.referer;
        agent              = other.agent;
    }

    String toCSVString() {
        ZonedDateTime t = ZonedDateTime.parse(time);

        ArrayList<String> cols = new ArrayList<String>();
        cols.add(uid);
        cols.add(Integer.toString(experiment_id));
        cols.add(Integer.toString(experiment_version));
        cols.add(Integer.toString(variation_id));
        cols.add(event_name);
        cols.add(t.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ssxxx")));
        cols.add(remote);
        cols.add(method);
        cols.add(path);
        cols.add(referer);
        cols.add(agent);

        return cols.stream()
            .reduce((s1, s2) -> s1 + "," + StringEscapeUtils.escapeCsv(s2))
            .get();
    }
}

public class Task 
{
    public static void main( String[] args )
    {
        SparkConf conf         = new SparkConf().setAppName("My first app");
        JavaSparkContext sc    = new JavaSparkContext(conf);

        JavaRDD<String> infile = sc.textFile("s3a://see-tracker-data/nginx/*/*/*/*/*.gz");
        //JavaRDD<String> infile = sc.textFile("/home/hithaeglir/stl");

        JavaRDD<String> csvLines = infile.flatMap((line) -> {
            Gson gson    = new Gson();
            Event parsed = gson.fromJson(line, Event.class);

            final List<NameValuePair> params = URLEncodedUtils.parse(parsed.path.substring(7), StandardCharsets.UTF_8);
            HashMap<String, String> paramMap = new HashMap<String, String>();

            for (final NameValuePair nv: params) {
                paramMap.put(nv.getName(), nv.getValue());
            }

            parsed.uid               = paramMap.get("uid");
            parsed.event_name        = paramMap.get("event");
            final List<String> parts = Arrays.asList(paramMap.get("alloc").split(","));

            ArrayList<String> records = new ArrayList<String>();

            for (final String exp: parts) {
                final List<String> segments = Arrays.asList(exp.split(":"));
                Event ev                    = new Event(parsed);
                ev.experiment_id            = Integer.parseInt(segments.get(0));
                ev.experiment_version       = Integer.parseInt(segments.get(1));
                ev.variation_id             = Integer.parseInt(segments.get(2));

                records.add(ev.toCSVString());
            }

            return records.iterator();
        });

        ZonedDateTime now = ZonedDateTime.now();

        //csvLines.saveAsTextFile("/home/hithaeglir/stl-out/" + now.format(DateTimeFormatter.ISO_INSTANT) + "/csv");
        csvLines.saveAsTextFile("s3a://see-tracker-data/csv/" + now.format(DateTimeFormatter.ISO_INSTANT) + "/parts");

        System.out.println( "done" );
    }
}
