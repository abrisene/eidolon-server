/*
 # routes/auth/index.js
 # Users Mongoose Model
 */

/**
 # Module Dependencies
 */

const passport = require('passport');

const authJwt = require('./auth.jwt');
const authLocal = require('./auth.local');

// const googleStrategy = require('./auth.google');
// const facebookStrategy = require('./auth.facebook');
// const twitterStrategy = require('./auth.twitter');
// const linkedInStrategy = require('./auth.linkedin');
// const pinterestStrategy = require('./auth.pinterest');

/**
 # Module Exports
 */

const auth = async () => {
  const jwtStrategy = await authJwt();
  const localStrategy = await authLocal();

  console.log(localStrategy);

  // const googleStrategy = await authGoogle;
  // const facebookStrategy = await authFacebook;
  // const twitterStrategy = await authTwitter;
  // const linkedInStrategy = await authLinkedIn;
  // const pinterestStrategy = await authPinterest;

  passport.use(jwtStrategy);
  passport.use(localStrategy);

  // if (google) passport.use(googleStrategy());
  // if (facebook) passport.use(facebookStrategy());
  // if (twitter) passport.use(twitterStrategy());
  // if (linkedIn) passport.use(linkedInStrategy());
  // if (pinterest) passport.use(pinterestStrategy());
};

module.exports = auth;
