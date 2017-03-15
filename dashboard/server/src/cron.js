var config = require('./config');
var pg = require('./postgres');
var moment = require('moment-timezone');
var shell = require('exec-sh');
var co = require('co');

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
                err    : err,
                stdout : stdout,
                stderr : stderr
            };

            if (err) {
                console.log(stdout);
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
        var from, to, result, res;

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

        return res;
    });
}

function* submitToEMR(uid, from, to) {
    // Launch EMR cluster to process nginx records to csv
    var cmd = getEmrCmd(uid, from, to).join(' \\\n');
    var result = yield shellex(cmd);

    // Wait for cluster to boot up
    var parsed = JSON.parse(result.stdout);
    cmd = 'aws emr wait cluster-running --cluster-id ' + parsed.ClusterId;
    yield shellex(cmd);

    // Wait for cluster to terminate
    cmd = 'until aws emr wait cluster-terminated --cluster-id ' + parsed.ClusterId + '; do echo "wait timed out.. trying again"; sleep 2; done';
    return yield shellex(cmd);
}

function* submitToSpark(uid, from, to) {
    // Submit job to spark cluster to process nginx records to csv
    var cmd = getSparkCmd(uid, from, to).join(' \\\n');
    return yield shellex(cmd);
}

function getEmrCmd(uid, from, to) {
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
        '--steps Type=Spark,Name="nginx-to-csv",Jar="command-runner.jar",ActionOnFailure=CONTINUE,' +
        'Args=["' + getSparkCmd(uid, from, to, ',').join('","') + '"]'
    ];
}

function getSparkCmd(uid, from, to, argsep) {
    argsep = argsep || ' ';
    return [
        getSparkEnvVars().join(' ') + ' ' + config.spark.cmd,
        getSparkArgs(uid, from, to).join(argsep)
    ];
}

function getSparkArgs(uid, from, to) {
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

function getSparkEnvVars() {
    return [
        ['DB_TYPE', config.analysisdb.type],
        ['DB_HOST', config.analysisdb.host],
        ['DB_PORT', config.analysisdb.port],
        ['DB_USER', config.analysisdb.user],
        ['DB_PASS', config.analysisdb.password],
        ['DB_NAME', config.analysisdb.database],
        ['DB_TEMP', config.analysisdb.tempdir]
    ].map(function (e) { console.log(e); return e.join('='); });
}

