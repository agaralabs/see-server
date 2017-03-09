var redis  = require('redis');
var bb     = require('bluebird');
var config = require('./config');

bb.promisifyAll(redis.RedisClient.prototype);
bb.promisifyAll(redis.Multi.prototype);

var client = redis.createClient({
	host: config.redis.host,
	port: config.redis.port
});

client.on('error', function (err) {
    console.error(err.stack);
});

module.exports = client;
