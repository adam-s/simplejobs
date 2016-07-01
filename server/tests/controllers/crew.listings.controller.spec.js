'use strict';

var app = require('../../../server.js'),
    mongoose = require('mongoose'),
    faker = require('faker'),
    CrewListing = mongoose.model('CrewListing'),
    values = require('../../config/values.js');

var crewListings;

describe('Crew listing controller unit tests: ', function() {
    beforeEach(function(done) {
       setup(done);
    });

    afterEach(function(done) {
        teardown(done);
    });

    describe('GET /api/crew-listings', function() {
        it('Should not throw an error', function(done) {
            request(app)
                .get('/api/crew-listings')
                .end(function(err, response) {
                    if (err) return done(err);
                    expect(response.body.records.length).to.equal(10);
                    done();
                });
        });
    });

    describe('POST /api/crew-listing', function() {
        it('Should save a crew listing to the database', function(done) {
            var data = fakeCrewObject();

            request(app)
                .post('/api/crew-listings')
                .type('form')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(done);
        });
    });

    describe('GET /api/crew-listings/:crewListingId', function() {
        it('Should load the first crew listing by ID', function(done) {
            var testCrew = crewListings[0];
            request(app)
                .get('/api/crew-listings/' + testCrew._id)
                .expect(200)
                .end(function(err, response) {
                    if (err) return done(err);
                    expect(response.body.name).to.equal(testCrew.name);
                    done();
                });
        });
    });

    describe('PUT /api/crew-listings/:crewListingId', function() {
        it('Should update the first crew listing document', function(done) {
            var data = crewListings[0];
            data.name = 'changed';

            request(app)
                .put('/api/crew-listings/' + data._id)
                .send(data)
                .expect(200)
                .end(function(err, response) {
                    expect(response.body.name).to.equal(data.name);
                    done();
                });
        });
    });

    describe('DELETE /api/crew-listings/:crewListingId', function() {
        it('Should delete the crew listing document', function(done) {
            var data = crewListings[0];

            request(app)
                .del('/api/crew-listings/' + data._id)
                .expect(200)
                .end(function(err) {
                    if (err) return done(err);
                    request(app)
                        .get('/api/crew-listings')
                        .end(function(err, response) {
                            if (err) return done(err);
                            expect(response.body.records.length).to.equal(9);
                            done();
                        });
                });
        });
    });


});

function setup(done) {
    var crew = [];
    for(var i = 0; i < 10; i++) {
        crew.push(fakeCrewObject());
    }

    CrewListing.remove(function() {
        CrewListing.create(crew, function(err, results) {
            if (err) return done(err);
            crewListings = results;
            done();
        });
    });
}

function teardown(done) {
    CrewListing.remove(function() {
        done();
    });
}

function fakeCrewObject() {
    return {
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
    }
}
