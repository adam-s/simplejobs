'use strict';

var chai = require('chai');

// Load Chai assertions
global.expect = chai.expect;

// Load Sinon
global.sinon = require('sinon');

// Load Supertest as request
global.request = require('supertest');

// Load the application
if (typeof global.app == 'undefined') {
    global.app = require(__dirname + '/server.js');
}

// Initialize Chai plugins
chai.use(require('sinon-chai'));


