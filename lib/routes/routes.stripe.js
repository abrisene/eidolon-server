'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*
                                                                                                                                                                                                                                                                   # routes.stripe.js
                                                                                                                                                                                                                                                                   # Stripe Payments Route Index
                                                                                                                                                                                                                                                                   */

/*
 # Module Dependencies
 */

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

module.exports = function StripeRoutes(config) {
  console.log(Object.keys(config));
  var _config$environment = config.environment,
      app = _config$environment.app,
      env = _config$environment.env,
      appName = _config$environment.appName;
  var stripe = config.modules.stripe;
  var client = stripe.client,
      publicKey = stripe.publicKey;


  app.post('/api/charge/:amount', function (req, res) {
    var body = req.body,
        params = req.params;
    var stripeToken = body.stripeToken,
        stripeEmail = body.stripeEmail,
        offerId = body.offerId;
    var amount = params.amount;


    client.customers.create({
      email: stripeEmail,
      source: stripeToken
    }).then(function (customer) {
      return client.charges.create({
        amount: amount,
        description: 'Sample Charge',
        currency: 'usd',
        customer: customer.id
      });
    }).then(function (charge) {
      var message = '$' + (charge.amount / 100).toFixed(2) + ' Charge Successful';
      res.render('charge-test', _extends({}, amount, { publicKey: publicKey, message: message }));
    }).catch(function (err) {
      return console.error(err);
    });
  });

  app.get('/test/charge/:amount', function (req, res) {
    var params = req.params;
    var amount = params.amount;


    res.render('charge-test', { amount: amount, publicKey: publicKey });
  });
};