/*
 # routes/index.js
 # Routes Index
 */

/*
 # Module Dependencies
 */

const chalk = require('chalk');
const path = require('path');

const passport = require('passport');
const { asyncRoute } = require('./middleware.common');
const { generateUserToken, authenticate } = require('./middleware.auth');

const config = require('../configs');

const { User, Identity } = require('../models');

/*
 # Module Exports
 */

const routes = async () => {
  const environment = config.get('environment');
  const { app, appName, env, clientURL } = environment;

  // >>>>>>>>>>>>>>>> BASIC AUTH ROUTES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  app.get('/login', (req, res) => {
    res.render('login', { title: appName, env });
  });

  app.get('/register', (req, res) => {
    res.render('register', { title: appName, env });
  });

  app.get('/profile', authenticate.required, (req, res) => {
    res.render('profile', { title: appName, env });
  });

  app.post('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  // >>>>>>>>>>>>>>>> ACCOUNT VALIDATION & RECOVERY >>>>>>>>>>>>>>>>>>>>>>>>>>

  // Account Recovery
  app.get('/recover/', (req, res) => {
    res.render('recover', { title: appName, env });
  });

  app.post('/recover/', asyncRoute(async (req, res) => {
    const { email } = req.body;
    const reset = await User.requestPasswordReset(email);

    if (reset.err) res.status(400).redirect('/');
    if (reset.success) res.redirect('/login');
  }));

  // Reset Password with Token
  app.get('/recover/:token', (req, res) => {
    const token = req.params.token;
    res.render('recover', { title: appName, env, token });
  });

  app.post('/recover/:token', asyncRoute(async (req, res) => {
    const token = req.params.token;
    const { password } = req.body;
    const redeem = await User.setPasswordWithToken(token, password);

    if (redeem.err) res.status(400).redirect('/');
    if (redeem.success) res.redirect('/login');
  }));

  // Confirm Email with Token
  app.get('/validate/email/:token', asyncRoute(async (req, res, next) => {
    const token = req.params.token;
    const redeem = await Identity.validateWithToken(token);

    if (redeem.err) res.status(400).redirect('/');
    if (redeem.success) res.redirect('/login');
  }));


  // >>>>>>>>>>>>>>>> EMAIL LOGIN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // Email Login
  app.post('/auth/login', 
    passport.authenticate(['local'], { session: false }),
    generateUserToken,
    (req, res) => {
      res.redirect('/');
    });

  // Email Registration
  app.post('/auth/register', 
    asyncRoute(async (req, res, next) => {
      const { email, password } = req.body;
      const result = await User.authenticateEmail(email, password, true);

      if (result.user) {
        req.user = result.user;
        next();
      } else {
        res
          .status(400)
          .redirect('/register');
      }
    }),
    generateUserToken,
    (req, res) => res.redirect('/')
  );

  // Set / Reset Password
 /* app.patch('/auth/password', 
    asyncRoute(async (req, res) => {
      const { email, oldPassword, newPassword } = req.body;
      const result = await User.authenticateEmail(email, password);

      if (result.user) {

      }
      // const result = await 
  }));*/

  // >>>>>>>>>>>>>>>> SOCIAL LOGIN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // Google Authentication Routes
  app.get('/auth/google',
    passport.authenticate(['google'], { session: false, scope: ['openid', 'email'] })
  );

  app.get('/auth/google/redirect',
    passport.authenticate(['google'], { session: false }),
    generateUserToken,
    (req, res) => res.redirect('/')
  );

  // Facebook Authentication Routes
  app.get('/auth/facebook',
    passport.authenticate(['facebook'], { session: false, authType: 'rerequest', scope: ['public_profile', 'email', 'user_gender'] })
  );

  app.get('/auth/facebook/redirect',
    passport.authenticate(['facebook'], { session: false }),
    generateUserToken,
    (req, res) => res.redirect('/')
  );

  // Twitter Authentication Routes
  /*app.get('/auth/twitter',
    passport.authenticate(['twitter'], { session: false, authType: 'rerequest', scope: ['public_profile', 'email', 'user_gender'] })
  );

  app.get('/auth/twitter/redirect',
    passport.authenticate(['twitter'], { session: false }),
    generateUserToken,
    (req, res) => res.redirect('/')
  );*/
};

module.exports = routes;
