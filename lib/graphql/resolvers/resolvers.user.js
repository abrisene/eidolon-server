/*
 # resolvers.user.js
 # User GraphQL Resolvers
 */

/*
 # Module Dependencies
 */

const { gql } = require('apollo-server-express');
// const { User } = require('../../models');
// const models = require('../../models');

/*
 # Resolvers
 */

/* const gqlResolvers = {
  Query: {
    me: (parent, args, { me }) => me,
    user: (parent, { id }) => users[id],
    users: () => users,
    message: (parent, { id }) => messages[id],
    messages: () => messages,
  },
  Mutation: {
    createMessage: (parent, { content }, { me }) => {
      const m = { id: messages.length, user: me.id, content };
      messages.push(m);
      return m;
    },
    deleteMessage: (parent, { id }) => {
      const { [id]: message, ...rest } = messages;
      if (!message) return false;
      messages = rest;
      return true;
    },
  },
  User: {
    // id: parent => parent.id,
    // username: parent => parent.username,
    // password: parent => parent.password,
    // names: parent => parent.names,
    name: parent => `${parent.names.first} ${parent.names.last}`,
    messages: parent => messages.filter(m => m.user === parent.id),
  },
  Message: {
    user: (parent, args, { me }) => users[parent.user],
  },
}; */

const query = {
  user: async (parent, { id }, { models }) => models.User.findById(id),
  users: async (p, a, { models }) => models.User.find(),
};

const user = {
  tsLogin: parent => parent.tsLogin.map(t => t.getTime()),
};

const mutation = {
};

/*
 # Module Exports
 */

module.exports = {
  Query: query,
  Mutation: mutation,
  User: user,
};
