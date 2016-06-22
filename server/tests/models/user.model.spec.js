'use strict';

var User = require('../../models/user.model.js'),
    async = require('async'),
    _ = require('lodash'),
    faker = require('faker'),
    mongoose = require('mongoose'),
    values = require('../../config/values.js');

describe('BaseListing model unit tests:', function() {
    var user;

    beforeEach(function(){
        user = new User ({
            name: faker.name.findName(),
            email: faker.internet.email()
        });
    });

    afterEach(function(done) {
        User.remove({}, done);
    });

    it('Should create a new user', function(done) {
        user.save(function(err, result) {
            expect(err).to.be.null;
            done();
        });
    });
});