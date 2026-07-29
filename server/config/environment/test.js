'use strict';

/**
 * Test configuration.
 *
 * This file was empty in the repository for years: the real one was kept out of
 * git with `git update-index --assume-unchanged`, so a fresh clone could never
 * boot. It is reconstructed here from production.js's shape, with local-only
 * values, and it is TRACKED on purpose — nothing in it is a secret, and a clone
 * that boots is worth more than a file nobody can reproduce.
 *
 * There is no deploy target for this project, so the values below are local
 * defaults rather than production stand-ins.
 */
module.exports = {

    // Third-party checks performed during registration. Off locally so the app
    // runs with no Mailgun account and no reCAPTCHA registration; on in
    // production, where both are real signup defences.
    verification: {
        email: false,
        recaptcha: false
    },
    db: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/simplejobs-test',

    // Root of the client tree, relative to the repo. express.js serves
    // `<dir>/public` statically and app.controller renders `<dir>/index.html`.
    // Production sets this to 'build'; development serves the sources directly,
    // which is what makes the edit-reload loop work without a build step.
    dir: 'client',
    fileDir: 'files/',

    sessionSecret: process.env.SESSION_SECRET || 'local-development-only',
    mockDataToken: process.env.MOCK_DATA_TOKEN || 'local-development-only',

    // The Google Maps browser key, injected into client/index.html at render
    // time rather than hardcoded in the markup.
    //
    // This key is NOT a secret and cannot be made one — a browser has to send
    // it in the clear on every Maps request, so anyone can read it out of the
    // page. What protects it is an HTTP-referrer restriction in the Google
    // Cloud console, not being absent from this repo. It lives here so it can
    // be rotated or replaced per environment without editing HTML.
    googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY || ''
    },

    admin: {
        accountEmail: process.env.ADMIN_ACCOUNT_EMAIL || 'admin@simpleyachtjobs.com',
        accountPassword: process.env.ADMIN_ACCOUNT_PASSWORD || 'password'
    },

    // Mail is not sent locally. nodemailer's json transport swallows the send
    // and reports success, so the forgotten-password flow can be exercised
    // end to end without a provider account.
    mailer: {
        from: 'no-reply@localhost',
        options: {
            jsonTransport: true
        }
    },

    mailgun: {
        options: {
            auth: {
                api_key: process.env.MAILGUN_API_KEY || '',
                email_validation_key: process.env.MAILGUN_EMAIL_VALIDATION_KEY || '',
                domain: process.env.MAILGUN_DOMAIN || 'localhost'
            }
        }
    },

    // Google's documented always-passes test pair. Public by design.
    // @link https://developers.google.com/recaptcha/docs/faq
    recaptcha: {
        siteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
        secret: '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe',
        url: 'https://www.google.com/recaptcha/api/siteverify'
    },

    googleAnalytics: {
        trackingId: ''
    },

    facebook: {
        pixelId: ''
    },

    // Résumé uploads go to the local filesystem, not S3. See
    // server/lib/storage.js — the S3 client is only constructed when a bucket
    // is configured, so no AWS account is required to run this project.
    aws: {
        s3: {
            awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            bucket: process.env.AWS_S3_BUCKET || ''
        }
    },

    storage: {
        // 'local' writes under client/files/; 's3' uses the aws block above.
        driver: process.env.STORAGE_DRIVER || 'local',
        localDir: process.env.STORAGE_LOCAL_DIR || '.data/test-uploads/'
    }
};
