'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    BaseListing = require('./base.listing.model.js');

var options = {
    discriminatorKey: 'kind'
};

var CrewListingSchema = new Schema({
    name: String,
    resume: String,
    checkIn: {
        type: Date
    }
}, options);

CrewListingSchema.pre('save', function(next) {
    var now = new Date();
    var twentyFour = 1000 * 60 * 60 * 24;

    if (this.checkIn) {
        this.checkIn = now.getTime() - twentyFour > this.checkIn.getTime() ? now : this.checkIn;
    } else {
        this.checkIn = now;
    }

    next();
});

module.exports = BaseListing.discriminator('CrewListing', CrewListingSchema);

