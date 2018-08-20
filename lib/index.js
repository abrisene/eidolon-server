/*
 # index.js
 # App Index
 */

/**
 # Module Dependencies
 */

const config = require('./configs');
const server = require('./server');

const main = async () => {
  await config.init();
  await server();
};

main();
