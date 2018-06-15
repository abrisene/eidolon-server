'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*
                                                                                                                                                                                                                                                                   # configs/index.js
                                                                                                                                                                                                                                                                   # Configuration Index
                                                                                                                                                                                                                                                                   */

/*
 # Module Dependencies
 */

var _configEnv = require('./config.env.js');

var _configEnv2 = _interopRequireDefault(_configEnv);

var _configDb = require('./config.db.js');

var _configDb2 = _interopRequireDefault(_configDb);

var _configModules = require('./config.modules.js');

var _configModules2 = _interopRequireDefault(_configModules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 # Critical Variables
 */

/*
 # Module Exports
 */

module.exports = {
  environment: _configEnv2.default,
  database: _configDb2.default,
  modules: _configModules2.default,
  apiPublicKeys: _extends({}, _configEnv2.default.apiPublicKeys, _configDb2.default.apiPublicKeys, _configModules2.default.apiPublicKeys)
};