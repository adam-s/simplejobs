'use strict';

var app = require('../../../server.js'),
    mongoose = require('mongoose'),
    faker = require('faker'),
    User = mongoose.model('User'),
    values = require('../../config/values.js');

var users;

describe('User listing controller unit tests: ', function() {
    beforeEach(function(done) {
        setup(done);
    });

    afterEach(function(done) {
        teardown(done);
    });

    describe('GET /api/users', function() {
        it('Should not throw an error', function(done) {
            request(app)
                .get('/api/users')
                .end(function(err, response) {
                    if (err) return done(err);
                    expect(response.body.data.records.length).to.equal(10);
                    done();
                });
        });
    });

    describe('POST /api/user', function() {
        it('Should save a user listing to the database', function(done) {
            var data = fakeUserObject();

            request(app)
                .post('/api/users')
                .type('form')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(done);
        });
    });

    describe('GET /api/users/:userId', function() {
        it('Should load the first user listing by ID', function(done) {
            var testUser = users[0];
            request(app)
                .get('/api/users/' + testUser._id)
                .expect(200)
                .end(function(err, response) {
                    if (err) return done(err);
                    expect(response.body.data.name).to.equal(testUser.name);
                    done();
                });
        });
    });

    describe('PUT /api/users/:userId', function() {
        it('Should update the first user listing document', function(done) {
            var data = users[0];
            data.email = 'different@example.com';

            request(app)
                .put('/api/users/' + data._id)
                .send(data)
                .expect(200)
                .end(function(err, response) {
                    expect(response.body.data.email).to.equal(data.email);
                    done();
                });
        });
    });

    describe('DELETE /api/users/:userId', function() {
        it('Should delete the user listing document', function(done) {
            var data = users[0];

            request(app)
                .del('/api/users/' + data._id)
                .expect(200)
                .end(function(err) {
                    if (err) return done(err);
                    request(app)
                        .get('/api/users')
                        .end(function(err, response) {
                            if (err) return done(err);
                            expect(response.body.data.records.length).to.equal(9);
                            done();
                        });
                });
        });
    });


});

function setup(done) {
    var user = [];
    for(var i = 0; i < 10; i++) {
        user.push(fakeUserObject());
    }

    User.remove(function() {
        User.create(user, function(err, results) {
            if (err) return done(err);
            users = results;
            done();
        });
    });
}

function teardown(done) {
    User.remove(function() {
        done();
    });
}

function fakeUserObject() {
    return {
        name: faker.name.findName(),
        email: faker.internet.email()
    }
}
