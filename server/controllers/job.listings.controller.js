'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    JobListing = mongoose.model('JobListing'),
    app = require('express')();

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
    res.json(app.locals.jobListing);
};

exports.create = function(req, res) {
    var jobListing = new JobListing(req.body);
    jobListing.save(function(err) {
        if (err) return res.status(400).send(err);
        res.json(jobListing);
    });
};

exports.update = function(req, res) {
    var data = _.extend(app.locals.jobListing, req.body);
    data = data.toObject();
    delete data._id;
    app.locals.jobListing.save(function(err, result) {
        if (err) return res.status(400).send(err);
        res.json(result);
    });
};

exports.remove = function(req, res) {
    app.locals.jobListing.delete(function(err) {
        if (err) return res.status(400).send(err);
        res.json(true);
    })
};

exports.jobListingById = function(req, res, next, id) {
    JobListing
        .findById(id)
        .exec(function(err, jobListing) {
            if (err) return res.status(400).send(err);
            app.locals.jobListing = jobListing;
            next();
        });
};