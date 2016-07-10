'use strict';

var expressValidator = require('express-validator'),
    _ = require('lodash');

module.exports = function() {
    return expressValidator({
        customValidators: {
            allowedValue: function(value, allowedValues) {

                if (!_.isEmpty(value) && _.isString(value)) {
                    return allowedValues.some(function(item) {
                        return item === value;
                    })
                }

                if (_.isArray(value)) {
                    return _.isEmpty(_.difference(value, allowedValues));
                }

                return true;
            },
            isArray: function(value) {
                return Array.isArray(value);
            },
            isString: function(value) {
                return _.isString(value);
            }
        }
    })
};

// @link https://github.com/ctavan/express-validator#customvalidators

//expressValidator({
//    customValidators: {

//        gte: function(param, num) {
//            return param >= num;
//        }
//    }
//})
//
//req.checkBody('users', 'Users must be an array').isArray();
//req.checkQuery('time', 'Time must be an integer great than or equal to 5').isInt().gte(5)