/*
 # routes.services.js
 # Service Routes
 */

/*
 # Module Dependencies
 */

const { asyncRoute } = require('./middleware.common');
// const { authenticate } = require('./middleware.auth');

const config = require('../configs');

/*
 # Module Exports
 */

const routes = async () => {
  const environment = config.get('environment');
  const { app } = environment;

  // >>>>>>>>>>>>>>>> BASIC SERVICE ROUTES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // TIMER RETURN ROUTE WIP
  app.post('/api/timer/return', asyncRoute(async (req, res) => {
    // const { body } = req;
    // const { payload } = body;
    res.json({ status: 'recieved' });
  }));
};

module.exports = routes;
