'use strict';

var passport = require('passport'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    nodemailer = require('nodemailer'),
    mailgun = require('nodemailer-mailgun-transport'),
    config = require('../config/config'),
    async = require('async'),
    crypto = require('crypto'),
    util = require('util'),
    request = require('request'),
    validationErrorHandler = require('../lib/validationErrorHandler.js'),
    emailValidator = require('mailgun-validate-email')(config.mailgun.options.auth.email_validation_key);

exports.register = function(req, res) {
    req.assert('password', 'You must enter a password').notEmpty();
    req.assert('passwordConfirm', 'Passwords must match').equals(req.body.password);
    req.assert('email', 'You must enter a valid email address').isEmail();
    req.assert('recaptcha', 'reCaptcha is required').notEmpty();

    var errors = req.validationErrors();
    if (errors) return res.status(400).send(validationErrorHandler(errors));

    // Validate email here
    emailValidator(req.body.email, function(err, result) {
        console.log(result);
        if (err || !result.is_valid) return res.status(400).send({message: "Email is not valid"});

        var payload = {
            secret: config.recaptcha.secret,
            response: req.body.recaptcha,
            remoteip: req.app.locals.ipAddress
        };

        request.post({url: config.recaptcha.url, form:payload}, function(err, response, body) {
            body = JSON.parse(body);

            if (!body.success) return res.status(400).send({message: 'The reCaptcha didn\'t validate'});

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
        });
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
        console.log(user);
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

    req.assert('password', 'You must enter a password').notEmpty();
    req.assert('newPassword', 'You must enter a new password').notEmpty();
    req.assert('newPasswordConfirm', 'Passwords must match').equals(req.body.newPassword);

    var errors = req.validationErrors();
    if (errors) return res.status(400).send(validationErrorHandler(errors));

    passport.authenticate('local', function(err, user, info) {
        console.log(user);
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

exports.forgotPassword = function(req, res) {
    // create token
    // save to database
    // send mail
    // email links to reset password page
    // return success or error message

    var email = req.body.email;

    async.waterfall([
        // Generate random token
        function(done) {
            crypto.randomBytes(20, function(err, buffer) {
                var token = buffer.toString('hex');
                done(err, token);
            })
        },
        // Look up user by email address and save token and expiration to user
        function(token, done) {
            User.findOne({email: email}, function (err, user) {
                if (err || !user) return done({message: 'User does not exist'});
                done(null, user, token);
            })
        },
        function(user, token, done) {
            user.reset = {
                token: token,
                expires: Date.now() + (60 * 60 * 1000) // 60 min * 60 sec * 1000 milliseconds
            };

            user.save(function(err) {
                if (err) return done(validationErrorHandler(err, true));
                done(null, user, token);
            });
        },
        function(user, token, done) {
            var mailOptions = {
                from: config.mailer.from,
                to: req.body.email,
                subject: 'Resetting the password',
                html: util.format('Reset your <a href="http://localhost:3000/forgot-password-reset/%s">Reset password</a>', token)
            };

            var transport = nodemailer.createTransport(mailgun(config.mailgun.options));

            transport.sendMail(mailOptions, function(err) {
                if (err) return done({message: 'System error'});
                done(err);
            });
        }
    ], function(err) {
        if (err) return res.status(400).send(err);
        res.send({message: 'An email has been sent with further instructions.'});
    });
};

exports.forgotPasswordReset = function(req, res) {

    req.assert('newPassword', 'You must enter a new password').notEmpty();
    req.assert('newPasswordConfirm', 'Passwords must match').equals(req.body.newPassword);

    var errors = req.validationErrors();
    if (errors) return res.status(400).send(validationErrorHandler(errors));

    User.findOne({
        'reset.token': req.body.token,
        'reset.expires': {$gt: Date.now()}
    }, function(err, user) {
        if (err) return res.status(400).send(validationErrorHandler(err, true));
        if (!user) return res.status(400).send({message: 'Token invalid or expired'});

        user.password = req.body.newPassword;
        user.reset = undefined;

        user.save(function(err) {
            if (err) return res.status(400).send(validationErrorHandler(err, true));

            user.password = undefined;
            user.salt = undefined;

            req.login(user, function(err) {
                if (err) return res.status(400).send(err);
                res.json(user);
            });
        });
    });
};

exports.fetchMe = function(req, res) {
    res.send(req.user);
};