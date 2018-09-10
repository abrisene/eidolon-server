/*
 # clear.collections.js
 # Script for Clearing Eidolon Collections
 */

/**
 # Module Dependencies
 */

const chalk = require('chalk');
const eidolon = require('../lib');

const { models } = eidolon;

/**
 # Main
 */

const main = async () => {
  try {
    await eidolon.init();

    if (process.env.NODE_ENV === 'development') {
      await models.User.remove({});
      await models.Identity.remove({});
      await models.Token.remove({});
      // await models.Product.remove({});
      // await models.SKU.remove({});

      console.log(chalk`{yellow User Collections Cleared}`);
    } else {
      throw new Error('Cannot clear collections in production.');
    }
  } catch (err) {
    console.error(err);
  }
};

main();
