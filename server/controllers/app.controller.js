'use strict';

var path = require('path'),
    config = require('../config/config'),
    values = require('../config/values.js');

exports.index = function(req, res) {
    var template = path.join(process.env.PWD + '/' + config.dir + '/index.html');
    // googleMapsApiKey is injected rather than hardcoded in index.html — see
    // the note in server/config/environment/development.js for why it is not a
    // secret, and why it still does not belong in committed markup.
    res.render(template, {
        user: req.user,
        values: values,
        googleMapsApiKey: config.googleMaps ? config.googleMaps.apiKey : ''
    });
};