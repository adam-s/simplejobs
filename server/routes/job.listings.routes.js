'use strict';

var jobs = require('../controllers/job.listings.controller.js');

module.exports = function(app) {

    app.route('/api/job-listings')
        .get(jobs.index)
        .post(createJobListing, jobs.create);

    app.route('/api/job-listings/:jobListingId')
        .get(jobs.detail)
        .put(jobs.update)
        .delete(jobs.remove);

    app.param('jobListingId', jobs.jobListingById);
};

// Access check.
function createJobListing(req, res, next) {

    // user is logged in and is authenticated
    if (req.user && userHasRole('authenticated', req.user)) return next();
    res.status(403).send({message: 'User does not have permission'});
}

function userHasRole(role, user) {
    var roles = user ? user.roles : ['anonymous'];
    return roles.some(function(item) {
        return item === role;
    })
}