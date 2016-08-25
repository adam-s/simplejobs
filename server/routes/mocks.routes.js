'use strict';

var mongoose = require('mongoose'),
    CrewListing = mongoose.model('CrewListing'),
    JobListing = mongoose.model('JobListing'),
    User = mongoose.model('User'),
    async = require('async'),
    faker = require('faker'),
    values = require('../config/values.js'),
    fs = require('fs-extra');

module.exports = function(app) {
    app.get('/delete-all-the-things', function(req, res) {
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

    app.get('/make-all-the-things', function(req, res) {
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
                    console.log('1: ', user._id);
                    console.log('2: ', path);
                    fs.copy(__dirname + '/../tests/fixtures/' + fileName, 'client/' + path, function() {
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
                            resume: path,
                            author: user._id
                        };

                        var profile = new CrewListing(profileData);

                        profile.save(function() {
                            callback();
                        })

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