/*
 # routes/index.js
 # Routes Index
 */

/*
 # Module Dependencies
 */

const chalk = require('chalk');

const passport = require('passport');
const { asyncRoute } = require('./middleware.common');
const { generateUserToken, clearUserToken, authenticate } = require('./middleware.auth');

const config = require('../configs');

const { User, Identity } = require('../models');

/*
 # Module Exports
 */

const routes = async () => {
  const environment = config.get('environment');
  const { app, appName, env, clientURL } = environment;


  // >>>>>>>>>>>>>>>> API MIDDLEWARE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  app.use('/api/secure', authenticate.required);  

  // >>>>>>>>>>>>>>>> "SESSION" ROUTES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // app.get('/logout', clearUserToken, (req, res) => res.redirect('/'));
  app.post('/auth/logout', clearUserToken, (req, res) => res.redirect('/'));

  // >>>>>>>>>>>>>>>> ACCOUNT VALIDATION & RECOVERY >>>>>>>>>>>>>>>>>>>>>>>>>>

  // Account Recovery
  app.get('/recover/', authenticate.optional, (req, res) => {
    res.render('recover', { ...req.config, user: req.user });
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
    res.render('recover', { ...req.config, token, user: req.user });
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
    passport.authenticate(['local'], { session: false, failureRedirect: '/login' }),
    generateUserToken,
    (req, res) => {
      res.redirect('/profile');
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
        res.status(400).redirect('/register');
      }
    }),
    generateUserToken,
    (req, res) => res.redirect('/profile')
  );

  // TODO: Set / Reset Password


  // >>>>>>>>>>>>>>>> SOCIAL LOGIN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // Google Authentication Routes
  app.get('/auth/google',
    passport.authenticate(['google'], { session: false, failureRedirect: '/login', scope: ['openid', 'email'] })
  );

  app.get('/auth/google/redirect',
    passport.authenticate(['google'], { session: false, failureRedirect: '/login' }),
    generateUserToken,
    (req, res) => res.redirect('/profile')
  );

  // Facebook Authentication Routes
  app.get('/auth/facebook',
    passport.authenticate(['facebook'], { session: false, failureRedirect: '/login', authType: 'rerequest', scope: ['public_profile', 'email', 'user_gender'] })
  );

  app.get('/auth/facebook/redirect',
    passport.authenticate(['facebook'], { session: false, failureRedirect: '/login' }),
    generateUserToken,
    (req, res) => res.redirect('/profile')
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

  // LinkedIn Authentication Routes
  /*app.get('/auth/linkedin',
    passport.authenticate(['linkedin'], { session: false, authType: 'rerequest', scope: ['public_profile', 'email', 'user_gender'] })
  );

  app.get('/auth/linkedin/redirect',
    passport.authenticate(['linkedin'], { session: false }),
    generateUserToken,
    (req, res) => res.redirect('/')
  );*/
};

module.exports = routes;
