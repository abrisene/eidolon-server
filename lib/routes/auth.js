'use strict';

var _expressJwt = require('express-jwt');

var _expressJwt2 = _interopRequireDefault(_expressJwt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 # Utility Methods
 */

var getTokenFromHeaders = function getTokenFromHeaders(req) {
  var headers = req.headers;
  var authorization = headers.authorization;

  if (authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1];
  }
  return null;
};

/*
 # Critical Variables
 */

/*
 # auth.js
 # Auth Configuration
 */

/**
 # Module Dependencies
 */

var auth = {
  required: (0, _expressJwt2.default)({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders
  }),
  optional: (0, _expressJwt2.default)({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false
  })
};

/**
 # Module Exports
 */

module.exports = auth;