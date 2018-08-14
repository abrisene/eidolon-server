'use strict';

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _auth = require('./auth.jwt');

var _auth2 = _interopRequireDefault(_auth);

var _token = require('./token');

var _token2 = _interopRequireDefault(_token);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 # Critical Variables
 */

/*
 # Module Exports
 */

function auth() {
  _passport2.default.use((0, _auth2.default)());
}
// import jwt from 'auth.jwt';
// import google from 'auth.google';
// import facebook from 'auth.facebook';
// import twitter from 'auth.twitter';

/*
 # configs/auth/index.js
 # Authorization Configuration Index
 */

/*
 # Module Dependencies
 */

console.log((0, _token2.default)('5b3723b420e162355569c537'));

module.exports = {
  auth: auth,
  generateToken: _token2.default
};