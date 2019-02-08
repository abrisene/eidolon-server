/*
 # constants.storefront.js
 # Storefront Constants
 */

/*
 # Critical Variables
 */

const constants = {
  token: {
    redeem_purchase: 'REDEEM_PURCHASE',
    // validateIdentity: 'VALIDATE_IDENTITY',
    // resetPassword: 'RESET_PASSWORD',
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
