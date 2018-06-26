'use strict';

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = require('passport-local');

var _passportLocal2 = _interopRequireDefault(_passportLocal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 # config.env.js
 # Environment Configuration File
 */

/**
 # Module Dependencies
 */

var Users = _mongoose2.default.model('Users');

/*
 # Config
 */

var localStrategy = {
  usernameField: 'user[email]',
  passwordField: 'user[password]'
};

_passport2.default.use(new _passportLocal2.default(localStrategy, function (email, password, done) {
  Users.findOne({ email: email }).then(function (user) {
    if (!user || !user.validatePassword(password)) {
      return done(null, false, { errors: { 'email or password': 'is invalid' } });
    }

    return done(null, user);
  }).catch(done);
}));