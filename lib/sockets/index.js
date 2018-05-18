'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Sockets;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 # Critical Variables
 */

/*
 # Module Exports
 */

/*
 # index.js
 # Void Socket Index
 */

/*
 # Module Dependencies
 */

function Sockets(config) {
  var server = config.server;

  var io = (0, _socket2.default)(server);

  // Set socket.io listeners.
  io.on('connection', function (socket) {
    console.log(_chalk2.default.cyan.bold('>> Client Connected <<'));

    socket.on('disconnect', function () {
      console.log(_chalk2.default.magenta.bold('>> Client Disconnected <<'));
    });
  });

  return io;
}