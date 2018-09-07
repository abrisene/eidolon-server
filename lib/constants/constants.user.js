/*
 # constants.auth.js
 # Authentication Constants
 */

/*
 # Critical Variables
 */

const constants = {
  password: {
    hashCost: 10,
  },
  token: {
    validateIdentity: 'VALIDATE_IDENTITY',
    resetPassword: 'RESET_PASSWORD',
  }
};

/*
 # Module Exports
 */

module.exports = {
  ...constants,
};
