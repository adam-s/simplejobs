'use strict';

var auth = require('../controllers/auth.controller.js'),
    passport = require('passport');

module.exports = function(app) {

    // Heart and soul of authentication
    app.route('/auth/register').post(auth.register);
    app.route('/auth/login').post(auth.login);
    app.route('/auth/logout').get(auth.logout);

    // TODO Get me '/auth/me'. This returns the user object if any for http interception error.
    app.route('/auth/me').get(auth.fetchMe);

    // Changing stuff
    app.route('/auth/email').post(checkAuthenticated, auth.email);
    app.route('/auth/change-password').post(checkAuthenticated, auth.passwordChange);

    app.route('/auth/forgot-password').post(auth.forgotPassword);
    app.route('/auth/forgot-password-reset').post(auth.forgotPasswordReset)

    // Access check.
    function checkAuthenticated(req, res, next) {

        // user is logged in and is authenticated
        if (!req.user) return res.status(401).send({message: 'User is not authenticated'});
        if (userHasRole('authenticated', req.user)) return next();
        return res.status(403).send({message: 'User is not authorized'});
    }

    function userHasRole(role, user) {
        var roles = user ? user.roles : ['anonymous'];
        return roles.some(function(item) {
            return item === role;
        })
    }

};