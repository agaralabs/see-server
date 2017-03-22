# Sieve A/B testing framework

- [Overview](#overview)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Installing](#installing)
- [Contributing](#contributing)

Sieve is a simple API-based a/b testing framework designed for ease of use and quick to start. It is meant
for those organizations who prefer to build and operate their own a/b testing framework rather than using
a third party service.

## Why Sieve?

## Features

## Overview of project

This project is divided into three components:

1. **SDK**: hosts the npm module sieve-js, which is to be integrated by an app or website that wants to perform the A/B test.
1. **API Server**: provides endpoints to create and manage the a/b tests aka experiments. Also handles experiment allocation, tracking and reporting.
1. **Dashboard**: is the admin UI for (1) managing experiments and (2) tracking their performance as the experiment receives traffic.

The flow:

1. Create an experiment using the dashboard, set it's exposure, add variations, and set their splits.
![](https://agaralabs.github.io/sieve/images/screen-1.png)
![](https://agaralabs.github.io/sieve/images/screen-2.png)
2. Integrate the SDK into your client, and request the server to allocate experiments and their variations. Trigger the required changes in the client based on the response.

	```javascript
	var client = new Sieve({
   		base_url: 'https://sieve.server'
	});
	
	client.allocate().then(function (experiments) {
		// Change client based on allocated experiments+variations
	})
	.catch(function (err) {
		console.error(err);
	})
	```
3. Track relevant user actions.

	```javascript
	client.track('pay_btn_click');
	```

All the tracked events are stored in a file as JSON strings.
This file(s) need to be processed offline at regular intervals, and then saved into the analytics database,
for which there is a Spark Java application bundled along with the server code.
Using this will require a Spark or EMR cluster to be set up.
If you prefer to not do this, you can write your own scripts to parse the log files and save it in the database.


## Requirements

- node >= 4
- MySQL
- Redis
- Redshift cluster / PostgreSQL server

*(Optional)* For Data Processing:

- JDK 8
- Maven 3
- Apache Spark 2+ / AWS EMR cluster

## Quick Start

To make it easy for you to test out the framework, we've created a simple demo app. This section lists out the procedure to get it running.

Let's start off by cloning this repository:

```shell
git clone https://github.com/agaralabs/sieve.git
```

Change your current working directory to the demo:

```shell
cd sieve/demo
```

This directory contains the demo app, a sample config and a script that will install the dependencies, build all the components, create tables and seed it with the sample data.

But before running this script, you need to ensure that you've installed NodeJS, MySQL, and Redis. MySQL & Redis services should be running too.

Now you need to create the `sieve_demo` database and the `sieveuser` user, and grant privileges for the database:

```sql
CREATE SCHEMA `sieve_demo`;
CREATE USER sieveuser IDENTIFIED BY "password";
GRANT ALL PRIVILEGES ON sieve_demo.* TO sieveuser;
```

If you need to, modify the `demo-config.ini`. For more details, refer [this document](dashboard/server/README.md#configuration)

Finally, run the demo:

```shell
./run-demo
```

If the script faces any issue during this process, it will throw an error.
Re-run the command after fixing it.
But if the error is database related, it is better to delete all the tables before re-running.

If everything goes right, the dashboard should be running on [http://localhost:8000](http://localhost:8000) and the demo app on [http://localhost:8000/demo](http://localhost:8000/demo)

To end the demo, press `CTRL+C`

The demo app's tracking logs should be written to the `tracker.logfile` path in the config. (Default value: `/tmp/sieve_tracker.log`)

## Installing

If you haven't already cloned the repo, do so, as given at the beginning of Quickstart.

**Install the dependencies:**

If you've built the demo app, you can skip this step, as it has already installed the dependencies. Otherwise, run:

```shell
.bin/dependencies.sh
```

If you prefer not to build the data processor java application, set the env `WITHOUT_DATAPROC=1`:

```shell
WITHOUT_DATAPROC=1 .bin/dependencies.sh
```

**Configure the API:**

The config file needs to be present at `dashboard/server/src/config/config.ini`.
This file does not exist and needs to be created. You can copy a sample config and modify it:

```shell
cd dashboard/server
cp src/config/sample-spark.config.ini src/config/config.ini
```

Modify the config according to the instructions given [here](dashboard/server/README.md#configuration) and return to the project root.

```shell
cd ../..
```

Note: For security reasons, the config file is not saved to the repo. If you're using a CI, this file needs to be provided during the build process by other means.

The config file is read during the build, and the public url of the API is injected into the dashboard UI build.

**Build:**

```shell
.bin/build.sh
```

As before, if you prefer not to build the data processor java app, you can skip it.

```shell
WITHOUT_DATAPROC=1 .bin/build.sh
```

This will create build artifacts in the `dist` directory. It contains the `server` and `dashboard` folders, which correspond to the API app and it's frontend.

**Setup Database:**

MySQL is used for storing experiments. To set it up:

Create the `sieve` database and the `sieveuser` user, and grant permissions to the database. If you've followed the process listed in Quickstart, you should not create the user, but you need to create the database and assign privileges.

```sql
CREATE SCHEMA `sieve`;
CREATE USER sieveuser IDENTIFIED BY "password";
GRANT ALL PRIVILEGES ON sieve.* TO sieveuser;
```

And setup the tables. This is done automatically in the demo script, but needs to be done manually for general installations.

```shell
mysql -u sieveuser -p sieve < dashboard/server/db/mysql_schema.sql
```

You can skip the rest of the database setup if you are not setting up analytics now.

**For analytics database:**

We've kept the experiments store separate from the tracker store. PostgreSQL is used for this and can be replaced by Amazon Redshift when you need more performance.

Instructions for PostgreSQL:

After installing Postgres, run these commands on the shell to create the database and the user. Depending on your OS, you might have to login as `postgres` user for these commands to work.

```shell
createdb sieve
createuser sieveuser -l -P			# enter the password at prompt
```

Enter into the psql prompt and grant all privileges on the `sieve` tables to `sieveuser`:

```shell
$ psql

psql (9.5.6)
Type "help" for help.

postgres=# GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO sieveuser;
```

Edit the `pg_hba.conf` to allow `sieveuser` to login into the `sieve` db from host `127.0.0.1` using a password. Restart the postgres service after editing

```shell
# Your data directory may vary
# Check your installation for details
# Running `SHOW data_directory` at psql prompt might help

sudo vi /etc/postgresql/9.5/main/pg_hba.conf

# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    sieve           sieveuser       127.0.0.1/32            md5

# Add the above line to the end of the file, save, and quit
# Restart postgres

```

Test by logging into the database:

```shell
psql -U sieveuser -W -h 127.0.0.1 sieve     # Enter password at prompt

psql (9.5.6)
Type "help" for help.

sieve=>
# quit
sieve=> \q
```

Load the schema into the database:

```shell
psql -U sieveuser -W -h 127.0.0.1 -d sieve -a -f dashboard/server/db/pg_schema.sql
```

And you're done!

Instructions for Redshift:

Create the cluster on AWS Console and load the schema in `dashboard/server/db/redshift_schema.sql`

**Run:**

For the API Server:

```shell
cd dist/server
npm install --production
node app.js               # use the "--harmony" flag for node v4
```

For the frontend dashboard, serve the contents via a generic server like nginx/apache, or use this command for a temporary server. Access it through the browser via [http://localhost:8000](http://localhost:8000).

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
