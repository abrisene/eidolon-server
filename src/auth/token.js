/*
 # configs/auth/token.js
 # Authorization Token Generator
 */

/*
 # Module Dependencies
 */

import jwt from 'jsonwebtoken';
import config from '../configs';

/*
 # Module Exports
 */

module.exports = function generateToken(id) {
  const secret = config.auth.jwt.secret;
  const options = {
    expiresIn: '1 hour',
    issuer: config.auth.jwt.issuer,
    audience: config.auth.jwt.audience,
    subject: id.toString(),
  };

  const token = jwt.sign({}, secret, options);

  return token;
}
