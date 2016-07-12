'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    JobListing = mongoose.model('JobListing'),
    validationErrorHandler = require('../lib/validationErrorHandler.js'),
    values = require('../config/values.js');

exports.index = function(req, res) {
    var user = req.user || {};
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

    jobListing.save(function(err, result) {
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