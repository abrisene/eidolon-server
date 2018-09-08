/*
 # models/index.js
 # Model Index
 */

/*
 # Module Dependencies
 */

const User = require('./user/model.user');
const Identity = require('./user/model.identity');

const Token = require('./authentication/model.token');

const Product = require('./storefront/model.product');
const SKU = require('./storefront/model.sku');

// const Plan = require('./storefront/model.plan');

/*
 # Critical Variables
 */


/*
 # Module Exports
 */

module.exports = {
  User,
  Identity,
  Token,

  Product,
  SKU,
};
