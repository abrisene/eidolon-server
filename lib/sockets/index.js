'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Sockets;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 # Critical Variables
 */

/*
 # Module Exports
 */

function Sockets(config) {
  var io = config.environment.io;

  // Set socket.io listeners.

  io.on('connection', function (socket) {
    console.log(_chalk2.default.cyan.bold('>> Client Connected <<'));

    socket.on('disconnect', function () {
      console.log(_chalk2.default.magenta.bold('>> Client Disconnected <<'));
    });
  });
} /*
   # index.js
   # Socket Index
   */

/*
 # Module Dependencies
 */