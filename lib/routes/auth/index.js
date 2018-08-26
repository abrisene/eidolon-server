/*
 # routes/auth/index.js
 # Users Mongoose Model
 */

/**
 # Module Dependencies
 */

const passport = require('passport');

const config = require('../../configs');

const authJwt = require('./auth.jwt');
const authLocal = require('./auth.local');

const authGoogle = require('./auth.google');
const authFacebook = require('./auth.facebook');
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
  const facebookStrategy = await authFacebook();
  // const twitterStrategy = await authTwitter;
  // const linkedInStrategy = await authLinkedIn;
  // const pinterestStrategy = await authPinterest;

  passport.use(jwtStrategy);
  passport.use(localStrategy);

  if (config.get('authentication').google.clientID) passport.use(googleStrategy);
  if (config.get('authentication').facebook.clientID) passport.use(facebookStrategy);
  // if (twitter) passport.use(twitterStrategy());
  // if (linkedIn) passport.use(linkedInStrategy());
  // if (pinterest) passport.use(pinterestStrategy());
};

module.exports = auth;
