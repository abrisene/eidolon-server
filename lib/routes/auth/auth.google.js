/*
 # auth.google.js
 # Google Authentication Strategy
 */

/*
 # Module Dependencies
 */

const { OAuth2Strategy } = require('passport-google-oauth');

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
  return new OAuth2Strategy(options, async (request, accessToken, refreshToken, profile, done) => {
    try {
      const userData = {
        id: profile.id,
        email: profile.emails[0].value,
        displayName: profile.displayName,
        gender: profile.gender,
        metadata: {
          name: profile.name,
          photos: profile.photos,
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
