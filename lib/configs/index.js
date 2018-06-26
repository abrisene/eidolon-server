'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*
                                                                                                                                                                                                                                                                   # configs/index.js
                                                                                                                                                                                                                                                                   # Configuration Index
                                                                                                                                                                                                                                                                   */

/*
 # Module Dependencies
 */

var _config = require('./config.env');

var _config2 = _interopRequireDefault(_config);

var _config3 = require('./config.db');

var _config4 = _interopRequireDefault(_config3);

var _config5 = require('./config.modules');

var _config6 = _interopRequireDefault(_config5);

var _config7 = require('./config.passport');

var _config8 = _interopRequireDefault(_config7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 # Critical Variables
 */

/*
 # Module Exports
 */

module.exports = {
  environment: _config2.default,
  database: _config4.default,
  modules: _config6.default,
  apiPublicKeys: _extends({}, _config2.default.apiPublicKeys, _config4.default.apiPublicKeys, _config6.default.apiPublicKeys)
};