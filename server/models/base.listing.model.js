'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongooseDelete = require('mongoose-delete'),
    metadata = require('./plugins/metadata.js'),
    pagination = require('./plugins/pagination.js'),
    values = require('../config/values.js');

var options = {
    discriminatorKey: 'kind'
};

var BaseListingSchema = new Schema({
    startDate: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true
    },
    phone: String,
    email: String,
    position: {
        type: String,
        enum: values.positions
    },
    languages: {
        type: String,
        enum: values.languages
    },
    location: {
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