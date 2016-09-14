'use strict';

var expressValidator = require('express-validator'),
    _ = require('lodash');

module.exports = function() {
    return expressValidator({
        customValidators: {
            gte: function(param, num) {
                return param >= num;
            },
            lte: function(param, num) {
                return param <= num;
            },
            inArray: function(param, array) {
                return array.some(function(item) {
                    return item == param;
                })
            }
        }
    })
};

// @link https://github.com/ctavan/express-validator#customvalidators

//expressValidator({
//    customValidators: {
//        isArray: function(value) {
//            return Array.isArray(value);
//        },
//        gte: function(param, num) {
//            return param >= num;
//        }
//    }
//})
//
//req.checkBody('users', 'Users must be an array').isArray();
//req.checkQuery('time', 'Time must be an integer great than or equal to 5').isInt().gte(5)