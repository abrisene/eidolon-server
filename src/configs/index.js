/*
 # configs/index.js
 # Configuration Index
 */

/*
 # Module Dependencies
 */

import envConfig from './config.env';
import dbConfig from './config.db';
import moduleConfig from './config.modules';
import passportConfig from './config.passport';

/*
 # Critical Variables
 */


/*
 # Module Exports
 */

module.exports = {
  environment: envConfig,
  database: dbConfig,
  modules: moduleConfig,
  apiPublicKeys: {
    ...envConfig.apiPublicKeys,
    ...dbConfig.apiPublicKeys,
    ...moduleConfig.apiPublicKeys,
  },
};
