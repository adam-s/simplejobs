'use strict';

/**
 * Deterministic fixture data.
 *
 * The generation logic here started life in server/routes/mocks.routes.js,
 * which exposed it as `GET /make-all-the-things/:token` next to a matching
 * `/delete-all-the-things/:token` that dropped every collection. Three
 * problems with that as a seeding mechanism:
 *
 *   1. A GET request that wipes the database is one crawler away from ruining
 *      your afternoon.
 *   2. It used unseeded faker and Math.random, so every run produced different
 *      records — which makes screenshot comparison and any "the third row says
 *      X" assertion worthless.
 *   3. Every field was lorem ipsum. You cannot tell a broken layout from a
 *      working one when nothing on screen means anything.
 *
 * So the logic moved here, the content moved to server/lib/fixtures.js, and it
 * runs from the command line:
 *
 *     npm run seed
 *
 * Same command, same database, every time.
 */

// config/config.js resolves `./environment/<NODE_ENV>.js` at require time, so
// the default has to be set before anything below pulls config in.
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PWD = process.env.PWD || process.cwd();

var async = require('async'),
    fs = require('fs-extra'),
    path = require('path'),
    fixtures = require('./fixtures.js'),
    createStorage = require('./storage.js');

var storage = createStorage('files/resumes/');

/** Fixed so every clone gets identical fixtures. */
var SEED = 20160101;

var RESUME_FILES = ['test.doc', 'test.docx', 'test.odt', 'test.pdf', 'test.txt'];

var JOB_COUNT = fixtures.JOB_LISTINGS.length;
var CREW_COUNT = fixtures.CREW_LISTINGS.length;

/**
 * The one seeded account with a password, so the login and profile flows can
 * be driven end to end — by the e2e specs here and by the mobile app's Detox
 * walk, both of which import this rather than hardcoding a copy.
 *
 * Local-only by construction: this database is recreated by `npm run seed` and
 * the app is never deployed.
 */
var DEMO_LOGIN = {
    name: 'Demo Crew',
    email: 'demo@example.com',
    password: 'demo-password'
};

/**
 * A seeded linear congruential generator, used for the handful of choices the
 * fixtures leave open (résumé file type, start dates). Reassigning Math.random
 * globally would be a nasty surprise for anything else in the process.
 */
function makeRandom(seed) {
    var state = seed >>> 0;
    return function random() {
        state = (state * 1664525 + 1013904223) >>> 0;
        return state / 4294967296;
    };
}

function pick(random, list) {
    return list[Math.floor(random() * list.length)];
}

/**
 * Start dates spread across the coming season rather than all landing on one
 * day, but derived from the seed so they do not move between runs.
 */
function startDate(random, index) {
    var base = new Date('2026-04-01T12:00:00Z').getTime();
    var day = 24 * 60 * 60 * 1000;
    return new Date(base + Math.floor(random() * 120 + index) * day);
}

function buildLocation(port) {
    return {
        name: port.locality + ', ' + port.country,
        locality: port.locality,
        administrativeArea: port.administrativeArea,
        country: port.country,
        coordinates: port.coordinates
    };
}

/**
 * Wipe and regenerate. `db` is the mongoose connection; models are read off it
 * so this works both from the CLI and from a test that already has one open.
 */
