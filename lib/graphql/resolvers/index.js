/*
 # graphql/resolvers/index.js
 # GraphQL Resolver Index
 */

/*
 # Module Dependencies
 */

const configResolvers = require('./resolvers.config');
const userResolvers = require('./resolvers.user');
const paymentResolvers = require('./resolvers.payment');
const messageResolvers = require('./resolvers.message');

/*
 # Module Exports
 */

module.exports = [
  configResolvers,
  userResolvers,
  paymentResolvers,
  messageResolvers,
];
