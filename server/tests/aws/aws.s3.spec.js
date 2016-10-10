'use strict';

var mongoose = require('mongoose'),
    CrewListing = require('../../models/crew.listing.model.js'),
    JobListing = require('../../models/job.listing.model.js'),
    User = require('../../models/user.model.js'),
    async = require('async'),
    faker = require('faker'),
    values = require('../../config/values.js'),
    config = require('../../config/config'),
    fs = require('fs-extra'),
    S3FS = require('s3fs'),
    request = require('request');

var s3fs = new S3FS( config.aws.s3.bucket + '/files/resumes/', {
    accessKeyId: config.aws.s3.awsAccessKeyId,
    secretAccessKey: config.aws.s3.awsSecretAccessKey
});

describe.only('email MX validate', function() {
    it('should validate an email address', function(done) {

        var options = {
            url: 'https://api.mailgun.net/v3/address/validate',
            method: 'GET',
            qs: {
                address: 'adamsohn1@gmail.com'
            },
            auth: {
                username: 'api',
                password: 'key-7pwnqmm4xvvekhjmzi53ns1l-h6r4141'
            }
        };

        request(options, function (err, res, body) {
            if (err) return done(err);
            console.log();
            done();
        });
    })
});

describe('AWS S3', function() {
    var user;
    beforeEach(function(done) {
        s3fs.rmdirp('../../', done);
    });

    beforeEach(function(done){
        User.remove({}, done);
    });

    beforeEach(function(done){
        CrewListing.remove({}, done);
    });

    beforeEach(function(done) {
        user = new User ({
            name: faker.name.findName(),
            email: faker.internet.email()
        });

        done();
    });


    afterEach(function(done) {
        User.remove({}, done);
    });

    it('should not blow up in my fucking face', function(done) {

        // There needs to be readstream opened then write stream into the S3 bucket.

        user.save(function() {
            var files = ['test.doc', 'test.docx', 'test.odt', 'test.pdf', 'test.txt'];
            var fileName = files[Math.floor(Math.random() * files.length)];
            var path = 'files/resumes/' + user._id + '/' + fileName;

            fs.readFile(__dirname + '/../fixtures/' + fileName, function(err, data) {
                s3fs.writeFile(user._id + '/' + fileName, data, function(err) {
                    var profileData = {
                    startDate: Date.now(),
                    title: faker.lorem.words(5),
                    description: faker.lorem.paragraph(),
                    phone: faker.phone.phoneNumberFormat(),
                    email: faker.internet.email(),
                    name: faker.name.firstName() + ' ' + faker.name.lastName(),
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
                    jobType: values.jobTypes[Math.floor(Math.random() * values.jobTypes.length)],
                    vesselType: values.vesselTypes[Math.floor(Math.random() * values.vesselTypes.length)],
                    resume: path,
                    author: user._id
                };

                    var profile = new CrewListing(profileData);

                    profile.save(function() {
                        console.log(profile);
                        done();
                    })
                });
            });
        });
    });
});