'use strict';

var path = require('path'),
    config = require('../config/config'),
    values = require('../config/values.js');

exports.index = function(req, res) {
    var template = path.join(process.env.PWD + '/' + config.dir + '/index.html');
    res.render(template, {user: req.user, values: values});
};