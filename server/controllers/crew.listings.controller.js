'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    CrewListing = mongoose.model('CrewListing'),
    app = require('express')();

exports.index = function(req, res, next) {
    CrewListing
        .pagination(req.query.tableState)
        .exec(function(err, results) {
            if(err) return next(err);
            res.json({
                message: null,
                data: results
            });
        });
};

exports.detail = function(req, res, next) {
    res.json({
        message: null,
        data: app.locals.crewListing
    })
};

exports.create = function(req, res, next) {
    var crewListing = new CrewListing(req.body);
    crewListing.save(function(err) {
       if (err) return next(err);
        res.json({
            message: null,
            data: crewListing
        })
    });
};

exports.update = function(req, res, next) {
    var data = _.extend(app.locals.crewListing, req.body);
    data = data.toObject();
    delete data._id;
    app.locals.crewListing.save(function(err, result) {
        if (err) return next(err);
        res.json({
            message: null,
            data: result
        });
    });
};

exports.remove = function(req, res, next) {
    app.locals.crewListing.delete(function(err) {
        if (err) return next(err);
        res.json({
            message: null,
            data: true
        })
    })
};

exports.crewListingById = function(req, res, next, id) {
    CrewListing
        .findById(id)
        .exec(function(err, crewListing) {
            if (err) return next(err);
            app.locals.crewListing = crewListing;
            next();
        });
};