'use strict';

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _auth = require('../auth');

var _models = require('../models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import auth from './middleware.auth';

// import auth from './auth';

/*
 # Critical Variables
 */

// const Users = mongoose.model('Users');


/*
 # Utility Functions
 */

/*
 # Module Exports
 */

module.exports = function AuthRoutes(config) {
  var _config$environment = config.environment,
      app = _config$environment.app,
      env = _config$environment.env,
      appName = _config$environment.appName;


  (0, _auth.auth)(config);

  app.get('/api/secure', _passport2.default.authenticate(['jwt'], { session: false }), function (req, res) {
    res.send('Secure response from ' + JSON.stringify(req.user));
  });

  /*app.get('/test/register', auth.optional, (req, res) => {
    const { payload } = req;
    const { id } = req;
    console.log('x');
    res.render('auth-test', { title: appName, user: id });
  });
   app.post('/auth/register', auth.optional, (req, res, next) => {
    console.log('REGISTERING');
    const { body } = req;
    const { email, password } = body;
    console.log(email);
    console.log(body);
    const user = new User({ email });
     User.register(user, password, (err) => {
      if (err) {
        console.log(chalk`{red ${err}}`);
        return next(err);
      }
       console.log('REGISTERED');
      res.json({ user: user.toAuthJSON() });
    });
  });
   app.post('/auth/login', auth.optional, (req, res, next) => {
    console.log('LOGIN');
    return passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) {
        console.log(chalk`{red ${err}}`);
        return next(err);
      }
       // console.log(user);
      if (user) {
        console.log('LOGGED IN');
        return res.json({ user: user.toAuthJSON() });
      }
      return res.status(400).info;
      
    })(req, res, next);
  });
   app.post('/auth/logout', auth.optional, (req, res) => {
    req.logout();
    res.redirect('/');
  });
   app.get('/auth/register', auth.optional, (req, res) => {
    const { payload } = req;
    res.json(payload);
  });
   app.get('/auth/login', auth.optional, (req, res) => {
    const { payload } = req;
    res.json(payload);
  });*/
}; /*
    # routes.stripe.js
    # Stripe Payments Route Index
    */

/*
 # Module Dependencies
 */