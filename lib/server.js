/*
 # server.js
 # Server Index
 */

/**
 # Module Dependencies
 */

const chalk = require('chalk');
const ip = require('ip');

const socketIO = require('socket.io');

const routes = require('./routes');
// const sockets = require('./sockets');

const config = require('./configs');


// console.log(config);

/*
 # Server
 */

const init = async () => {
  const environment = config.get('environment');
  const { app, port, appName, env } = environment;
  const server = app.listen(port, async () => {

    // Server Info
    const address = `http://${ip.address()}:${port}`;

    // Socket IO
    // const io = socketIO(server);

    // Routes & Sockets
    routes();
    // sockets();

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

  return server;
};

/*
 # Module Exports
 */

module.exports = init;
