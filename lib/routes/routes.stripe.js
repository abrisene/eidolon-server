'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = StripeRoutes;

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

function StripeRoutes(config) {
  var app = config.app,
      address = config.address,
      stripe = config.stripe;
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
      res.render('chargeTest', { amount: amount, publicKey: publicKey, message: message });
    }).catch(function (err) {
      return console.error(err);
    });
  });

  app.get('/test/charge/:amount', function (req, res) {
    var params = req.params;
    var amount = params.amount;


    res.render('chargeTest', { address: address, amount: amount, publicKey: publicKey });
  });
} /*
   # routes.stripe.js
   # Stripe Payments Route Index
   */

/*
 # Module Dependencies
 */