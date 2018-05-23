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

const server = app.listen(port, () => {
  const address = `http://${ip.address()}:${port}`;
  const serverConfig = { ...config, server, address };

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
