'use strict';

var crew = require('../controllers/crew.listings.controller.js'),
    multer = require('multer');

module.exports = function(app) {

    // Stuff everybody can see.
    app.route('/api/crew-listings').get(crew.index);
    app.route('/api/crew-listings/:crewListingId').get(crew.detail);

    // Protect these routes with admin access only
    app.route('/api/crew-listings')
        .post(checkAdministrator, crew.fileHandler, crew.create);

    app.route('/api/crew-listings/:crewListingId')
        .put(checkAdministrator, crew.fileHandler, crew.update)
        .delete(checkAdministrator, crew.remove);

    app.param('crewListingId', crew.crewListingById);

    // Add some autocomplete functionality
    // Requires a field i.e. "name" and a query string "q"
    app.route('/api/crew-listings/autocomplete/:field')
        .get(checkAuthenticated, crew.autocomplete);

    // Get any profile by the user ID
    app.route('/api/profile/:userIdForProfile')
        .get(crew.detail);

    app.param('userIdForProfile', crew.crewListingByUserId);

    // We have actions for all user's profile.
    app.route('/api/profile').all(checkAuthenticated, crew.crewListingBySession)
        .get(crew.detail)
        .delete(crew.remove);

    app.route('/api/profile')
        .all(checkAuthenticated, crew.crewListingBySession, crew.fileHandler) // file handling middle ware on crew
        .post(crew.createProfile, crew.create)
        .put(crew.updateProfile, crew.update);

};

// Access check.
function checkAuthenticated(req, res, next) {
    // user is logged in and is authenticated
    if (req.user && userHasRole('authenticated', req.user)) return next();
    return res.status(403).send({message: 'User is not authorized'});
}

function checkAdministrator(req, res, next) {
    // user is logged in and is authenticated
    if (req.user && userHasRole('administrator', req.user)) return next();
    return res.status(403).send({message: 'User is not authorized'});
}

function userHasRole(role, user) {
    var roles = user ? user.roles : ['anonymous'];
    return roles.some(function(item) {
        return item === role;
    })
}