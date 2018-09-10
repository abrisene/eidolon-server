/*
 # auth.local.js
 # Local (Email + Password) Strategy
 */

/*
 # Module Dependencies
 */

const { Strategy } = require('passport-local');

const { User } = require('../../models');


/*
 # Critical Variables
*/

const options = {
  usernameField: 'email',
  passwordField: 'password',
  session: false,
};

/*
 # Strategies
*/

const strategy = async () => new Strategy(options, async (email, password, done) => {
  try {
    const result = await User.authenticateEmail(email, password);
    if (result.err) throw result.err;
    if (result.authenticated) return done(null, result.user);
    return done(null, false);
  } catch (err) {
    return done(null, false);
  }
});

/*
 # Module Exports
 */

module.exports = strategy;
