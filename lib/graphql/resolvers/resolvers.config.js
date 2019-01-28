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
    const storefront = config.get('storefront');
    const { appName, env } = environment;
    const { stripe } = storefront;

    return {
      name: appName,
      env,
      keys: {
        stripe: stripe.publicKey,
      },
    };
  },
};

const appConfig = {};

const publicKeys = {};

const mutation = {
};

/*
 # Module Exports
 */

module.exports = {
  Query: query,
  Mutation: mutation,
  AppConfig: appConfig,
  PublicKeys: publicKeys,
};
