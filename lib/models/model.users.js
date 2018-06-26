'use strict';

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 # Utility Methods
 */

// Replace with bcrypt
var hashPassword = function hashPassword(password, salt) {
  return _crypto2.default.pbkdf2Sync(password, salt, 1000, 512, 'sha512').toString('hex');
};

/*
 # Schema
 */

/*
 # model.users.js
 # Users Mongoose Model
 */

/**
 # Module Dependencies
 */

var UsersSchema = new _mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  hash: String,
  salt: String
});

/**
 # Schema Methods
 */

UsersSchema.methods.setPassword = function (password) {
  this.salt = _crypto2.default.randomBytes(32).toString('hex');
  this.hash = hashPassword(password, this.salt);
};

UsersSchema.methods.validatePassword = function (password) {
  var hash = hashPassword(password, this.salt);
  return this.hash === hash;
};

UsersSchema.methods.generateJWT = function () {
  var today = new Date();
  var expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return _jsonwebtoken2.default.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10)
  }, 'secret');
};

UsersSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    email: this.email
  };
};

/**
 # Module Exports
 */

_mongoose2.default.model('Users', UsersSchema);