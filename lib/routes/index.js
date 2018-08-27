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

const { asyncRoute, cors } = require('./middleware.common');
const { generateUserToken, authenticate } = require('./middleware.auth');

const authRoutes = require('./routes.auth');

const config = require('../configs');


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

  // Authorization Routes
  await authRoutes();

  // 404 Handling
  app.use((req, res, next) => {
    res.status(404);
    res.render('404', { title: appName, env, url: req.url });
    /*if (res.format('html')) {
      res.render('404', { title: appName, env, url: req.url });
    }

    if (res.format('json')) {
      res.json({ error: 'Not found' });
    }

    res.type('txt').send('404: Not found');*/
  });
};

module.exports = routes;
