'use strict';

var mongoose = require('mongoose'),
    CrewListing = mongoose.model('CrewListing'),
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
            }

        ], function() {
            res.send('all the things deleted');
        })
    });

    app.get('/make-all-the-things', function(req, res, next) {
        var crew = crewMaker();

        async.parallel([
            function(callback) {
                CrewListing.create(crew, function(err, results) {
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
