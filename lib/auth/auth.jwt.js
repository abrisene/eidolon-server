'use strict';

var _passportJwt = require('passport-jwt');

var _models = require('../models');

var _configs = require('../configs');

var _configs2 = _interopRequireDefault(_configs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 # Module Exports
 */

module.exports = function authJwtStrategy() {
  var options = {
    jwtFromRequest: _passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: _configs2.default.auth.jwt.secret,
    issuer: _configs2.default.auth.jwt.issuer,
    audience: _configs2.default.auth.jwt.audience
  };

  var strategy = new _passportJwt.Strategy(options, function (payload, done) {
    var id = payload.sub; // ID is Subject of Payload?

    _models.User.find({ _id: id }, function (err, user) {
      if (user !== undefined) {
        return done(null, user, payload);
      } else {
        return done();
      }
    });
    /* Need to check here that the user is valid, and that the 
        token is not expired or revoked.
    */
  });

  return strategy;
}; /*
    # configs/auth/index.js
    # Authorization Configuration Index
    */

/*
 # Module Dependencies
 */