#!/bin/bash
aws emr create-cluster \
    --release-label emr-5.3.0 \
    --instance-type m4.xlarge \
    --instance-count 3 \
    --auto-terminate \
    --use-default-roles \
    --name see-nginx-to-csv \
    --log-uri s3://see-tracker-data/spark-logs/nginx-to-csv/ \
    --applications Name=Spark \
    --ec2-attributes KeyName=seevpc,SubnetId=subnet-6ada3c03 \
    --steps Type=Spark,\
Name="SEE-Spark",\
ActionOnFailure=CONTINUE,\
Args=[--class,com.ramnique.projects.Task,--deploy-mode,cluster,--master,yarn,s3://see-tracker-data/seefinal.jar,s3a://see-tracker-data/nginx,s3a://see-tracker-data/csv/clitest05,2017-01-31T10:00:00+00:00,2017-01-31T10:59:59+00:00]
