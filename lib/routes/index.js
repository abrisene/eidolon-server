'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*
                                                                                                                                                                                                                                                                   # routes/index.js
                                                                                                                                                                                                                                                                   # Routes Index
                                                                                                                                                                                                                                                                   */

/*
 # Module Dependencies
 */

exports.default = Routes;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _routes = require('./routes.twilio');

var _routes2 = _interopRequireDefault(_routes);

var _routes3 = require('./routes.stripe');

var _routes4 = _interopRequireDefault(_routes3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import graphqlRoutes from './routes.graphql';

/*
 # Critical Variables
 */

/*
 # Module Exports
 */

function Routes(config) {
  var _config$environment = config.environment,
      app = _config$environment.app,
      env = _config$environment.env,
      appName = _config$environment.appName;
  var apiPublicKeys = config.apiPublicKeys;


  app.set('view engine', 'pug');
  app.set('views', _path2.default.join(__dirname, '../views'));

  app.use(_express2.default.static('public'));
  app.disable('x-powered-by');
  // app.use(cookieParser());
  app.use(_bodyParser2.default.urlencoded({ extended: true }));
  app.use(_bodyParser2.default.json());

  // == MIDDLEWARE ==

  // CORS FOR CLIENT URL
  app.use(function (req, res, next) {
    if (config.clientURL !== undefined) {
      res.header('Access-Control-Allow-Origin', '' + config.clientURL);
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    }
    next();
  });

  // == MODULAR ROUTES ==

  if (config.modules.twilio) {
    (0, _routes2.default)(_extends({}, config));
  }

  if (config.modules.stripe) {
    (0, _routes4.default)(_extends({}, config));
  }

  // == BASE ROUTES ==

  app.get('/', function (req, res) {
    res.render('index', { title: appName, env: env });
  });

  app.get('/index', function (req, res) {
    res.render('index', { title: appName, env: env });
  });

  app.get('/react', function (req, res) {
    res.render('index-react', { title: appName, env: env });
  });

  app.get('/api/configs', function (req, res) {
    var configs = {
      appName: appName,
      apiKeys: apiPublicKeys
    };

    res.json(configs);
  });

  app.get('/ping', function (req, res) {
    res.send('pong');
  });

  app.use(function (req, res) {
    res.status(404).render('404', { title: appName, env: env });
  });
}