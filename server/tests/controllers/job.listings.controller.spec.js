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
        describe('Unathenticated users', function() {
            it('Should deny access for unathenticated users', function(done) {
                request(app)
                    .post('/api/job-listings')
                    .expect(403)
                    .end(done);
            });
        });

        describe('Authenticated users', function() {
            var user;

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
                    .end(function(err, response) {
                        user = response.body;
                        done();
                    });
            });

            it('Should set the job listing author to current user', function(done) {
                var data = fakeJobObject();
                delete data.author;

                agent
                    .post('/api/job-listings')
                    .send(data)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, response) {
                        expect(response.body.author).to.be.ok;
                       done();
                    });
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

            it('Should return 403 if user doesn\'t have access', function(done) {
                var data = jobListings[0];
                agent
                    .put('/api/job-listings/' + data._id)
                    .send(data)
                    .expect(403)
                    .end(done);
            });

            it('Should update job listing with authenticated user', function(done) {
                var data = fakeJobObject();

                agent
                    .post('/api/job-listings')
                    .send(data)
                    .expect('Content-Type', /json/)
                    .end(function(err, response) {
                        data = response.body;
                        data.title = 'Argh!! I\'m a pirate';
                        agent
                            .put('/api/job-listings/' + data._id)
                            .send(data)
                            .expect(200)
                            .end(function(err, response){
                                if (err) return done(err);
                                expect(response.body.title).to.equal(data.title);
                                done();
                            });
                    });
            });

            it('should get a count of active and inactive listings with authenticated user', function(done) {
                var jobs = [];
                for (var i = 0; i < 100; i++) {
                    var item = fakeJobObject();
                    item.active = i < 25 ;
                    item.author = user._id;
                    jobs.push(item);
                }

                JobListing.create(jobs, function() {
                    agent
                        .get('/api/job-listings/count/?userId=' + user._id)
                        .end(function(err, response) {
                            console.log(response.body);
                            done();
                        })
                })

            })
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

    describe('DELETE /api/job-listings/:jobListingId', function() {
        xit('Should delete the job listing document', function(done) {
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

    describe('GET /api/job-listings/count', function() {
        it ('Should get the count of the number of job listings', function(done) {
            request(app)
                .get('/api/job-listings/count')
                .expect(200)
                .end(function(err, response){
                    expect(response.body.total).to.equal(10);
                    done();
                })
        })
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
        smoking: false,
        papers: false,
        jobType: values.jobTypes[Math.floor(Math.random() * values.jobTypes.length)],
        flag: 'American',
        length: faker.random.number({min: 80, max: 300}),
        author: mongoose.Types.ObjectId()
    }
}

