#!/usr/bin/env node
'use strict';

/**
 * Compile the project's Sass.
 *
 * Replaces grunt-sass, which pulled node-sass 3.13 — a native module with no
 * prebuilt binary for any current toolchain, so `npm install` failed outright
 * on a clean clone.
 *
 * This uses dart-sass's JS API rather than its CLI on purpose. The CLI loads
 * chokidar for `--watch` even when you are not watching, and chokidar's newer
 * releases are ESM-only, which Node 12 cannot require. Calling renderSync
 * never touches that path, so a one-shot build has one fewer thing to drift.
 *
 * Output mirrors the old grunt-sass layout, which is what the <link> tags in
 * client/index.html already point at:
 *
 *   client/sass/**\/*.scss            -> client/public/css/sass/**\/*.css
 *   client/public/scripts/**\/*.scss  -> client/public/css/scripts/**\/*.css
 */

var fs = require('fs-extra');
var path = require('path');
var sass = require('sass');

var REPO = path.resolve(__dirname, '..');

var SOURCES = [
    { from: path.join(REPO, 'client', 'sass'), to: path.join(REPO, 'client', 'public', 'css', 'sass') },
    { from: path.join(REPO, 'client', 'public', 'scripts'), to: path.join(REPO, 'client', 'public', 'css', 'scripts') }
];

/** Every .scss under `dir`, ignoring partials (_name.scss). */
function findStylesheets(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).reduce(function(found, entry) {
        var full = path.join(dir, entry);
        if (fs.statSync(full).isDirectory()) return found.concat(findStylesheets(full));
        if (path.extname(entry) === '.scss' && entry.charAt(0) !== '_') found.push(full);
        return found;
    }, []);
}

var compiled = 0;

SOURCES.forEach(function(source) {
    findStylesheets(source.from).forEach(function(file) {
        var result = sass.renderSync({ file: file, outputStyle: 'expanded' });
        var target = path.join(source.to, path.relative(source.from, file)).replace(/\.scss$/, '.css');
        fs.outputFileSync(target, result.css);
        compiled++;
    });
});

console.log('build:css — compiled ' + compiled + ' stylesheets');
