/*
 # configs/auth/index.js
 # Authorization Configuration Index
 */

/*
 # Module Dependencies
 */

import { Strategy, ExtractJwt } from 'passport-jwt';

import { User } from '../models';
import config from '../configs';

/*
 # Module Exports
 */

module.exports = function authJwtStrategy() {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.auth.jwt.secret,
    issuer: config.auth.jwt.issuer,
    audience: config.auth.jwt.audience,
  };

  const strategy = new Strategy(options, (payload, done) => {
    const id = payload.sub; // ID is Subject of Payload?

    User.find({ _id: id }, (err, user) => {
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
}
