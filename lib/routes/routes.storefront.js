/*
 # routes.storefront.js
 # Storefront Routes
 */

/*
 # Module Dependencies
 */

const { asyncRoute } = require('./middleware.common');
const { authenticate } = require('./middleware.auth');

const config = require('../configs');

/*
 # Module Exports
 */

const routes = async () => {
  const environment = config.get('environment');
  // const storefront = config.get('storefront');
  const {
    app,
  } = environment;

  // >>>>>>>>>>>>>>>> BASIC STOREFRONT ROUTES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  app.post('/api/charge/:amount', authenticate.required, asyncRoute(async (req, res) => {
    const { body, params, user } = req;
    const { stripeEmail, stripeToken } = body;
    const { amount } = params;

    await user.createCharge({
      email: stripeEmail,
      source: stripeToken,
      amount,
    });

    res.redirect('/profile');
  }));

  app.get('/store/charge/:amount', (req, res) => {
    res.render('storefront', { ...req.config, user: req.user });
  });
};

module.exports = routes;
