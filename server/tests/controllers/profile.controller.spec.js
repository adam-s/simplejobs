'use strict';

var app = require('../../../server.js'),
    faker = require('faker'),
    values = require('../../config/values.js'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    CrewListing = mongoose.model('CrewListing'),
    agent = require('supertest').agent(app),
    _ = require('lodash');

describe('/api/profile', function() {
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
                done();
            });
        });
    });

    describe('Unathenticated users', function() {

    });

    describe('Authenticated users', function() {
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
                .end(done)
        });

        it('should get the user profile', function(done) {
            agent
                .get('/api/profile')
                .end(function(err, response) {
                    done();
                });
        });

        it('should create a profile', function(done) {

            agent
                .post('/api/profile')
                .field('startDate', '1470017218561')
                .field('checkIn', '1470017218561')
                .field('title', 'consequatur dolorem facere voluptatem debitis')
                .field('description', 'Quibusdam laudantium pariatur labore qui consequatur incidunt. Voluptatem quia laudantium. Assumenda quia labore veritatis eius aliquam et. Veritatis debitis quos quia sequi perspiciatis dolor est natus soluta. Ullam ipsam consequatur quaerat ipsa omnis. Nostrum necessitatibus perspiciatis sequi adipisci error.')
                .field('phone', '934-182-8580')
                .field('email', 'Sabrina.OKon@hotmail.com')
                .field('position', 'Daywork')
                .field('languages[0]', 'Russian')
                .field('active', 'true')
                .field('location[name]', 'ut nulla occaecati')
                .field('location[locality]', 'Haagmouth')
                .field('location[administrativeArea]', 'Kentucky')
                .field('location[country]', 'Turkmenistan')
                .field('location[coordinates][0]', '-0.6660')
                .field('location[coordinates][1]', '38.3562')
                .field('smoking', 'false')
                .field('papers', 'false')
                .field('jobType', 'Commercial')
                .field('name', 'Bridgette Hahn')
                // .field('resume', 'tmp/871c711c50e96b3706240657cc62d319')
                .attach('file', __dirname + '/../fixtures/test.txt')
                .end(function(err, response) {
                    expect(response.status).to.equal(200);
                    done();
                })
        });

        it('should update a profile', function(done) {
            var data = fakeProfileObject();

            multipartFields(agent.post('/api/profile'), data)
                .attach('file', __dirname + '/../fixtures/test.pdf')
                .end(function(err, response) {
                    expect(response.status).to.equal(200);
                    data = response.body;
                    data.active = false;
                    // superagent refuses to mix .send() with .attach(); the
                    // update carries a file, so it has to be multipart too.
                    multipartFields(agent.put('/api/profile'), data)
                        .attach('file', __dirname + '/../fixtures/test.pdf')
                        .end(function(err, response) {
                            expect(response.status).to.equal(200);
                            expect(response.body.active).to.equal(false);
                            done();
                        })
                })
        });

        it('rejects a file that is not a resume format', function(done) {
            // The filter allows doc/docx/odt/pdf/txt only. An image must be
            // refused: this is the upload surface's only content check.
            var data = fakeProfileObject();
            multipartFields(agent.post('/api/profile'), data)
                .attach('file', __dirname + '/../fixtures/sidenav-bg.png')
                .end(function(err, response) {
                    expect(response.status).to.equal(400);
                    done();
                });
        });

        it('should remove a profile', function(done) {
            var data = fakeProfileObject();
            multipartFields(agent.post('/api/profile'), data)
                .attach('file', __dirname + '/../fixtures/test.txt')
                .end(function(err, response) {
                    expect(response.status).to.equal(200);
                    agent
                        .del('/api/profile')
                        .end(function(err, response) {
                            expect(response.status).to.equal(200);
                            agent
                                .get('/api/profile')
                                .end(function(err, response) {
                                    expect(_.isEmpty(response.body)).to.equal(true);
                                    expect(response.status).to.equal(200);
                                    done();
                                });
                        });
                });
        });
    });
});

/**
 * Flatten a profile object into the bracketed field names multipart uses.
 * superagent's .field() only accepts strings — handing it a nested object or a
 * number throws "source.on is not a function" from form-data, which is what
 * these specs did before.
 */
function multipartFields(agentRequest, obj, prefix) {
    Object.keys(obj).forEach(function(key) {
        var name = prefix ? prefix + '[' + key + ']' : key;
        var value = obj[key];
        if (Array.isArray(value)) {
            value.forEach(function(item, i) {
                agentRequest.field(name + '[' + i + ']', String(item));
            });
        } else if (value !== null && typeof value === 'object') {
            multipartFields(agentRequest, value, name);
        } else {
            agentRequest.field(name, String(value));
        }
    });
    return agentRequest;
}

function fakeProfileObject() {
    return {
        startDate: Date.now(),
        checkIn: Date.now(),
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
        name: faker.name.findName(),
        resume: faker.internet.url()
    }
}