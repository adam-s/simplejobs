'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    BaseListing = require('./base.listing.model.js'),
    values = require('../config/values.js'),
    validators = require('./validators/validators.js');

var options = {
    discriminatorKey: 'kind'
};

var JobListingSchema = new Schema({
    smoking: {
        type: Boolean,
        default: false
    },
    papers: {
        type: Boolean,
        default: false
    },
    flag: String,
    length: Number
}, options);

module.exports = BaseListing.discriminator('JobListing', JobListingSchema);