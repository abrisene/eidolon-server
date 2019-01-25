/*
 # routes.auth.js
 # Authentication Routes
 */

/*
 # Module Dependencies
 */

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
  const auth = config.get('authentication');

  const { app } = environment;
  const { google, facebook } = auth;

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

    if (reset.err) throw new Error(reset.err);
    if (reset.success) res.redirect('/login');
  }));

  // Reset Password with Token
  app.get('/recover/:token', (req, res) => {
    const { token } = req.params;
    res.render('recover', { ...req.config, token, user: req.user });
  });

  app.post('/recover/:token', asyncRoute(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const redeem = await User.setPasswordWithToken(token, password);

    if (redeem.err) throw new Error(redeem.err);
    if (redeem.success) res.redirect('/login');
  }));

  // Confirm Email with Token
  app.get('/validate/email/:token', asyncRoute(async (req, res, next) => {
    const { token } = req.params;
    const redeem = await Identity.validateWithToken(token);

    if (redeem.err) throw new Error(redeem.err);
    if (redeem.success) res.redirect('/profile');
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
      console.log(result);
      if (result.err) throw new Error(result.err);
      req.user = result.user;
      next();
    }),
    generateUserToken,
    (req, res) => res.redirect('/profile'));

  // TODO: Set / Reset Password


  // >>>>>>>>>>>>>>>> SOCIAL LOGIN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // Google Authentication Routes
  if (google !== undefined) {
    app.get('/auth/google',
      passport.authenticate(['google'], { session: false, failureRedirect: '/login', scope: ['openid', 'email'] }));

    app.get(google.callbackPath,
      passport.authenticate(['google'], { session: false, failureRedirect: '/login' }),
      generateUserToken,
      (req, res) => res.redirect('/profile'));
  }


  // Facebook Authentication Routes
  if (facebook !== undefined) {
    app.get('/auth/facebook',
      passport.authenticate(['facebook'], {
        session: false, failureRedirect: '/login', authType: 'rerequest', scope: ['public_profile', 'email', 'user_gender'],
      }));

    app.get(facebook.callbackPath,
      passport.authenticate(['facebook'], { session: false, failureRedirect: '/login' }),
      generateUserToken,
      (req, res) => res.redirect('/profile'));
  }

/*
  // Twitter Authentication Routes
  if (twitter !== undefined) {
    app.get('/auth/twitter',
      passport.authenticate(['twitter'], { session: false, authType: 'rerequest', scope: [] }));

    app.get('/auth/twitter/redirect',
      passport.authenticate(['twitter'], { session: false }),
      generateUserToken,
      (req, res) => res.redirect('/'));
  }

  // LinkedIn Authentication Routes
  if (linkedin !== undefined) {
    app.get('/auth/linkedin',
      passport.authenticate(['linkedin'], { session: false, authType: 'rerequest', scope: [] }));

    app.get('/auth/linkedin/redirect',
      passport.authenticate(['linkedin'], { session: false }),
      generateUserToken,
      (req, res) => res.redirect('/'));
  }
*/
};

module.exports = routes;
