/*
 # graphql/index.js
 # GraphQL Index
 */

/*
 # Module Dependencies
 */

const schema = require('./schema');
const resolvers = require('./resolvers');
/*
 # Resolvers
 */

module.exports = {
  schema,
  resolvers,
};
