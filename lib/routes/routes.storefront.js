/*
 # routes/index.js
 # Routes Index
 */

/*
 # Module Dependencies
 */

const chalk = require('chalk');

const { asyncRoute, injectConfig } = require('./middleware.common');
const { authenticate } = require('./middleware.auth');

const config = require('../configs');

/*
 # Module Exports
 */

const routes = async () => {
  const environment = config.get('environment');
  const storefront = config.get('storefront');
  const { app, appName, env, clientURL } = environment;
  const { stripe } = storefront;

  // >>>>>>>>>>>>>>>> BASIC STOREFRONT ROUTES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  app.post('/api/charge/:amount', authenticate.required, asyncRoute(async (req, res) => {
    try {
      const { body, params, user } = req;
      const { stripeEmail, stripeToken, stripeTokenType } = body;
      const { amount } = params;

      const charge = await user.createCharge({
        email: stripeEmail,
        source: stripeToken,
        amount,
      });

      res.redirect('/profile');
    } catch (err) {
      console.error(err);
      res.redirect('/profile');
    }
  }));

  app.get('/store/charge/:amount', (req, res) => {
    res.render('storefront', { ...req.config, user: req.user });
  });
};

module.exports = routes;
