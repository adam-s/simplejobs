'use strict';

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = function(app) {
    // Serialize sessions
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // Deserialize sessions
    passport.deserializeUser(function (id, done) {
        User.findOne({
            _id: id
        }, '-salt -hashedPassword -__v -deleted', function (err, user) {
            done(err, user);
        });
    });

    // Add strategies
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function(username, password, done) {
        User.findOne({ email: username }, function(err, user) {
            // Check if error
            if (err) return done(err);

            // Check user not found
            if (!user || !user.authenticate(password)) {
                return done(null, false, {
                    message: 'Invalid email or password'
                });
            }

            // Everything is A-OK :)
            return done(null, user);
        })
    }));

    // Add passport's middleware
    app.use(passport.initialize());
    app.use(passport.session());
};