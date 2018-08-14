/*
 # configs/auth/index.js
 # Authorization Configuration Index
 */

/*
 # Module Dependencies
 */

import passport from 'passport';

import authJwtStrategy from './auth.jwt';
// import jwt from 'auth.jwt';
// import google from 'auth.google';
// import facebook from 'auth.facebook';
// import twitter from 'auth.twitter';

import generateToken from './token';


/*
 # Critical Variables
 */

/*
 # Module Exports
 */

function auth() {
  passport.use(authJwtStrategy());
}

console.log(generateToken('5b3723b420e162355569c537'));


module.exports = {
  auth,
  generateToken,
};
