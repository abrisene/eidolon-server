/*
 # config.js
 # Configuration File
 */

/**
 # Module Dependencies
 */

import chalk from 'chalk';
import dotenv from 'dotenv';
import express from 'express';

import redis from 'redis';

import Twilio from 'twilio';
import Stripe from 'stripe';

dotenv.config();

/**
 # Utility Methods
 */

const jsonFromEnv = env => env ? JSON.parse(env) : undefined;

const getRedis = () => {
  const { REDIS, REDIS_URL } = process.env;
  const redisConfig = jsonFromEnv(REDIS);
  const url = redisConfig ? redisConfig.url : REDIS_URL;
  const password = redisConfig ? redisConfig.password : undefined;

  const client = url ? redis.createClient(url, { password }) : redis.createClient();

  client.on('ready', () => {
    console.log(chalk.green.bold(`>> REDIS Connected <<`));
  });

  return client;
}

const getTwilio = () => {
  const t = jsonFromEnv(process.env.TWILIO);
  const client = (t && t.account && t.key) ? new Twilio(t.account, t.key) : undefined;
  return { ...t, client };
}

const getStripe = () => {
  const s = jsonFromEnv(process.env.STRIPE);
  const client = (s && s.secretKey && s.publicKey) ? new Stripe(s.secretKey) : undefined;
  return { ...s, client };
}

/**
 # Critical Variables
 */

const config = {
  env: process.env.NODE_ENV || 'production',
  port: process.env.PORT || 8000,
  appName: process.env.APP_NAME || 'Eidolon',
  app: express(),
  redis: getRedis(),
  twilio: getTwilio(process.env.TWILIO),
  stripe: getStripe(process.env.STRIPE),
};

/**
 # Configs
 */


/**
 # Module Exports
 */

module.exports = config;
