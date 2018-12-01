/**
 # Module Imports
 */

const { jsonTryParse } = require('../common');

/**
 # Configuration Methods
 */

const getJWTConfig = () => ({
  secretOrKey: process.env.JWT_SECRET || 'test_secret',
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE,
  expiration: process.env.JWT_EXPIRATION || '1d',
});

const getAuthConfig = (c, type) => {
  const config = jsonTryParse(c);
  if (config !== undefined) {
    if (!config.callbackURL) config.callbackURL = `${process.env.CLIENT_URL}/auth/${type}/redirect`;
    config.callbackPath = new URL(config.callbackURL).pathname;
  }
  return config;
};

const getConfig = async () => ({
  useHttps: process.env.HTTPS,
  jwt: getJWTConfig(),
  google: getAuthConfig(process.env.GOOGLE_AUTH, 'google'),
  facebook: getAuthConfig(process.env.FACEBOOK_AUTH, 'facebook'),
});

/**
 # Module Exports
 */

module.exports = getConfig;
