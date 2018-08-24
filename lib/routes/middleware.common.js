/*
 # middleware.common.js
 # Common Middleware
 */

/*
 # Module Dependencies
 */

const config = require('../configs');

/*
 # Middleware
 */

const asyncRoute = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(next)
};

const asyncPassport = (strategy, options = {}) => {
  Promise.resolve()
}

const cors = url => (req, res, next) => {
  if (url) {
    res.header('Access-Control-Allow-Origin', `${url}`);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  }
  next();
};

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

/*
 # Module Exports
 */

module.exports = {
  asyncRoute,
  cors,
  generateUserToken,
};
