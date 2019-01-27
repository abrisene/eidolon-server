/*
 # resolvers.user.js
 # User GraphQL Resolvers
 */

/*
 # Module Dependencies
 */

const { gql } = require('apollo-server-express');

/*
 # Resolvers
 */

const validateRole = (user, role, result) => {
  return user && user.roles.includes(role) ? result : undefined;
};

const query = {
  currentUser: async (parent, args, { user }) => user || undefined,
  user: async (parent, { id }, { models, user }) => validateRole(user, 'admin', models.User.findById(id)),
  users: async (parent, args, { models, user }) => validateRole(user, 'admin', models.User.find()),
};

const user = {
  identities: async (parent, args, { models }) => models.Identity.find({ ownerId: parent.id }),
  tsLogin: parent => parent.tsLogin.map(t => t.getTime()),
  tsCreated: parent => parent.tsCreated.getTime(),
  tsUpdated: parent => parent.tsUpdated.getTime(),
};

const identity = {
  owner: async (parent, { ownerId }, { models }) => models.User.findById(ownerId),
  tsValidated: parent => parent.tsValidated.getTime(),
  tsAccessed: parent => parent.tsAccessed.getTime(),
  tsCreated: parent => parent.tsCreated.getTime(),
  tsUpdated: parent => parent.tsUpdated.getTime(),
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
  Identity: identity,
};
