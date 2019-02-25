/*
 # config.storefront.js
 # Storefront Config
 */

/**
 # Module Dependencies
 */

const Airtable = require('airtable');
const { jsonTryParse } = require('../common');

/**
 # Configuration Methods
 */

const getAirtable = () => {
  const s = jsonTryParse(process.env.AIRTABLE);
  const client = (s && s.apiKey) ? new Airtable(s) : undefined;
  return client ? { ...s, client } : undefined;
};

const getConfig = async () => ({
  airtable: getAirtable(),
});

/**
 # Module Exports
 */

module.exports = getConfig;
