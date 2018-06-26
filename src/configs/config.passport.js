/*
 # config.env.js
 # Environment Configuration File
 */

/**
 # Module Dependencies
 */

import chalk from 'chalk';
import mongoose from 'mongoose';
import passport from 'passport';
import LocalStrategy from 'passport-local';

const Users = mongoose.model('Users');

/*
 # Config
 */

const localStrategy = {
  usernameField: 'user[email]',
  passwordField: 'user[password]',
};

passport.use(new LocalStrategy(localStrategy, (email, password, done) => {
  Users.findOne({ email })
    .then((user) => {
      if (!user || !user.validatePassword(password)) {
        return done(null, false, { errors: { 'email or password': 'is invalid' } });
      }

      return done(null, user);
    })
    .catch(done);
  }));
