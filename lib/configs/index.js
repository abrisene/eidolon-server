/*
 # configs/index.js
 # Configuration Index
 */

/*
 # Module Dependencies
 */

require('dotenv').config();

const getEnvironment = require('./config.environment');
const getDatabase = require('./config.database');

// import authConfig from './config.auth.js';
// import moduleConfig from './config.modules.js';


/*
 # Methods
 */

class Config {
  constructor() {
  }

  async init() {
    this.environment = await getEnvironment();
    this.database = await getDatabase();
  }

  get(key) {
    return this[key] || undefined;
  }
}

/*
 # Module Exports
 */

// module.exports = getConfigs();
module.exports = new Config();
