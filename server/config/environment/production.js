'use strict';

/**
 * Set the 'production' environment configuration object
 * @link http://docs.mongolab.com/migrating/
 */

module.exports = {
    db: process.env.MONGODB_URI,
    // set this to build
    // dir: 'build/',
    dir: 'build/',
    fileDir: 'files/',
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
    },
    googleAnalytics: {
        trackingId: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
    },
    facebook: {
        pixelId: process.env.FACEBOOK_PIXEL_ID || 'FACEBOOK_PIXEL_ID'
    }
};