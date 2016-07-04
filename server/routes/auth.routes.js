'use strict';

var auth = require('../controllers/auth.controller.js');

module.exports = function(app) {

    // Heart and soul of authentication
    app.route('/auth/register').post(auth.register);
    app.route('/auth/login').post(auth.login);
    app.route('/auth/logout').get(auth.logout);

    // Changing stuff
    app.route('/auth/email').post(auth.email);
    app.route('/auth/change-password').post(auth.passwordChange);
};