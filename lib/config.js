'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*
                                                                                                                                                                                                                                                                   # config.js
                                                                                                                                                                                                                                                                   # Configuration File
                                                                                                                                                                                                                                                                   */

/**
 # Module Dependencies
 */

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _twilio = require('twilio');

var _twilio2 = _interopRequireDefault(_twilio);

var _stripe = require('stripe');

var _stripe2 = _interopRequireDefault(_stripe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

/**
 # Utility Methods
 */

var jsonFromEnv = function jsonFromEnv(env) {
  return env ? JSON.parse(env) : undefined;
};

var getRedis = function getRedis() {
  var _process$env = process.env,
      REDIS = _process$env.REDIS,
      REDIS_URL = _process$env.REDIS_URL;

  var redisConfig = jsonFromEnv(REDIS);
  var url = redisConfig ? redisConfig.url : REDIS_URL;
  var password = redisConfig ? redisConfig.password : undefined;

  var client = url ? _redis2.default.createClient(url, { password: password }) : _redis2.default.createClient();

  client.on('ready', function () {
    console.log(_chalk2.default.green.bold('>> REDIS Connected <<'));
  });

  return client;
};

var getTwilio = function getTwilio() {
  var t = jsonFromEnv(process.env.TWILIO);
  var client = t && t.account && t.key ? new _twilio2.default(t.account, t.key) : undefined;
  return _extends({}, t, { client: client });
};

var getStripe = function getStripe() {
  var s = jsonFromEnv(process.env.STRIPE);
  var client = s && s.secretKey && s.publicKey ? new _stripe2.default(s.secretKey) : undefined;
  return _extends({}, s, { client: client });
};

/**
 # Critical Variables
 */

var config = {
  env: process.env.NODE_ENV || 'production',
  port: process.env.PORT || 8000,
  appName: process.env.APP_NAME || 'Eidolon',
  app: (0, _express2.default)(),
  redis: getRedis(),
  twilio: getTwilio(process.env.TWILIO),
  stripe: getStripe(process.env.STRIPE)
};

/**
 # Configs
 */

/**
 # Module Exports
 */

module.exports = config;