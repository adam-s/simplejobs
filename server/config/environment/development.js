'use strict';

// Set the 'development' environment configuration object
module.exports = {
    db: 'mongodb://localhost/simplejobs-dev',
    dir: 'client/',
    fileDir: 'files/',
    sessionSecret: process.env.SESSION_SECRET || 'MEAN',
    adminAccountEmail: process.env.ADMIN_ACCOUNT_EMAIL || 'admin@simpleyachtjobs.com',
    adminAccountPassword: process.env.ADMIN_ACCOUNT_PASSWORD || 'password'
};