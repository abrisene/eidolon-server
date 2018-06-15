'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*
                                                                                                                                                                                                                                                                   # config.modules.js
                                                                                                                                                                                                                                                                   # Module Configuration File
                                                                                                                                                                                                                                                                   */

/**
 # Module Dependencies
 */

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _twilio = require('twilio');

var _twilio2 = _interopRequireDefault(_twilio);

var _stripe = require('stripe');

var _stripe2 = _interopRequireDefault(_stripe);

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

/**
 # Configuration Methods
 */

/**
 ### TWILIO
 */

var getTwilio = function getTwilio() {
  var t = jsonFromEnv(process.env.TWILIO);
  var client = t && t.account && t.key ? new _twilio2.default(t.account, t.key) : undefined;
  return _extends({}, t, { client: client });
};

/**
 ### STRIPE
 */

var getStripe = function getStripe() {
  var s = jsonFromEnv(process.env.STRIPE);
  var client = s && s.secretKey && s.publicKey ? new _stripe2.default(s.secretKey) : undefined;
  apiPublicKeys.stripe = s ? s.publicKey || undefined : undefined;
  return _extends({}, s, { client: client });
};

/**
 # Critical Variables
 */

var config = {
  twilio: getTwilio(),
  stripe: getStripe(),
  apiPublicKeys: apiPublicKeys
};

/**
 # Module Exports
 */

module.exports = _extends({}, config, {
  apiPublicKeys: apiPublicKeys
});