var co     = require('co');
var models = require('../models');

function Stats(pool) {
    this.pool = pool;
}

function sqlToObj(row) {
    var uc                         = new models.UniqueCountT();
    uc.experiment                  = new models.ExperimentT();
    uc.experiment.id               = Number(row.experiment_id);
    uc.experiment.version          = Number(row.experiment_version);
    uc.experiment.usr_variation    = new models.VariationT();
    uc.experiment.usr_variation.id = Number(row.variation_id);
    uc.metric_name                 = row.event_name;
    uc.unique_count                = row.ecount;
    return uc;
}

Stats.prototype.fetchEventCounts = function (exp_id, version_id, event_name) {
    var that = this;

    return co(function *() {
        var sql     = [
            'select',
            'count (distinct uid) as ecount, variation_id, event_name',
            'from records',
            'where experiment_id = $1',
            'and experiment_version = $2',
            'and agent not in (select distinct agent from bad_agents)',
            'group by variation_id, event_name',
            'having event_name = $3 or event_name = $4'
        ].join(' ');

        var result = yield that.pool.pquery(sql, [ exp_id, version_id, 'participation', event_name ]);

        result.rows.forEach(function (row) {
            row.experiment_id      = exp_id;
            row.experiment_version = version_id;
        });

        return result.rows.map(sqlToObj);
    });
};

module.exports = Stats;
