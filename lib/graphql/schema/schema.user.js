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

  extend type Mutation {
    authenticateEmail(input: AuthenticateEmailInput): User!
    authenticateSocial(input: AuthenticateSocialInput): User!
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

  input SocialProfile {
    id: ID!
    email: String!
    displayName: String
    gender: String
    metadata: SocialMetadata
  }

  input SocialMetadata {
    name: String
    username: String
    photos: String
    profileUrl: String
  }

  input AuthenticateEmailInput {
    email: String!
    password: String!
    register: Boolean
  }

  input AuthenticateSocialInput {
    provider: String!
    accessToken: String!
    refreshToken: String
  }

  input ResetPasswordWithTokenInput {
    token: String!
    password: String!
  }
`;

/*
 # Module Exports
 */

module.exports = schema;
