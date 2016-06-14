'use strict';

var path = require('path'),
    config = require('../config/config');

// Express drops through all the route middle ware to find a URL that matches a definition.
// If it gets to the bottom and doesn't find anything because this is a single page app
// AngularJS on the client should handle the 404 with the client side routing. Here we are saying
// didn't find a route? No problem just send the index page and don't worry about it on the server

module.exports = function(app) {

    // Looking for a static resource if it is not found in the client directory it falls through to
    // here. A 404 needs to be sent to the client because the catch all index.html hangs up the browser
    app.all('/:url(css|api|styles|bower_components|scripts|images|templates)/*', function(req, res) {
        console.log(req);
        res.status(404)
            .send('Not found');
    });

    app.all('/*', function(req, res) {
        res.sendFile(path.join(process.env.PWD + '/' + config.dir + '/index.html'));
    });
};