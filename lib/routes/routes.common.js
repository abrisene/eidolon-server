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
  const { app } = environment;

  const navConfig = {
    navs: [
      { text: 'About', href: '/about' },
    ],
    authNavs: [
      { text: 'Profile', href: '/profile' },
      { text: 'Store', href: '/store' },
      { text: 'Subscribe', href: '/subscribe' },
    ],
  };

  app.use(injectConfig('config', navConfig));

  // >>>>>>>>>>>>>>>> INDEX ROUTE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  app.get('/', authenticate.optional, (req, res) => {
    res.render('placeholder', { ...req.config, user: req.user, placeholder: 'Home' });
  });

  // >>>>>>>>>>>>>>>> COMMON ROUTES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  app.get('/about', authenticate.optional, (req, res) => {
    res.render('placeholder', { ...req.config, user: req.user, placeholder: 'About' });
  });

  // >>>>>>>>>>>>>>>> USER ROUTES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  app.get('/login', authenticate.optional, (req, res) => {
    res.render('login', { ...req.config, user: req.user });
  });

  app.get('/register', authenticate.optional, (req, res) => {
    res.render('register', { ...req.config, user: req.user });
  });

  app.get('/profile', authenticate.required, asyncRoute(async (req, res) => {
    const { user } = req;
    let identities = await user.getIdentities();
    res.render('profile', { ...req.config, user, identities });
  }));

  // >>>>>>>>>>>>>>>> STORE ROUTES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  app.get('/store', authenticate.optional, (req, res) => {
    res.render('placeholder', { ...req.config, user: req.user, placeholder: 'Store' });
  });

  app.get('/subscribe', authenticate.optional, (req, res) => {
    res.render('placeholder', { ...req.config, user: req.user, placeholder: 'Subscribe' });
  });

};

module.exports = routes;
