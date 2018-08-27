/*
 # config.storefront.js
 # Storefront Config
 */

/**
 # Module Dependencies
 */

const Twilio = require('twilio');
const { jsonTryParse } = require('../common');



/**
 # Configuration Methods
 */

const getTwilio = () => {
  const t = jsonTryParse(process.env.TWILIO);
  const client = (t && t.account && t.key) ? new Twilio(t.account, t.key) : undefined;
  return { ...t, client };
}

const getConfig = async () => {
  return {
    twilio: getTwilio(),
    mailgun: undefined,
  };
};

/**
 # Module Exports
 */

module.exports = getConfig;
