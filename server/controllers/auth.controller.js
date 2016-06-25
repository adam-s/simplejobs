'use strict';

var passport = require('passport'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    validationErrorHandler = require('../lib/validationErrorHandler.js');

exports.register = function(req, res, next) {

    req.assert('password', 'You must enter a password').notEmpty();
    req.assert('passwordConfirm', 'Passwords must match').equals(req.body.password);
    req.assert('email', 'You must enter a valid email address').isEmail();

    var errors = req.validationErrors();
    if (errors) return next(validationErrorHandler(errors));

    var user = new User();
    user.email = req.body.email;
    user.password = req.body.password;

    user.save(function(err) {
        if (err) return next(validationErrorHandler(err, true));

        res.status(200);
        res.json(user);
    });
};

exports.login = function(req, res) {
    passport.authenticate('local', function(err, user, info) {
        var token;

        // If passport throws / catches an error
        if (err) {
            res.status(404).json(err);
            return;
        }

        // If a user is found
        if (user) {
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token" : token
            });
        } else {
            // If user is not found
            res.status(401).json(info);
        }

    })(req, res);
};