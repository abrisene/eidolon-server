/*
 # config.env.js
 # Environment Configuration File
 */

/**
 # Module Dependencies
 */

import chalk from 'chalk';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

/*
 # Critical Variables
 */

const apiPublicKeys = {};

/**
 # Utility Methods
 */

const jsonFromEnv = env => env ? JSON.parse(env) : undefined;

/**
 # Critical Variables
 */

const config = {
  env: process.env.NODE_ENV || 'production',
  port: process.env.PORT || 8000,
  appName: process.env.APP_NAME || 'Eidolon',
  clientURL: process.env.CLIENT_URL,
  app: express(),
};

/**
 # Module Exports
 */

module.exports = {
  ...config,
  apiPublicKeys,
};
