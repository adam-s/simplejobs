'use strict';

var crew = require('../controllers/crew.listings.controller.js'),
    multer = require('multer'),
    upload = multer({dest: 'uploads/'});

module.exports = function(app) {

    // Protect these routes with admin access only
    app.route('/api/crew-listings')
        .get(crew.index)
        .post(crew.create);

    app.route('/api/crew-listings/:crewListingId')
        .get(crew.detail)
        .put(crew.update)
        .delete(crew.remove);

    app.param('crewListingId', crew.crewListingById);

    // Get any profile by the user ID
    app.route('/api/profile/:userId')
        .get(crew.detail);
    
    // We have actions for all user's profile.
    app.route('/api/profile').all(checkAuthenticated, crew.crewListingBySession)
        .get(crew.detail)
        .delete(crew.remove);

    app.route('/api/profile')
        .all(checkAuthenticated, crew.crewListingBySession, crew.fileHandler) // file handling middle ware on crew
        .post(crew.createProfile, crew.create)
        .put(crew.updateProfile, crew.update);

    app.param('userId', crew.crewListingByUserId);
};

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