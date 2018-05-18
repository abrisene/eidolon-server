/*
 # index.dev.js
 # Development Entry
 */

/**
 # Module Dependencies
 */

require('babel-register');

const path = `../${process.env.RUN_DIR || 'src'}`;
const dev = require(path);

/**
 # Module Exports
 */

module.exports = dev;
