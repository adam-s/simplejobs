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

    // // Get any profile by the user ID
    // app.route('/api/profile/:userIdForProfile')
    //     .get(crew.detail);

    // We have actions for all user's profile.
    app.route('/api/profile').all(checkAuthenticated, crew.crewListingBySession)
        .get(crew.detail)
        .delete(crew.remove);

    app.route('/api/profile')
        .all(checkAuthenticated, crew.crewListingBySession, crew.fileHandler) // file handling middle ware on crew
        .post(crew.createProfile, crew.create)
        .put(crew.updateProfile, crew.update);

    // If the app ever needs to have file management this will get refactored into a 'file' resource. No biggie.
    app.route('/files/resumes/:authorId/:fileName')
        .get(checkAuthenticated, crew.crewListingByAuthorId, crew.downloadResume);

    app.param('authorId', crew.crewListingByAuthorId);

};

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
    if (userHasRole('administrator', req.user)) return next();
    return res.status(403).send({message: 'User is not authorized'});
}

function userHasRole(role, user) {
    var roles = user ? user.roles : ['anonymous'];
    return roles.some(function(item) {
        return item === role;
    })
}