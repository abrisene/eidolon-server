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
const { asyncRoute, cors } = require('./middleware.common');

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

  // app.use(passport.initialize());

  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors(clientURL));

  // Basic Routes
  app.get('/', (req, res) => {
    res.render('index', { title: appName, env });
  });
};

module.exports = routes;
