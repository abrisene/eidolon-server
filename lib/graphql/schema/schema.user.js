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

  extend type Mutation {
    authenticateEmail(input: AuthenticateEmailInput): User!
    validateEmailWithToken(input: TokenInput): Boolean!
    requestPasswordReset(input: EmailInput): Boolean!
    resetPasswordWithToken(input: ResetPasswordWithTokenInput): Boolean!
    logout: Boolean!
  }

  input EmailInput {
    email: String!
  }

  input TokenInput {
    token: String!
  }

  input AuthenticateEmailInput {
    email: String!
    password: String!
    register: Boolean
  }

  input ResetPasswordWithTokenInput {
    token: String!
    password: String!
  }

  type User {
    id: ID
    roles: [String]
    emails: [String]
    identities: [Identity]
    tsLogin: [Float]
    tsCreated: Float!
    tsUpdated: Float!
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
