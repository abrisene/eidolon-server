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

const authenticateJwtRole = (roles = []) => (req, res, next) => passport.authenticate(['jwt'], { session: false }, (err, user) => {
  if (err) return next(err);
  req.user = user;

  const userRoles = user.roles || [];
  let requiredRoles;
  let valid = false;

  // Generate the required roles.
  if (Array.isArray(roles)) {
    requiredRoles = roles;
  } else if (typeof roles === 'string') {
    requiredRoles = [roles];
  }

  // Validate the user roles against the required roles.
  requiredRoles.some((role) => {
    if (userRoles.includes(role)) valid = true;
    return valid;
  });

  return valid ? next() : res.status(400).redirect('/');
})(req, res, next);

const authenticate = {
  optional: authenticateJwtOptional,
  required: authenticateJwtRequired,
  role: authenticateJwtRole,
};

/*
 # Module Exports
 */

module.exports = {
  generateUserToken,
  clearUserToken,
  authenticate,
};
