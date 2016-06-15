'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    BaseListing = require('./base.listing.model.js');

var options = {
    discriminatorKey: 'kind'
};

var JobListingSchema = new Schema({
    smokingAllowed: {
        type: Boolean,
        default: false
    },
    reqPapers: {
        type: Boolean,
        default: false
    },
    flag: String,
    length: Number
}, options);

module.exports = BaseListing.discriminator('JobListing', JobListingSchema);