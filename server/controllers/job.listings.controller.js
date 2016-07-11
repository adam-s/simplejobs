'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    JobListing = mongoose.model('JobListing'),
    validationErrorHandler = require('../lib/validationErrorHandler.js'),
    values = require('../config/values.js');

exports.index = function(req, res) {
    var tableState = req.query.tableState || {};
    tableState.order = tableState.order || '-updated';
    JobListing
        .pagination(tableState)
        .exec(function(err, result) {
            if (err) return res.status(400).send(err);
            res.json(result);
        });
};

exports.detail = function(req, res) {
    res.json(req.app.locals.jobListing);
};

exports.create = function(req, res) {
    var jobListing = new JobListing(req.body);
    jobListing.author = req.user._id;

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
        if (err) return res.status(400).send(err);
        res.json(result);
    });
};

exports.remove = function(req, res) {
    req.app.locals.jobListing.delete(function(err) {
        if (err) return res.status(400).send(err);
        res.json(true);
    })
};

exports.jobListingById = function(req, res, next, id) {
    JobListing
        .findById(id)
        .exec(function(err, jobListing) {
            if (err) return res.status(400).send(err);
            req.app.locals.jobListing = jobListing;
            next();
        });
};