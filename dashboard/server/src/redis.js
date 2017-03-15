var redis  = require('redis');
var bb     = require('bluebird');
var config = require('./config');
var logger = require('./config');

bb.promisifyAll(redis.RedisClient.prototype);
bb.promisifyAll(redis.Multi.prototype);

var client = redis.createClient({
    host : config.redis.host,
    port : config.redis.port
});

client.on('error', function (err) {
    logger.error(err.stack);
});

module.exports = client;
