/*
 # auth.jwt.js
 # JSON Web Token Strategy
 */

/*
 # Module Dependencies
 */

const { Strategy, ExtractJwt } = require('passport-jwt');

const config = require('../../configs');

const { User } = require('../../models');

/*
 # Critical Variables
*/

const extractors = [
  // Note, this will fail if https is not enabled. Cookie is signed with secure.
  (req) => {
    let jwt;
    if (req !== undefined && req.cookies !== undefined) {
      jwt = req.cookies.jwt || req.cookies.bearer;
    }
    return jwt;
  },
  ExtractJwt.fromAuthHeaderAsBearerToken(),
];

/*
 # Strategies
*/

const strategy = async () => {
  const options = config.get('authentication').jwt;
  options.jwtFromRequest = ExtractJwt.fromExtractors(extractors);
  return new Strategy(options, async (payload, done) => {
    try {
      const id = payload.sub;
      const user = await User.findOne({ _id: id });
      return user ? done(null, user) : done(null, false);
    } catch (err) {
      return done(err, false);
    }
  });
};

/*
 # Module Exports
 */

module.exports = strategy;
