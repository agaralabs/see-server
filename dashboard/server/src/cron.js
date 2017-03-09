var config = require('./config');
var pg = require('./postgres');
var moment = require('moment-timezone');
var shell = require('exec-sh');
var co = require('co');
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
                err: err,
                stdout: stdout,
                stderr: stderr
            };

            if (err) {
                console.log(err);
                console.log(stderr);
                return reject(err);
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
    return co(function* () {
        var from, to, result, cmd;

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

        if (config.emr)
            res = yield submitToEMR(uid, from, to);
        else
            res = yield submitToSpark(uid, from, to);

        // Clear 
        yield pg.pquery('delete from records where time >= $1 AND time <= $2', [from.format('YYYY-MM-DD HH:mm:ss'), to.format('YYYY-MM-DD HH:mm:ss')]);

        // Reload data
        if (config.postgres.host.indexOf('redshift.amazonaws.com') > 0) {
            // Using redshift
            yield pg.pquery([
                "copy records from '" + config.spark.output_path + '/' + uid + "/part'",
                config.spark.s3_region ? "region '" + config.spark.s3_region + "'" : "",
                process.env.AWS_ACCESS_KEY ? "credentials 'aws_access_key_id=" + process.env.AWS_ACCESS_KEY + ";aws_secret_access_key=" + process.env.AWS_SECRET_KEY + "'" : "",
                "csv",
                "dateformat 'auto'",
                "timeformat 'auto';"
            ].join("\n"), []);
        }
    });
}

function* submitToEMR(uid, from, to) {
    // Launch EMR cluster to process nginx records to csv
    var cmd = generateEmrCmd(uid, from, to);
    var result = yield shellex(cmd);

    // Wait for cluster to boot up
    var parsed = JSON.parse(result.stdout);
    cmd = 'aws emr wait cluster-running --cluster-id ' + parsed.ClusterId;
    yield shellex(cmd);

    // Wait for cluster to terminate
    cmd = 'until aws emr wait cluster-terminated --cluster-id ' + parsed.ClusterId + '; do echo "wait timed out.. trying again"; sleep 2; done';
    return shellex(cmd);
}

function* submitToSpark(uid, from, to) {
    // Submit job to spark cluster to process nginx records to csv
    var cmd = generateSparkCmd(uid, from, to);
    console.log(cmd);
    return shellex(cmd);
}

function generateEmrCmd(uid, from, to) {
    return [
        'aws emr create-cluster',
        '--release-label emr-5.3.0',
        '--instance-type ' + config.emr.instance_type,
        '--instance-count ' + config.emr.instance_count,
        '--auto-terminate',
        '--log-uri ' + config.emr.log_uri,
        '--use-default-roles',
        '--name ' + config.emr.name,
        '--applications Name=Spark',
        '--ec2-attributes ' + config.emr.ec2_attributes,
        '--steps Type=Spark,Name="nginx-to-csv",ActionOnFailure=CONTINUE,Args=[' + generateArgsForSpark(uid, from, to).join(',') + ']'
    ].join(' \\\n');
}

function generateSparkCmd(uid, from, to) {
    return [
        config.spark.cmd,
        generateArgsForSpark(uid, from, to).join(' ')
    ].join(' \\\n');
}

function generateArgsForSpark(uid, from, to) {
    return [
        '--class', config.spark.task_class,
        '--deploy-mode', config.spark.deploy_mode,
        '--master', config.spark.master,
        config.spark.jar_path,
        config.spark.input_path,
        config.spark.output_path + '/' + uid,
        from.format(),
        to.format()
    ];
}
