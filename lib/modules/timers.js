/*
 # timer.js
 # Timer Module
 */

/*
 # Module Dependencies
 */

const axios = require('axios');
const config = require('../configs');

/*
 # Critical Variables
 */

/**
 * Submits a new timer to the timer service.
 *    Usage:
 *    const timer = timers.create({
 *      duration: 10,
 *      payload: { message: 'Hello' },
 *    });
 */
const create = async ({
  startTS = Date.now(),
  endTS,
  duration,
  durationType,
  payload,
  callbackUrl,
}) => {
  try {
    const services = config.get('services');
    const { timerUrl, timerCallbackUrl } = services;

    if (!endTS && !duration) throw new Error('Cannot define timer with indefinite end time.');
    console.log(timerUrl);
    const result = await axios({
      method: 'post',
      url: `${timerUrl}/timer`,
      data: {
        startTS,
        endTS,
        duration,
        durationType,
        payload,
        callback: callbackUrl || timerCallbackUrl,
      },
    });

    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};

/*
 # Module Exports
 */

module.exports = {
  create,
};
