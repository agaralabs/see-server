var pg      = require('./pg');
var moment  = require('moment-timezone');
var shell   = require('exec-sh');
var co      = require('co');
var cosleep = require('co-sleep');

function tlog() {
    console.log();
    console.log();
    console.log.apply(this, [moment().format()].concat([].slice.call(arguments)));
}

function shellex(cmd) {
    tlog('\t-> ' + cmd);
    return new Promise(function (resolve, reject) {
        shell(cmd, true, function (err, stdout, stderr) {
            var result = {
                err   : err,
                stdout: stdout,
                stderr: stderr
            };

            if (err) {
                return reject(result);
            }

            resolve(result);
        });
    });
}

init()
    .then(function () {
        tlog('exiting');
    })
    .catch(function (err) {
        tlog('error!', err.stack);
    });

function init() {
    return co(function *() {
        var from, to, result, uid, cmd;

        var now = moment();
        var uid = now.format('YYYY/MM/DD/HH_mm_ss');
        tlog("> Task ID: ", uid);

        // If a from date is passed, use that, othwerwise
        // fetch the last record date from redshift
        if (process.env.FROM_DATE) {
            from = moment(process.env.FROM_DATE).tz('UTC');
        } else {
            result = yield pg.pquery('select max(time) as tmax from records', []);
            from = moment(result.rows[0].tmax).tz('UTC');
        }

        // If a to date is passed, use that, otherwise
        // use the current date
        if (process.env.TO_DATE) {
            to = moment(process.env.TO_DATE).tz('UTC');
        } else {
            to = moment().tz('UTC');
        }

        // Launch EMR cluster to process nginx records to csv
        cmd = [
            'aws emr create-cluster \\',
            '--release-label emr-5.3.0 \\',
            '--instance-type m4.xlarge \\',
            '--instance-count 3 \\',
            '--auto-terminate \\',
            '--log-uri s3://see-tracker-data/emr-logs/ \\',
            '--use-default-roles \\',
            '--name see-nginx-to-csv \\',
            '--applications Name=Spark \\',
            '--ec2-attributes KeyName=seevpc,SubnetId=subnet-6ada3c03 \\',
            '--steps Type=Spark,\\',
            'Name="SEE-Spark",\\',
            'ActionOnFailure=CONTINUE,\\',
            'Args=[--class,com.ramnique.projects.Task,--deploy-mode,cluster,--master,yarn,s3://see-tracker-data/see-final-2.jar,s3a://see-tracker-data/nginx,s3a://see-tracker-data/csv/' + uid + ',' + from.format() + ',' + to.format() + ']'
        ].join('\n');
        result = yield shellex(cmd);

        // Wait for cluster to boot up
        parsed = JSON.parse(result.stdout);
        cmd = 'aws emr wait cluster-running --cluster-id ' + parsed.ClusterId;
        yield shellex(cmd);

        // Wait for cluster to terminate
        cmd = 'until aws emr wait cluster-terminated --cluster-id ' + parsed.ClusterId + '; do echo "wait timed out.. trying again"; sleep 2; done';
        yield shellex(cmd);

        // Clear redshift
        yield pg.pquery('delete from records where time >= $1 AND time <= $2', [from.format('YYYY-MM-DD HH:mm:ss'), to.format('YYYY-MM-DD HH:mm:ss')]);

        // Reload data
        yield pg.pquery([
            "copy records from 's3://see-tracker-data/csv/" + uid + "/part'",
            "region 'ap-southeast-1'",
            "credentials 'aws_access_key_id=" + process.env.AWS_ACCESS_KEY + ";aws_secret_access_key=" + process.env.AWS_SECRET_KEY + "'",
            "csv",
            "dateformat 'auto'",
            "timeformat 'auto';"
        ].join("\n"), []);
    });
}
