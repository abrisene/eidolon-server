/*
 # auth.google.token.js
 # Google Token Authentication Strategy
 */

/*
 # Module Dependencies
 */

// const { OAuth2Strategy } = require('passport-google-oauth');
const { Strategy } = require('passport-google-token');

const config = require('../../configs');

const { User } = require('../../models');


/*
 # Critical Variables
*/


/**
 * Options Schmea
 *
 * options = {
 *   clientID,
 *   clientSecret,
 *   callbackURL
 * }
 */


/*
 # Strategies
*/

const strategy = async () => {
  const options = config.get('authentication').google;
  return new Strategy(options, async (accessToken, refreshToken, profile, done) => {
    try {
      const userData = {
        id: profile.id,
        email: profile.emails[0].value,
        displayName: profile.displayName,
        gender: profile._json.gender,
        metadata: {
          name: profile.name,
          photoUrl: profile._json.picture,
          profileUrl: profile._json.link,
        },
      };

      const result = await User.authenticateSocial('google', userData);

      if (result.authenticated) return done(null, result.user);
      return done(null, false);
    } catch (err) {
      return done(null, false);
    }
  });
};

/*
 # Module Exports
 */

module.exports = strategy;
