'use strict';

var mongoose = require('mongoose'),
    CrewListing = mongoose.model('CrewListing'),
    JobListing = mongoose.model('JobListing'),
    User = mongoose.model('User'),
    async = require('async'),
    faker = require('faker'),
    values = require('../config/values.js'),
    config = require('../config/config.js'),
    fs = require('fs-extra'),
    S3FS = require('s3fs');

var s3fs = new S3FS(config.aws.s3.bucket + '/files/resumes/', {
        accessKeyId: config.aws.s3.awsAccessKeyId,
        secretAccessKey: config.aws.s3.awsSecretAccessKey
    });

module.exports = function(app) {
    app.get('/delete-all-the-things/:token', function(req, res) {
        if (req.params.token !== config.mockDataToken) return res.status(400).send({message: 'Nice try buddy'});
        async.parallel([
            function(callback) {
                CrewListing.remove({}, function() {
                    callback();
                })
            },
            function(callback) {
                JobListing.remove({}, function() {
                    callback();
                })
            },
            function(callback) {
                User.remove({}, function() {
                    callback();
                })
            }
        ], function() {
            fs.emptyDir('client/files/resumes', function() {
                res.send('all the things deleted');
            });
        })
    });

    app.get('/make-all-the-things/:token', function(req, res) {
        if (req.params.token !== config.mockDataToken) return res.status(400).send({message: 'Nice try buddy'});
        var count = 5;
        async.whilst(
            function() { return count > 0},
            function(callback) {
                count --;

                var userData = {
                    name: faker.name.findName(),
                    email: faker.internet.email()
                };

                var user = new User(userData);

                user.save(function() {
                    var files = ['test.doc', 'test.docx', 'test.odt', 'test.pdf', 'test.txt'];
                    var fileName = files[Math.floor(Math.random() * files.length)];
                    var path = 'files/resumes/' + user._id + '/' + fileName;

                    fs.readFile(__dirname + '/../tests/fixtures/' + fileName, function(err, data) {
                        s3fs.writeFile(user._id + '/' + fileName, data, function(err) {
                            var profileData = {
                                startDate: Date.now(),
                                title: faker.lorem.words(5),
                                description: faker.lorem.paragraph(),
                                phone: faker.phone.phoneNumberFormat(),
                                email: faker.internet.email(),
                                name: faker.name.firstName() + ' ' + faker.name.lastName(),
                                position: values.positions[Math.floor(Math.random() * values.positions.length)],
                                languages: [values.languages[Math.floor(Math.random() * values.languages.length)]],
                                active: true,
                                location: {
                                    name: faker.lorem.words(3),
                                    locality: faker.address.city(),
                                    administrativeArea: faker.address.state(),
                                    country: faker.address.country(),
                                    coordinates: [faker.address.longitude(), faker.address.latitude()]
                                },
                                jobType: values.jobTypes[Math.floor(Math.random() * values.jobTypes.length)],
                                vesselType: values.vesselTypes[Math.floor(Math.random() * values.vesselTypes.length)],
                                resume: path,
                                author: user._id
                            };

                            var profile = new CrewListing(profileData);

                            profile.save(function() {
                                callback();
                            })
                        });
                    });
                });
            },
            function() {
                var userData = {
                    name: faker.name.findName(),
                    email: faker.internet.email()
                };

                var user = new User(userData);

                user.save(function() {
                    count = 25;
                    async.whilst(
                        function () { return count > 0},
                        function (callback) {
                            count --;

                            var jobData = {
                                startDate: Date.now(),
                                title: faker.lorem.words(5),
                                description: faker.lorem.paragraph(),
                                phone: faker.phone.phoneNumberFormat(),
                                email: faker.internet.email(),
                                position: values.positions[Math.floor(Math.random() * values.positions.length)],
                                languages: [values.languages[Math.floor(Math.random() * values.languages.length)]],
                                active: true,
                                location: {
                                    name: faker.lorem.words(3),
                                    locality: faker.address.city(),
                                    administrativeArea: faker.address.state(),
                                    country: faker.address.country(),
                                    coordinates: [faker.address.longitude(), faker.address.latitude()]
                                },
                                smoking: false,
                                papers: false,
                                jobType: values.jobTypes[Math.floor(Math.random() * values.jobTypes.length)],
                                vesselType: values.vesselTypes[Math.floor(Math.random() * values.vesselTypes.length)],
                                flag: 'American',
                                length: faker.random.number({min: 80, max: 300}),
                                author: user._id
                            };

                            var job = new JobListing(jobData);

                            job.save(function() {
                                return callback();
                            })
                        },
                        function() {
                            res.send('Made all the things');
                        }
                    );
                });
            }
        )
    });


};