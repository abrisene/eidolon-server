'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*
                                                                                                                                                                                                                                                                   # config.auth.js
                                                                                                                                                                                                                                                                   # Auth Configuration File
                                                                                                                                                                                                                                                                   */

/**
 # Module Dependencies
 */

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

/*
 # Critical Variables
 */

var apiPublicKeys = {};

/**
 # Utility Methods
 */

var jsonFromEnv = function jsonFromEnv(env) {
  return env ? JSON.parse(env) : undefined;
};

var getJWTConfig = function getJWTConfig() {
  return {
    secret: process.env.JWT_SECRET || 'testsecret',
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE
  };
};

/**
 # Critical Variables
 */

var config = {
  jwt: getJWTConfig(),
  google: jsonFromEnv(process.env.GOOGLE_AUTH),
  facebook: jsonFromEnv(process.env.FACEBOOK_AUTH)
};

/**
 # Module Exports
 */

module.exports = _extends({}, config, {
  apiPublicKeys: apiPublicKeys
});