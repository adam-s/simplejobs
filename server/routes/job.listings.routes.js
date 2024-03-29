'use strict';

var jobs = require('../controllers/job.listings.controller.js');

module.exports = function(app) {
    app.get('/api/job-listings/count', jobs.count);

    app.route('/api/job-listings')
        .get(jobs.index)
        .post(checkAuthenticated, jobs.create);

    app.route('/api/job-listings/:jobListingId')
        .get(jobs.detail)
        .put(checkAdminOrOwn, jobs.update)
        .delete(checkAdminOrOwn, jobs.remove);

    app.param('jobListingId', jobs.jobListingById);

    app.route('/api/job-listings/autocomplete/:field')
        .get(checkAuthenticated, jobs.autocomplete);
};

// Access check.
function checkAuthenticated(req, res, next) {
    // user is logged in and is authenticated
    if (!req.user) return res.status(401).send({message: 'User is not authenticated'});
    if (userHasRole('authenticated', req.user)) return next();
    return res.status(403).send({message: 'User is not authorized'});
}

function checkAdminOrOwn(req, res, next) {
    var jobListing = req.app.locals.jobListing;
    if (!jobListing) return res.status(400).send({message: 'Job listing doesn\'t exist'});

    if (!req.user) return res.status(401).send({message: 'User is not authenticated'});
    if (userHasRole('administrator', req.user)) return next();
    if (jobListing.author.toString() === req.user._id.toString()) return next();

    return res.status(403).send({message: 'User is not authorized'});

}

function userHasRole(role, user) {
    var roles = user ? user.roles : ['anonymous'];
    return roles.some(function(item) {
        return item === role;
    })
}