'use strict';

/**
 * Tests for the local storage driver that replaced s3fs.
 *
 * This file stands in for server/tests/aws/aws.s3.spec.js, which was deleted:
 * it hit the live Mailgun and S3 APIs (so it could only pass with credentials
 * and a network), and it carried a hardcoded Mailgun API key in the source.
 * These tests touch nothing but a temp directory.
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.PWD = process.env.PWD || process.cwd();

var expect = require('chai').expect,
    fs = require('fs-extra'),
    path = require('path'),
    createStorage = require('../../lib/storage.js');

describe('lib/storage (local driver)', function() {

    var storage = createStorage('files/resumes/');
    var root = createStorage.LOCAL_ROOT;

    afterEach(function(done) {
        fs.remove(path.join(root, 'files'), function() { done(); });
    });

    it('writes a file and reports it through stat', function(done) {
        storage.writeFile('abc/test.txt', Buffer.from('hello'), function(err) {
            expect(err).to.not.exist;
            storage.stat('abc/test.txt', function(err, stats) {
                expect(err).to.not.exist;
                expect(stats.size).to.equal(5);
                done();
            });
        });
    });

    it('creates intermediate directories', function(done) {
        storage.writeFile('deep/nested/path/cv.pdf', Buffer.from('x'), function(err) {
            expect(err).to.not.exist;
            var full = path.join(root, 'files/resumes/deep/nested/path/cv.pdf');
            expect(fs.existsSync(full)).to.equal(true);
            done();
        });
    });

    it('reports a missing file as a 404, matching the S3 contract', function(done) {
        // The controllers switch on err.statusCode and render a specific
        // "reattach your resume" message for 404. Anything else is a 500.
        storage.stat('nope/missing.txt', function(err) {
            expect(err).to.exist;
            expect(err.statusCode).to.equal(404);
            done();
        });
    });

    it('deletes through the s3-shaped deleteObject call', function(done) {
        storage.writeFile('gone/x.txt', Buffer.from('x'), function() {
            storage.s3.deleteObject({ Key: 'gone/x.txt' }, function(err) {
                expect(err).to.not.exist;
                storage.stat('gone/x.txt', function(err) {
                    expect(err.statusCode).to.equal(404);
                    done();
                });
            });
        });
    });

    it('hands back a URL the static route can serve', function(done) {
        storage.s3.getSignedUrl('getObject', { Key: 'u/cv.pdf' }, function(err, url) {
            expect(err).to.not.exist;
            expect(url).to.equal('/uploads/files/resumes/u/cv.pdf');
            done();
        });
    });

    it('refuses a key that escapes the upload root', function(done) {
        // `resume` reaches storage from a database field that started life as
        // a user-supplied filename, so traversal gets stopped here.
        storage.writeFile('../../../../etc/passwd', Buffer.from('x'), function(err) {
            expect(err).to.exist;
            expect(err.message).to.match(/outside the upload root/);
            done();
        });
    });

    it('removes a whole subtree with rmdirp', function(done) {
        storage.writeFile('wipe/a.txt', Buffer.from('a'), function() {
            storage.writeFile('wipe/b.txt', Buffer.from('b'), function() {
                storage.rmdirp('wipe', function(err) {
                    expect(err).to.not.exist;
                    storage.stat('wipe/a.txt', function(err) {
                        expect(err.statusCode).to.equal(404);
                        done();
                    });
                });
            });
        });
    });
});
