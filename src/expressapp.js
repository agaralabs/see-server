var express   = require('express');
var bp        = require('body-parser');
var cp        = require('cookie-parser');
var wrap      = require('co-express');
var moment    = require('moment-timezone');
var models    = require('./models');
var container = require('./container');
var app       = express();

app.use(bp.json());
app.use(cp());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', config.app.cors_allowed_origins);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
});

app.get('/experiments', wrap(function* (req, res) {
    var experiments = yield container.get('experiments_datamapper').fetchAll();
    experiments     = experiments.filter(function (exp) {
        return !exp.is_deleted;
    });

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
    var id = yield container.get('experiments_datamapper').insert(experiment);

    // Add control variation
    var vrtn = new models.VariationT({
        name         : 'CONTROL',
        split_percent: 50,
        is_control   : true,
        experiment_id: id
    });
    yield container.get('variations_datamapper').insert(vrtn);

    // fetch again
    var fetched        = yield container.get('experiments_datamapper').fetchById(id);
    fetched.variations = yield container.get('variations_datamapper').fetchByExperimentId(id);
    fetched.variations = fetched.variations.filter(function (vrtn) {
        return !vrtn.is_deleted;
    });

    // update cache
    yield container.get('experiments_cachemapper').reloadExperiment(fetched);

    res.status(201);
    res.json({ data: { experiment: fetched } });
}));

app.get('/experiments/:id', wrap(function *(req, res, next) {
    var experiment = yield container.get('experiments_datamapper').fetchById(req.params.id);

    if (!experiment) {
        return next();
    }

    if (experiment.is_deleted) {
        return next();
    }

    res.json({ data: { experiment: experiment } });
}));

app.delete('/experiments/:id', wrap(function *(req, res, next) {
    // fetch existing
    var existing = yield container.get('experiments_datamapper').fetchById(req.params.id);

    if (!existing) {
        return next();
    }

    if (existing.is_deleted) {
        return next();
    }

    // delete
    yield container.get('experiments_datamapper').delete(existing.id);

    // fetch again
    var fetched        = yield container.get('experiments_datamapper').fetchById(req.params.id);
    fetched.variations = yield container.get('variations_datamapper').fetchByExperimentId(req.params.id);
    fetched.variations = fetched.variations.filter(function (vrtn) {
        return !vrtn.is_deleted;
    });

    // update cache
    yield container.get('experiments_cachemapper').reloadExperiment(fetched);

    res.json({ data: { experiment: fetched } });
}));


