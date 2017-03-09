var ini = require('node-ini');
module.exports = ini.parseSync(__dirname + '/config.ini');
