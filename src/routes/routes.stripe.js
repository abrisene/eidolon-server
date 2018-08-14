/*
 # routes.stripe.js
 # Stripe Payments Route Index
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

module.exports = function StripeRoutes(config) {
  console.log(Object.keys(config));
  const { app, env, appName } = config.environment;
  const { stripe } = config.modules;
  const { client, publicKey } = stripe;

  app.post('/api/charge/:amount', (req, res) => {
    const { body, params } = req;
    const { stripeToken, stripeEmail, offerId } = body;
    const { amount } = params;

    client.customers.create({
      email: stripeEmail,
      source: stripeToken
    })
    .then((customer) => {
      return client.charges.create({
        amount,
        description: 'Sample Charge',
           currency: 'usd',
           customer: customer.id
      });
    })
    .then((charge) => {
      const message = `$${(charge.amount / 100).toFixed(2)} Charge Successful`;
      res.render('charge-test', { ...amount, publicKey, message });
    })
    .catch(err => console.error(err));
  });

  app.get('/test/charge/:amount', (req, res) => {
    const { params } = req;
    const { amount } = params;

    res.render('charge-test', { amount, publicKey });
  });
}
