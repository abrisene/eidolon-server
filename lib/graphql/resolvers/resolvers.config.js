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
    const { appName, env, serverUrl } = environment;
    const { stripe } = storefront;

    return {
      name: appName,
      env,
      uris: {
        host: serverUrl,
        authLogin: `${serverUrl}/auth/login`,
        authRegister: `${serverUrl}/auth/register`,
        authGoogle: `${serverUrl}/auth/google`,
        authFacebook: `${serverUrl}/auth/facebook`,
      },
      keys: {
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
