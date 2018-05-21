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

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _twilio = require('twilio');

var _twilio2 = _interopRequireDefault(_twilio);

var _stripe = require('stripe');

var _stripe2 = _interopRequireDefault(_stripe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

_mongoose2.default.Promise = global.Promise;

/**
 # Utility Methods
 */

var jsonFromEnv = function jsonFromEnv(env) {
  return env ? JSON.parse(env) : undefined;
};

var getRedis = function getRedis() {
  var _process$env = process.env,
      REDIS = _process$env.REDIS,
      REDIS_URL = _process$env.REDIS_URL,
      REDISCLOUD_URL = _process$env.REDISCLOUD_URL,
      NODE_ENV = _process$env.NODE_ENV;

  var client = void 0;

  if (REDIS) {
    var redisConfig = jsonFromEnv(REDIS);
    var url = redisConfig.url;
    var password = redisConfig.password;
    client = _redis2.default.createClient(url, { password: password });
  } else if (REDISCLOUD_URL) {
    client = _redis2.default.createClient(REDISCLOUD_URL, { no_ready_check: true });
  } else if (REDIS_URL) {
    client = _redis2.default.createClient(REDIS_URL);
  } else if (NODE_ENV === 'development') {
    client = _redis2.default.createClient();
  }

  if (client) {
    client.on('ready', function () {
      console.log(_chalk2.default.green.bold('>> Redis Connected <<'));
    });
  }

  return client;
};

var getMongoDB = function getMongoDB() {
  var _process$env2 = process.env,
      MONGODB = _process$env2.MONGODB,
      MONGODB_URL = _process$env2.MONGODB_URL,
      MONGODB_URI = _process$env2.MONGODB_URI;

  var client = void 0;
  var url = void 0;

  if (MONGODB) {
    var mongoConfig = jsonFromEnv(MONGODB);
    url = mongoConfig.url;
  } else if (MONGODB_URL || MONGODB_URI) {
    url = MONGODB_URL || MONGODB_URI;
  }

  if (url) {
    var password = url.split(':')[2].split('@')[0];
    var passwordEncoded = encodeURIComponent(password);
    var encodedURL = url.replace(password, passwordEncoded);

    client = _mongoose2.default.connection;
    _mongoose2.default.connect(encodedURL).then(function (db) {
      console.log(_chalk2.default.green.bold('>> MongoDB Connected <<'));
    }).catch(function (err) {
      return console.error(err);
    });
  }

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
  mongodb: getMongoDB(),
  twilio: getTwilio(),
  stripe: getStripe()
};

/**
 # Configs
 */

/**
 # Module Exports
 */

module.exports = config;