'use strict';

var app = require('../../../server.js'),
    mongoose = require('mongoose'),
    faker = require('faker'),
    User = mongoose.model('User'),
    values = require('../../config/values.js');

var user, data;

describe('User auth controller unit tests: ', function() {
    beforeEach(function(done) {
        User.remove(function() {
            data = {
                email: 'test@example.com',
                password: 'password',
                passwordConfirm: 'password'
            };

            user = new User(data);

            user.save(function(err) {
                done();
            });
        });
    });

    afterEach(function(done) {
        User.remove(done);
    });

    describe('POST /api/auth/register', function() {
        it('Should register a user', function(done) {
            data = {
                email: 'different@example.com',
                password: 'password',
                passwordConfirm: 'password'
            };

            request(app)
                .post('/api/auth/register')
                .send(data)
                .expect(200)
                .end(function(err, response) {
                    if (err) return done(err);
                    expect(response.body.email).to.equal(data.email);
                    done();
                });
        });

        it('Should require a password confirmation', function(done) {
            data = {
                email: 'different@example.com',
                password: 'password'
            };

            request(app)
                .post('/api/auth/register')
                .send(data)
                .expect(400)
                .end(function(err, response) {
                    if (err) return done(err);
                    expect(response.body.message).to.equal('Validation error');
                    done();
                });
        });

        it('Should not allow creation of account with existing email', function(done) {
            request(app)
                .post('/api/auth/register')
                .send(data)
                .expect(400)
                .end(function(err, response) {
                    if (err) return done(err);
                    expect(response.body.message).to.equal('Validation error');
                    done();
                });
        });

        it('Should login', function(done) {
            data = {
                email: 'different@example.com',
                password: 'password',
                passwordConfirm: 'password'
            };

            request(app)
                .post('/api/auth/register')
                .send(data)
                .expect(200)
                .end(function(err) {
                    if (err) return done(err);
                    request(app)
                        .post('/api/auth/login')
                        .send(data)
                        .expect(200)
                        .end(function(err) {
                            if (err) return done(err);
                            request(app)
                                .get('/api/auth/logout')
                                .expect(302)
                                .end(function(err, reponse) {
                                    if (err) return done(err);
                                    done();
                                })
                        });
                });
        });
    });
});

