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

    var query = JobListing.pagination(tableState);

    // We allow filter on author ID
    if (tableState.author) query.where('author', tableState.author);
    if (tableState.active) query.where('active', tableState.active);
    if (tableState.email) query.where('email', tableState.email);
    if (tableState.location) query.where('location.name', tableState.location);
    if (tableState.jobType) query.where('jobType', {
        "$in" : Array.isArray(tableState.jobType) ? tableState.jobType : [tableState.jobType]
    });
    if (tableState.vesselType) query.where('vesselType', tableState.vesselType);
    if (tableState.position) query.where('position', tableState.position);

    // Only admin and owner can see nonactive listings.
    var isAdmin = req.user && req.user.isAdmin();
    var isOwner = req.user && tableState.author && req.user._id.toString() === tableState.author.toString();
    if (!(isAdmin || isOwner)) {
        query.where('active', true);
    }

    // Location proximity search
    // The proximity search sorts so we don't want to override it
    if (tableState.longitude && tableState.latitude) {
        query.where('location.coordinates', {
            $near : {
                $geometry: {
                    type: "Point",
                    coordinates: [tableState.longitude, tableState.latitude]
                }
            }
        });
    } else {
        query.sort(tableState.order || '-updated');
    }

    query
        .exec(function(err, result) {
            if (err) return res.status(400).send(validationErrorHandler(err, true));
            res.json(result);
        });
};
exports.autocomplete = function(req, res) {
    req.assert('field', 'Fields are limited to name and email').inArray(['name', 'email', 'location.name']);
    req.assert('q', 'Search query string is required').notEmpty();

    var errors = req.validationErrors();
    if (errors) return res.status(400).send(validationErrorHandler(errors));

    var field = req.params.field,
        searchString = req.query.q.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

    var match = new RegExp(searchString, 'i');
    var rules = {};
    rules[field] = match;

    JobListing.aggregate([
        { $match: rules },
        { $limit: 10 },
        { $group: {
            _id: '$' + field
        }}
    ], function(err, results) {
        if (err) return res.status(400).send(validationErrorHandler(err, true));

        results = results.map(function(result) {
            return result._id;
        });

        res.json(results);
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
    delete jobListing.kind;

    _.assignIn(jobListing, req.body);

    jobListing.save({ runValidators: true }, function(err) {
        if (err) return res.status(400).send(validationErrorHandler(err, true));
        res.json(jobListing);
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
        .select('-__v')
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

        var isAdmin = req.user && req.user.roles.indexOf('administrator') !== -1;
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