'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    validate = require('mongoose-validator'),
    values = require('../../config/values.js');


var FLOAT = /^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/;

exports.title = [
    validate({
        validator: 'isLength',
        arguments: [0, 75],
        message: 'Title field has to be shorter than 75 characters'
    }),
    validate({
        validator: function(value) {
            return value.length >= 1;
        },
        message: 'Title field is required'
    })
];

exports.name = [
    validate({
        validator: 'isLength',
        arguments: [0, 75],
        message: 'Name field has to be shorter than 75 characters'
    }),
];

exports.email = [
    validate({
        validator: 'isEmail',
        message: 'Email address is not valid'
    })
];

exports.jobType = [
    validate({
        validator: function(value) {
            return values.jobTypes.some(function(item) {
                return item === value;
            })
        },
        passIfEmpty: true,
        message: 'Job type is not a valid value'
    }),
    validate({
        validator: function(value) {
            return _.isString(value);
        },
        message: 'Job type field is not valid'
    })
];

exports.vesselType = [
    validate({
        validator: function(value) {
            return values.vesselTypes.some(function(item) {
                return item === value;
            })
        },
        passIfEmpty: true,
        message: 'Vessel type is not a valid value'
    }),
    validate({
        validator: function(value) {
            return _.isString(value);
        },
        message: 'Vessel type field is not valid'
    })
];

exports.position = [
    validate({
        validator: function(value) {
           return values.positions.some(function(item) {
               return item === value;
           })
        },
        passIfEmpty: true,
        message: 'Position is not a valid value'
    }),
    validate({
        validator: function(value) {
            return _.isString(value)
        },
        message: 'Position field is not valid'
    })
];

exports.languages = [
    validate({
        validator: function(value) {
            return _.isEmpty(_.difference(value, values.languages));
        },
        message: 'Language is not a valid value;'
    })
];

exports.description = [
    validate({
        validator: 'isLength',
        arguments: { max: 2500 },
        message: 'Description field can\'t exceed 2500 characters'
    })
];

exports.coordinates = [
    validate({
        validator: function(value) {
           return value.length == 2;
        },
        message: 'Coordinates should have a length of 2'
    }),
    validate({
        validator: function(value) {
            value.forEach(function(value) {
                if (value === '' || value === '.') {
                    return false;
                }
                return FLOAT.test(value);
            })
        },
        message: 'Each coordinate value needs to be a float'
    })
];