'use strict';

/**
 * Deterministic fixture data.
 *
 * The generation logic here comes from server/routes/mocks.routes.js, which
 * exposed it as `GET /make-all-the-things/:token` alongside a matching
 * `/delete-all-the-things/:token` that dropped every collection. Two problems
 * with that as a seeding mechanism:
 *
 *   1. A GET request that wipes the database is one crawler away from ruining
 *      your afternoon.
 *   2. It used unseeded faker and Math.random, so every run produced different
 *      records — which makes screenshot comparison and any "the third row says
 *      X" assertion worthless.
 *
 * So the logic moved here, the randomness got a fixed seed, and it runs from
 * the command line instead of over HTTP:
 *
 *     npm run seed
 *
 * Same command, same database, every time: 25 job listings, 5 crew listings
 * with résumés, in the same order with the same contents.
 */

// config/config.js resolves `./environment/<NODE_ENV>.js` at require time, so
// the default has to be set before anything below pulls config in.
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PWD = process.env.PWD || process.cwd();

var faker = require('faker'),
    async = require('async'),
    fs = require('fs-extra'),
    path = require('path'),
    values = require('../config/values.js'),
    createStorage = require('./storage.js');

var storage = createStorage('files/resumes/');

/** Fixed so every clone gets byte-identical fixtures. */
var SEED = 20160101;

var JOB_COUNT = 25;
var CREW_COUNT = 5;

var RESUME_FILES = ['test.doc', 'test.docx', 'test.odt', 'test.pdf', 'test.txt'];

/**
 * A seeded linear congruential generator. faker.seed() covers faker's own
 * output, but the original code also called Math.random() directly to pick
 * from the `values` lists — those picks have to be reproducible too, and
 * reassigning Math.random globally would be a nasty surprise for anything
 * else in the process.
 */
function makeRandom(seed) {
    var state = seed >>> 0;
    return function random() {
        state = (state * 1664525 + 1013904223) >>> 0;
        return state / 4294967296;
    };
}

/** Deterministic pick from an array. */
function pick(random, list) {
    return list[Math.floor(random() * list.length)];
}

function commonListingFields(random) {
    return {
        startDate: new Date('2016-01-01T00:00:00Z'),
        title: faker.lorem.words(5),
        description: faker.lorem.paragraph(),
        phone: faker.phone.phoneNumberFormat(),
        email: faker.internet.email(),
        position: pick(random, values.positions),
        languages: [pick(random, values.languages)],
        active: true,
        location: {
            name: faker.lorem.words(3),
            locality: faker.address.city(),
            administrativeArea: faker.address.state(),
            country: faker.address.country(),
            coordinates: [faker.address.longitude(), faker.address.latitude()]
        },
        jobType: pick(random, values.jobTypes),
        vesselType: pick(random, values.vesselTypes)
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

    faker.seed(SEED);

    var CrewListing = db.model('CrewListing');
    var JobListing = db.model('JobListing');
    var User = db.model('User');

    async.series([
        // 1. Clear listings. Users are left alone: config/init.js guarantees
        //    the admin account, and dropping it mid-run would race with boot.
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
            var made = 0;
            async.whilst(
                function() { return made < CREW_COUNT; },
                function(cb) {
                    made++;
                    var user = new User({
                        name: faker.name.findName(),
                        email: faker.internet.email()
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
                                var doc = commonListingFields(random);
                                doc.name = faker.name.firstName() + ' ' + faker.name.lastName();
                                doc.resume = 'files/resumes/' + key;
                                doc.author = user._id;
                                new CrewListing(doc).save(cb);
                            });
                        });
                    });
                },
                function(err) {
                    log('created ' + CREW_COUNT + ' crew listings');
                    next(err);
                }
            );
        },

        // 4. Job listings, all owned by one poster.
        function(next) {
            var user = new User({
                name: faker.name.findName(),
                email: faker.internet.email()
            });
            user.save(function(err) {
                if (err) return next(err);
                var made = 0;
                async.whilst(
                    function() { return made < JOB_COUNT; },
                    function(cb) {
                        made++;
                        var doc = commonListingFields(random);
                        doc.smoking = false;
                        doc.papers = false;
                        doc.flag = 'American';
                        doc.length = 80 + Math.floor(random() * 220);
                        doc.author = user._id;
                        new JobListing(doc).save(cb);
                    },
                    function(err) {
                        log('created ' + JOB_COUNT + ' job listings');
                        next(err);
                    }
                );
            });
        }
    ], function(err) {
        done(err);
    });
}

module.exports = seed;
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
