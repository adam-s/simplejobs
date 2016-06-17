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
        listing = new BaseListing ({
            startDate: Date.now(),
            name: faker.name.findName(),
            phone: faker.phone.phoneNumberFormat(),
            email: faker.internet.email(),
            position: values.positions[Math.floor(Math.random() * values.positions.length)],
            active: true,
            location: {
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

function connect(done) {
    mongoose.connect('mongodb://localhost/yachtjobs-test', done);
}

function disconnect(done) {
    mongoose.connect('mongodb://location/yachtjobs-test', function() {
        mongoose.connection.db.dropDatabase(function() {
            mongoose.connection.db.close(done);
        });
    })
}