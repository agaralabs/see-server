var co     = require('co');
var models = require('../models');

function ExperimentsDm(pool) {
    this.pool = pool;
}

function sqlToObj(row) {
    var e = new models.ExperimentT();
    e.id               = row.id;
    e.name             = row.name;
    e.exposure_percent = row.exposure_percent;
    e.version          = row.version;
    e.metric_name      = row.metric_name || "";
    e.is_active        = Boolean(row.is_active);
    e.is_deleted       = Boolean(row.is_deleted);
    e.create_time      = Number(row.create_time);
    e.update_time      = Number(row.update_time);
    return e;
}

ExperimentsDm.prototype.fetchById = function (id) {
    var that = this;

    return co(function *() {
        var sql     = 'SELECT * FROM `experiments` WHERE `id` = ?;';
        var results = yield that.pool.pquery(sql, [ id ]);
        return results.length ? sqlToObj(results[0]) : null;
    });
};

ExperimentsDm.prototype.fetchAll = function () {
    var that = this;

    return co(function *() {
        var sql     = 'SELECT * FROM `experiments`;';
        var results = yield that.pool.pquery(sql);
        return results.map(function (row) {
            return sqlToObj(row);
        });
    });
};

ExperimentsDm.prototype.insert = function (experiment) {
    var that = this;

    return co(function *() {
        var sql = 'INSERT INTO `experiments`(`name`, `exposure_percent`, `is_active`, `version`, `metric_name`) VALUES(?, ?, ?, ?, ?);';
        var result = yield that.pool.pquery(sql, [
            experiment.name,
            experiment.exposure_percent,
            false,
            1,
            experiment.metric_name
        ]);
        experiment.id = result.insertId;
        return result.insertId;
    });
};

ExperimentsDm.prototype.update = function (experiment) {
    var that = this;

    return co(function *() {
        var sql    = 'UPDATE `experiments` SET ? WHERE `id` = ?;';
        var result = yield that.pool.pquery(sql, [
            {
                name            : experiment.name,
                exposure_percent: experiment.exposure_percent,
                is_active       : experiment.is_active,
                metric_name     : experiment.metric_name
            },
            experiment.id
        ]);
        return result.changedRows;
    });
};

ExperimentsDm.prototype.upgradeVersion = function (id) {
    var that = this;

    return co(function *() {
        var sql    = 'UPDATE `experiments` SET `version` = `version` + 1 WHERE `id` = ?;';
        var result = yield that.pool.pquery(sql, [ id ]);
        return result.changedRows;
    });
};

ExperimentsDm.prototype.delete = function (id) {
    var that = this;

    return co(function *() {
        var sql    = 'UPDATE `experiments` SET `is_deleted` = 1 WHERE `id` = ?;';
        var result = yield that.pool.pquery(sql, [ id ]);
        return result.changedRows;
    });
};

module.exports = ExperimentsDm;
