/*
 # config.database.js
 # Database Config
 */

/**
 # Module Dependencies
 */

const chalk = require('chalk');

const redis = require('redis');
const mongoose = require('mongoose');

const { exists, jsonTryParse } = require('../common');

mongoose.Promise = global.Promise;

/**
 # Configuration Methods
 */

const getRedis = async () => {
  const {
    REDIS, REDIS_URL, REDISCLOUD_URL, NODE_ENV,
  } = process.env;
  let client;
  let url;
  let config;

  if (exists([REDIS, REDIS_URL, REDISCLOUD_URL])) {
    const rConfig = jsonTryParse(REDIS);
    let method;

    try {
      if (exists(rConfig) && exists(rConfig.url)) {
        method = 'Config URL';
        url = rConfig.url;
        config = { password: rConfig.password };
      } else if (exists(REDISCLOUD_URL)) {
        method = 'RedisCloud URL';
        url = REDISCLOUD_URL;
        config = { no_ready_check: true };
      } else if (exists(REDIS_URL)) {
        method = 'URL';
        url = REDIS_URL;
      } else if (NODE_ENV === 'development') {
        method = 'Local';
      }
      client = redis.createClient(url, config);
    } catch (err) {
      console.error(err);
    }

    if (client) {
      client.on('ready', () => {
        console.log(chalk.green.bold(`>> Redis Connected to ${method} <<`));
      });
      client.on('error', (err) => {
        console.log(chalk.red(`>> Redis Error: ${err}`));
      });
    }
  }

  return { client, url, config };
};

const getMongoDB = async () => {
  const { MONGODB, MONGODB_URL, MONGODB_URI } = process.env;
  let client;

  if (exists([MONGODB, MONGODB_URL, MONGODB_URI])) {
    const mConfig = jsonTryParse(MONGODB);
    let { url } = mConfig || {};
    let method;

    try {
      if (exists(mConfig) && exists(mConfig.url)) {
        method = 'Config URL';
      } else if (exists(MONGODB_URL)) {
        url = MONGODB_URL;
        method = 'URL';
      } else if (exists(MONGODB_URI)) {
        url = MONGODB_URI;
        method = 'URI';
      }

      if (exists(url)) {
        const password = url.split(':')[2].split('@')[0];
        const passwordEncoded = encodeURIComponent(password);
        const encodedURL = url.replace(password, passwordEncoded);

        client = mongoose.connection;
        await mongoose.connect(encodedURL, { useNewUrlParser: true });

        console.log(chalk.green.bold(`>> MongoDB Connected to ${method} <<`));
      }
    } catch (err) {
      console.error(err);
    }
  }

  return { client };
};

const getConfig = async () => {
  const redisClient = await getRedis();
  const mongoClient = await getMongoDB();

  return {
    redis: redisClient,
    mongoDB: mongoClient,
  };
};

/**
 # Module Exports
 */

module.exports = getConfig;
