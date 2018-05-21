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
import mongoose from 'mongoose';

import Twilio from 'twilio';
import Stripe from 'stripe';

dotenv.config();

mongoose.Promise = global.Promise;

/**
 # Utility Methods
 */

const jsonFromEnv = env => env ? JSON.parse(env) : undefined;

const getRedis = () => {
  const { REDIS, REDIS_URL, REDISCLOUD_URL, NODE_ENV } = process.env;
  let client;

  if (REDIS) {
    const redisConfig = jsonFromEnv(REDIS);
    const url = redisConfig.url;
    const password = redisConfig.password;
    client = redis.createClient(url, { password });
  } else if (REDISCLOUD_URL) {
    client = redis.createClient(REDISCLOUD_URL,  { no_ready_check: true });
  } else if (REDIS_URL) {
    client = redis.createClient(REDIS_URL);
  } else if (NODE_ENV === 'development') {
    client = redis.createClient();
  }

  if (client) {
    client.on('ready', () => {
      console.log(chalk.green.bold(`>> Redis Connected <<`));
    });
  }

  return client;
}

const getMongoDB = () => {
  const { MONGODB, MONGODB_URL, MONGODB_URI } = process.env;
  let client;
  let url;

  if (MONGODB) {
    const mongoConfig = jsonFromEnv(MONGODB);
    url = mongoConfig.url;

  } else if (MONGODB_URL || MONGODB_URI) {
    url = MONGODB_URL || MONGODB_URI;
  }

  if (url) {
    const password = url.split(':')[2].split('@')[0];
    const passwordEncoded = encodeURIComponent(password);
    const encodedURL = url.replace(password, passwordEncoded);

    client = mongoose.connection;
    mongoose.connect(encodedURL)
      .then((db) => {
        console.log(chalk.green.bold(`>> MongoDB Connected <<`));
      })
      .catch(err => console.error(err));
  }

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
  mongodb: getMongoDB(),
  twilio: getTwilio(),
  stripe: getStripe(),
};

/**
 # Configs
 */


/**
 # Module Exports
 */

module.exports = config;
