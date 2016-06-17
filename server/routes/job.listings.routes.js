'use strict';

var jobs = require('../controllers/job.listings.controller.js');

module.exports = function(app) {

    app.route('/api/job-listings')
        .get(jobs.index)
        .post(jobs.create);

    app.route('/api/job-listings/:jobListingId')
        .get(jobs.detail)
        .put(jobs.update)
        .delete(jobs.remove);

    app.param('jobListingId', jobs.jobListingById);
};