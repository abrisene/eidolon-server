/*
 # generator.js
 # Static Mail Generator
 */

/*
 # Module Dependencies
 */

const Mailgen = require('mailgen');
const config = require('../configs');

/*
 # Module Exports
 */

const getGenerator = () => {
  const { appName, clientUrl, logoUrl } = config.get('environment');
  return new Mailgen({
    theme: 'default',
    product: {
      name: appName,
      link: clientUrl,
      logo: logoUrl,
    },
  });
}


module.exports = getGenerator;
