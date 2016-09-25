'use strict';

// Set the 'test' environment configuration object
module.exports = {
    db: 'mongodb://localhost/simplejobs-test',
    dir: 'client/',
    fileDir: '../tmp/files/',
    sessionSecret: process.env.SESSION_SECRET || 'MEAN',
    admin: {
        accountEmail: process.env.ADMIN_ACCOUNT_EMAIL || 'admin@simpleyachtjobs.com',
        accountPassword: process.env.ADMIN_ACCOUNT_PASSWORD || 'password'
    },
    mailer: {
        from: process.env.MAILER_FROM || 'MAILER_FROM',
        options: {
            service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
            auth: {
                user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
                pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
            }
        }
    },
    mailgun: {
        options: {
            auth: {
                api_key: process.env.MAILGUN_API_KEY || 'MAILGUN_API_KEY',
                domain: process.env.MAILGUN_DOMAIN || 'MAILGUN_DOMAIN'
            }
        }
    },
    recaptcha: {
        siteKey: process.env.RECAPTCHA_SITEKEY || 'RECAPTCHA_SITEKEY',
        secret: process.env.RECAPTCHA_SECRET || 'RECAPTCHA_SECRET',
        url: process.env.RECAPTCHA_URL || 'RECAPTCHA_URL'
    }
};