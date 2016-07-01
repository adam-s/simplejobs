'use strict';

var app = require('../../../server.js'),
    mongoose = require('mongoose'),
    faker = require('faker'),
    JobListing = mongoose.model('JobListing'),
    values = require('../../config/values.js');

var jobListings;

describe('Job listing controller unit tests: ', function() {
    beforeEach(function(done) {
        setup(done);
    });

    afterEach(function(done) {
        teardown(done);
    });

    describe('GET /api/job-listings', function() {
        it('Should not throw an error', function(done) {
            request(app)
                .get('/api/job-listings')
                .end(function(err, response) {
                    if (err) return done(err);
                    expect(response.body.records.length).to.equal(10);
                    done();
                });
        });
    });

    describe('POST /api/job-listings', function() {
        it('Should save a job listing to the database', function(done) {
            var data = fakeJobObject();

            request(app)
                .post('/api/job-listings')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(done);
        });
    });

    describe('GET /api/job-listings/:jobListingId', function() {
        it('Should load the first job listing by ID', function(done) {
            var testJob = jobListings[0];
            request(app)
                .get('/api/job-listings/' + testJob._id)
                .expect(200)
                .end(function(err, response) {
                    if (err) return done(err);
                    expect(response.body.name).to.equal(testJob.name);
                    done();
                });
        });
    });

    describe('PUT /api/job-listings/:jobListingId', function() {
        it('Should update the first job listing document', function(done) {
            var data = jobListings[0];
            data.name = 'changed';

            request(app)
                .put('/api/job-listings/' + data._id)
                .send(data)
                .expect(200)
                .end(function(err, response) {
                    expect(response.body.name).to.equal(data.name);
                    done();
                });
        });
    });

    describe('DELETE /api/job-listings/:jobListingId', function() {
        it('Should delete the job listing document', function(done) {
            var data = jobListings[0];

            request(app)
                .del('/api/job-listings/' + data._id)
                .expect(200)
                .end(function(err) {
                    if (err) return done(err);
                    request(app)
                        .get('/api/job-listings')
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
    var jobs = [];
    for(var i = 0; i < 10; i++) {
        jobs.push(fakeJobObject());
    }

    JobListing.remove(function() {
        JobListing.create(jobs, function(err, results) {
            if (err) return done(err);
            jobListings = results;
            done();
        });
    });
}

function teardown(done) {
    JobListing.remove(function() {
        done();
    });
}

function fakeJobObject() {
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
        smokingAllowed: false,
        reqPapers: false,
        jobTypes: values.jobTypes[Math.floor(Math.random() * values.jobTypes.length)],
        flag: 'American',
        length: faker.random.number({min: 80, max: 300})
    }
}

