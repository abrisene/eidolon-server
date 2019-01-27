/*
 # schema.user.js
 # User GraphQL Schema
 */

/*
 # Module Dependencies
 */

const { gql } = require('apollo-server-express');

/*
 # Schema
 */

const schema = gql`
  extend type Query {
    currentUser: User
    user(id: ID!): User
    users: [User!]
  }

  type User {
    id: ID
    roles: [String]
    emails: [String]
    identities: [Identity]
    tsLogin: [Float]
    tsCreated: Float
    tsUpdated: Float
  }

  type Identity {
    id: ID!
    ownerId: ID!
    owner: User!
    type: String!
    key: String!
    source: String!
    email: String
    displayName: String
    gender: String
    tsValidated: Float
    tsAccessed: Float
    tsCreated: Float!
    tsUpdated: Float!
  }
`;

/*
 # Module Exports
 */

module.exports = schema;
