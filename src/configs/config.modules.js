/*
 # config.modules.js
 # Module Configuration File
 */

/**
 # Module Dependencies
 */

import chalk from 'chalk';
import dotenv from 'dotenv';

import Twilio from 'twilio';
import Stripe from 'stripe';

dotenv.config();

/*
 # Critical Variables
 */

const apiPublicKeys = {};

/**
 # Utility Methods
 */

const jsonFromEnv = env => env ? JSON.parse(env) : undefined;

/**
 # Configuration Methods
 */

/**
 ### TWILIO
 */

const getTwilio = () => {
  const t = jsonFromEnv(process.env.TWILIO);
  const client = (t && t.account && t.key) ? new Twilio(t.account, t.key) : undefined;
  return { ...t, client };
}

/**
 ### STRIPE
 */

const getStripe = () => {
  const s = jsonFromEnv(process.env.STRIPE);
  const client = (s && s.secretKey && s.publicKey) ? new Stripe(s.secretKey) : undefined;
  apiPublicKeys.stripe = s ? s.publicKey || undefined : undefined;
  return { ...s, client };
}

/**
 # Critical Variables
 */

const config = {
  twilio: getTwilio(),
  stripe: getStripe(),
  apiPublicKeys,
};

/**
 # Module Exports
 */

module.exports = {
  ...config,
  apiPublicKeys,
};
