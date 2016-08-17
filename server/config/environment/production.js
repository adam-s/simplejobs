'use strict';

/**
 * Set the 'production' environment configuration object
 * @link http://docs.mongolab.com/migrating/
 */

module.exports = {
    db: process.env.MONGODB_URI,
    // set this to build
    // dir: 'build/',
    dir: 'client/',
    fileDir: 'files/',
    sessionSecret: process.env.SESSION_SECRET || 'MEAN',
    adminAccountEmail: process.env.ADMIN_ACCOUNT_EMAIL || 'admin@simpleyachtjobs.com',
    adminAccountPassword: process.env.ADMIN_ACCOUNT_PASSWORD || 'password'
};