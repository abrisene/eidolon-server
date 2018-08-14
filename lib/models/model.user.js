'use strict';

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _configs = require('../configs');

var _configs2 = _interopRequireDefault(_configs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 # Utility Methods
 */

/*
 # model.users.js
 # Users Mongoose Model
 */

/**
 # Module Dependencies
 */

var hashPassword = function hashPassword(password, salt) {
  return _crypto2.default.pbkdf2Sync(password, salt, 1000, 512, 'sha512').toString('hex');
};

/*
 # Schema
 */

// import passportLocalMongoose from 'passport-local-mongoose';

// Replace with bcrypt
var schema = new _mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  hash: String,
  salt: String
});

/*
 # Plugins
 */

var options = {
  usernameField: 'email',
  lastLoginField: 'lastLoginTS',
  usernameLowerCase: true
};

// schema.plugin(passportLocalMongoose, options);


/**
 # Schema Methods
 */

/*schema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(32).toString('hex');
  this.hash = hashPassword(password, this.salt);
};

schema.methods.validatePassword = function (password) {
  const hash = hashPassword(password, this.salt);
  return this.hash === hash;
};*/

/*schema.methods.generateJWT = function () {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
};

schema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    email: this.email,
  };
};*/

schema.methods.generateJWT = function () {};

/**
 # Module Exports
 */

module.exports = _mongoose2.default.model('User', schema);