/*
 # index.js
 # Server Index
 */

/**
 # Module Dependencies
 */

import chalk from 'chalk';
import ip from 'ip';

import socketIO from 'socket.io';

import config from './configs';
import routes from './routes';
import sockets from './sockets';

/*
 # Critical Variables
 */

const { appName, port, app, env } = config.environment;

/*
 # Server
 */

const server = app.listen(port, () => {

  // Server Info
  const address = `http://${ip.address()}:${port}`;
  const io = socketIO(server);

  // Inject Server Info into Environment Config
  const serverConfig = {
    ...config,
    environment: { ...config.environment, server, io, address },
  };

  // Routes & Sockets
  routes(serverConfig);
  sockets(serverConfig);

  // Render Status Logs
  console.log(chalk.bold.underline.green(`\n${appName} Listening on ${port}:\n`));

  console.log(chalk.bold.underline.green(`  Addresses:\n`));
  if (env === 'development') console.log(chalk.cyan.bold(`  • http://localhost:${port}`));
  console.log(chalk.cyan.bold(`  • ${address}`));

  console.log(chalk.bold.underline.green(`\n  Configs:\n`));
  Object.keys(config).forEach((configKey) => {
    console.log(chalk`  {cyan ${configKey}}`);
    Object.keys(config[configKey]).forEach((k) => {
      const color = config[configKey][k] !== undefined ? 'cyan.bold' : 'dim';
      if (k !== 'apiPublicKeys') console.log(chalk`    • {${color} ${k}}`);
    });
    console.log('\n');
  });
  console.log('\n');
});
