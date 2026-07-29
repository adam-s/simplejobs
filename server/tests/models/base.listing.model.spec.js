'use strict';

var BaseListing = require('../../models/base.listing.model.js'),
    async = require('async'),
    _ = require('lodash'),
    faker = require('faker'),
    mongoose = require('mongoose'),
    values = require('../../config/values.js');

describe('BaseListing model unit tests:', function() {
    var listing;

    beforeEach(function(){
        // title, description, author and location.name became required on the
        // model after this spec was written. The suite ran under describe.only
        // for years, so nobody saw it fail.
        listing = new BaseListing ({
            startDate: Date.now(),
            title: faker.lorem.words(4),
            description: faker.lorem.paragraph(),
            name: faker.name.findName(),
            phone: faker.phone.phoneNumberFormat(),
            email: faker.internet.email(),
            position: values.positions[Math.floor(Math.random() * values.positions.length)],
            active: true,
            author: new mongoose.Types.ObjectId(),
            location: {
                name: faker.lorem.words(3),
                locality: faker.address.city(),
                administrativeArea: faker.address.state(),
                country: faker.address.country(),
                coordinates: [faker.address.longitude(), faker.address.latitude()]
            }
        });
    });

    afterEach(function(done) {
       BaseListing.remove({}, done);
    });

    it('Should create a new base listing', function(done) {
        listing.save(function(err, result) {
            expect(err).to.be.null;
            done();
        });
    });
});