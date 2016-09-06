'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    User = mongoose.model('User'),
    CrewListing = mongoose.model('CrewListing'),
    async = require('async'),
    validationErrorHandler = require('../lib/validationErrorHandler.js');

exports.index = function(req, res) {
    var tableState = req.query.tableState || {};
    tableState.order = tableState.order || '-updated';

    async.waterfall([
        function(callback) {
            User
                .pagination(tableState)
                .select('email updated roles _id')
                .exec(function(err, results) {
                    if (err) return callback(err);
                    callback(null, results);
                });
        }, function (users, callback) {
            if (!users.records.length) return callback(null, users)

            var ids = users.records.map(function(record) {
                return record._id;
            });

            // This is valid but feels hacky. The crew listings for each user is found and then the _id and profiles
            // are switched. Therefore merging arrays should be straight forward.
            //
            // This yeilds:
            //
            // [ { _id: 57be7f523df53ea217dd3147,
            //     profile: 57be7f523df53ea217dd3148 }]

            CrewListing
                .aggregate([
                    {
                        $match: {
                            author: { $in: ids }
                        }
                    },
                    {
                        $group: {
                            '_id': '$author',
                            'profile' : {$first: '$_id'}
                        }
                    }
                ], function (err, results) {
                    if (err) return callback(err);
                    users.records.forEach(function(record, index) {
                        results.some(function(result) {
                            if (record._id.equals(result._id)) {
                                users.records[index] = record.toObject();
                                users.records[index]['profile'] = result.profile;
                                return true;
                            }
                        });
                    });
                    callback(null, users);
                });
        }
    ], function (err, results) {
        if (err) return res.status(400).send(err);
        res.json(results);
    })
};

exports.detail = function(req, res) {
    res.json(req.app.locals.user);
};

exports.create = function(req, res) {
    var user = new User(req.body);
    user.save(function(err) {
        if (err) return res.status(400).send(err);
        res.json(user);
    });
};

exports.update = function(req, res) {
    var user = req.app.locals.user;

    if (req.body.newEmail) {
        req.assert('email', 'You must enter a valid email address').isEmail();
        user.email = req.body.newEmail;
    }

    if (req.body.newPassword || req.body.newPasswordConfirm) {
        req.assert('newPassword', 'You must enter a password').notEmpty();
        req.assert('newPasswordConfirm', 'Passwords must match').equals(req.body.newPassword);
        user.password = req.body.newPassword
    }

    user.roles = req.body.roles;

    var errors = req.validationErrors();
    if (errors) return res.status(400).send(validationErrorHandler(errors));

    user.save(function(err) {
        if (err) return res.status(400).send(validationErrorHandler(err, true));

        user.password = user.passwordConfirm = undefined;
        user.salt = undefined;

        res.json(user);
    });
};

exports.remove = function(req, res) {
    req.app.locals.user.delete(function(err) {
        if (err) return res.status(400).send(err);
        res.json(true);
    })
};

exports.userById = function(req, res, next, id) {
    User
        .findById(id)
        .select('_id email updated roles profile')
        .exec(function(err, user) {
            if (err) return res.status(400).send(err);
            req.app.locals.user = user;
            next();
        });
};