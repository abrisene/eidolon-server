/*
 # configs/index.js
 # Configuration Index
 */

/*
 # Module Dependencies
 */

import envConfig from './config.env.js';
import dbConfig from './config.db.js';
import moduleConfig from './config.modules.js';

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