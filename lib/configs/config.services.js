/*
 # config.services.js
 # Services Config
 */

/**
 # Module Dependencies
 */

// const { jsonTryParse } = require('../common');

/**
 # Configuration Methods
 */

const getConfig = async () => ({
  timerUrl: process.env.TIMER_URL,
  timerCallbackUrl: process.env.TIMER_CALLBACK_URL || `${process.env.SERVER_URL}/api/timer/return`,
});

/**
 # Module Exports
 */

module.exports = getConfig;
