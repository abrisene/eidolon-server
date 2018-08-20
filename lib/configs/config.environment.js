/*
 # config.environment.js
 # Environment Config
 */

/**
 # Module Dependencies
 */

const express = require('express');
const { jsonTryParse } = require('../common');

/**
 # Critical Variables
 */

const getConfig = async () => {
  return {
    env: process.env.NODE_ENV || 'production',
    port: process.env.PORT || 8080,
    appName: process.env.APP_NAME || 'Eidolon',
    clientURL: process.env.CLIENT_URL, // Replace this with array of CORS URLs
    app: express(),
  };
};

/**
 # Module Exports
 */

module.exports = getConfig;
