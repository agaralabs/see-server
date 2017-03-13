var express   = require('express');
var bp        = require('body-parser');
var cp        = require('cookie-parser');
var wrap      = require('co-express');
var math      = require('mathjs');
var moment    = require('moment-timezone');
var models    = require('./models');
var container = require('./container');
var config    = require('./config');
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

    var varcounts = [];

    var tasks = experiment.variations.map(function (vrtn) {
        return container.get('stats').fetchEventCounts(
            experiment.id,
            req.query.version ? req.query.version : experiment.version,
            vrtn.id
        ).then(function (counts) {
            var varcount = new models.VariationCountT();
            // remove participation from "counts" and add it to "variation"
            var participation = 0
            var participationIndex = -1
            for (var i = 0; i < counts.length; i++) {
              if (counts[i].key == "participation") {
                participation = counts[i].value
                participationIndex = i
                break;
              }
            }
            // remove participation from counts array
            counts.splice(participationIndex, 1);

            // add rate = value / parition to each of the counts
            counts.map(function (row) {
              var rate = 0;
              if (participation > 0) {
                rate = row.value / participation
              }
              row.rate = rate;
            });
            varcount.unique_counts = counts;
            // add participation at "variation" level
            varcount.id = vrtn.id;
            varcount.is_control = vrtn.is_control;
            varcounts.push(varcount)
        });
    });
    yield tasks;
    addTestStatistics(varcounts)
    res.json({ data: { variations: varcounts } });
}));

// Compares control and variation
// For formulas https://en.wikipedia.org/wiki/Statistical_hypothesis_testing
function addTestStatistics(variations) {
  for (var i = 0; i < variations.length; i++) {
    if (variations[i].is_control) {
      for (var j = 0; j < variations.length; j++) {
        if (!variations[j].is_control && i != j) {
          compareControlVariation(variations[i], variations[j], "binomial")
        }
      }
      break;
    }
  }
}

function compareControlVariation(control, variation, distribution) {
  control.unique_counts.map(function (ctrl_count) {
    variation.unique_counts.map(function (var_count) {
      if (ctrl_count.key == var_count.key) {
        if (distribution == "binomial") {
          var zscore = getZScore(ctrl_count.rate, control.participation,
            var_count.rate, variation.participation)
          var_count.zscore = zscore
          var_count.pvalue = getPValue(zscore)
        }
      }
    });
  });
}

function getZScore(ctrl_value, ctrl_count, var_value, var_count) {
  // standard deviation formula from https://en.wikipedia.org/wiki/Binomial_distribution#Normal_approximation
  // zscore formula from https://en.wikipedia.org/wiki/Statistical_hypothesis_testing
  // Two-proportion z-test, pooled for H0: p1 = p2
  var ctrl_std_err = Math.sqrt(ctrl_value * (1 - ctrl_value) / ctrl_count);
  var var_std_err = Math.sqrt(var_value * (1 - var_value) / var_count);
  return (ctrl_value - var_value) / Math.sqrt(Math.pow(ctrl_std_err, 2) + Math.pow(var_std_err, 2));
}

function cdfNormal(x, mean, std_deviation) {
    return (1 - math.erf((mean - x ) / (Math.sqrt(2) * std_deviation))) / 2;
};

function getPValue(x) {
  return cdfNormal(x, 0, 1)
}

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

    var vartimelines = [];
    var tasks = experiment.variations.map(function (vrtn) {
        var vartimeline = new models.VariationTimelineT();
        return container.get('stats').fetchEventTimeline(
            experiment.id,
            req.query.version ? req.query.version : experiment.version,
            vrtn.id,
            moment(req.params.from),
            moment(req.params.to),
            req.params.granularity
        ).then(function (items) {
            vartimeline.id = vrtn.id
            vartimeline.timeline = items;
            vartimelines.push(vartimeline);
        });
    });

    yield tasks;

    res.json({ data: { variations: vartimelines } });
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
