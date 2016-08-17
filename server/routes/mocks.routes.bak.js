'use strict';

var mongoose = require('mongoose'),
    CrewListing = mongoose.model('CrewListing'),
    JobListing = mongoose.model('JobListing'),
    User = mongoose.model('User'),
    async = require('async'),
    faker = require('faker'),
    values = require('../config/values.js');

module.exports = function(app) {
    app.get('/delete-all-the-things', function(req, res, next) {
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
            res.send('all the things deleted');
        })
    });

    app.get('/make-job-listings/:userId', function(req, res, next) {
        var jobs = jobsMaker(100, req.params.userId);
        JobListing.create(jobs, function(err, results) {
            if (err) return res.send(err.message);
            return res.send('Made the jobs')
        })
    });

    app.get('/make-all-the-things', function(req, res, next) {
        var users = usersMaker(count);
        var crew = crewMaker(count);
        var jobs = jobsMaker(count);
        async.parallel([
            function(callback) {
                User.create(users, function(err, results) {
                    if (err) return callback(err);
                    callback(null, results);
                })
            },
            function(callback) {
                CrewListing.create(crew, function(err, results) {
                    if (err) return callback(err);
                    callback(null, results);
                })
            },
            function(callback) {
                JobListing.create(jobs, function(err, results) {
                    if (err) return callback(err);
                    callback(null, results);
                })
            }
        ], function(err, results) {
            res.send('Made all the things')
        })
    });

    app.get('/make-profile', function(req, res, next) {

    })
};

function crewMaker(count) {
    var crew = [];

    for (var i = 0; i < count; i++) {
        crew.push({
            startDate: Date.now(),
            name: faker.name.findName(),
            phone: faker.phone.phoneNumberFormat(),
            email: faker.internet.email(),
            position: values.positions[Math.floor(Math.random() * values.positions.length)],
            languages: values.languages[Math.floor(Math.random() * values.languages.length)],
            active: true,
            location: {
                locality: faker.address.city(),
                administrativeArea: faker.address.state(),
                country: faker.address.country(),
                coordinates: [faker.address.longitude(), faker.address.latitude()]
            },
            resume: faker.internet.url()
        })
    }

    return crew;
}

function jobsMaker(count, userId) {
    var jobs = [];

    for (var i = 0; i < count; i++) {
        jobs.push({
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
            author: userId || mongoose.Types.ObjectId()
        });
    }

    return jobs;
}

function usersMaker(count) {
    var users = [];

    for (var i = 0; i < count; i++) {
        users.push({
            name: faker.name.findName(),
            email: faker.internet.email()
        });
    }
    return users;
}
