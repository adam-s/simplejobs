'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    CrewListing = mongoose.model('CrewListing'),
    validationErrorHandler = require('../lib/validationErrorHandler.js');

exports.index = function(req, res) {

    req.assert('tableState.limit', 'Limit is not a valid param').optional().isInt().lte(10000);
    req.assert('tableState.page', 'Page is not a valid param').optional().isInt().lte(10000);
    req.assert('tableState.author', 'Author is not a valid param').optional().isMongoId();

    var errors = req.validationErrors();
    if (errors) return res.status(400).send(validationErrorHandler(errors));

    var tableState = req.query.tableState || {};
    tableState.order = tableState.order || '-updated';
    CrewListing
        .pagination(tableState)
        .exec(function(err, results) {
            if (err) return res.status(400).send(validationErrorHandler(err,true));
            res.json(results);
        });
};

exports.detail = function(req, res) {
    res.json(req.app.locals.crewListing);
};

exports.create = function(req, res) {
    var crewListing = new CrewListing(req.body);
    crewListing.save(function(err) {
        if (err) return res.status(400).send(validationErrorHandler(err,true));
        res.json(crewListing);
    });
};

exports.update = function(req, res) {
    var crewListing = req.app.locals.crewListing;

    // Protect information
    delete req.body.author;
    delete req.body.__v;
    delete req.body._id;

    // Merge objects
    _.merge(crewListing, req.body);

    crewListing.save({runValidators: true}, function(err, result) {
        if (err) return res.status(400).send(validationErrorHandler(err, true));
        res.json(result);
    })
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
            if (!crewListing) return res.status(404).send({message: "File not found"});
            if (err) return res.status(400).send(err);
            req.app.locals.crewListing = crewListing;
            next();
        });
};

exports.crewListingByUserId = function (req, res, next, id) {
    CrewListing
        .find()
        .where('author', id)
        .exec(function(err, crewListing) {
            if (!crewListing) return res.status(404).send({message: "File not found"});
            if (err) return res.status(400).send(err);
            req.app.locals.crewListing = crewListing;
            next();
        });
};

exports.crewListingBySession = function(req, res, next) {
    if (!req.user) return res.status(400).send({message: 'User is not set'});
    CrewListing
        .findOne()
        .where('author', req.user._id)
        .exec(function(err, crewListing) {
            if (err) return res.status(400).send({message: 'An error occurred'});
            req.app.locals.crewListing = crewListing;
            next();
        });
};

exports.createProfile = function(req, res, next) {
    var crewListing = req.app.locals.crewListing;
    if (!_.isEmpty(crewListing)) return res.status(400).send({message: 'Profile already exists'});
    req.body.author = req.user._id;
    next();
};

exports.updateProfile = function(req, res, next) {
    var crewListing = req.app.locals.crewListing;
    if (_.isEmpty(crewListing)) return res.status(400).send({message: 'Profile doesn\'t exist'});
    next();
};