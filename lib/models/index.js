/*
 # models/index.js
 # Model Index
 */

/*
 # Module Dependencies
 */

const User = require('./model.user');
const Identity = require('./model.identity');
const Token = require('./model.token');

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
};
