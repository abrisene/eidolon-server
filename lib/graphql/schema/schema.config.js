/*
 # schema.config.js
 # App Config GraphQL Schema
 */

/*
 # Module Dependencies
 */

const { gql } = require('apollo-server-express');

/*
 # Schema
 */

const schema = gql`
  extend type Query {
    appConfig: AppConfig
  }

  type AppConfig {
    name: String
    env: String
    uris: AppURIs
    keys: PublicKeys
  }

  type AppURIs {
    host: String
    authLogin: String
    authRegister: String
    authGoogle: String
    authFacebook: String
  }

  type PublicKeys {
    stripe: String
  }
`;

/*
 # Module Exports
 */

module.exports = schema;
