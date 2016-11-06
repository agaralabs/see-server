var pool          = require('./mysql');
var ExperimentsDm = require('./datamappers/experiments');
var VariationsDm  = require('./datamappers/variations');

var map = {
    'experiments_datamapper': new ExperimentsDm(pool),
    'variations_datamapper' : new VariationsDm(pool)
};

module.exports = {
    get: function (key) {
        return map[key];
    },

    set: function (key, val) {
        map[key] = val;
    }
};
