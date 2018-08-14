'use strict';

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _configs = require('../configs');

var _configs2 = _interopRequireDefault(_configs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 # Module Exports
 */

/*
 # configs/auth/token.js
 # Authorization Token Generator
 */

/*
 # Module Dependencies
 */

module.exports = function generateToken(id) {
  var secret = _configs2.default.auth.jwt.secret;
  var options = {
    expiresIn: '1 hour',
    issuer: _configs2.default.auth.jwt.issuer,
    audience: _configs2.default.auth.jwt.audience,
    subject: id.toString()
  };

  var token = _jsonwebtoken2.default.sign({}, secret, options);

  return token;
};