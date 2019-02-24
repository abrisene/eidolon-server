/*
 # schema.message.js
 # Message GraphQL Schema
 */

/*
 # Module Dependencies
 */

const { gql } = require('apollo-server-express');

/*
 # Schema
 */

const schema = gql`
  extend type Subscription {
    messageAdded: ChatMessage
  }

  extend type Query {
    messages: [ChatMessage!]
    channelMessages(id: ID!): [ChatMessage!]
    userMessages(id: ID!): [ChatMessage!]
  }

  type ChatMessage {
    id: ID!
    from: ID!
    to: ID!
    name: String!
    body: String!
    tsCreated: Float!
  }

  extend type Mutation {
    sendMessage(input: MessageInput): ChatMessage
  }

  input MessageInput {
    to: ID!
    body: String!
  }
`;

/*
 # Module Exports
 */

module.exports = schema;
