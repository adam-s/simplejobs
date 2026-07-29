'use strict';

var app = require('../../../server.js'),
    mongoose = require('mongoose'),
    faker = require('faker'),
    User = mongoose.model('User'),
    values = require('../../config/values.js');

var users;
var agent = request.agent(app);
var ADMIN = { email: 'admin-spec@example.com', password: 'password' };

describe('User listing controller unit tests: ', function() {
    before(function(done) {
        // /api/users is administrator-only; without this the suite asserts
        // against the body of a 401 and reads `undefined.length`.
        User.remove({ email: ADMIN.email }, function() {
            var admin = new User({
                email: ADMIN.email,
                password: ADMIN.password,
                roles: ['administrator', 'authenticated']
            });
            admin.save(function(err) {
                if (err) return done(err);
                agent.post('/auth/login').send(ADMIN).expect(200).end(done);
            });
        });
    });

    beforeEach(function(done) {
        setup(done);
    });

    afterEach(function(done) {
        teardown(done);
    });

    describe('GET /api/users', function() {
        it('Should not throw an error', function(done) {
            agent
                .get('/api/users')
                .end(function(err, response) {
                    if (err) return done(err);
                    expect(response.body.records.length).to.equal(10);
                    done();
                });
        });
    });

    describe('POST /api/user', function() {
        it('Should save a user listing to the database', function(done) {
            var data = fakeUserObject();

            agent
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
            agent
                .get('/api/users/' + testUser._id)
                .expect(200)
                .end(function(err, response) {
                    if (err) return done(err);
                    expect(response.body.name).to.equal(testUser.name);
                    done();
                });
        });
    });

    describe('PUT /api/users/:userId', function() {
        it('Should update the first user listing document', function(done) {
            // users.update only moves the address when `newEmail` is set;
            // assigning `email` was silently a no-op.
            var target = users[0];
            var data = {
                newEmail: 'different@example.com',
                email: 'different@example.com',
                roles: target.roles
            };

            agent
                .put('/api/users/' + target._id)
                .send(data)
                .expect(200)
                .end(function(err, response) {
                    expect(response.body.email).to.equal(data.email);
                    done();
                });
        });
    });

    describe('DELETE /api/users/:userId', function() {
        it('Should delete the user listing document', function(done) {
            var data = users[0];
            var baseline;

            agent.get('/api/users').end(function(err, response) {
                if (err) return done(err);
                baseline = response.body.metadata.totalCount;

            agent
                .del('/api/users/' + data._id)
                .expect(200)
                .end(function(err) {
                    if (err) return done(err);
                    agent
                        .get('/api/users')
                        .end(function(err, response) {
                            if (err) return done(err);
                            // Relative to the baseline: the spec's own admin
                            // account is in this collection too, and the list
                            // is paginated, so a hardcoded count is brittle.
                            expect(response.body.metadata.totalCount).to.equal(baseline - 1);
                            done();
                        });
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

    User.remove({ roles: { $ne: 'administrator' } }, function() {
        User.create(user, function(err, results) {
            if (err) return done(err);
            users = results;
            done();
        });
    });
}

function teardown(done) {
    User.remove({ roles: { $ne: 'administrator' } }, function() {
        done();
    });
}

function fakeUserObject() {
    return {
        name: faker.name.findName(),
        email: faker.internet.email()
    }
}
