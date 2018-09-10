/*
 # sockets/index.js
 # Sockets Index
 */

/*
 # Module Dependencies
 */

const chalk = require('chalk');

const config = require('../configs');

/*
 # Module Exports
 */

const sockets = async () => {
  const environment = config.get('environment');
  const { io } = environment;

  // Set socket.io listeners.
  io.on('connection', (socket) => {
    console.log(chalk.cyan.bold('>> Client Connected <<'));

    socket.on('disconnect', () => {
      console.log(chalk.magenta.bold('>> Client Disconnected <<'));
    });
  });
};

module.exports = sockets;
