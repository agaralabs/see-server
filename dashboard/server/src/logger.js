var winston = require('winston');
var moment  = require('moment-timezone');
var config  = require('./config');

var Logger = winston.Logger;

var TrackerTransport = null;

if (config.tracker && config.tracker.logfile) {
    TrackerTransport = new winston.transports.File({
        formatter : formatRequest,
        filename  : config.tracker.logfile,
        json      : false
    });
} else {
    TrackerTransport = new winston.transports.Console({
        formatter : formatRequest,
        json      : false
    });
}

Logger.prototype._tracker = new winston.Logger({
    transports: [
        TrackerTransport
    ]
});

Logger.prototype.track = function (req) {
    return this._tracker.info(req);
};

function formatRequest(req) {
    req = req.meta;

    return JSON.stringify({
        remote  : req.ip || '-',
        host    : req.hostname || '-',
        user    : req.user || '-',
        method  : req.method,
        path    : req.originalUrl,
        code    : 200,
        referer : req.headers.referer || '',
        agent   : req.headers['user-agent'] || '',
        time    : moment().tz('UTC').format()
    });
}

// Re-open log file post logrotate, when a SIGUSR2 signal is sent.
// This is akin to nginx, but SIGUSR2 is used instead of SIGUSR1
// because of https://nodejs.org/api/process.html#process_signal_events
process.on('SIGUSR2', function () {
    if (Logger.prototype._tracker.transports.file)
        Logger.prototype._tracker.transports.file._createStream();
});

module.exports = new Logger({
    transports: [
        new winston.transports.Console({ timestamp: true })
    ]
});
