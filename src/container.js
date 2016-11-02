var pool          = require('./mysql');
var ExperimentsDm = require('./datamappers/experiments');

var map = {
    'experiments_datamapper': new ExperimentsDm(pool)
};

module.exports = {
    get: function (key) {
        return map[key];
    },

    set: function (key, val) {
        map[key] = val;
    }
};
