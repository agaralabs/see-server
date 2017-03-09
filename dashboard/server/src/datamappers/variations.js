var co     = require('co');
var models = require('../models');

function VariationsDm(pool) {
    this.pool = pool;
}

function sqlToObj(row) {
    var v = new models.VariationT();
    v.id               = row.id;
    v.name             = row.name;
    v.is_control       = Boolean(row.is_control);
    v.experiment_id    = row.experiment_id;
    v.split_percent    = row.split_percent;
    v.is_deleted       = Boolean(row.is_deleted);
    v.create_time      = Number(row.create_time);
    v.update_time      = Number(row.update_time);
    return v;
}

VariationsDm.prototype.fetchById = function (id) {
    var that = this;

    return co(function *() {
        var sql     = 'SELECT * FROM `variations` WHERE `id` = ?;';
        var results = yield that.pool.pquery(sql, [ id ]);
        return results.length ? sqlToObj(results[0]) : null;
    });
};

VariationsDm.prototype.fetchByExperimentId = function (id) {
    var that = this;

    return co(function *() {
        var sql     = 'SELECT * FROM `variations` WHERE `experiment_id` = ? ORDER BY `id`;';
        var results = yield that.pool.pquery(sql, [ id ]);
        return results.map(function (row) {
            return sqlToObj(row);
        });
    });
};

VariationsDm.prototype.insert = function (variation) {
    var that = this;

    return co(function *() {
        var sql = 'INSERT INTO `variations`(`experiment_id`, `name`, `is_control`, `split_percent`) VALUES(?, ?, ?, ?);';
        var result = yield that.pool.pquery(sql, [
            variation.experiment_id,
            variation.name,
            variation.is_control,
            variation.split_percent
        ]);
        variation.id = result.insertId;
        return result.insertId;
    });
};

VariationsDm.prototype.update = function (variation) {
    var that = this;

    return co(function *() {
        var sql    = 'UPDATE `variations` SET ? WHERE `id` = ?;';
        var result = yield that.pool.pquery(sql, [
            {
                name         : variation.name,
                split_percent: variation.split_percent
            },
            variation.id
        ]);
    });
};

VariationsDm.prototype.delete = function (id) {
    var that = this;

    return co(function *() {
        var sql    = 'UPDATE `variations` SET `is_deleted` = 1 WHERE `id` = ?;';
        var result = yield that.pool.pquery(sql, [ id ]);
    });
};

module.exports = VariationsDm;
