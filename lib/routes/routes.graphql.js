/*
 # routes.graphql.js
 # GraphQL Routes
 */

/*
 # Module Dependencies
 */

const { ApolloServer } = require('apollo-server-express');
const { RedisCache } = require('apollo-server-cache-redis');

const { schema, resolvers } = require('../graphql');
const models = require('../models');

// const { asyncRoute, injectConfig } = require('./middleware.common');
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
  const database = config.get('database');
  const { app } = environment;
  const { redis } = database;

  // Create the Redis Cache for GraphQL if possible
  /* const cache = redis === undefined ? undefined : new RedisCache({
    host: redis.url,
    ...redis.config,
  }); */

  // Create the GraphQL Server
  const gqlServer = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: async ({ req, res }) => ({
      req,
      res,
      user: req.user,
      models,
      config,
    }),
    // cache,
    playground: {
      settings: {
        'request.credentials': 'include',
      },
    },
  });

  // >>>>>>>>>>>>>>>>  MIDDLEWARE  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  app.use('/graphql', authenticate.optional);
  gqlServer.applyMiddleware({ app, path: '/graphql' });
};

module.exports = routes;
