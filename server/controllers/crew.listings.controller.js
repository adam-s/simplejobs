'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    CrewListing = mongoose.model('CrewListing');

exports.index = function(req, res) {
    var tableState = req.query.tableState || {};
    tableState.order = tableState.order || '-updated';
    CrewListing
        .pagination(tableState)
        .exec(function(err, results) {
            if (err) return res.status(400).send(err);
            res.json(results);
        });
};

exports.detail = function(req, res) {
    res.json(req.app.locals.crewListing);
};

exports.create = function(req, res) {
    var crewListing = new CrewListing(req.body);
    crewListing.save(function(err) {
        if (err) return res.status(400).send(err);
        res.json(crewListing);
    });
};

exports.update = function(req, res) {
    var data = _.extend(req.app.locals.crewListing, req.body);
    data = data.toObject();
    delete data._id;
    req.app.locals.crewListing.save(function(err, result) {
        if (err) return res.status(400).send(err);
        res.json(result);
    });
};

exports.remove = function(req, res) {
    req.app.locals.crewListing.delete(function(err) {
        if (err) return res.status(400).send(err);
        res.json(true);
    })
};

exports.crewListingById = function(req, res, next, id) {
    CrewListing
        .findById(id)
        .exec(function(err, crewListing) {
            if (err) return res.status(400).send(err);
            req.app.locals.crewListing = crewListing;
            next();
        });
};