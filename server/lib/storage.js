'use strict';

/**
 * File storage, with a local-disk driver.
 *
 * The original code constructed an `s3fs` client at module load in three
 * places, so the server could not boot at all without AWS credentials and a
 * real bucket. That made a fresh clone unrunnable for anyone but the author.
 *
 * This module keeps the same call surface the controllers already use —
 * writeFile / stat / rmdirp / s3.deleteObject / s3.getSignedUrl — and picks a
 * driver at construction time:
 *
 *   config.storage.driver === 'local'  → the filesystem under .data/uploads/
 *   config.storage.driver === 's3'     → the original s3fs client
 *
 * Local is the default. S3 is kept because deleting it would throw away
 * working code for no gain, but nothing in the project requires it.
 *
 *   var storage = require('../lib/storage')('files/resumes/');
 *   storage.writeFile(key, data, options, cb);
 */

var fs = require('fs-extra'),
    path = require('path'),
    config = require('../config/config');

// Everything the local driver writes lives under one root, so uploads are
// trivially inspectable and `rm -rf .data` is a complete reset.
var LOCAL_ROOT = path.resolve(process.cwd(), '.data', 'uploads');

/** Public URL prefix that `server/config/express.js` serves LOCAL_ROOT from. */
var LOCAL_URL_PREFIX = '/uploads/';

/**
 * Join `subpath` and `key` under LOCAL_ROOT, refusing anything that escapes it.
 * The key reaches here from a database field that originated in a filename, so
 * this is the boundary where traversal gets stopped.
 */
function resolveLocal(subpath, key) {
    var full = path.resolve(LOCAL_ROOT, subpath || '', key || '');
    if (full !== LOCAL_ROOT && full.indexOf(LOCAL_ROOT + path.sep) !== 0) {
        throw new Error('storage: refusing path outside the upload root');
    }
    return full;
}

function notFound() {
    var err = new Error('File not found');
    // The controllers switch on err.statusCode and expect S3's 404.
    err.statusCode = 404;
    err.code = 'ENOENT';
    return err;
}

function localDriver(subpath) {
    return {
        driver: 'local',

        /** s3fs.writeFile(key, data, [options], cb) — cb(err, object) */
        writeFile: function(key, data, options, cb) {
            if (typeof options === 'function') {
                cb = options;
            }
            var full;
            try {
                full = resolveLocal(subpath, key);
            } catch (err) {
                return cb(err);
            }
            fs.outputFile(full, data, function(err) {
                if (err) return cb(err);
                // S3 returns an object carrying VersionId; the caller uses it
                // to roll the write back. There are no versions on disk, so
                // the rollback path deletes the file itself.
                cb(null, { VersionId: null, Key: key });
            });
        },

        /** s3fs.stat(key, cb) — cb(err, stats), err.statusCode 404 when absent */
        stat: function(key, cb) {
            var full;
            try {
                full = resolveLocal(subpath, key);
            } catch (err) {
                return cb(err);
            }
            fs.stat(full, function(err, stats) {
                if (err) return cb(err.code === 'ENOENT' ? notFound() : err);
                cb(null, stats);
            });
        },

        /** s3fs.rmdirp(dir, cb) — recursive delete, used to reset fixtures */
        rmdirp: function(dir, cb) {
            var full;
            try {
                full = resolveLocal(subpath, dir === '../../' ? '' : dir);
            } catch (err) {
                return cb(err);
            }
            fs.remove(full, cb);
        },

        s3: {
            deleteObject: function(params, cb) {
                var full;
                try {
                    full = resolveLocal(subpath, params.Key);
                } catch (err) {
                    return cb && cb(err);
                }
                fs.remove(full, function(err) {
                    if (cb) cb(err || null, {});
                });
            },

            /**
             * S3 hands back a time-limited signed URL and the controller
             * redirects to it. Locally the equivalent is the static route —
             * no signing, because there is no third party to prove anything to.
             */
            getSignedUrl: function(operation, params, cb) {
                var url = LOCAL_URL_PREFIX +
                    path.posix.join(subpath || '', params.Key || '');
                if (cb) return cb(null, url);
                return url;
            }
        }
    };
}

function s3Driver(subpath) {
    var S3FS = require('s3fs');
    var bucket = config.aws.s3.bucket + (subpath ? '/' + subpath : '');
    var client = new S3FS(bucket, {
        accessKeyId: config.aws.s3.awsAccessKeyId,
        secretAccessKey: config.aws.s3.awsSecretAccessKey
    });
    return client;
}

/**
 * @param {string} [subpath] key prefix, e.g. 'files/resumes/'
 */
module.exports = function createStorage(subpath) {
    var driver = (config.storage && config.storage.driver) || 'local';
    if (driver === 's3') {
        if (!config.aws.s3.bucket) {
            throw new Error('storage: driver is "s3" but no bucket is configured');
        }
        return s3Driver(subpath);
    }
    return localDriver(subpath);
};

module.exports.LOCAL_ROOT = LOCAL_ROOT;
module.exports.LOCAL_URL_PREFIX = LOCAL_URL_PREFIX;
