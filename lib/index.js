/*
 # index.js
 # App Index
 */

/**
 # Module Dependencies
 */

const config = require('./configs');
const server = require('./server');

const { Token } = require('./models');

/**
 # Main
 */

const main = async () => {
  try {
    await config.init();
    await server();

  } catch(err) {
    console.error(err);
  }
};

main();
