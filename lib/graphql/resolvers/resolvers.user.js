/*
 # resolvers.user.js
 # User GraphQL Resolvers
 */

/*
 # Module Dependencies
 */

const passport = require('passport');

const config = require('../../configs');

// FOR SOCIAL AUTH:
// https://medium.freecodecamp.org/how-to-nail-social-authentication-in-graphql-27943aee5dce

/*
 # Utility Methods
 */

const authSocial = (provider, req, res) => new Promise((resolve, reject) => {
  const providers = Object.keys(config.get('authentication'));
  if (!providers.includes(provider)) reject(new Error(`Could not find provider: ${provider}`));
  passport.authenticate([`${provider}-token`], { session: false }, (err, user, info) => {
    if (err) reject(err);
    resolve({ user, info });
  })(req, res);
});

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
  authenticateEmail: async (_, { input }, {
    models,
    req,
    res,
  }) => {
    try {
      const { email, password, register } = input;
      const { useHttps } = config.get('authentication');
      const auth = await models.User.authenticateEmail(email, password, register);
      if (auth.err) throw new Error(auth.err);
      const token = auth.user.generateJWT();
      req.user = auth.user;
      res.cookie('jwt', token, { httpOnly: true, secure: useHttps });
      return req.user;
    } catch (err) {
      console.error(err);
      return err;
    }
  },
  authenticateSocial: async (_, { input }, {
    req,
    res,
  }) => {
    try {
      const { provider, accessToken, refreshToken } = input;
      const { useHttps } = config.get('authentication');
      req.body = { ...req.body, access_token: accessToken, refresh_token: refreshToken };
      const auth = await authSocial(provider, req, res);
      if (auth.err) throw new Error(auth.err);
      const token = auth.user.generateJWT();
      req.user = auth.user;
      res.cookie('jwt', token, { httpOnly: true, secure: useHttps });
      return req.user;
    } catch (err) {
      console.error(err);
      return err;
    }
  },
  requestPasswordReset: async (_, { input }, { models }) => {
    try {
      const { email } = input;
      const reset = await models.User.requestPasswordReset(email);
      if (reset.err) throw new Error(reset.err);
      return true;
    } catch (err) {
      console.error(err);
      return err;
    }
  },
  validateEmailWithToken: async (_, { input }, { models }) => {
    try {
      const { token } = input;
      const redeem = await models.Identity.validateWithToken(token);
      if (redeem.err) throw new Error(redeem.err);
      return true;
    } catch (err) {
      console.error(err);
      return err;
    }
  },
  resetPasswordWithToken: async (_, { input }, { models }) => {
    try {
      const { token, password } = input;
      const redeem = await models.User.setPasswordWithToken(token, password);
      if (redeem.err) throw new Error(redeem.err);
      return true;
    } catch (err) {
      console.error(err);
      return err;
    }
  },
  logout: async (_, __, { res }) => {
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
