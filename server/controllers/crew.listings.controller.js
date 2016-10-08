'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    CrewListing = mongoose.model('CrewListing'),
    validationErrorHandler = require('../lib/validationErrorHandler.js'),
    multer = require('multer'),
    async = require('async'),
    fs = require('fs-extra'),
    sanitizeFilename = require('sanitize-filename'),
    config = require('../config/config'),
    S3FS = require('s3fs');

var s3fs = new S3FS( config.aws.s3.bucket, {
    accessKeyId: config.aws.s3.awsAccessKeyId,
    secretAccessKey: config.aws.s3.awsSecretAccessKey
});

exports.index = function(req, res) {

    req.assert('tableState.limit', 'Limit is not a valid param').optional().isInt().lte(10000);
    req.assert('tableState.page', 'Page is not a valid param').optional().isInt().lte(10000);
    req.assert('tableState.author', 'Author is not a valid param').optional().isMongoId();

    var errors = req.validationErrors();
    if (errors) return res.status(400).send(validationErrorHandler(errors));

    var tableState = req.query.tableState || {};

    var query = CrewListing.pagination(tableState);

    if (tableState.active) query.where('active', tableState.active);
    if (tableState.name) query.where('name', tableState.name);
    if (tableState.location) query.where('location.name', tableState.location);
    if (tableState.jobType) query.where('jobType', {
        "$in" : Array.isArray(tableState.jobType) ? tableState.jobType : [tableState.jobType]
    });
    if (tableState.vesselType) query.where('vesselType', tableState.vesselType);
    if (tableState.position) query.where('position', tableState.position);

    // Only allow authenticated users to see protect fields email and phone number
    query.select('-__v -kind');
    if (!(req.user && req.user.isAuthenticated())) query.select('-email -phone -resume');

    // Location proximity search
    // The proximity search sorts so we don't want to override it
    if (tableState.longitude && tableState.latitude) {
        query.where('location.coordinates', {
            $near : {
                $geometry: {
                    type: "Point",
                    coordinates: [tableState.longitude, tableState.latitude]
                }
            }
        });
    } else {
        query.sort(tableState.order || '-updated');
    }

    query
        .exec(function(err, result) {
            if (err) return res.status(400).send(validationErrorHandler(err, true));
            res.json(result);
        });
};

