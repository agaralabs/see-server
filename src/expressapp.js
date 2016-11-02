var express   = require('express');
var bp        = require('body-parser');
var cp        = require('cookie-parser');
var wrap      = require('co-express');
var models    = require('./models');
var container = require('./container');
var app       = express();

app.use(bp.json());
app.use(cp());

app.post('/experiments', wrap(function* (req, res) {
    var experiment = new models.ExperimentT(req.body.experiment);    

    // Validations
    if (!experiment.name) {
        res.status(400);
        res.json({
            err_code: 'BAD_DATA',
            err_msg : 'Missing: experiment name'
        });
        return;
    }

    if (!experiment.variations.length) {
        res.status(400);
        res.json({
            err_code: 'BAD_DATA',
            err_msg : 'Minimum one variation required to create experiment'
        });
        return;
    }

    // Save it
    experiment.id = yield container.get('experiments_datamapper').insert(experiment);

    res.status(201);
    res.json(experiment);
}));

app.get('/allocate', wrap(function* (req, res) {
    // Get all active experiments
    var experiments = yield container.get('experiments_datamapper').fetchActive();

    experiments.forEach(function (exp) {
        // Decide participation
        var rand                 = Math.random() * 100;
        exp.usr_is_participating = rand - exp.exposure_percent < 0;

        // If participating, allocate bucket
        if (exp.usr_is_participating) {
            rand = Math.random() * 100;
            var sum = 0;
            for (var i = 0; i < exp.variations.length; ++i) {
                if (rand - (sum + exp.variations[i].split_percent) < 0) {
                    exp.usr_variation = exp.variations[i];
                    break;
                }
                sum += exp.variations[i].split_percent;
            }
        }
    });

    res.json(experiments);
}));

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.json({
        err_code: 'UNKNOWN',
        err_msg : 'An unknown error occured'
    });
});

app.use(function (req, res) {
    res.status(404);
    res.json({
        err_code: 'NOT_FOUND',
        err_msg : 'Requested resource not found'
    });
});

module.exports = app;
