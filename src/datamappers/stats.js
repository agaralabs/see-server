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

Stats.prototype.fetchEventTimeline = function (exp_id, version_id, vrtn_id, from, to, granularity) {
    var that = this;

    var granularity_dict = {
        'hourly' : 'hour',
        'daily'  : 'day',
        'weekly' : 'week',
        'monthly': 'month'
    };

    return co( function *() {
        var sql = [
            'select count(distinct uid) as ecount, event_name,',
            'date_trunc(\'' + granularity_dict[granularity] + '\', time AT TIME ZONE \'Asia/Kolkata\') as date',
            'from records',
            'where experiment_id = $1 and experiment_version = $2 and variation_id = $3',
            'and TIMESTAMPTZ_CMP(records.time, $4) >= 0  and TIMESTAMPTZ_CMP(records.time, $5) <= 0',
            'and agent not in (select distinct agent from bad_agents)',
            'group by date_trunc(\'' + granularity_dict[granularity] + '\', time AT TIME ZONE \'Asia/Kolkata\'), event_name;'
        ].join(' ');

        var result = yield that.pool.pquery(sql, [
            exp_id,
            version_id,
            vrtn_id,
            from.format('YYYY-MM-DD HH:mm:ssZ'),
            to.format('YYYY-MM-DD HH:mm:ssZ')
        ]);

        var items = result.rows.map(function (row) {
            return new models.TimelineItemT({
                time      : Number(new Date(row.date)),
                event_name: row.event_name,
                count     : Number(row.ecount)
            });
        });

        return items;
    });
};

module.exports = Stats;
