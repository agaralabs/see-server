#!/bin/bash
~/apps/spark-2.1.0/bin/spark-submit \
    --master local[*] \
    --class com.ramnique.projects.Task \
    target/see-nginx-to-csv-1.0-SNAPSHOT.jar \
    "$1" "$2"
