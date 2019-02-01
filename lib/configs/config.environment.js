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
 # Configuration Methods
 */

const getCORSConfig = () => {
  const clientUrl = process.env.CLIENT_URL;
  const timerUrl = process.env.TIMER_URL;
  const corsUrls = jsonTryParse(process.env.CORS_URLS) || [];
  const origin = corsUrls !== '*' ? [clientUrl, timerUrl, ...corsUrls] : ['*'];
  const config = { origin, credentials: true };
  // config.allowedHeaders = ['Content-Type', 'Authorization'];
  return config;
};

const getConfig = async () => ({
  env: process.env.NODE_ENV || 'production',
  port: process.env.PORT || 8080,
  appName: process.env.APP_NAME || 'Eidolon',
  serverUrl: process.env.SERVER_URL,
  clientUrl: process.env.CLIENT_URL, // Replace this with array of CORS URLs
  corsConfig: getCORSConfig(),
  logoUrl: process.env.LOGO_URL,
  app: express(),
});

/**
 # Module Exports
 */

module.exports = getConfig;
