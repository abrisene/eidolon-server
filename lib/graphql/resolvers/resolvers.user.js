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

/*
const generateUserToken = (req, res, next) => {
  const { user } = req;
  const { useHttps } = config.get('authentication');

  if (!user) {
    res.status(400).send({ err: 'Could not login.' });
  } else {
    const token = user.generateJWT();
    res.cookie('jwt', token, { httpOnly: true, secure: useHttps });
    next();
  }
};

const clearUserToken = (req, res, next) => {
  const { useHttps } = config.get('authentication');
  res.cookie('jwt', '', { httpOnly: true, secure: useHttps });
  next();
};

// These should handle errors properly as exceptions instead of redirect.
const authenticateJwtRequired = (req, res, next) => passport.authenticate(['jwt'], { session: false }, (err, user) => {
  req.user = user;
  return user ? next() : res.status(400).redirect('/login');
})(req, res, next);

const authenticateJwtOptional = (req, res, next) => passport.authenticate(['jwt'], { session: false }, (err, user) => {
  if (err) return next(err);
  req.user = user;
  return next();
})(req, res, next);
*/

/* const generateUserToken = (req, res, next) => {
  const { user } = req;
  const { useHttps } = config.get('authentication');

  if (!user) {
    res.status(400).send({ err: 'Could not login.' });
  } else {
    const token = user.generateJWT();
    res.cookie('jwt', token, { httpOnly: true, secure: useHttps });
    next();
  }
}; */



const validateRole = (user, role, result) => {
  return user && user.roles.includes(role) ? result : undefined;
};

const query = {
  currentUser: async (parent, args, { user }) => user || undefined,
  user: async (parent, { id }, { models, user }) => validateRole(user, 'admin', models.User.findById(id)),
  users: async (parent, args, { models, user }) => validateRole(user, 'admin', models.User.find()),
};

const user = {
  id: parent => parent.id || parent._id,
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
  authenticateEmail: async (_, { input }, { config, models, req, res }) => {
    try {
      const { email, password, register } = input;
      const { useHttps } = config.get('authentication');
      const result = await models.User.authenticateEmail(email, password, register);
      if (result.err) throw new Error(result.err);
      const token = result.user.generateJWT();
      req.user = result.user;
      res.cookie('jwt', token, { httpOnly: true, secure: useHttps });
      return req.user;
    } catch (err) {
      console.error(err);
      return err;
    }
  },
  logout: async (_, __, { config, res }) => {
    const { useHttps } = config.get('authentication');
    res.cookie('jwt', '', { httpOnly: true, secure: useHttps });
    return true;
  },
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
