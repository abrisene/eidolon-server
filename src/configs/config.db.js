/*
 # config.js
 # Database Configuration File
 */

/**
 # Module Dependencies
 */

import chalk from 'chalk';
import dotenv from 'dotenv';

import redis from 'redis';
import mongoose from 'mongoose';

dotenv.config();

mongoose.Promise = global.Promise;

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
 ### REDIS
 */

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
    client.on('error', (err) => {
      console.log(chalk.red(`>> Redis Error: ${err}`));
    });
  }

  return client;
}

/**
 ### MONGODB
 */

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
      .catch(err => console.log(chalk.red(`>> MongDB Error: ${err}`)));
  }

  return client;
}

/**
 # Critical Variables
 */

const config = {
  redis: getRedis(),
  mongodb: getMongoDB(),
};

/**
 # Module Exports
 */

module.exports = {
  ...config,
  apiPublicKeys,
};
