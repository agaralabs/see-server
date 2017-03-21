# Sieve A/B testing framework

- [Overview](#overview)
- [Requirements](#requirements)
- [Running the Demo](#running-the-demo)
- [Installing](#installing)
- [Contributing](#contributing)

## Overview

This project is divided into three components:

1. **SDK**: hosts the npm module sieve-js, which is to be integrated by an app or website that wants to perform the A/B test.
1. **API Server**: provides endpoints to create and manage the a/b tests aka experiments. Also handles experiment allocation, tracking and reporting.
1. **Dashboard**: is the admin UI for (1) managing experiments and (2) tracking their performance as the experiment receives traffic.

TODO: Add more information about the flow and the directory structure

## Requirements

- node >= 4
- MySQL
- Redis
- Redshift cluster / PostgreSQL server

*(Optional)* For Data Processing:

- JDK 8
- Maven 3
- Apache Spark 2+ / AWS EMR cluster

## Running the Demo

[Installing](#installing) has general instructions for setting up the project. If you're just trying a demo, [check this out](demo/README.md) for a wrapper that makes the setup easy

## Installing

**Clone the repository:**

```shell
git clone https://github.com/agaralabs/sieve.git
cd sieve
```

**Install the dependencies:**

```shell
.bin/dependencies.sh
```
If you prefer not to build the data processor java application, set the env `WITHOUT_DATAPROC=1`:

```shell
WITHOUT_DATAPROC=1 .bin/dependencies.sh
```

**Configure the API:**

```shell
cd dashboard/server
cp src/config/sample-spark.config.ini src/config/config.ini
```

Modify the config according to the instructions given [here](dashboard/server/README.md#configuration) and return to the project root

```shell
cd ../..
```

**Build:**

```shell
.bin/build.sh
```

As before, if you prefer not to build the data processor java app, you can skip it

```shell
WITHOUT_DATAPROC=1 .bin/build.sh
```

This will create build artifacts in the `dist` directory. It contains the `server` and `dashboard` folders, which correspond to the API app and it's frontend

**Database:**

For MySQL:

Create the database and the user, and grant correct permissions:

```sql
CREATE SCHEMA `sieve`;
CREATE USER sieveuser IDENTIFIED BY "password";
GRANT ALL PRIVILEGES ON sieve.* TO sieveuser;
```

And setup the tables:

```shell
mysql -u sieveuser -p sieve < dashboard/server/db/mysql_schema.sql
```

TODO: Add steps for Postgres

**Run:**

For the API Server:

```shell
cd dist/server
npm install --production
node app.js               # use the "--harmony" flag for node v4
```

For the frontend dashboard, serve the contents via a generic server like nginx/apache, or use this command for a temporary server. Access it through the browser via [http://localhost:8000]()

```shell
cd dist/dashboard
python -m SimpleHTTPServer 8000
```

## Contributing

For bugs and support, please raise an issue on this repository.

To contribute, please fork the project and raise a pull request. Make sure to run tests before pushing.

```shell
.bin/test.sh
.bin/build.sh
```


## License

Apache 2.0
