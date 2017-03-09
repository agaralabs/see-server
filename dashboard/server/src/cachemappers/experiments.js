var co     = require('co');
var models = require('../models');

function ExperimentsCm(client) {
    this.client = client;
}

ExperimentsCm.prototype.fetchAllActive = function () {
    var that = this;

    return that.client.smembersAsync('active_exp_set')
        .then(function (ids) {
            var tasks = ids.map(function (id) {
                return that.client.getAsync('exp_id_' + id);
            });
            return Promise.all(tasks);
        })
        .then(function (jsonstrs) {
            return jsonstrs.map(function (str) {
                return str ? new models.ExperimentT(JSON.parse(str)) : null;
            });
        });
};

ExperimentsCm.prototype.reloadExperiment = function (exp) {
    var that = this;

    if (!exp.is_active || exp.is_deleted || exp.variations.length < 2) {
        return this.client.sremAsync('active_exp_set', ['' + exp.id])
            .then(function () {
                return that.client.delAsync('exp_id_' + exp.id);
            });
    }

    return this.client.saddAsync('active_exp_set', ['' + exp.id])
        .then(function () {
            return that.client.setAsync('exp_id_' + exp.id, JSON.stringify(exp));
        });
};

ExperimentsCm.prototype.purge = function () {
    var that = this;

    return that.client.smembersAsync('active_exp_set')
        .then(function (ids) {
            var tasks = ids.map(function (id) {
                return that.client.delAsync('exp_id_' + id);
            });
            return Promise.all(tasks);
        })
        .then(function () {
            return that.client.delAsync('active_exp_set');
        });
};

module.exports = ExperimentsCm;
