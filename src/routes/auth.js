/*
 # auth.js
 # Auth Configuration
 */

/**
 # Module Dependencies
 */

import jwt from 'express-jwt';

/**
 # Utility Methods
 */

const getTokenFromHeaders = (req) => {
  const { headers } = req;
  const { authorization } = headers;
  if (authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1];
  }
  return null;
};

/*
 # Critical Variables
 */

 const auth = {
  required: jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
  optional: jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
 };

/**
 # Module Exports
 */

module.exports = auth;
