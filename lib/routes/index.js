const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const logger = require('morgan');
const passport = require('passport');
const authStrategies = require('./auth');

const { cors, injectConfig } = require('./middleware.common');
const { authenticate } = require('./middleware.auth');

const commonRoutes = require('./routes.common');
const authRoutes = require('./routes.auth');
const storefrontRoutes = require('./routes.storefront');

const config = require('../configs');


/*
 # Module Exports
 */

const routes = async () => {
  const environment = config.get('environment');
  const storefront = config.get('storefront');
  const {
    app, appName, env, clientUrl,
  } = environment;
  const { stripe } = storefront;

  const routeConfig = {
    title: appName,
    appName,
    env,
    publicKeys: {
      stripe: stripe.publicKey,
    },
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

  app.use(injectConfig('config', routeConfig));

  app.use(passport.initialize());
  await authStrategies();

  // API Middleware


  // Routes
  await commonRoutes();
  await authRoutes();
  await storefrontRoutes();

  // 404 Handling
  app.use(authenticate.optional, (req, res) => {
    res.status(404);
    res.render('404', { ...req.config, user: req.user, url: req.url });
  });
};

module.exports = routes;
