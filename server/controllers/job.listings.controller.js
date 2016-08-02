'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    JobListing = mongoose.model('JobListing'),
    validationErrorHandler = require('../lib/validationErrorHandler.js'),
    values = require('../config/values.js');

exports.index = function(req, res) {

    req.assert('tableState.limit', 'Limit is not a valid param').optional().isInt().lte(10000);
    req.assert('tableState.page', 'Page is not a valid param').optional().isInt().lte(10000);
    req.assert('tableState.author', 'Author is not a valid param').optional().isMongoId();

    var errors = req.validationErrors();
    if (errors) return res.status(400).send(validationErrorHandler(errors));

    var tableState = req.query.tableState || {};
    tableState.order = tableState.order || '-updated';

    var query = JobListing.pagination(tableState);

    // We allow filter on author ID
    if (tableState.author) {
        query.where('author', tableState.author);
    }

    // Only admin and owner can see nonactive listings.
    var isAdmin = req.user && req.user.roles.indexOf('admin') !== -1;
    var isOwner = req.user && tableState.author && req.user._id.toString() === tableState.author.toString();
    if (!(isAdmin || isOwner)) {
        query.where('active', true);
    }

    query
        .exec(function(err, result) {
            if (err) return res.status(400).send(validationErrorHandler(err, true));
            res.json(result);
        });
};

exports.detail = function(req, res) {
    res.json(req.app.locals.jobListing);
};

exports.create = function(req, res) {
    var data = req.body;
    data.author = req.user._id;

    var jobListing = new JobListing(data);

    jobListing.save(function(err) {
        if (err) return res.status(400).send(validationErrorHandler(err, true));
        res.json(jobListing);
    });
};

exports.update = function(req, res) {
    var jobListing = req.app.locals.jobListing;

    // Protect information
    delete req.body.author;
    delete req.body.__v;
    delete req.body._id;

    // Merge objects
    _.merge(jobListing, req.body);

    jobListing.save({runValidators: true}, function(err, result) {
        if (err) return res.status(400).send(validationErrorHandler(err, true));
        res.json(result);
    });
};

exports.remove = function(req, res) {
    var jobListing = req.app.locals.jobListing;

    jobListing.delete(function(err) {
        if (err) return res.status(400).send(validationErrorHandler(err, true));
        res.json(true);
    })
};

exports.jobListingById = function(req, res, next, id) {
    JobListing
        .findById(id)
        .exec(function(err, jobListing) {
            if (err) return res.status(400).send(validationErrorHandler(err, true));
            req.app.locals.jobListing = jobListing;
            next();
        });
};

exports.count = function(req, res) {
    var userId = req.query.userId;

    if (_.isEmpty(userId)) {
        JobListing.count({active: true}, function(err, count) {
            if (err) return res.status(400).send({message: 'An error occurred', errors: [err]});
            return res.json({ total: count })
        });
    } else {
        req.assert('userId', 'Not a valid User ID').isMongoId();

        var errors = req.validationErrors();
        if (errors) return res.status(400).send(validationErrorHandler(errors));

        var isAdmin = req.user && req.user.roles.indexOf('admin') !== -1;
        var isOwner = req.user && userId && req.user._id.toString() === userId;

        JobListing
            .find()
            .where('author', userId)
            .select('active')
            .exec(function(err, listings) {
                if (err) return res.status(400).send({message: 'An error occurred', errors: [err]});

                var activeCount = _.countBy(listings, function(item) {
                    return item.active ? 'active' : 'deactivated'
                });

                if (!isAdmin && !isOwner) {
                    var count = {
                        total: listings.length
                    };

                    return res.json(count);
                } else {
                    var count = {
                        total: listings.length,
                        active: activeCount.active,
                        deactivated: activeCount.deactivated
                    };

                    return res.json(count);
                }


            })
    }

};