'use strict';

var path = require('path'),
    config = require('../config/config');

exports.index = function(req, res) {
    var template = path.join(process.env.PWD + '/' + config.dir + '/index.html');
    res.render(template, {
        user: {
            email: 'adam@email.com',
            pass: 'password'
        }
    });
};