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

const getConfig = async () => ({
  useHttps: process.env.HTTPS,
  jwt: getJWTConfig(),
  google: jsonTryParse(process.env.GOOGLE_AUTH),
  facebook: jsonTryParse(process.env.FACEBOOK_AUTH),
});

/**
 # Module Exports
 */

module.exports = getConfig;
