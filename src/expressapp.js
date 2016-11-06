var express   = require('express');
var bp        = require('body-parser');
var cp        = require('cookie-parser');
var wrap      = require('co-express');
var models    = require('./models');
var container = require('./container');
var app       = express();

app.use(bp.json());
app.use(cp());

app.get('/experiments', wrap(function* (req, res) {
    var experiments = yield container.get('experiments_datamapper').fetchAll();

    res.status(200);
    res.json({ data: { experiments: experiments } });
}));


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

    // Save it
    experiment.id = yield container.get('experiments_datamapper').insert(experiment);

    res.status(201);
    res.json({ data: { experiment: experiment } });
}));

app.get('/experiments/:id', wrap(function *(req, res, next) {
    var experiment = yield container.get('experiments_datamapper').fetchById(req.params.id);

    if (!experiment) {
        return next();
    }

    res.json({ data: { experiment: experiment } });
}));

app.put('/experiments/:id', wrap(function *(req, res, next) {
    // fetch existing
    var existing = yield container.get('experiments_datamapper').fetchById(req.params.id);

    if (!existing) {
        return next();
    }

    var patch = new models.ExperimentT(req.body.experiment); 

    // Validations
    if (!patch.name) {
        res.status(400);
        res.json({
            err_code: 'BAD_DATA',
            err_msg : 'Missing: experiment name'
        });
        return;
    }

    // update
    patch.id = req.params.id;
    yield container.get('experiments_datamapper').update(patch);

    // increase version if required
    if (existing.exposure_percent !== patch.exposure_percent) {
        yield container.get('experiments_datamapper').upgradeVersion(patch.id);
    }

    res.json({ data: { experiment: patch } });
}));

app.get('/experiments/:id/variations', wrap(function *(req, res, next) {
    var experiment = yield container.get('experiments_datamapper').fetchById(req.params.id);

    if (!experiment) {
        return next();
    }

    var variations = yield container.get('variations_datamapper').fetchByExperimentId(req.params.id);
    res.json({ data: { variations: variations } });
}));

app.post('/experiments/:id/variations', wrap(function *(req, res, next) {
    var experiment = yield container.get('experiments_datamapper').fetchById(req.params.id);

    if (!experiment) {
        return next();
    }

    // validations
    var variation = new models.VariationT(req.body.variation);
    variation.experiment_id  = experiment.id;

    if (!variation.name) {
        res.status(400);
        res.json({
            err_code: 'BAD_DATA',
            err_msg : 'Missing: variation name'
        });
        return;
    }

    // create
    yield container.get('variations_datamapper').insert(variation);
    res.status(201);
    res.json({ data: { variation: variation } });
}));

app.put('/experiments/:experiment_id/variations/:variation_id', wrap(function *(req, res, next) {
    var existing = yield container.get('variations_datamapper').fetchById(req.params.variation_id);

    if (!existing) {
        return next();
    }

    if (existing.experiment_id != req.params.experiment_id) {
        return next();
    }

    // validations
    var variation = new models.VariationT(req.body.variation);
    variation.experiment_id  = existing.experiment_id;
    variation.id             = existing.id;

    if (!variation.name) {
        res.status(400);
        res.json({
            err_code: 'BAD_DATA',
            err_msg : 'Missing: variation name'
        });
        return;
    }

    // create
    yield container.get('variations_datamapper').update(variation);
    res.status(200);
    res.json({ data: { variation: variation } });
}));

app.get('/allocate', wrap(function* (req, res) {
    // Get all active experiments
    var experiments = yield container.get('experiments_datamapper').fetchAllActive();

    var tasks = experiments.map(function (exp) {
        return function *() {
            // Decide participation
            var rand                 = Math.random() * 100;
            exp.is_usr_participating = rand - exp.exposure_percent < 0;

            // If participating, allocate bucket
            if (exp.is_usr_participating) {
                // get variations
                exp.variations = yield container.get('variations_datamapper').fetchByExperimentId(exp.id);

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
        };
    });

    yield tasks;
    res.json({ data: { experiments: experiments } });
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
