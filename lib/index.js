/*
 # index.js
 # App Index
 */

/**
 # Module Dependencies
 */

const config = require('./configs');
const server = require('./server');

const constants = require('./constants');
const models = require('./models');

const mail = require('./mail');

/**
 # Main
 */

const main = async (useServer = true) => {
  try {
    await config.init();
    if (useServer) await server();

    return {
      config,
      constants,
      models,
      mail,
    };
  } catch(err) {
    console.error(err);
  }
};

/**
 # Module Exports
 */

module.exports = main();
