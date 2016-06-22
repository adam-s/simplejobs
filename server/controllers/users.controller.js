'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    User = mongoose.model('User'),
    app = require('express')();

exports.index = function(req, res, next) {
    var tableState = req.query.tableState || {};
    tableState.order = tableState.order || '-updated';
    User
        .pagination(tableState)
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
        data: app.locals.user
    })
};

exports.create = function(req, res, next) {
    var user = new User(req.body);
    user.save(function(err) {
        if (err) return next(err);
        res.json({
            message: null,
            data: user
        })
    });
};

exports.update = function(req, res, next) {
    var data = _.extend(app.locals.user, req.body);
    data = data.toObject();
    delete data._id;
    app.locals.user.save(function(err, result) {
        if (err) return next(err);
        res.json({
            message: null,
            data: result
        });
    });
};

exports.remove = function(req, res, next) {
    app.locals.user.delete(function(err) {
        if (err) return next(err);
        res.json({
            message: null,
            data: true
        })
    })
};

exports.userById = function(req, res, next, id) {
    User
        .findById(id)
        .exec(function(err, user) {
            if (err) return next(err);
            app.locals.user = user;
            next();
        });
};