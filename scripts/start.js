/*
 # index.js
 # App Index
 */

/**
 # Module Dependencies
 */

const eidolon = require('../lib');
// const { config, constants, models, mail } = eidolon;

/**
 # Main
 */

const main = async () => {
  try {
    await eidolon.init();
  } catch (err) {
    console.error(err);
  }
};

main();
