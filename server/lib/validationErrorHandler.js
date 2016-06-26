'use strict';

var createError = require('http-errors');

module.exports = function(errors, format) {
    if (format) {
        errors = modelErrorFormatter(errors);
    }

    return {
        message: 'Validation error',
        errors: errors
    };
};

function modelErrorFormatter(err) {
    var modelErrors = [];
    var message = '';

    if (err.errors) {

        for (var errName in err.errors) {
            if (err.errors.hasOwnProperty(errName)) {

                if (err.errors[errName].kind == 'Duplicate value') {
                    message = 'The ' + errName + ' field must be unique';
                } else {
                    message = err.errors[errName].message
                }

                modelErrors.push({
                    param: errName,
                    msg: message,
                    value: err.errors[errName].value
                });
            }
        }
    }

    return modelErrors;
};