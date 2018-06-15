/*
 # index.js
 # Socket Index
 */

/*
 # Module Dependencies
 */

import chalk from 'chalk';

/*
 # Critical Variables
 */

/*
 # Module Exports
 */

export default function Sockets(config) {

  const { io } = config.environment;

  // Set socket.io listeners.
  io.on('connection', (socket) => {
    console.log(chalk.cyan.bold('>> Client Connected <<'));

    socket.on('disconnect', () => {
      console.log(chalk.magenta.bold('>> Client Disconnected <<'));
    });
  });
}
