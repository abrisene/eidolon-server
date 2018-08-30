/*
 # middleware.common.js
 # Common Middleware
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
}

const authenticateJwtOptional = (req, res, next) => {
  return passport.authenticate(['jwt'], { session: false }, (err, user, info) => {
    if (err) return next(err);
    req.user = user;
    return next();
  })(req, res, next);
};


const authenticateJwtRequired = passport.authenticate(['jwt'],
  { session: false, failureRedirect: '/login' },
);

const authenticate = {
  optional: authenticateJwtOptional,
  required: authenticateJwtRequired,
};

/*
 # Module Exports
 */

module.exports = {
  generateUserToken,
  authenticate,
};
