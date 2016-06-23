'use strict';

// Set the 'test' environment configuration object
module.exports = {
    db: 'mongodb://localhost/simplejobs-test',
    dir: 'client',
    sessionSecret: process.env.SESSION_SECRET || 'MEAN'
};