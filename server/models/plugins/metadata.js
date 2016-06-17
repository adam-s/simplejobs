'use strict';

var _ = require('lodash');

module.exports = function(schema, options) {

    schema.add({
        updated: {
            type: Date,
            default: Date.now
        }
    });

    schema.pre('save', function(next) {
        this.updated = new Date();
        next();
    });

    schema.virtual('created').get(function() {
        var timestamp = _id.toString().substring(0,8);
        return new Date(parseInt(timestamp, 16) * 1000);
    });

};