/*
 # config.storefront.js
 # Storefront Config
 */

/**
 # Module Dependencies
 */

const Stripe = require('stripe');
const { jsonTryParse } = require('../common');

/**
 # Configuration Methods
 */

const getStripe = () => {
  const s = jsonTryParse(process.env.STRIPE);
  const client = (s && s.secretKey && s.publicKey) ? new Stripe(s.secretKey) : undefined;
  return { ...s, client };
}

const getConfig = async () => {
  return {
    stripe: getStripe(),
    braintree: undefined,
  };
};

/**
 # Module Exports
 */

module.exports = getConfig;
