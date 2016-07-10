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
    title: {
        type: String,
        required: [true, 'Title field is required'],
        validate: validators.title
    },
    description: {
        type: String,
        required: [true, 'Description field is required'],
        validate: validators.description
    },
    smokingAllowed: {
        type: Boolean,
        default: false
    },
    reqPapers: {
        type: Boolean,
        default: false
    },
    jobType: {
        type: String,
        validate: validators.jobType
    },
    flag: String,
    length: {
        type: Number
    }
}, options);

module.exports = BaseListing.discriminator('JobListing', JobListingSchema);