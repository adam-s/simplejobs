'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    BaseListing = require('./base.listing.model.js');

var options = {
    discriminatorKey: 'kind'
};

var CrewListingSchema = new Schema({
    name: String,
    resume: String
}, options);

module.exports = BaseListing.discriminator('CrewListing', CrewListingSchema);

