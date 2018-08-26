/*
 # index.js
 # App Index
 */

/**
 # Module Dependencies
 */

const config = require('./configs');
const server = require('./server');

const { Identity } = require('./models');

/**
 # Main
 */

const main = async () => {
  try {
    await config.init();
    await server();

    // const identities = await Identity.findIdentitiesByEmail('presagus@gmail.com');
    // console.log(identities);

  } catch(err) {
    console.error(err);
  }
};

main();
