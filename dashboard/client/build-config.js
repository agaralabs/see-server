'use strict';

let isWatchEnabled = false;
const ENV = process.env.NODE_ENV || 'development'; // eslint-disable-line no-process-env

if (process.argv[2] && process.argv[2] === '-w') {
    isWatchEnabled = true;
}

module.exports = {
    ENV: ENV,
    isWatchEnabled: isWatchEnabled,
    path: {
        src: __dirname + '/src',
        dist: __dirname + '/dist'
    }
};
