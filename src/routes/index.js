/*
 # routes/index.js
 # Routes Index
 */

/*
 # Module Dependencies
 */

import chalk from 'chalk';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';

import passport from 'passport';

import { auth } from '../auth';

import authRoutes from './routes.auth';
import twilioRoutes from './routes.twilio';
import stripeRoutes from './routes.stripe';
// import graphqlRoutes from './routes.graphql';


/*
 # Critical Variables
 */

/*
 # Module Exports
 */

module.exports = function Routes(config) {
  const { app, env, appName } = config.environment;
  const { apiPublicKeys } = config;

  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, '../views'));

  app.use(express.static('public'));
  app.disable('x-powered-by');

  app.use(passport.initialize());

  // app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  auth();


  // == MIDDLEWARE ==

  // CORS FOR CLIENT URL
  app.use((req, res, next) => {
    if (config.clientURL !== undefined) {
      res.header('Access-Control-Allow-Origin', `${config.clientURL}`);
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    }
    next();
  });

  // == MODULAR ROUTES ==
  
  authRoutes({ ...config });

  if (config.modules.twilio) {
    twilioRoutes({ ...config });
  }

  if (config.modules.stripe) {
    stripeRoutes({ ...config });
  }

  // == BASE ROUTES ==

  app.get('/', (req, res) => {
    res.render('index', { title: appName, env });
  });

  app.get('/index', (req, res) => {
    res.render('index', { title: appName, env });
  });

  app.get('/react', (req, res) => {
    res.render('index-react', { title: appName, env });
  })

  app.get('/api/configs', (req, res) => {
    const configs = {
      appName,
      apiKeys: apiPublicKeys,
    };

    res.json(configs);
  });

  app.get('/ping', (req, res) => {
    res.send('pong');
  });

  app.use((req, res) => {
    res.status(404).render('404', { title: appName, env });
  });
}
