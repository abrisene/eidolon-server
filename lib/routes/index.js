'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

/*
 # routes/index.js
 # Routes Index
 */

/*
 # Module Dependencies
 */

function Routes(config) {
  var app = config.app,
      port = config.port,
      address = config.address,
      twilio = config.twilio,
      stripe = config.stripe;


  app.set('view engine', 'pug');
  app.set('views', _path2.default.join(__dirname, '../views'));

  // app.use(express.static('public'));
  app.disable('x-powered-by');
  // app.use(cookieParser());
  app.use(_bodyParser2.default.urlencoded({ extended: true }));
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
    (0, _routes2.default)(config);
  }

  if (config.stripe) {
    (0, _routes4.default)(config);
  }

  // == BASE ROUTES ==

  app.get('/', function (req, res) {
    res.render('index', { address: address });
  });

  app.get('/index', function (req, res) {
    res.render('index', { address: address });
  });

  /*app.get('/api/configs', (req, res) => {
    const configs = {
      appName: options.appName,
      firebaseConfig: options.firebaseConfigClient,
    };
     res.json(configs);
  });*/

  app.get('/ping', function (req, res) {
    res.send('pong');
  });

  app.use(function (req, res) {
    res.status(404).render('404', { address: address });
  });
}