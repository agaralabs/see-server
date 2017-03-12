var models = require('./types');
var cookie = require('js-cookie');
var uuid   = require('uuid');
var fetch  = require('whatwg-fetch').fetch;
var qs     = require('querystring');

function App(opts) {
    this.opts  = {
        base_url: 'http://localhost:8080'
    };

    if (opts) {
        for (var k in this.opts) {
            if (opts.hasOwnProperty(k)) {
                this.opts[k] = opts[k];
            }
        }
    }
}

App.prototype.allocate = function () {
    var that = this;

    return getStorage('allocstr')
        .then(function (allocstr) {
            var uri = that.opts.base_url +
                '/allocate?' +
                qs.stringify({ current: allocstr });

            return window.fetch(uri, { method: 'GET' });
        })
        .then(function (resp) {
            if (!resp.ok) {
                throw new Error(resp.status + ': ' + resp.statusText);
            }
            return resp.json();
        })
        .then(function (body) {
            return setStorage('allocstr', body.data.serialized)
                .then(function () {
                    return body;
                });
        })
        .then(function (body) {
            return that.track.call(that, "participation")
                .then(function () {
                    return body;
                });
        })
        .then(function (body) {
            return body.data.experiments.map(function (exp) {
                return new models.ExperimentT(exp);
            });
        });
};

App.prototype.track = function (event, params) {
    params = params || {};
    var that = this;

    return Promise.all([
        getStorage('allocstr'),
        getId()
    ])
        .then(function (results) {
            params.alloc = results[0];
            params.uid   = results[1];
            params.event = event;
            var uri      = that.opts.base_url + '/track?' + qs.stringify(params);

            return window.fetch(uri, { method: 'GET' });
        })
        .then(function (resp) {
            if (!resp.ok) {
                throw new Error(resp.status + ': ' + resp.statusText);
            }
            return true;
        });
};

function getId() {
    return getStorage('uid')
        .then(function (uid) {
            if (uid) {
                return uid;
            }

            uid = uuid.v1();
            return setStorage('uid', uid)
                .then(function () {
                    return uid;
                });
        });
}

function getStorage(key) {
    return Promise.resolve(cookie.get(key));
}

function setStorage(key, val) {
    return Promise.resolve(cookie.set(key, val));
}

module.exports = App;
