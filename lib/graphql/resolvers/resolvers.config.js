/*
 # resolvers.config.js
 # Config GraphQL Resolvers
 */

/*
 # Module Dependencies
 */

/*
 # Utility Methods
 */

/*
 # Resolvers
 */

const query = {
  appConfig: async (p, a, { config }) => {
    const environment = config.get('environment');
    const auth = config.get('authentication');
    const storefront = config.get('storefront');
    const { appName, env, serverUrl } = environment;
    const { google, facebook } = auth;
    const { stripe } = storefront;

    return {
      name: appName,
      env,
      uris: {
        host: serverUrl,
      },
      keys: {
        google: google.clientID,
        facebook: facebook.clientID,
        stripe: stripe.publicKey,
      },
    };
  },
};

const appConfig = {};

const publicKeys = {};

const mutation = {};

/*
 # Module Exports
 */

module.exports = {
  Query: query,
  Mutation: mutation,
  AppConfig: appConfig,
  PublicKeys: publicKeys,
};
