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

};

// Access check.
function checkAuthenticated(req, res, next) {
    // user is logged in and is authenticated
    if (req.user && userHasRole('authenticated', req.user)) return next();
    return res.status(403).send({message: 'User is not authorized'});
}

function checkAdminOrOwn(req, res, next) {
    var user = req.user;
    var jobListing = req.app.locals.jobListing;

    if (!jobListing) return res.status(400).send({message: 'Job listing doesn\'t exist'});
    if (user && userHasRole('admin', user)) return next();
    if (user && jobListing.author.toString() === user._id.toString()) return next();

    return res.status(403).send({message: 'User is not authorized'});

}

function userHasRole(role, user) {
    var roles = user ? user.roles : ['anonymous'];
    return roles.some(function(item) {
        return item === role;
    })
}