'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    CrewListing = mongoose.model('CrewListing'),
    validationErrorHandler = require('../lib/validationErrorHandler.js'),
    multer = require('multer'),
    async = require('async'),
    fs = require('fs-extra'),
    sanitizeFilename = require('sanitize-filename'),
    config = require('../config/config');

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
        if (err) {
            // Delete the req file
            fs.unlink(req.file.path, function() {
                return res.status(400).send(validationErrorHandler(err,true));
            });
        } else {
            // Move the req file
            fs.move(req.file.path, config.dir + crewListing.resume, {clobber: true}, function(err) {
                if (err) return res.status(400).send({message: 'Unexpected error has occurred'})
                res.json(crewListing);
            });
        }
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
        if (req.file) {
            if (err) {
                // Delete the req file
                fs.unlink(req.file.path, function() {
                    return res.status(400).send(validationErrorHandler(err,true));
                });
            } else {
                // Move the req file
                fs.move(req.file.path, config.dir + crewListing.resume, {clobber: true}, function(err) {
                    if (err) return res.status(400).send({message: 'Unexpected error has occured'});
                    return res.json(result);
                });
            }
        } else {
            if (err) return res.status(400).send(validationErrorHandler(err, true));
            return res.json(result);
        }
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
        .findOne()
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



exports.fileHandler = function(req, res, next) {
    var MAX_FILE_SIZE = 10 * 1000000;
    var FILE_FIELD = 'file';
    var PARENT_DIRECTORY = config.fileDir + 'resumes/';

    // Validate here
    var fileFilter = function fileFilter (req, file, callback) {
        // allowed extensions .doc .docx .odt .pdf .txt
        var allowedMimeTypes = [
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.oasis.opendocument.text',
            'application/pdf',
            'text/plain'
        ];
        var validMimetype = allowedMimeTypes.some(function(mimetype) {
            return file.mimetype == mimetype;
        });

        if (!validMimetype) return callback(new Error('Resume is not a valid file format'));

        callback(null, true)
    };

    var fileOptions = {
        fileFilter: fileFilter,
        dest: 'tmp/',
        limits: {
            fileSize: MAX_FILE_SIZE
        }
    };
    var upload = multer(fileOptions).single(FILE_FIELD);

    upload(req, res, function(err) {
        if (err) return res.status(400).send({message: err.message});

        // We don't need a new file if req.body.resume has a value
        if (_.isEmpty(req.body.resume) && typeof req.file === 'undefined') {
            return res.status(400).send({message: 'Resume file is required'});
        }

        // Make sure that if there is a resume file but no new file, the resume exists in the file system.
        if (req.body.resume && typeof req.file === 'undefined') {
            fs.stat(config.dir + req.body.resume, function(err, stats) {
                console.log(err);
                if (err) {
                    return res.status(400).send({message: 'Resume doesn\'t exist on file server'});
                } else {
                    return next();
                }
            })
        } else {
            // Let's add the file path at req.body.resume.
            // The idea is that if the save method on the model returns and error. Delete the file
            // in the tmp folder. Then return an error. If the model validates and is saved. Move the
            // file into the proper folder
            var cleanFilename = sanitizeFilename(req.file.originalname);

            // Tricky. As security, authenticated users can only upload to their own directory with their
            // user id. But, admins can upload to any directory. Therefore, we will check for admin privledges
            // to see if they can save to different users directory. Otherwise, the resume is saved to user
            // directory. Seems wonky to me.
            var userId;
            if (req.user.isAdmin()) {
                // Is admin so the file userId must be the author field unless it belongs to the admin
                // then fall back to the admin's user id.
                userId = req.body.author || req.user._id;
            } else {
                userId = req.user._id;
            }

            req.body.resume = PARENT_DIRECTORY + userId + '/' + cleanFilename;
            return next();
        }
    });
};