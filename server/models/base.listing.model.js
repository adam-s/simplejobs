'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongooseDelete = require('mongoose-delete'),
    metadata = require('./plugins/metadata.js'),
    pagination = require('./plugins/pagination.js'),
    values = require('../config/values.js'),
    validators = require('./validators/validators.js');

var options = {
    discriminatorKey: 'kind'
};

var BaseListingSchema = new Schema({
    startDate: {
        type: Date,
        default: Date.now
    },
    phone: String,
    email: {
        type: String,
        required: [true, 'Email field is required'],
        validate: validators.email
    },
    position: {
        type: String,
        validate: validators.position
    },
    languages: {
        type: [String],
        validate: validators.languages
    },
    location: {
        name: String,
        locality: String,
        district: String,
        administrativeArea: String,
        country: String,
        coordinates: {
            index: '2dsphere',
            type: [Number]
        }
    },
    active: {
        type: Boolean,
        default: true
    }
}, options);

BaseListingSchema.plugin(metadata);
BaseListingSchema.plugin(pagination);
BaseListingSchema.plugin(mongooseDelete, { overrideMethods: 'all' });

module.exports = mongoose.model('BaseListing', BaseListingSchema);