'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*
                                                                                                                                                                                                                                                                   # index.js
                                                                                                                                                                                                                                                                   # Index
                                                                                                                                                                                                                                                                   */

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _ip = require('ip');

var _ip2 = _interopRequireDefault(_ip);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _sockets = require('./sockets');

var _sockets2 = _interopRequireDefault(_sockets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(Object.keys(_config2.default));

var server = _config.app.listen(_config.port, function () {
  var address = 'http://' + _ip2.default.address() + ':' + _config.port;
  var serverConfig = _extends({}, _config2.default, { server: server, address: address });

  (0, _routes2.default)(serverConfig);
  (0, _sockets2.default)(serverConfig);

  console.log(_chalk2.default.bold.underline.green('\n' + _config.appName + ' Listening on ' + _config.port + ':'));
  console.log(_chalk2.default.cyan.bold('\n    >> ' + address + '\n    '));
});