'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    User = mongoose.model('User'),
    app = require('express')();

exports.index = function(req, res) {
    var tableState = req.query.tableState || {};
    tableState.order = tableState.order || '-updated';
    User
        .pagination(tableState)
        .exec(function(err, results) {
            if (err) return res.status(400).send(err);
            res.json(results);
        });
};

exports.detail = function(req, res) {
    res.json(app.locals.user);
};

exports.create = function(req, res) {
    var user = new User(req.body);
    user.save(function(err) {
        if (err) return res.status(400).send(err);
        res.json(user);
    });
};

exports.update = function(req, res) {
    var data = _.extend(app.locals.user, req.body);
    data = data.toObject();
    delete data._id;
    app.locals.user.save(function(err, result) {
        if (err) return res.status(400).send(err);
        res.json(result);
    });
};

exports.remove = function(req, res) {
    app.locals.user.delete(function(err) {
        if (err) return res.status(400).send(err);
        res.json(true);
    })
};

exports.userById = function(req, res, next, id) {
    User
        .findById(id)
        .exec(function(err, user) {
            if (err) return res.status(400).send(err);
            app.locals.user = user;
            next();
        });
};