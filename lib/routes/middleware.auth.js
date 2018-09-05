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
  const useHttps = config.get('authentication').useHttps;

  if (!user) {
    res.status(400).send({ err: 'Could not login.' });
  } else {
    const token = user.generateJWT();
    res.cookie('jwt', token, { httpOnly: true, secure: useHttps });
    next();
  }
};

const clearUserToken = (req, res, next) => {
  const useHttps = config.get('authentication').useHttps;
  res.cookie('jwt', '', { httpOnly: true, secure: useHttps });
  next();
};

const authenticateJwtRequired = (req, res, next) => {
  return passport.authenticate(['jwt'], { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).redirect('/register');
    } else {
      req.user = user;
      return next();
    }
  })(req, res, next);
};

const authenticateJwtOptional = (req, res, next) => {
  return passport.authenticate(['jwt'], { session: false }, (err, user, info) => {
    if (err) return next(err);
    req.user = user;
    return next();
  })(req, res, next);
};

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
