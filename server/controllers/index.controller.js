'use strict';
var path = require('path'),
    config = require('../config/config');

var appRoot = path.dirname(require.main.filename);

/**
 * @link http://stackoverflow.com/questions/10265798/determine-project-root-from-a-running-node-js-application
 * @param req
 * @param res
 * @param next
 */
exports.index = function (req, res, next) {
    res.sendFile(appRoot + '/' + config.dir + '/index.html');
};