function seed(db, options, done) {
    if (typeof options === 'function') {
        done = options;
        options = {};
    }
    options = options || {};

    var log = options.log || function() {};
    var random = makeRandom(SEED);

    var CrewListing = db.model('CrewListing');
    var JobListing = db.model('JobListing');
    var User = db.model('User');

    async.series([
        // 1. Clear listings and their posters. Administrators are left alone:
        //    config/init.js guarantees the admin account and dropping it
        //    mid-run would race with boot.
        function(next) {
            log('clearing listings');
            async.parallel([
                function(cb) { CrewListing.remove({}, cb); },
                function(cb) { JobListing.remove({}, cb); },
                function(cb) { User.remove({ roles: { $ne: 'administrator' } }, cb); }
            ], next);
        },

        // 2. Clear stored résumés so file state matches database state.
        function(next) {
            storage.rmdirp('', function() { next(); });
        },

        // 3. Crew listings, each with a résumé on disk.
        function(next) {
            async.forEachOfSeries(fixtures.CREW_LISTINGS, function(entry, index, cb) {
                var port = fixtures.PORTS[entry.port];
                var user = new User({
                    name: entry.name,
                    email: 'crew' + (index + 1) + '@example.com'
                });

                user.save(function(err) {
                    if (err) return cb(err);

                    var fileName = pick(random, RESUME_FILES);
                    var key = user._id + '/' + fileName;
                    var fixture = path.join(__dirname, '..', 'tests', 'fixtures', fileName);

                    fs.readFile(fixture, function(err, data) {
                        if (err) return cb(err);
                        storage.writeFile(key, data, function(err) {
                            if (err) return cb(err);
                            new CrewListing({
                                title: entry.title,
                                description: entry.description,
                                name: entry.name,
                                position: entry.position,
                                jobType: entry.jobType,
                                vesselType: 'Motor',
                                languages: entry.languages,
                                startDate: startDate(random, index),
                                email: 'crew' + (index + 1) + '@example.com',
                                phone: '555-0' + String(100 + index),
                                active: true,
                                location: buildLocation(port),
                                resume: 'files/resumes/' + key,
                                author: user._id
                            }).save(cb);
                        });
                    });
                });
            }, function(err) {
                log('created ' + CREW_COUNT + ' crew listings');
                next(err);
            });
        },

        // 4. Job listings. One poster stands in for the crew agency that would
        //    have placed them.
        function(next) {
            var poster = new User({
                name: 'Blue Water Crew Placement',
                email: 'listings@example.com'
            });

            poster.save(function(err) {
                if (err) return next(err);

                async.forEachOfSeries(fixtures.JOB_LISTINGS, function(entry, index, cb) {
                    var port = fixtures.PORTS[entry.port];
                    var vessel = entry.vessel === null ? null : fixtures.VESSELS[entry.vessel];

                    new JobListing({
                        title: entry.title,
                        description: entry.description,
                        position: entry.position,
                        jobType: entry.jobType,
                        // Shoreside roles have no vessel; the field is required,
                        // so they take the catch-all the enum provides.
                        vesselType: vessel ? vessel.type : 'Other',
                        languages: entry.languages,
                        startDate: startDate(random, index),
                        email: 'listings@example.com',
                        phone: '555-0' + String(200 + index),
                        active: true,
                        location: buildLocation(port),
                        smoking: false,
                        papers: false,
                        flag: vessel ? 'Cayman Islands' : 'American',
                        length: vessel ? Math.round(vessel.length * 3.28084) : 0,
                        author: poster._id
                    }).save(cb);
                }, function(err) {
                    log('created ' + JOB_COUNT + ' job listings');
                    next(err);
                });
            });
        },

        // 5. One account that can actually sign in.
        //
        //    Every other user the seeder creates is a listing author with no
        //    password, which is all the listings needed — but it left no way to
        //    exercise login, the profile, or anything else behind
        //    `checkAuthenticated`. The admin account from config/init.js can
        //    sign in, but demoing the crew experience as an administrator is
        //    misleading.
        //
        //    Credentials are deliberately obvious and local-only. Nothing here
        //    is ever deployed; see docs/SECURITY.md.
        function(next) {
            log('creating the demo login (' + DEMO_LOGIN.email + ')');
            User.findOne({ email: DEMO_LOGIN.email }, function(err, existing) {
                if (err) return next(err);
                if (existing) return existing.remove(function() { createDemoUser(next); });
                createDemoUser(next);
            });

            function createDemoUser(cb) {
                new User({
                    name: DEMO_LOGIN.name,
                    email: DEMO_LOGIN.email,
                    password: DEMO_LOGIN.password,
                    roles: ['authenticated']
                }).save(cb);
            }
        }
    ], function(err) {
        done(err);
    });
}

module.exports = seed;
module.exports.DEMO_LOGIN = DEMO_LOGIN;
module.exports.SEED = SEED;
module.exports.JOB_COUNT = JOB_COUNT;
module.exports.CREW_COUNT = CREW_COUNT;

// CLI entry point: `npm run seed`
if (require.main === module) {
    var db = require('../config/mongoose')();

    seed(db, { log: function(m) { console.log('seed: ' + m); } }, function(err) {
        if (err) {
            console.error('seed failed:', err.message);
            process.exit(1);
        }
        console.log('seed: done');
        // config/mongoose.js hands back the mongoose module, not a connection,
        // so disconnect() is the way out rather than close().
        db.disconnect(function() { process.exit(0); });
    });
}
