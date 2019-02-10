/*
 # constants.storefront.js
 # Storefront Constants
 */

/*
 # Critical Variables
 */

const constants = {
  token: {
    redeemPurchase: 'REDEEM_PURCHASE',
  },
  productStatus: {
    active: 'active',
    disabled: 'inactive',
    debug: 'debug',
    staging: 'staging',
  },
};

/*
 # Module Exports
 */

module.exports = {
  ...constants,
};
