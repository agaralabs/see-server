var co        = require('co');
var config    = require('./config');
var app       = require('./expressapp');
var container = require('./container');

// rebuild cache
co(function *() {
    yield container.get('experiments_cachemapper').purge();
    var experiments = yield container.get('experiments_datamapper').fetchAll();
    tasks = experiments.map(function (exp) {
        return function *() {
            exp.variations = yield container.get('variations_datamapper').fetchByExperimentId(exp.id);
            yield container.get('experiments_cachemapper').reloadExperiment(exp);
        };
    });
    yield tasks;
    console.log('rebuilt experiment cache');
})
    .then(function () {
        // start server
        app.listen(config.app.port, function () {
            console.log('listening on port: %d', config.app.port);
        });
    });
