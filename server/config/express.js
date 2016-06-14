'use strict';

var config = require('./config'),
    http = require('http'),
    express = require('express'),
    morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

// Define the Express configuration method
module.exports = function (db) {
    // Create a new Express application instance
    var app = express();

    // Create a new HTTP server
    var server = http.createServer(app);

    // Use the 'NODE_ENV' variable to activate the 'morgan' logger or 'compress' middleware
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }

    // Use the 'body-parser' and 'method-override' middleware functions
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    // Set the application view engine and 'views' folder
    app.set('views', './server/views');
    app.set('view engine', 'jade');

    // Configure static file serving
    app.use(express.static('./' + config.dir));

    // Load the routing files
    require('../routes/index.routes.js')(app);

    // This has to go last as a catch all
    require('../routes/app.routes.js')(app);

    // Return the Server instance
    return server;
}