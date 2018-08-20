/*
 # middleware.common.js
 # Common Middleware
 */

/*
 # Module Dependencies
 */

/*
 # Middleware
 */

const asyncRoute = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(next)
};

const cors = url => (req, res, next) => {
  if (url) {
    res.header('Access-Control-Allow-Origin', `${url}`);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  }
  next();
};

/*
 # Module Exports
 */

module.exports = {
  asyncRoute,
  cors,
};