exports.autocomplete = function(req, res) {
    req.assert('field', 'Fields are limited to name and email').inArray(['name', 'email', 'location.name']);
    req.assert('q', 'Search query string is required').notEmpty();

    var errors = req.validationErrors();
    if (errors) return res.status(400).send(validationErrorHandler(errors));

    var field = req.params.field,
        searchString = req.query.q.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

    var match = new RegExp(searchString, 'i');
    var rules = {};
    rules[field] = match;

    // TODO A user should only have access to active documents or their own unless they are admin
    // Authenticated can see everything right now. Use the OR operator. $match: [{active: false} OR {author: user._id}]
    CrewListing.aggregate([
        { $match: rules },
        { $limit: 10 },
        { $group: {
            _id: '$' + field
        }}
    ], function(err, results) {
        if (err) return res.status(400).send(validationErrorHandler(err, true));

        results = results.map(function(result) {
            return result._id;
        });

        // http://stackoverflow.com/questions/6393943/convert-javascript-string-in-dot-notation-into-an-object-reference
        // results = field.split('.')
        //     .reduce(function(obj, i) {
        //         var arr = [];
        //         obj.forEach(function(item) {
        //             arr.push(item[i]);
        //         });
        //         return arr;
        //     }, results);

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
            fs.readFile(req.file.path, function(err, data) {
                if (err) return res.status(400).send({message: 'Unexpected error has occurred'});

                var options = {
                    encoding: req.file.encoding,
                    ContentType: req.file.mimetype
                };

                s3fs.writeFile(crewListing.resume, data, options, function(err) {
                    if (err) return res.status(400).send({message: 'Unexpected error has occurred'});

                    fs.unlink(req.file.path, function() {
                        res.json(crewListing);
                    });
                })
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
    delete crewListing.kind;

    // Merge objects
    _.assignIn(crewListing, req.body);

    crewListing.save({runValidators: true}, function(err, result) {
        if (req.file) {
            if (err) {
                // Delete the req file
                fs.unlink(req.file.path, function() {
                    return res.status(400).send(validationErrorHandler(err,true));
                });
            } else {
                // Move the req file
                fs.readFile(req.file.path, function(err, data) {
                    if (err) return res.status(400).send({message: 'Unexpected error has occurred'});

                    var options = {
                        encoding: req.file.encoding,
                        ContentType: req.file.mimetype
                    };

                    s3fs.writeFile(crewListing.resume, data, options, function(err) {
                        if (err) return res.status(400).send({message: 'Unexpected error has occurred'});

                        fs.unlink(req.file.path, function() {
                            res.json(crewListing);
                        });
                    })
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
    var query = CrewListing.findById(id);

    // Only allow authenticated users to see protect fields email and phone number
    query.select('-__v -kind');
    if (!(req.user && req.user.isAuthenticated())) query.select('-email -phone -resume');

    query
        .exec(function(err, crewListing) {
            if (!crewListing) return res.status(404).send({message: "File not found"});
            if (err) return res.status(400).send(err);
            req.app.locals.crewListing = crewListing;
            next();
        });
};

exports.crewListingBySession = function(req, res, next) {
    if (!req.user) return res.status(400).send({message: 'User is not set'});

    var query = CrewListing.findOne();

    // Only allow authenticated users to see protect fields email and phone number
    query.select('-__v -kind');
    if (!(req.user && req.user.isAuthenticated())) query.select('-email -phone -resume');

    query
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
            s3fs.stat(req.body.resume, function(err, stats) {
                if (err) {
                    return res.status(400).send({message: 'Resume doesn\'t exist on file server. Please reattach.'});
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


exports.crewListingByAuthorId = function (req, res, next, authorId) {
    var query = CrewListing.findOne({author: authorId});

    // Only allow authenticated users to see protect fields email and phone number
    query.select('-__v -kind');
    if (!(req.user && req.user.isAuthenticated())) query.select('-email -phone -resume');

    query
        .exec(function(err, crewListing) {
            if (!crewListing) return res.status(404).send({message: "File not found"});
            if (err) return res.status(400).send({message: 'An error occurred'});

            req.app.locals.crewListing = crewListing;
            next();
        });
};

exports.downloadResume = function(req, res) {
    var crewListing = req.app.locals.crewListing;

    // If a profile is deleted or not active people shouldn't have access to the resume file download.
    // If not active or if deleted check if the requesting user is the owner or an administrator.
    if ((!crewListing.active || crewListing.deleted) &&
        (req.user._id !== crewListing.author || !req.user.isAdmin())) {
        return res.status(404).send({message: 'File not found'});
    }

    var params = {
        Bucket: config.aws.s3.bucket,
        Key: crewListing.resume,
        Expires: 60
    };

    // Just get a signed URL that expires in one minute and redirect.
    s3fs.s3.getSignedUrl('getObject', params, function(err, url) {
        res.redirect(url);
    });

    // var file = s3fs.readFile(crewListing.resume);
    //
    // file
    //     .then(function(data) {
    //         console.log(data);
    //         return res.send(data);
    //     }, function() {
    //         return res.status(404).send({message: 'File not found'});
    //     });


    // Here we can create an outgoing stream listening on the httpHeaders event. Leaving the idea here in case I want
    // to start thinking serving data I want to transform and intercept.
    // @see http://stackoverflow.com/questions/35782434/streaming-file-from-s3-with-express-including-information-on-length-and-filetype

    // s3fs.s3.getObject({Bucket: config.aws.s3.bucket, Key: crewListing.resume})
    //     .on('httpHeaders', function (statusCode, headers) {
    //         console.log('shit');
    //         res.set('Content-Length', headers['content-length']);
    //         res.set('Content-Type', headers['content-type']);
    //         this.response.httpResponse.createUnbufferedStream()
    //             .on('data', function (chunk) {
    //                 console.log(chunk);
    //             })
    //             .pipe(res);
    //     })
    //     .on('error', function(data) {
    //         return res.status(404).send({message: 'File not found'});
    //     })
    //     .send();
};