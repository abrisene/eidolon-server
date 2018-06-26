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

import auth from './auth';

/*
 # Critical Variables
 */

const Users = mongoose.model('Users');

/*
 # Utility Functions
 */


/*
 # Module Exports
 */

export default function AuthRoutes(config) {
  console.log(Object.keys(config));
  const { app, env, appName } = config.environment;

  app.get('/test/register', auth.optional, (req, res) => {
    const { payload } = req;
    const { id } = req;
    res.render('auth-test', { title: appName, user: id });
  });

  // REGISTRATION
  app.post('/api/register', auth.optional, (req, res, next) => {
    const { body } = req;
    const user = body;

    console.log('x');
    console.log(body);
    console.log(user);

    if (!user.email) {
      return res.status(422)
        .json({
          errors: { email: 'is required' },
        });
    }

    if (!user.password) {
      return res.status(422)
        .json({
          errors: { password: 'is required' },
        });
    }

    const newUser = new Users(user);
    newUser.setPassword(user.password);

    return newUser.save()
      .then(() => res.json({ user: newUser.toAuthJSON() }));
  });

  app.post('/api/login', auth.optional, (req, res, next) => {
    const { body } = req;
    const user = body;

    if (!user.email) {
      return res.status(422)
        .json({
          errors: { email: 'is required' },
        });
    }

    if (!user.password) {
      return res.status(422)
        .json({
          errors: { password: 'is required' },
        });
    }

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
      if (err) return next(err);

      if (passportUser) {
        const authUser = passportUser;
        authUser.token = passportUser.generateJWT();

        return res.json({ user: user.toAuthJSON() });
      }

      return status(400).info;
    })(req, res, next);
  });

  app.get('/api/user', auth.required, (req, res, next) => {
    const { payload } = req;
    const { id } = req;

    return Users.findById(id)
      .then((user) => {
        if (!user) {
          return res.sendStatus(400);
        }

        return res.json({ user: user.toAuthJSON() });
      });
  });
}
