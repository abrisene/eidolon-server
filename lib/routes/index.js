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
const authStrategies = require('./auth');

const { asyncRoute, cors, injectConfig } = require('./middleware.common');
const { generateUserToken, authenticate } = require('./middleware.auth');

const commonRoutes = require('./routes.common');
const authRoutes = require('./routes.auth');
// const storefrontRoutes = require('./routes.storefront');

const config = require('../configs');


/*
 # Module Exports
 */

const routes = async () => {
  const environment = config.get('environment');
  const { app, appName, env, clientUrl } = environment;

  const envConfig = {
    title: appName,
    appName,
    env,
  };

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
  app.use(cors(clientUrl));

  app.use(injectConfig('config', envConfig));

  app.use(passport.initialize());
  await authStrategies();

  // API Middleware
  

  // Common Routes
  await commonRoutes();

  // Authorization Routes
  await authRoutes();

  // 404 Handling
  app.use(authenticate.optional, (req, res, next) => {
    res.status(404);
    res.render('404', { ...req.config, user: req.user, url: req.url });
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
