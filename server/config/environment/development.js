'use strict';

// Set the 'development' environment configuration object
module.exports = {
    db: 'mongodb://localhost/simplejobs-dev',
    dir: 'client/',
    fileDir: 'files/',
    sessionSecret: process.env.SESSION_SECRET || 'MEAN',
    admin: {
        accountEmail: process.env.ADMIN_ACCOUNT_EMAIL || 'admin@simpleyachtjobs.com',
        accountPassword: process.env.ADMIN_ACCOUNT_PASSWORD || 'password'
    },
    mailer: {
        from: 'admin@simpleyachtjobs.com' || 'MAILER_FROM',
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
                api_key: 'key-7pwnqmm4xvvekhjmzi53ns1l-h6r4141' || 'MAILGUN_API_KEY',
                domain: 'sandboxa4466e139c804af5a7c0fb969a38f9f4.mailgun.org' || 'MAILGUN_DOMAIN'
            }
        }
    },
    recaptcha: {
        siteKey: '6LfzWgcUAAAAAEv7EeHdFTQEuCFAQVwIjDyOFFHV' || 'RECAPTCHA_SITEKEY',
        secret: '6LfzWgcUAAAAAM5Mfz_iOSheRL_3HorrcPRElta_' || 'RECAPTCHA_SECRET',
        url: 'https://www.google.com/recaptcha/api/siteverify' || 'RECAPTCHA_URL'
    },
    googleAnalytics: {
        trackingId: 'UA-85182124-1' || 'GOOGLE_ANALYTICS_TRACKING_ID'
    }
};