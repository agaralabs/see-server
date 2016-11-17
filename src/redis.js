var redis = require('redis');
var bb    = require('bluebird');

bb.promisifyAll(redis.RedisClient.prototype);
bb.promisifyAll(redis.Multi.prototype);

var client = redis.createClient();

client.on('error', function (err) {
    console.error(err.stack);
});

module.exports = client;
