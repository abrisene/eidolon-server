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

import twilioRoutes from './routes.twilio';
import stripeRoutes from './routes.stripe';
// import graphqlRoutes from './routes.graphql';

/*
 # Critical Variables
 */

/*
 # Module Exports
 */

export default function Routes(config) {
  const { app, port, address, twilio, stripe } = config;

  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, '../views'));

  // app.use(express.static('public'));
  app.disable('x-powered-by');
  // app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  // app.use(bodyParser.json());

  // == MIDDLEWARE ==

  /*app.use((req, res, next) => {
    if (options.urlClient !== undefined) {
      res.header('Access-Control-Allow-Origin', `${options.urlClient}`);
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    }
    next();
  });*/

  // == MODULAR ROUTES ==

  if (config.twilio) {
    twilioRoutes(config);
  }

  if (config.stripe) {
    stripeRoutes(config);
  }

  // == BASE ROUTES ==

  app.get('/', (req, res) => {
    res.render('index', { address });
  });

  app.get('/index', (req, res) => {
    res.render('index', { address });
  });

  /*app.get('/api/configs', (req, res) => {
    const configs = {
      appName: options.appName,
      firebaseConfig: options.firebaseConfigClient,
    };

    res.json(configs);
  });*/

  app.get('/ping', (req, res) => {
    res.send('pong');
  });

  app.use((req, res) => {
    res.status(404).render('404', { address });
  });
}
