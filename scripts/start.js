/*
 # index.js
 # App Index
 */

/**
 # Module Dependencies
 */

const eidolon = require('../lib');

/**
 # Main
 */

const main = async () => {
  try {
    await eidolon.init();
  } catch(err) {
    console.error(err);
  }
};

main();
