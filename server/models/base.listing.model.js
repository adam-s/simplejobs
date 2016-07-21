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

var LocationSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Location name field is required']
    },
    locality: String,
    district: String,
    administrativeArea: String,
    country: String,
    coordinates: {
        index: '2dsphere',
        type: [Number],
        required: [true, 'Location coordinates field is required'],
        validate: validators.coordinates
    }
}, {_id: false});

var BaseListingSchema = new Schema({
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
    jobType: {
        type: String,
        validate: validators.jobType
    },
    position: {
        type: String,
        validate: validators.position
    },
    languages: {
        type: [String],
        validate: validators.languages
    },
    location: LocationSchema,
    active: {
        type: Boolean,
        default: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, options);

BaseListingSchema.plugin(metadata);
BaseListingSchema.plugin(pagination);
BaseListingSchema.plugin(mongooseDelete, { overrideMethods: 'all' });

BaseListingSchema.path('author').set(function(value) {
    return (this.author || value);
});

module.exports = mongoose.model('BaseListing', BaseListingSchema);