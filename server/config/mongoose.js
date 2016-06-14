'use strict';

var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function () {
    var options = { server: { socketOptions: { keepAlive: 1 } } };
    var db = mongoose.connect(config.db, options);

    // Load the application models
    // Here we use require('../models/artist.model'); to load a model. However, this
    // is tightly coupled to a route so it should perhaps be defined in a config file with routes
    // with an iterator.

    return db;
}