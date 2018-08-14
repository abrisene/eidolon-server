/*
 # config.auth.js
 # Auth Configuration File
 */

/**
 # Module Dependencies
 */

import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

/*
 # Critical Variables
 */

const apiPublicKeys = {};

/**
 # Utility Methods
 */

const jsonFromEnv = env => env ? JSON.parse(env) : undefined;


const getJWTConfig = () => {
  return {
    secret: process.env.JWT_SECRET || 'testsecret',
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  };
}


/**
 # Critical Variables
 */

const config = {
  jwt: getJWTConfig(),
  google: jsonFromEnv(process.env.GOOGLE_AUTH),
  facebook: jsonFromEnv(process.env.FACEBOOK_AUTH),
};

/**
 # Module Exports
 */

module.exports = {
  ...config,
  apiPublicKeys,
};
