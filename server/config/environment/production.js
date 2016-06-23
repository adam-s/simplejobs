'use strict';

/**
 * Set the 'production' environment configuration object
 * @link http://docs.mongolab.com/migrating/
 */

module.exports = {
    db: process.env.MONGODB_URI,
    // set this to build
    dir: 'client',
    sessionSecret: process.env.SESSION_SECRET || 'MEAN'
};