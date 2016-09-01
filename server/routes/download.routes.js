'use strict';

var config = require('../config/config'),
    express = require('express');

module.exports = function(app) {
    var pathTo = './' + config.dir + '/' + config.fileDir + '/resumes';
    app.use('/files/resumes', [checkAuthenticated, express.static(pathTo)]);

    // Access check.
    function checkAuthenticated(req, res, next) {
        // user is logged in and is authenticated
        if (req.user && userHasRole('authenticated', req.user)) return next();
        return res.status(403).send({message: 'User is not authorized'});
    }

    function userHasRole(role, user) {
        var roles = user ? user.roles : ['anonymous'];
        return roles.some(function(item) {
            return item === role;
        })
    }
};