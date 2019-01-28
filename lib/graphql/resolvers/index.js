/*
 # graphql/resolvers/index.js
 # GraphQL Resolver Index
 */

/*
 # Module Dependencies
 */

const configResolvers = require('./resolvers.config');
const userResolvers = require('./resolvers.user');

/*
 # Module Exports
 */

module.exports = [
  configResolvers,
  userResolvers,
];
