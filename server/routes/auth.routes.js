'use strict';

var auth = require('../controllers/auth.controller.js');

module.exports = function(app) {

    app.route('/api/auth/register').post(auth.register)

};