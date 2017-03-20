var SERVERDIR = __dirname + '/../server/src';

var path    = require('path');
var express = require('express');
var config  = require(SERVERDIR + '/config');
var app = express();

app.use('/demo', express.static('./public'));
app.use(express.static('../dashboard'), function (req, res) {
    if(/\/[^.]+$/.test(req.path))
        res.sendFile(path.resolve(__dirname + '/../dashboard/index.html'));
    else
        res.sendStatus(404);
});

app.listen(config.app.demo_port, function () {
    console.log("Started dashboard on localhost:%s", config.app.demo_port);
    console.log("Started demo on localhost:%s/demo", config.app.demo_port);
});

require(SERVERDIR + '/app.js');
