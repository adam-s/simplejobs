'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    BaseListing = require('./base.listing.model.js'),
    values = require('../config/values.js'),
    metadata = require('./plugins/metadata.js'),
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
    smoking: {
        type: Boolean,
        default: false
    },
    papers: {
        type: Boolean,
        default: false
    },
    jobType: {
        type: String,
        validate: validators.jobType
    },
    flag: String,
    length: Number
}, options);

module.exports = BaseListing.discriminator('JobListing', JobListingSchema);