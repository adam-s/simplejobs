'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    JobListing = mongoose.model('JobListing'),
    app = require('express')();

exports.index = function(req, res, next) {
    JobListing
        .pagination(req.query.tableState)
        .exec(function(err, result) {
            if(err) return next(err);
            res.json({
                message: null,
                data: result
            });
        });
};

exports.detail = function(req, res, next) {
    res.json({
        message: null,
        data: app.locals.jobListing
    })
};

exports.create = function(req, res, next) {
    var jobListing = new JobListing(req.body);
    jobListing.save(function(err) {
        if (err) return next(err);
        res.json({
            message: null,
            data: jobListing
        })
    });
};

exports.update = function(req, res, next) {
    var data = _.extend(app.locals.jobListing, req.body);
    data = data.toObject();
    delete data._id;
    app.locals.jobListing.save(function(err, result) {
        if (err) return next(err);
        res.json({
            message: null,
            data: result
        });
    });
};

exports.remove = function(req, res, next) {
    app.locals.jobListing.delete(function(err) {
        if (err) return next(err);
        res.json({
            message: null,
            data: true
        })
    })
};

exports.jobListingById = function(req, res, next, id) {
    JobListing
        .findById(id)
        .exec(function(err, jobListing) {
            if (err) return next(err);
            app.locals.jobListing = jobListing;
            next();
        });
};