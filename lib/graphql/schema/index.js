/*
 # graphql/schea/index.js
 # GraphQL Schema Index
 */

/*
 # Module Dependencies
 */

const { gql } = require('apollo-server-express');
const configSchema = require('./schema.config');
const userSchema = require('./schema.user');
const paymentSchema = require('./schema.payment');
const messageSchema = require('./schema.message');

/*
 # Resolvers
 */

const linkSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

module.exports = [
  linkSchema,
  configSchema,
  userSchema,
  paymentSchema,
  messageSchema,
];
