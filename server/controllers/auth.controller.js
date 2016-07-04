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
    if (errors) return res.status(400).send(validationErrorHandler(errors));

    var user = new User();
    user.email = req.body.email;
    user.password = req.body.password;

    user.save(function(err) {
        if (err) return res.status(400).send(validationErrorHandler(err, true));

        user.password = user.passwordConfirm = undefined;
        user.salt = undefined;

        req.login(user, function(err) {
            if (err) return res.status(400).send(err);
            res.json(user);
        })
    });
};

exports.login = function(req, res, next) {

    req.assert('password', 'You must enter a password').notEmpty();
    req.assert('email', 'You must enter a valid email address').isEmail();

    var errors = req.validationErrors();
    if (errors) return res.status(400).send(validationErrorHandler(errors));

    passport.authenticate('local', function(err, user, info) {
        if (err || !user) return res.status(400).send(info);

        user.password = undefined;
        user.salt = undefined;

        req.login(user, function(err) {
            if (err) return res.status(400).send(err);
            res.json(user);
        });
    })(req, res, next);
};

exports.logout = function(req, res, next) {
    console.log('logging out');
    req.logout();
    res.redirect('/');
};

exports.email = function(req, res, next) {
    req.assert('password', 'You must enter a password').notEmpty();
    req.assert('email', 'You must enter a valid email address').isEmail();
    req.assert('newEmail', 'You must enter a valid email address').isEmail();

    var errors = req.validationErrors();
    if (errors) return res.status(400).send(validationErrorHandler(errors));

    passport.authenticate('local', function(err, user, info) {
        if (err || !user) return res.status(400).send(info);

        user.email = req.body.newEmail;

        user.save(function(err) {
            if (err) return res.status(400).send(validationErrorHandler(err, true));

            user.newEmail = undefined;
            user.password = undefined;
            user.salt = undefined;

            res.json(user);
        });

    })(req, res, next);
};

exports.passwordChange = function(req, res, next) {
    console.log(req.body);

    req.assert('password', 'You must enter a password').notEmpty();
    req.assert('newPassword', 'You must enter a new password').notEmpty();
    req.assert('newPasswordConfirm', 'Passwords must match').equals(req.body.newPassword);

    var errors = req.validationErrors();
    if (errors) return res.status(400).send(validationErrorHandler(errors));

    passport.authenticate('local', function(err, user, info) {
        if (err || !user) return res.status(400).send(info);

        user.password = req.body.newPassword;

        user.save(function(err) {
            if (err) return res.status(400).send;

            user.salt = undefined;
            user.hashedPassword = undefined;

            res.json(user);
        });

    })(req, res, next);
};