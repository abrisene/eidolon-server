/*
 # config.messaging.js
 # Messaging Config
 */

/**
 # Module Dependencies
 */

const Twilio = require('twilio');
const mailgun = require('mailgun.js');
const { jsonTryParse } = require('../common');



/**
 # Configuration Methods
 */

const getMailgun = () => {
  const m = jsonTryParse(process.env.MAILGUN);
  const client = (m && m.key) ? mailgun.client({ ...m, username: 'api' }) : undefined;
  return {...m, client };
};

const getTwilio = () => {
  const t = jsonTryParse(process.env.TWILIO);
  const client = (t && t.account && t.key) ? new Twilio(t.account, t.key) : undefined;
  return { ...t, client };
};

const getConfig = async () => {
  return {
    mailgun: getMailgun(),
    twilio: getTwilio(),
  };
};

/**
 # Module Exports
 */

module.exports = getConfig;
