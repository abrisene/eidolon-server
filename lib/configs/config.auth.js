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

const getJWTConfig = () => {
  return {
    secretOrKey: process.env.JWT_SECRET || 'test_secret',
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
    expiration: process.env.JWT_EXPIRATION || '1d',
  };
};

const getConfig = async () => {
  return {
    useHttps: process.env.HTTPS,
    jwt: getJWTConfig(),
    google: jsonTryParse(process.env.GOOGLE_AUTH),
    facebook: jsonTryParse(process.env.FACEBOOK_AUTH),
  };
};

/**
 # Module Exports
 */

module.exports = getConfig;
