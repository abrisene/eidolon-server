/*
 # routes.twilio.js
 # Twilio Route Index
 */

/*
 # Module Dependencies
 */

import chalk from 'chalk';

/*
 # Critical Variables
 */


/*
 # Utility Functions
 */


/*
 # Module Exports
 */

module.exports = function TwilioRoutes(config) {
  const { app } = config.environment;
  const { twilio } = config.modules;
  const { client } = twilio;

  app.post('/api/sms', (req, res) => {
    const { body } = req;
    const number = body.From;
    console.log(`SMS from ${number}`);
  });

  app.post('/api/sms/failed', (req, res) => {
    console.log('SMS Failed');
  });

  app.post('/api/call', (req, res) => {
    const { body } = req;
    const number = body.From;
    console.log(`Recieved Call from ${number}`);
  });

  app.post('/api/call/failed', (req, res) => {
    console.log('Call Failed');
  });

  app.post('/api/call/status', (req, res) => {
    console.log('Call Status Changed');
  });
}
