/*
 # routes.graphql.js
 # GraphQL Routes
 */

/*
 # Module Dependencies
 */

const { ApolloServer, gql } = require('apollo-server-express');

const { schema, resolvers } = require('../graphql');
const models = require('../models');

const { asyncRoute, injectConfig } = require('./middleware.common');
const { authenticate } = require('./middleware.auth');

const config = require('../configs');

/*
 # Mock Schema
*/

/*
 # Module Exports
 */

const routes = async () => {
  const environment = config.get('environment');
  const { app } = environment;

  const gqlServer = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: { models },
  });

  // >>>>>>>>>>>>>>>>  MIDDLEWARE  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  gqlServer.applyMiddleware({ app, path: '/graphql' });
};

module.exports = routes;
