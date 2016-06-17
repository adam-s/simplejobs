'use strict';

var chai = require('chai');

// Load Chai assertions
global.expect = chai.expect;

// Load Sinon
global.sinon = require('sinon');

// Load Supertest as request
global.request = require('supertest');

// Initialize Chai plugins
chai.use(require('sinon-chai'));