app.put('/experiments/:id', wrap(function *(req, res, next) {
    // fetch existing
    var existing = yield container.get('experiments_datamapper').fetchById(req.params.id);

    if (!existing) {
        return next();
    }

    if (existing.is_deleted) {
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

    // fetch again
    var fetched        = yield container.get('experiments_datamapper').fetchById(req.params.id);
    fetched.variations = yield container.get('variations_datamapper').fetchByExperimentId(req.params.id);
    fetched.variations = fetched.variations.filter(function (vrtn) {
        return !vrtn.is_deleted;
    });

    // update cache
    yield container.get('experiments_cachemapper').reloadExperiment(fetched);

    res.json({ data: { experiment: fetched } });
}));

app.get('/experiments/:id/version', wrap(function *(req, res, next) {
    var experiment = yield container.get('experiments_datamapper').fetchById(req.params.id);

    if (!experiment) {
        return next();
    }

    if (experiment.is_deleted) {
        return next();
    }

    res.json({ data: { version: experiment.version } });
}));

app.post('/experiments/:id/version', wrap(function *(req, res, next) {
    var experiment = yield container.get('experiments_datamapper').fetchById(req.params.id);

    if (!experiment) {
        return next();
    }

    if (experiment.is_deleted) {
        return next();
    }

    // increment version
    yield container.get('experiments_datamapper').upgradeVersion(req.params.id);

    // fetch again
    var fetched        = yield container.get('experiments_datamapper').fetchById(req.params.id);
    fetched.variations = yield container.get('variations_datamapper').fetchByExperimentId(req.params.id);
    fetched.variations = fetched.variations.filter(function (vrtn) {
        return !vrtn.is_deleted;
    });

    // update cache
    yield container.get('experiments_cachemapper').reloadExperiment(fetched);

    res.status(201);
    res.json({ data: { version: fetched.version } });
}));

app.get('/experiments/:id/variations', wrap(function *(req, res, next) {
    var experiment = yield container.get('experiments_datamapper').fetchById(req.params.id);

    if (!experiment) {
        return next();
    }

    if (experiment.is_deleted) {
        return next();
    }

    var variations = yield container.get('variations_datamapper').fetchByExperimentId(req.params.id);
    variations     = variations.filter(function (vrtn) {
        return !vrtn.is_deleted;
    });

    res.json({ data: { variations: variations } });
}));

app.post('/experiments/:id/variations', wrap(function *(req, res, next) {
    var experiment = yield container.get('experiments_datamapper').fetchById(req.params.id);

    if (!experiment) {
        return next();
    }

    if (experiment.is_deleted) {
        return next();
    }

    // validations
    var variation = new models.VariationT(req.body.variation);
    variation.experiment_id  = experiment.id;
    variation.is_control     = false;

    if (!variation.name) {
        res.status(400);
        res.json({
            err_code: 'BAD_DATA',
            err_msg : 'Missing: variation name'
        });
        return;
    }

    // create
    var id = yield container.get('variations_datamapper').insert(variation);
 
    // fetch again
    var fetched           = yield container.get('variations_datamapper').fetchById(id);
    experiment.variations = yield container.get('variations_datamapper').fetchByExperimentId(req.params.id);
    experiment.variations = experiment.variations.filter(function (vrtn) {
        return !vrtn.is_deleted;
    });

    // update cache
    yield container.get('experiments_cachemapper').reloadExperiment(experiment);

    res.status(201);
    res.json({ data: { variation: fetched } });
}));

app.get('/experiments/:experiment_id/variations/:id', wrap(function *(req, res, next) {
    var experiment = yield container.get('experiments_datamapper').fetchById(req.params.experiment_id);

    if (!experiment) {
        return next();
    }

    if (experiment.is_deleted) {
        return next();
    }

    var variation = yield container.get('variations_datamapper').fetchById(req.params.id);

    if (!variation) {
        return next();
    }

    if (variation.experiment_id !== experiment.id) {
        return next();
    }

    res.json({ data: { variation: variation } });
}));

app.put('/experiments/:experiment_id/variations/:variation_id', wrap(function *(req, res, next) {
    var experiment = yield container.get('experiments_datamapper').fetchById(req.params.experiment_id);

    if (!experiment) {
        return next();
    }

    if (experiment.is_deleted) {
        return next();
    }

    var existing = yield container.get('variations_datamapper').fetchById(req.params.variation_id);

    if (!existing) {
        return next();
    }

    if (existing.is_deleted) {
        return next();
    }

    if (existing.experiment_id !== experiment.id) {
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

    // dont change name if control variation
    if (existing.is_control) {
        variation.name = existing.name;
    }

    // update
    yield container.get('variations_datamapper').update(variation);
  
    // fetch again
 
    // fetch again
    var fetched           = yield container.get('variations_datamapper').fetchById(existing.id);
    experiment            = yield container.get('experiments_datamapper').fetchById(experiment.id);
    experiment.variations = yield container.get('variations_datamapper').fetchByExperimentId(experiment.id);
    experiment.variations = experiment.variations.filter(function (vrtn) {
        return !vrtn.is_deleted;
    });

    // update cache
    yield container.get('experiments_cachemapper').reloadExperiment(experiment);


    res.status(200);
    res.json({ data: { variation: fetched } });
}));


app.delete('/experiments/:experiment_id/variations/:variation_id', wrap(function *(req, res, next) {
    var experiment = yield container.get('experiments_datamapper').fetchById(req.params.experiment_id);

    if (!experiment) {
        return next();
    }

    if (experiment.is_deleted) {
        return next();
    }

    var existing = yield container.get('variations_datamapper').fetchById(req.params.variation_id);

    if (!existing) {
        return next();
    }

    if (existing.is_deleted) {
        return next();
    }

    if (existing.experiment_id !== experiment.id) {
        return next();
    }

    // dont allow delete if control variation
    if (existing.is_control) {
        res.status(403);
        res.json({
            err_code: 'FORBIDDEN',
            err_msg : 'Cannot delete a CONTROL variation'
        });
        return;
    }

    // delete
    yield container.get('variations_datamapper').delete(existing.id);

    // fetch again
    var fetched           = yield container.get('variations_datamapper').fetchById(existing.id);
    experiment            = yield container.get('experiments_datamapper').fetchById(experiment.id);
    experiment.variations = yield container.get('variations_datamapper').fetchByExperimentId(experiment.id);
    experiment.variations = experiment.variations.filter(function (vrtn) {
        return !vrtn.is_deleted;
    });

    // update cache
    yield container.get('experiments_cachemapper').reloadExperiment(experiment);

    res.status(200);
    res.json({ data: { variation: fetched } });
}));

app.get('/experiments/:experiment_id/stats/counts', wrap(function *(req, res, next) {
    var experiment = yield container.get('experiments_datamapper').fetchById(req.params.experiment_id);

    if (!experiment) {
        return next();
    }

    if (experiment.is_deleted) {
        return next();
    }

    experiment.variations = yield container.get('variations_datamapper').fetchByExperimentId(experiment.id);

    var tasks = experiment.variations.map(function (vrtn) {
        return container.get('stats').fetchEventCounts(
            experiment.id,
            req.query.version ? req.query.version : experiment.version,
            vrtn.id
        ).then(function (counts) {
            vrtn.unique_counts = counts;
        });
    });

    yield tasks;

    res.json({ data: { variations: experiment.variations } });
}));

app.get('/experiments/:experiment_id/stats/timeline/:from/:to/:granularity', wrap(function *(req, res, next) {
    var experiment = yield container.get('experiments_datamapper').fetchById(req.params.experiment_id);

    if (!experiment) {
        return next();
    }

    if (experiment.is_deleted) {
        return next();
    }

    experiment.variations = yield container.get('variations_datamapper').fetchByExperimentId(experiment.id);

    var from;
    var to;
    try {
        from = moment(req.params.from);
        to = moment(req.params.to);
    } catch(e) {
        res.status(400);
        res.json({
            err_code: 'BAD_DATA',
            err_msg : 'Invalid from or to date'
        });
        return;
    }

    if (to.unix() < from.unix()) {
        res.status(400);
        res.json({
            err_code: 'BAD_DATA',
            err_msg : 'To date cannot be less than from date'
        });
        return;
    }

    var tasks = experiment.variations.map(function (vrtn) {
        return container.get('stats').fetchEventTimeline(
            experiment.id,
            req.query.version ? req.query.version : experiment.version,
            vrtn.id,
            moment(req.params.from),
            moment(req.params.to),
            req.params.granularity
        ).then(function (items) {
            vrtn.timeline = items;
        });
    });

    yield tasks;

    res.json({ data: { variations: experiment.variations } });
}));

function serialize(dict) {
    var set = [];
    for (var key in dict) {
        if (dict.hasOwnProperty(key)) {
            set.push(dict[key]);
        }
    }

    return set
        .map(function (exp) {
            return [
                exp.id,
                exp.version,
                exp.is_usr_participating ? exp.usr_variation.id : 0
            ].join(':');
        })
        .join(',');
}

function unserialize(str) {
    var dict = {};
    str.split(',').forEach(function (expstr) {
        var parts                = expstr.split(':');
        var exp                  = new models.ExperimentT();
        exp.id                   = Number(parts[0]);
        exp.version              = Number(parts[1]);
        exp.is_usr_participating = parts[2] !== '0';
        if (exp.is_usr_participating) {
            exp.usr_variation    = new models.VariationT();
            exp.usr_variation.id = Number(parts[2]);
        }
        dict[parts[0]]           = exp;
    });
    return dict;
}

app.get('/allocate', wrap(function* (req, res) {
    var dict = req.query.current ? unserialize(req.query.current) : {};

    // Get all active experiments
    var experiments = yield container.get('experiments_cachemapper').fetchAllActive();

    experiments.forEach(function (exp) {
        // If user has same version, skip
        if (dict[exp.id] && dict[exp.id].version === exp.version) {
            exp.is_usr_participating = dict[exp.id].is_usr_participating;
            // set user variation info
            if (exp.is_usr_participating) {
                exp.variations.forEach(function (vrtn) {
                    if (vrtn.id === dict[exp.id].usr_variation.id) {
                        exp.usr_variation = vrtn;
                    }
                });
            } else {
                exp.usr_variation = null;
            }
            dict[exp.id] = exp;
            return;
        }

        // Decide participation
        var rand                 = Math.random() * 100;
        exp.is_usr_participating = rand - exp.exposure_percent < 0;

        // If participating, allocate bucket
        if (exp.is_usr_participating) {
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

        dict[exp.id] = exp;
    });

    res.json({ data: { experiments: experiments, serialized : serialize(dict) } });
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
