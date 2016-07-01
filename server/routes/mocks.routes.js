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

    app.get('/make-all-the-things', function(req, res, next) {
        var users = usersMaker();
        var crew = crewMaker();
        var jobs = jobsMaker();
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
    })
};

function crewMaker() {
    var crew = [];

    for (var i = 0; i < 1000; i++) {
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

function jobsMaker() {
    var jobs = [];

    for (var i = 0; i < 1000; i++) {
        jobs.push({
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
            smokingAllowed: false,
            reqPapers: false,
            jobTypes: values.jobTypes[Math.floor(Math.random() * values.jobTypes.length)],
            flag: 'American',
            length: faker.random.number({min: 80, max: 300}),
            title: faker.lorem.sentence(faker.random.number({min: 3, max:6})),
            description: faker.lorem.sentences(4, faker.random.number({min: 4, max: 10}))
        });
    }

    return jobs;
}

function usersMaker() {
    var users = [];

    for (var i = 0; i < 1000; i++) {
        users.push({
            name: faker.name.findName(),
            email: faker.internet.email()
        });
    }
    return users;
}
