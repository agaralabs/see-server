var config = require('./config');
var mysql  = require('mysql');
var pool   = mysql.createPool({
    connectionLimit : config.mysql.connlimit,
    host            : config.mysql.host,
    user            : config.mysql.user,
    password        : config.mysql.password,
    database        : config.mysql.database
});
var logger  = require('./logger');

function pquery(sql, params) {
    var that = this;

    return new Promise(function (resolve, reject) {
        that.getConnection(function (err, conn) {
            if (err) {
                return reject(err);
            }
            logger.info('MySQL Query: %s', mysql.format(sql.sql ? sql.sql : sql, params));
            conn.query(sql, params, function (err, result) {
                conn.release();
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    });
}

pool.pquery    = pquery.bind(pool);
module.exports = pool;
