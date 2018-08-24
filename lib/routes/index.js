/*
 # routes/index.js
 # Routes Index
 */

/*
 # Module Dependencies
 */

const chalk = require('chalk');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const auth = require('./auth');
const { asyncRoute, cors, generateUserToken } = require('./middleware.common');

const config = require('../configs');

const { User } = require('../models');

/*
 # Module Exports
 */

const routes = async () => {
  const environment = config.get('environment');
  const { app, appName, env, clientURL } = environment;

  // Express Settings
  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, '../views'));
  app.disable('x-powered-by');

  // Middleware Configs
  app.use(express.static('public'));

  // app.use(logger('combined'));

  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors(clientURL));

  app.use(passport.initialize());
  await auth();

  // Basic Routes
  app.get('/', (req, res) => {
    res.render('index', { title: appName, env });
  });

  app.get('/login', (req, res) => {
    res.render('login', { title: appName, env });
  });

  app.post('/auth/login', 
    passport.authenticate(['local'], { session: false }),
    generateUserToken,
    (req, res) => {
      console.log(req.user);
      res.redirect('/');
    });

  app.get('/register', (req, res) => {
    res.render('register', { title: appName, env });
  });

  app.post('/auth/register', asyncRoute(async (req, res, next) => {
    console.log(req.body);
    const { email, password } = req.body;
    const result = await User.registerEmail(email, password);

    if (result.user) {
      req.user = result.user;
      next();
    } else {
      res
        .status(400)
        .redirect('/register');
    }
  }),
  generateUserToken,
  (req, res) => {
    res.redirect('/');
  });

  // Account Recovery
  app.get('/authenticate/recover/', (req, res) => {
    res.render('login', { title: appName, env });
  });

  // Reset Password with Token
  app.get('/authenticate/recover/:token', (req, res) => {
    res.render('login', { title: appName, env });
  });

  // Confirm Email with Token
  app.get('/authenticate/email/:token', (req, res) => {
    res.render('login', { title: appName, env });
  });

  /*app.get('/api/secure',
    passport.authenticate(['jwt'], { session: false }), (req, res) => {
      res.send('Secure response from ' + JSON.stringify(req.user));
    }
  );*/

  // 404 Handling
  app.use((req, res, next) => {
    res.status(404);

    if (res.format('html')) {
      res.render('404', { title: appName, env, url: req.url });
    }

    if (res.format('json')) {
      res.json({ error: 'Not found' });
    }

    res.type('txt').send('404: Not found');
  });
};

module.exports = routes;
