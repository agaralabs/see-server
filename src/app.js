var config = require('./config');
var app    = require('./expressapp');

app.listen(config.app.port, function () {
    console.log('listening on port: %d', config.app.port);
});
