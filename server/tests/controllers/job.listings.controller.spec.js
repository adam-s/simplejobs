'use strict';

// How to persist session
// @link https://github.com/visionmedia/supertest/issues/46

var app = require('../../../server.js'),
    mongoose = require('mongoose'),
    faker = require('faker'),
    JobListing = mongoose.model('JobListing'),
    User = mongoose.model('User'),
    values = require('../../config/values.js'),
    agent = require('supertest').agent(app);

var jobListings;

describe.only('Job listing controller unit tests: ', function() {
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
        describe('Unathenticated users', function() {
            it('Should deny access for unathenticated users', function(done) {
                request(app)
                    .post('/api/job-listings')
                    .expect(403)
                    .end(done);
            });
        });

        describe('Anthendicated users', function() {
            beforeEach(function(done) {

                var data = {
                    email: 'different@example.com',
                    password: 'password',
                    passwordConfirm: 'password'
                };

                agent
                    .post('/auth/register')
                    .send(data)
                    .expect(200)
                    .end(done);
            });

            it('Should save a job listing to the database', function(done) {
                var data = fakeJobObject();
                agent
                    .post('/api/job-listings')
                    .send(data)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, response) {
                        done();
                    });
            });

            it('Should validate title exist', function(done) {
                var data = fakeJobObject();
                data.title = '';
                agent
                    .post('/api/job-listings')
                    .send(data)
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end(function(err, response) {
                        done();
                    });
            });

            it('Should validate title less than 250 characters', function(done) {
                var data = fakeJobObject();
                data.title = 'Like any other social media site Facebook has length requirements when it comes to writing on the wall, providing status, messaging and commenting. Understanding how many characters you can use, enables you to re ectively use Faceboo a business orool.';

                agent
                    .post('/api/job-listings')
                    .send(data)
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end(function(err, response) {
                        done();
                    });
            });

            it('Should validate email exists', function(done) {
                var data = fakeJobObject();
                data.email = '';
                agent
                    .post('/api/job-listings')
                    .send(data)
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end(function(err, response) {
                        done();
                    });
            });

            it('Should validate email is valid', function(done) {
                var data = fakeJobObject();
                data.email = 'asdfasdf';
                agent
                    .post('/api/job-listings')
                    .send(data)
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end(function(err, response) {
                        done();
                    });
            });

            it('Should not throw error with empty jobType', function(done) {
                var data = fakeJobObject();
                data.jobType = '';
                agent
                    .post('/api/job-listings')
                    .send(data)
                    .expect('Content-Type', /json/)
                    .end(function(err, response) {
                        expect(response.status).to.equal(200);
                        done();
                    });
            });

            it('Should validate jobType value', function(done) {
                var data = fakeJobObject();
                data.jobType = 'notinarray';
                agent
                    .post('/api/job-listings')
                    .send(data)
                    .expect('Content-Type', /json/)
                    .end(function(err, response) {
                        expect(response.status).to.equal(400);
                        done();
                    });
            });
            it('Should not throw error with empty position', function(done) {
                var data = fakeJobObject();
                data.position = '';
                agent
                    .post('/api/job-listings')
                    .send(data)
                    .expect('Content-Type', /json/)
                    .end(function(err, response) {
                        expect(response.status).to.equal(200);
                        done();
                    });
            });

            it('Should validate position value', function(done) {
                var data = fakeJobObject();
                data.position = 'notinarray';
                agent
                    .post('/api/job-listings')
                    .send(data)
                    .expect('Content-Type', /json/)
                    .end(function(err, response) {
                        expect(response.status).to.equal(400);
                        done();
                    });
            });

            it('Should validate languages is array', function(done) {
                var data = fakeJobObject();
                data.languages = 'English';
                agent
                    .post('/api/job-listings')
                    .send(data)
                    .expect('Content-Type', /json/)
                    .end(function(err, response) {
                        expect(response.status).to.equal(200);
                        done();
                    });
            });

            it('Should throw error if language is not allowed', function(done) {
                var data = fakeJobObject();
                data.languages = ['English', 'French', 'Bacon'];
                agent
                    .post('/api/job-listings')
                    .send(data)
                    .expect('Content-Type', /json/)
                    .end(function(err, response) {
                        expect(response.status).to.equal(400);
                        done();
                    });
            });

            it('Should validate description exist', function(done) {
                var data = fakeJobObject();
                data.description = '';
                agent
                    .post('/api/job-listings')
                    .send(data)
                    .expect('Content-Type', /json/)
                    .end(function(err, response) {
                        expect(response.status).to.equal(400);
                        done();
                    });
            });

            it('Should validate description less than 2500 characters', function(done) {
                // @link http://stackoverflow.com/questions/16885297/how-to-create-a-string-with-n-characters-how-to-create-a-string-with-specific-l
                // Note, that it's 65537, not 65536, because you put characters inbetween.
                var data = fakeJobObject();
                data.description = Array(2500 + 2).join('x');
                agent
                    .post('/api/job-listings')
                    .send(data)
                    .expect('Content-Type', /json/)
                    .end(function(err, response) {
                        expect(response.status).to.equal(400);
                        done();
                    });
            });

            it('Should throw validation error if coordinates in not an array', function(done) {
                var data = fakeJobObject();
                data.location.coordinates = [13, 'dfgdf'];
                agent
                    .post('/api/job-listings')
                    .send(data)
                    .expect('Content-Type', /json/)
                    .end(function(err, response) {
                        expect(response.status).to.equal(400);
                        done();
                    });
            });
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
        xit('Should update the first job listing document', function(done) {
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
        User.remove(function() {
            JobListing.create(jobs, function(err, results) {
                if (err) return done(err);
                jobListings = results;
                done();
            });
        });
    });
}

function teardown(done) {
    JobListing.remove(function() {
        User.remove(function() {
            done();
        })
    });
}

function fakeJobObject() {
    return {
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
        smokingAllowed: false,
        reqPapers: false,
        jobType: values.jobTypes[Math.floor(Math.random() * values.jobTypes.length)],
        flag: 'American',
        length: faker.random.number({min: 80, max: 300})
    }
}

