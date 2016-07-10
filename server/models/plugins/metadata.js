'use strict';

var _ = require('lodash');

module.exports = function(schema, options) {

    schema.set('toJSON',
        {
            virtuals: true,
            transform: function(doc, ret, options) {
                delete ret.id;
                return ret;
            }
        }
    );

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
        return this._id.getTimestamp();
    });

};