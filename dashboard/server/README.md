# Sieve Server

This is the server component of Sieve A/B testing framework. 
It allocates experiments and provides a REST-ful API to manage experiments.

## Requirements

- node >= 4
- redis server
- mysql server
- redshift (or postgres) server

## Installation 

```sh
npm install
```

## Configuration

Edit `src/config/config.ini`

```ini
[app]
; The API Port
port                 = 8090
; Allowed origins. Should contain the dashboard
;  and the app which calls /allocate or /track endpoints
cors_allowed_origins = http://localhost:8000
; The publicly accessible URL, used by dashboard
api_url              = http://localhost:8090

[redis]
host = 127.0.0.1
port = 6379

[mysql]
connlimit = 10
host      = localhost
user      = user
password  = password
database  = sieve

; Contains tracked data
[analysisdb]
type     = postgres
host     = localhost
port     = 5432
database = sieve
user     = user
password = password

; Optional settings for the spark cluster (used by cron.js)
; These are settings when it is a standalone spark cluster
; Refer sample-emr.config.ini for sample spark settings 
;  when run in an EMR cluster
[spark]
cmd         = spark-submit
master      = spark://127.0.0.1:7077
task_class  = com.agaralabs.sieve.Task
deploy_mode = client
jar_path    = ./data-processor/target/sieve-nginx-to-csv-1.0-SNAPSHOT-jar-with-dependencies.jar
input_path  = /path/to/data/nginx
output_path = /path/to/data/csv

; Optional settings for the EMR cluster (used by cron.js)
; This section is not necessary if it is a standalone spark cluster
[emr]
name           = sieve-nginx-to-csv
instance_type  = m4.xlarge
instance_count = 3
log_uri        = s3://sieve-tracker-data/emr-logs/
ec2_attributes = KeyName=sieve,SubnetId=<subnet-id>

; Check the #Note section
[tracker]
logfile = /tmp/sieve_tracker.log

```

## Running

```sh
node src/app.js
```

## Note

Event tracking, done through the `/track` endpoint, logs the request to a file.
This works out of the box, and the logs are written to the path set in config.
For production use though, we suggest handling this endpoint through nginx.
Here's a sample configuration:

```nginx
server {
    listen 80;
    server_name YOUR_SERVER_NAME;

    location /track {
        access_log /var/log/nginx/tracker.log;
        return 200 logged;
    }
 
    location / {
        proxy_pass http://127.0.0.1:8080/;
    }
}
```

## API documentation

API documentation is [available here](APIDOC.md).
