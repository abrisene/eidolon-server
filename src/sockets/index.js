/*
 # index.js
 # Void Socket Index
 */

/*
 # Module Dependencies
 */

import chalk from 'chalk';
import socketIO from 'socket.io';

/*
 # Critical Variables
 */

/*
 # Module Exports
 */

export default function Sockets(config) {

  const { server } = config;
  const io = socketIO(server);

  // Set socket.io listeners.
  io.on('connection', (socket) => {
    console.log(chalk.cyan.bold('>> Client Connected <<'));

    socket.on('disconnect', () => {
      console.log(chalk.magenta.bold('>> Client Disconnected <<'));
    });
  });

  return io;
}
