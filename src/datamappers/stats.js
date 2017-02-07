var co     = require('co');
var models = require('../models');

function Stats(pool) {
    this.pool = pool;
}

Stats.prototype.fetchEventCounts = function (exp_id, version_id, vrtn_id) {
    var that = this;

    return co(function *() {
        var sql     = [
            'select',
            'count (distinct uid) as ecount, event_name',
            'from records',
            'where experiment_id = $1',
            'and experiment_version = $2',
            'and variation_id = $3',
            'and agent not in (select distinct agent from bad_agents)',
            'group by event_name'
        ].join(' ');

        var result = yield that.pool.pquery(sql, [ exp_id, version_id, vrtn_id ]);

        var counts = result.rows.map(function (row) {
            return new models.MapT({
                key  : row.event_name,
                value: row.ecount
            });
        });

        return counts;
    });
};

module.exports = Stats;
