var SERVERDIR = __dirname + '/../dashboard/server/src';

var express = require('express');
var app = express();

app.use(express.static('./dist-dashboard'))
app.use('/demo', express.static('./dist-demo'))

app.listen(8000, function () {
    console.log("Started dashboard on localhost:8000");
    console.log("Started demo on localhost:8000/demo");
});

require(SERVERDIR + '/app.js');

