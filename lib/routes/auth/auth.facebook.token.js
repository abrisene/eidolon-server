/*
 # auth.facebook.token.js
 # Facebook Token Authentication Strategy
 */

/*
 # Module Dependencies
 */

// const { OAuth2Strategy } = require('passport-google-oauth');
const Strategy = require('passport-facebook-token');

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
  const options = config.get('authentication').facebook;
  return new Strategy(options, async (accessToken, refreshToken, profile, done) => {
    try {
      const userData = {
        id: profile.id,
        email: profile.emails[0].value,
        displayName: profile.displayName,
        gender: profile.gender,
        metadata: {
          name: profile.name,
          photoUrl: profile.photos[0].value,
          // profileUrl: profile._json.link,
        },
      };

      const result = await User.authenticateSocial('facebook', userData);

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
