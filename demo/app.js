var SERVERDIR = __dirname + '/../server/src';

var express = require('express');
var config  = require(SERVERDIR + '/config');
var app = express();

app.use(express.static('../dashboard'))
app.use('/demo', express.static('./public'))

app.listen(config.app.demo_port, function () {
    console.log("Started dashboard on localhost:%s", config.app.demo_port);
    console.log("Started demo on localhost:%s/demo", config.app.demo_port);
});

require(SERVERDIR + '/app.js');

