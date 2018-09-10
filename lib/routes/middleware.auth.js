/*
 # middleware.auth.js
 # Authentication Middleware
 */

/*
 # Module Dependencies
 */

const passport = require('passport');

const config = require('../configs');

/*
 # Middleware
 */

const generateUserToken = (req, res, next) => {
  const { user } = req;
  const { useHttps } = config.get('authentication');

  if (!user) {
    res.status(400).send({ err: 'Could not login.' });
  } else {
    const token = user.generateJWT();
    res.cookie('jwt', token, { httpOnly: true, secure: useHttps });
    next();
  }
};

const clearUserToken = (req, res, next) => {
  const { useHttps } = config.get('authentication');
  res.cookie('jwt', '', { httpOnly: true, secure: useHttps });
  next();
};

// These should handle errors properly as exceptions instead of redirect.
const authenticateJwtRequired = (req, res, next) => passport.authenticate(['jwt'], { session: false }, (err, user) => {
  req.user = user;
  return user ? next() : res.status(400).redirect('/login');
})(req, res, next);

const authenticateJwtOptional = (req, res, next) => passport.authenticate(['jwt'], { session: false }, (err, user) => {
  if (err) return next(err);
  req.user = user;
  return next();
})(req, res, next);

const authenticate = {
  optional: authenticateJwtOptional,
  required: authenticateJwtRequired,
};

/*
 # Module Exports
 */

module.exports = {
  generateUserToken,
  clearUserToken,
  authenticate,
};
