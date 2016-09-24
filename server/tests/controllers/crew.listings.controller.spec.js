'use strict';

var app = require('../../../server.js'),
    faker = require('faker'),
    values = require('../../config/values.js'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    CrewListing = mongoose.model('CrewListing'),
    agent = require('supertest').agent(app),
    _ = require('lodash'),
    fs = require('fs-extra'),
    config = require('../../config/config.js');


describe('/api/crew-listings', function() {
    beforeEach(function(done) {
        CrewListing.remove(function() {
            User.remove(function() {
                done()
            });
        });
    });

    afterEach(function(done) {
        CrewListing.remove(function() {
            User.remove(function() {
                fs.emptyDir(__dirname + '/../../../tmp', function() {
                    done();
                });
            });
        });
    });

    describe.only('/api/crew-listings/field?q=search_string', function() {

    });

    describe('Admin control crew listings', function() {
        beforeEach(function(done) {
            var newAdmin = new User({
                email: config.adminAccountEmail,
                password: config.adminAccountPassword,
                roles: ['administrator', 'authenticated', 'anonymous']
            });
            newAdmin.save(function() {
                var data = {
                    email: config.adminAccountEmail,
                    password: config.adminAccountPassword
                };

                agent
                    .post('/auth/login')
                    .send(data)
                    .expect(200)
                    .end(done)
            })
        });

        it('should create a profile', function(done) {
            agent
                .post('/api/crew-listings')
                .field('startDate', '1470017218561')
                .field('checkIn', '1470017218561')
                .field('title', 'consequatur dolorem facere voluptatem debitis')
                .field('description', 'Quibusdam laudantium pariatur labore qui consequatur incidunt. Voluptatem quia laudantium. Assumenda quia labore veritatis eius aliquam et. Veritatis debitis quos quia sequi perspiciatis dolor est natus soluta. Ullam ipsam consequatur quaerat ipsa omnis. Nostrum necessitatibus perspiciatis sequi adipisci error.')
                .field('phone', '934-182-8580')
                .field('email', 'Sabrina.OKon@hotmail.com')
                .field('position', 'Dayworker')
                .field('languages[0]', 'Russian')
                .field('active', 'true')
                .field('location[name]', 'ut nulla occaecati')
                .field('location[locality]', 'Haagmouth')
                .field('location[administrativeArea', 'Kentucky')
                .field('location[country]', 'Turkmenistan')
                .field('location[coordinates][0]', '-0.6660')
                .field('location[coordinates][1]', '38.3562')
                .field('smoking', 'false')
                .field('papers', 'false')
                .field('jobType', 'Commercial')
                .field('name', 'Bridgette Hahn')
                .field('author', '57bb59aa513d0e0f4f72ef9b')
                .attach('file', __dirname + '/../fixtures/test.txt')
                .end(function(err, response) {
                    expect(response.status).to.equal(200);
                    done();
                })
        });

        it('should update a profile', function(done) {
            agent
                .post('/api/crew-listings')
                .field('startDate', '1470017218561')
                .field('checkIn', '1470017218561')
                .field('title', 'consequatur dolorem facere voluptatem debitis')
                .field('description', 'Quibusdam laudantium pariatur labore qui consequatur incidunt. Voluptatem quia laudantium. Assumenda quia labore veritatis eius aliquam et. Veritatis debitis quos quia sequi perspiciatis dolor est natus soluta. Ullam ipsam consequatur quaerat ipsa omnis. Nostrum necessitatibus perspiciatis sequi adipisci error.')
                .field('phone', '934-182-8580')
                .field('email', 'Sabrina.OKon@hotmail.com')
                .field('position', 'Dayworker')
                .field('languages[0]', 'Russian')
                .field('active', 'true')
                .field('location[name]', 'ut nulla occaecati')
                .field('location[locality]', 'Haagmouth')
                .field('location[administrativeArea', 'Kentucky')
                .field('location[country]', 'Turkmenistan')
                .field('location[coordinates][0]', '-0.6660')
                .field('location[coordinates][1]', '38.3562')
                .field('smoking', 'false')
                .field('papers', 'false')
                .field('jobType', 'Commercial')
                .field('name', 'Bridgette Hahn')
                .field('author', '57bb59aa513d0e0f4f72ef9b')
                .attach('file', __dirname + '/../fixtures/test.txt')
                .end(function() {
                    agent
                        .post('/api/crew-listings')
                        .field('startDate', '1470017218561')
                        .field('checkIn', '1470017218561')
                        .field('title', 'consequatur dolorem facere voluptatem debitis')
                        .field('description', 'Quibusdam laudantium pariatur labore qui consequatur incidunt. Voluptatem quia laudantium. Assumenda quia labore veritatis eius aliquam et. Veritatis debitis quos quia sequi perspiciatis dolor est natus soluta. Ullam ipsam consequatur quaerat ipsa omnis. Nostrum necessitatibus perspiciatis sequi adipisci error.')
                        .field('phone', '934-182-8580')
                        .field('email', 'Sabrina.OKon@hotmail.com')
                        .field('position', 'Dayworker')
                        .field('languages[0]', 'Russian')
                        .field('active', 'true')
                        .field('location[name]', 'ut nulla occaecati')
                        .field('location[locality]', 'Haagmouth')
                        .field('location[administrativeArea', 'Kentucky')
                        .field('location[country]', 'Turkmenistan')
                        .field('location[coordinates][0]', '-0.6660')
                        .field('location[coordinates][1]', '38.3562')
                        .field('smoking', 'false')
                        .field('papers', 'false')
                        .field('jobType', 'Commercial')
                        .field('name', 'Bridgette Hahn')
                        .field('author', '57bb59aa513d0e0f4f72ef9b')
                        .attach('file', __dirname + '/../fixtures/test.odt')
                        .end(function(err, response) {
                            expect(response.status).to.equal(200);
                            done();
                        });
                });
        });
    });
});