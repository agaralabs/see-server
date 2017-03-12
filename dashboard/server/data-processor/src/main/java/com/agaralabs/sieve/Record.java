package com.agaralabs.sieve;

import java.time.format.DateTimeFormatter;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import org.apache.commons.lang.StringEscapeUtils;

import com.google.gson.Gson;

import java.io.Serializable;
import java.sql.Timestamp;

public class Record implements Serializable {
    String uid;
    int experiment_id;
    int experiment_version;
    int variation_id;
    String event_name;
    String time;
    Timestamp timestamp;
    String remote;
    String method;
    String path;
    String referer;
    String agent;

    public Record() {
    }

    Record(Record e) {
        this.uid                = e.uid;
        this.experiment_id      = e.experiment_id;
        this.experiment_version = e.experiment_version;
        this.variation_id       = e.variation_id;
        this.event_name         = e.event_name;
        this.time               = e.time;
        this.timestamp          = new Timestamp(ZonedDateTime.parse(time).withZoneSameInstant(ZoneId.of("UTC")).toEpochSecond());
        this.remote             = e.remote;
        this.method             = e.method;
        this.path               = e.path;
        this.referer            = e.referer;
        this.agent              = e.agent;
    }

    public String getUid() {
        return this.uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public int getExperiment_id() {
        return this.experiment_id;
    }

    public void setExperiment_id(int experiment_id) {
        this.experiment_id = experiment_id;
    }

    public int getExperiment_version() {
        return this.experiment_version;
    }

    public void setExperiment_version(int experiment_version) {
        this.experiment_version = experiment_version;
    }

    public int getVariation_id() {
        return this.variation_id;
    }

    public void setVariation_id(int variation_id) {
        this.variation_id = variation_id;
    }

    public String getEvent_name() {
        return this.event_name;
    }

    public void setEvent_name(String event_name) {
        this.event_name = event_name;
    }

    public Timestamp getTime() {
        return this.timestamp;
    }

    public void setTime(Timestamp timestamp) {
        this.timestamp = timestamp;
        this.time = ZonedDateTime.ofInstant(timestamp.toInstant(), ZoneId.of("UTC")).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ssxxx"));
    }

    public String getIp() {
        return this.remote;
    }

    public void setIp(String ip) {
        this.remote = ip;
    }

    public String getMethod() {
        return this.method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getPath() {
        return this.path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getReferer() {
        return this.referer;
    }

    public void setReferer(String referer) {
        this.referer = referer;
    }

    public String getAgent() {
        return this.agent;
    }

    public void setAgent(String agent) {
        this.agent = agent;
    }

    static Record parseFromJsonString(String line)
    {
        Gson gson = new Gson();
        return gson.fromJson(line, Record.class);
    }

    @Override
    public String toString(){
        return toCSVString();
    }

    String toCSVString() {

        ArrayList<String> cols = new ArrayList<String>();
        cols.add(uid);
        cols.add(Integer.toString(experiment_id));
        cols.add(Integer.toString(experiment_version));
        cols.add(Integer.toString(variation_id));
        cols.add(event_name);
        cols.add(time);
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