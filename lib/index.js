'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*
                                                                                                                                                                                                                                                                   # index.js
                                                                                                                                                                                                                                                                   # Server Index
                                                                                                                                                                                                                                                                   */

/**
 # Module Dependencies
 */

var _templateObject = _taggedTemplateLiteral(['  {cyan ', '}'], ['  {cyan ', '}']),
    _templateObject2 = _taggedTemplateLiteral(['    \u2022 {', ' ', '}'], ['    \u2022 {', ' ', '}']);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _ip = require('ip');

var _ip2 = _interopRequireDefault(_ip);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _configs = require('./configs');

var _configs2 = _interopRequireDefault(_configs);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _sockets = require('./sockets');

var _sockets2 = _interopRequireDefault(_sockets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

/*
 # Critical Variables
 */

var _config$environment = _configs2.default.environment,
    appName = _config$environment.appName,
    port = _config$environment.port,
    app = _config$environment.app,
    env = _config$environment.env;

/*
 # Server
 */

var server = app.listen(port, function () {

  // Server Info
  var address = 'http://' + _ip2.default.address() + ':' + port;
  var io = (0, _socket2.default)(server);

  // Inject Server Info into Environment Config
  var serverConfig = _extends({}, _configs2.default, {
    environment: _extends({}, _configs2.default.environment, { server: server, io: io, address: address })
  });

  _configs2.default.environment.server = server;
  _configs2.default.environment.io = io;

  // Routes & Sockets
  (0, _routes2.default)(serverConfig);
  (0, _sockets2.default)(serverConfig);

  // Render Status Logs
  console.log(_chalk2.default.bold.underline.green('\n' + appName + ' Listening on ' + port + ':\n'));

  console.log(_chalk2.default.bold.underline.green('  Addresses:\n'));
  if (env === 'development') console.log(_chalk2.default.cyan.bold('  \u2022 http://localhost:' + port));
  console.log(_chalk2.default.cyan.bold('  \u2022 ' + address));

  console.log(_chalk2.default.bold.underline.green('\n  Configs:\n'));
  Object.keys(_configs2.default).forEach(function (configKey) {
    console.log((0, _chalk2.default)(_templateObject, configKey));
    Object.keys(_configs2.default[configKey]).forEach(function (k) {
      var color = _configs2.default[configKey][k] !== undefined ? 'cyan.bold' : 'dim';
      if (k !== 'apiPublicKeys') console.log((0, _chalk2.default)(_templateObject2, color, k));
    });
    console.log('\n');
  });
  console.log('\n');
});