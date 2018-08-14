/*
 # routes.stripe.js
 # Stripe Payments Route Index
 */

/*
 # Module Dependencies
 */

import chalk from 'chalk';
import mongoose from 'mongoose';
import passport from 'passport';

import { auth } from '../auth';

import { User } from '../models';

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
  const { app, env, appName } = config.environment;

  auth(config);

  app.get('/api/secure', passport.authenticate(['jwt'], { session: false }), (req, res) => {
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
}
