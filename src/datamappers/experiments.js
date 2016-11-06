var co     = require('co');
var models = require('../models');

function ExperimentsDm(pool) {
    this.pool = pool;
}

function buildfromsql(results) {
    // build experiments
    var expdict = results.reduce(function (dict, row) {
        if (!dict[row.E.id]) {
            var e              = new models.ExperimentT();
            e.id               = row.E.id;
            e.name             = row.E.name;
            e.version          = row.E.version;
            e.exposure_percent = row.E.exposure_percent;
            e.is_active        = row.E.is_active;
            e.create_time      = row.E.create_time;
            e.update_time      = row.E.update_time;
            dict[row.E.id]     = e;
        }
        var v           = new models.VariationT();
        v.id            = row.V.id;
        v.name          = row.V.name;
        v.split_percent = row.V.split_percent;
        v.create_time   = row.V.create_time;
        v.update_time   = row.V.update_time;
        dict[row.E.id].variations.push(v);
        return dict;
    }, {});
    var experiments = [];

    for (var expid in expdict) {
        if (!expdict.hasOwnProperty(expid)) {
            continue;
        }
        experiments.push(expdict[expid]);
    }
    return experiments;
}

ExperimentsDm.prototype.fetchById = function (id) {
    var that = this;

    return co(function *() {
        var sql = [
            'SELECT * FROM `variations` V LEFT JOIN `experiments` E',
            'ON V.`experiment_id` = E.`id` WHERE E.`id` = ?'
        ].join('\n');

        var results     = yield that.pool.pquery({ sql: sql, nestTables: true }, [ id ]);
        var experiments = buildfromsql(results);
        return experiments.length ? experiments[0] : null;
    });
};

ExperimentsDm.prototype.fetchActive = function () {
    var that = this;
    return co(function *() {
        var sql = [
            'SELECT * FROM `variations` V LEFT JOIN `experiments` E',
            'ON V.`experiment_id` = E.`id` WHERE E.`is_active` = 1'
        ].join('\n');

        var results = yield that.pool.pquery({ sql: sql, nestTables: true });
        return buildfromsql(results);
    });
}

ExperimentsDm.prototype.insert = function (experiment) {
    var that = this;

    return co(function *() {
        var sql       = 'INSERT INTO `experiments`(`name`, `version`, `exposure_percent`, `is_active`) VALUES(?, ?, ?, ?);';
        var result    = yield that.pool.pquery(sql, [ experiment.name, 1, experiment.exposure_percent, false ]);
        experiment.id = result.insertId;

        var addvariations = experiment.variations.map(function (variation) {
            return co(function *() {
                var sql = 'INSERT INTO `variations`(`experiment_id`, `name`, `split_percent`) VALUES(?, ?, ?);';
                var result = yield that.pool.pquery(sql, [
                    experiment.id,
                    variation.name,
                    variation.split_percent
                ]);
                variation.id = result.insertId;
            });
        });

        yield addvariations;
        return result.insertId;
    });
};

ExperimentsDm.prototype.upgradeVersion = function (experiment) {
    var that = this;

    return co(function *() {
        var sql    = 'UPDATE `experiments` SET `version` = `version` + 1 WHERE `id` = ?;';
        var result = yield that.pool.pquery(sql, [ experiment.id ]);
        if (result.changedRows) {
            experiment.version++;
        }
        return result.changedRows;
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
                is_active       : experiment.is_active
            },
            experiment.id
        ]);
    });
};

module.exports = ExperimentsDm;
