# Sieve data processor

Scripts that process Sieve tracker logs and put them into Amazon Redshift.

## Updating EMR Task

The EMR task jar file must be uploaded to s3

```sh
mvn package
aws s3 cp dist/package.jar s3://bucket/dest/path
```

## Running CRON job

First install npm dependencies:

```sh
npm install
```

Configure Redshift connection in `scripts/pg.js`

Install a shell script like this in crontab:

```sh
#!/bin/bash
mkdir -p "$HOME/tmp"
PIDFILE="$HOME/tmp/sieve-mgmt.pid"

if [ -e "${PIDFILE}" ] && (ps -u $(whoami) -opid= |
                           grep -P "^\s*$(cat ${PIDFILE})$" &> /dev/null); then
  echo "Already running."
  exit 99
fi

AWS_ACCESS_KEY=YOUR_ACCESS_KEY AWS_SECRET_KEY=YOUR_SECRET_KEY node scripts/cron.js >> sieve-mgmt.log &

echo $! > "${PIDFILE}"
chmod 644 "${PIDFILE}"
```

Please read contents of `scripts/cron.js` to configure cluster command parameters
