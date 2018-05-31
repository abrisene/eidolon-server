/*
 # index.js
 # Index
 */

import chalk from 'chalk';
import ip from 'ip';

import socketIO from 'socket.io';

import config, { appName, port, app } from './config';
import routes from './routes';
import sockets from './sockets';

const server = app.listen(port, () => {
  const address = `http://${ip.address()}:${port}`;
  const io = socketIO(server);
  const serverConfig = { ...config, server, io, address };

  routes(serverConfig);
  sockets(serverConfig);

  console.log(chalk.bold.underline.green(`\n${appName} Listening on ${port}:\n`));

  console.log(chalk.bold.underline.green(`  Addresses:\n`));
  if (config.env === 'development') console.log(chalk.cyan.bold(`  • http://localhost:${port}`));
  console.log(chalk.cyan.bold(`  • ${address}`));

  console.log(chalk.bold.underline.green(`\n  Configs:\n`));
  Object.keys(config).forEach((k) => console.log(chalk.cyan.bold(`  • ${k}`)));
  console.log('\n');
});
