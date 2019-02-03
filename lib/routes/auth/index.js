/*
 # routes/auth/index.js
 # Passport Strategy Index
 */

/**
 # Module Dependencies
 */

const passport = require('passport');

const config = require('../../configs');

const authJwt = require('./auth.jwt');
const authLocal = require('./auth.local');

const authGoogle = require('./auth.google');
const authGoogleToken = require('./auth.google.token');
const authFacebook = require('./auth.facebook');
const authFacebookToken = require('./auth.facebook.token');
// const authTwitter = require('./auth.twitter');
// const authLinkedIn = require('./auth.linkedin');
// const authPinterest = require('./auth.pinterest');

/**
 # Module Exports
 */

const auth = async () => {
  const jwtStrategy = await authJwt();
  const localStrategy = await authLocal();

  const googleStrategy = await authGoogle();
  const googleTokenStrategy = await authGoogleToken();
  const facebookStrategy = await authFacebook();
  const facebookTokenStrategy = await authFacebookToken();
  // const twitterStrategy = await authTwitter;
  // const linkedInStrategy = await authLinkedIn;
  // const pinterestStrategy = await authPinterest;

  passport.use(jwtStrategy);
  passport.use(localStrategy);

  if (config.get('authentication').google.clientID) {
    passport.use(googleStrategy);
    passport.use(googleTokenStrategy);
  }
  if (config.get('authentication').facebook.clientID) {
    passport.use(facebookStrategy);
    passport.use(facebookTokenStrategy);
  }
  // if (config.get('authentication').twitter.clientID) passport.use(twitterStrategy());
  // if (config.get('authentication').linkedIn.clientID) passport.use(linkedInStrategy());
  // if (config.get('authentication').pinterest.clientID) passport.use(pinterestStrategy());
};

module.exports = auth;
