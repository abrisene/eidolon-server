/*
 # index.js
 # Index
 */

import chalk from 'chalk';
import dotenv from 'dotenv';
import ip from 'ip';

import config, { appName, port, app } from './config';
import routes from './routes';
import sockets from './sockets';

console.log(Object.keys(config));

const server = app.listen(port, () => {
  const address = `http://${ip.address()}:${port}`;
  const serverConfig = { ...config, server, address };


  routes(serverConfig);
  sockets(serverConfig);

  console.log(chalk.bold.underline.green(`\n${appName} Listening on ${port}:`));
  console.log(chalk.cyan.bold(`
    >> ${address}
    `));
});
