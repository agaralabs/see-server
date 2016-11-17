var mysqlpool     = require('./mysql');
var redisclient   = require('./redis');
var ExperimentsDm = require('./datamappers/experiments');
var ExperimentsCm = require('./cachemappers/experiments');
var VariationsDm  = require('./datamappers/variations');

var map = {
    'experiments_datamapper' : new ExperimentsDm(mysqlpool),
    'experiments_cachemapper': new ExperimentsCm(redisclient),
    'variations_datamapper'  : new VariationsDm(mysqlpool)
};

module.exports = {
    get: function (key) {
        return map[key];
    },

    set: function (key, val) {
        map[key] = val;
    }
};
