/*
 # config.messaging.js
 # Messaging Config
 */

/**
 # Module Dependencies
 */

const PubNub = require('pubnub');
const Ably = require('ably');
const mailgun = require('mailgun.js');
const Twilio = require('twilio');
const { jsonTryParse } = require('../common');


/**
 # Configuration Methods
 */

const getPubNub = () => {
  const p = jsonTryParse(process.env.PUBNUB);
  const client = new PubNub(p);
  return { ...p, client };
};

const getAbly = () => {
  const a = jsonTryParse(process.env.ABLY);
  const client = a.serverKey ? new Ably.Realtime(a.serverKey) : undefined;
  return { ...a, client };
};

const getMailgun = () => {
  const m = jsonTryParse(process.env.MAILGUN);
  const client = (m && m.key) ? mailgun.client({ ...m, username: 'api' }) : undefined;
  return { ...m, client };
};

const getTwilio = () => {
  const t = jsonTryParse(process.env.TWILIO);
  const client = (t && t.account && t.key) ? new Twilio(t.account, t.key) : undefined;
  return { ...t, client };
};

const getConfig = async () => ({
  pubnub: getPubNub(),
  ably: getAbly(),
  mailgun: getMailgun(),
  twilio: getTwilio(),
});

/**
 # Module Exports
 */

module.exports = getConfig;
