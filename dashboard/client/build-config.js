let isWatchEnabled = false;
const ENV = process.env.NODE_ENV || 'development'; // eslint-disable-line no-process-env
const API_URL = process.env.API_URL || 'https://see.arawind.com'; // eslint-disable-line no-process-env

if (process.argv[2] && process.argv[2] === '-w') {
    isWatchEnabled = true;
}

module.exports = {
    ENV: ENV,
    API_URL: API_URL,
    isWatchEnabled: isWatchEnabled,
    path: {
        src: __dirname + '/src',
        dist: __dirname + '/dist'
    }
};
