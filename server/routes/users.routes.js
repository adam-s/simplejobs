'use strict';

var user = require('../controllers/users.controller.js');

module.exports = function(app) {

    app.route('/api/users').all(checkAdministrator)
        .get(user.index)
        .post(user.create);

    app.route('/api/users/:userId').all(checkAdministrator)
        .get(user.detail)
        .put(user.update)
        .delete(user.remove);

    app.param('userId', user.userById);

    app.route('/api/users/autocomplete/:field')
        .get(checkAuthenticated, user.autocomplete);

    // Access check.
    function checkAuthenticated(req, res, next) {
        // user is logged in and is authenticated
        if (!req.user) return res.status(401).send({message: 'User is not authenticated'});
        if (userHasRole('authenticated', req.user)) return next();
        return res.status(403).send({message: 'User is not authorized'});
    }

    function checkAdministrator(req, res, next) {
        // user is logged in and is authenticated
        if (!req.user) return res.status(401).send({message: 'User is not authenticated'});
        if (req.user && userHasRole('administrator', req.user)) return next();
        return res.status(403).send({message: 'User is not authorized'});
    }

    function userHasRole(role, user) {
        var roles = user ? user.roles : ['anonymous'];
        return roles.some(function(item) {
            return item === role;
        })
    }
};