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


/* const gqlSchema = gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]
    message(id: ID!): Message
    messages: [Message!]
  }

  type Mutation {
    createMessage(content: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }

  type User {
    id: ID!
    username: String!
    password: String!
    names: Fullname
    name: String!
    messages: [Message!]
  }

  type Fullname {
    first: String!
    last: String!
  }

  type Message {
    id: ID!
    user: User!
    content: String!
  }
`; */

const schema = gql`
  extend type Query {
    user(id: ID!): User
    users: [User!]
  }

  type User {
    id: ID!
    roles: [String]
    emails: [String]
    tsLogin: [Float]
  }
`;

/*
 # Module Exports
 */

module.exports = schema;
