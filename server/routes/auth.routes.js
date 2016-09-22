'use strict';

var auth = require('../controllers/auth.controller.js'),
    passport = require('passport');

module.exports = function(app) {

    // Heart and soul of authentication
    app.route('/auth/register').post(auth.register);
    app.route('/auth/login').post(auth.login);
    app.route('/auth/logout').get(auth.logout);

    // Changing stuff
    app.route('/auth/email').post(auth.email);
    app.route('/auth/change-password').post(auth.passwordChange);

    app.route('/auth/forgot-password').post(auth.forgotPassword);
    app.route('/auth/forgot-password-reset').post(auth.forgotPasswordReset)

};