'use strict';

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  var app = config.environment.app;
  var twilio = config.modules.twilio;
  var client = twilio.client;


  app.post('/api/sms', function (req, res) {
    var body = req.body;

    var number = body.From;
    console.log('SMS from ' + number);
  });

  app.post('/api/sms/failed', function (req, res) {
    console.log('SMS Failed');
  });

  app.post('/api/call', function (req, res) {
    var body = req.body;

    var number = body.From;
    console.log('Recieved Call from ' + number);
  });

  app.post('/api/call/failed', function (req, res) {
    console.log('Call Failed');
  });

  app.post('/api/call/status', function (req, res) {
    console.log('Call Status Changed');
  });
}; /*
    # routes.twilio.js
    # Twilio Route Index
    */

/*
 # Module Dependencies
 */