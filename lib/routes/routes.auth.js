'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = AuthRoutes;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _auth = require('./auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 # Critical Variables
 */

/*
 # routes.stripe.js
 # Stripe Payments Route Index
 */

/*
 # Module Dependencies
 */

var Users = _mongoose2.default.model('Users');

/*
 # Utility Functions
 */

/*
 # Module Exports
 */

function AuthRoutes(config) {
  console.log(Object.keys(config));
  var _config$environment = config.environment,
      app = _config$environment.app,
      env = _config$environment.env,
      appName = _config$environment.appName;


  app.get('/test/register', _auth2.default.optional, function (req, res) {
    var payload = req.payload;
    var id = req.id;

    res.render('auth-test', { title: appName, user: id });
  });

  // REGISTRATION
  app.post('/api/register', _auth2.default.optional, function (req, res, next) {
    var body = req.body;

    var user = body;

    console.log('x');
    console.log(body);
    console.log(user);

    if (!user.email) {
      return res.status(422).json({
        errors: { email: 'is required' }
      });
    }

    if (!user.password) {
      return res.status(422).json({
        errors: { password: 'is required' }
      });
    }

    var newUser = new Users(user);
    newUser.setPassword(user.password);

    return newUser.save().then(function () {
      return res.json({ user: newUser.toAuthJSON() });
    });
  });

  app.post('/api/login', _auth2.default.optional, function (req, res, next) {
    var body = req.body;

    var user = body;

    if (!user.email) {
      return res.status(422).json({
        errors: { email: 'is required' }
      });
    }

    if (!user.password) {
      return res.status(422).json({
        errors: { password: 'is required' }
      });
    }

    return _passport2.default.authenticate('local', { session: false }, function (err, passportUser, info) {
      if (err) return next(err);

      if (passportUser) {
        var authUser = passportUser;
        authUser.token = passportUser.generateJWT();

        return res.json({ user: user.toAuthJSON() });
      }

      return status(400).info;
    })(req, res, next);
  });

  app.get('/api/user', _auth2.default.required, function (req, res, next) {
    var payload = req.payload;
    var id = req.id;


    return Users.findById(id).then(function (user) {
      if (!user) {
        return res.sendStatus(400);
      }

      return res.json({ user: user.toAuthJSON() });
    });
  });
}