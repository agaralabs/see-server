#Sieve Demo
Clone the repository if you haven't

```shell
git clone https://github.com/agaralabs/sieve.git
cd sieve
```

Change your current working directory to this dir

```shell
cd demo
```

Ensure you have the following installed and the services running:

- NodeJS (prefer v6+)
- MySQL
- Redis
- PostgreSQL (optional for the demo)

Create the database and the user, and grant correct permissions in MySQL:

```sql
CREATE SCHEMA `sieve_demo`;
CREATE USER sieveuser IDENTIFIED BY "password";
GRANT ALL PRIVILEGES ON sieve_demo.* TO sieveuser;
```

Edit the `demo-config.ini` according to your setup. For more details, refer [this document](../dashboard/server/README.md#configuration)

To run the demo:

```shell
./run-demo
```

This will install the dependencies, build the project, create tables and seed it with data. Any issues during this process will be thrown as an error. Re-run the command after fixing it. If it is database related, it is better to delete all tables before rerunning.

After this, the dashboard should be running on [http://localhost:8000](http://localhost:8000) and the demo app on [http://localhost:8000/demo](http://localhost:8000/demo)

The demo app's tracking logs should be written to the `tracker.logfile` path in the config. (Default: `/tmp/sieve_tracker.log`)
