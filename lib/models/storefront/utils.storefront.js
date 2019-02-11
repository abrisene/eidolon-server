/*
 # utilities.storefront.js
 # Storefront Utility Methods
 */

/**
 # Module Imports
 */

const config = require('../../configs');
// const constants = require('../../constants');
const { trimObject } = require('../../common');


/**
 # Utilities
 */

/**
 * Registers / Syncs a Mongoose document with the Stripe API.
 * @param  {object}          doc  A mongoose document.
 * @param  {string}    clientKey  A valid key of a function in the stripe client.
 * @param  {function}   formatFn  Functin to format the document into the shape Stripe expects.
 * @return {object}               Returns a Stripe object.
 */
const syncStripeClient = async (doc, clientKey, formatFn, idFn = x => x._id.toString(), indexArrays = true) => {
  try {
    if (formatFn === undefined) throw new Error(`Formatting function is not defined for Stipe ${clientKey} sync`);
    const storefront = config.get('storefront');
    if (storefront.stripe === undefined) return undefined;
    const { client } = storefront.stripe;
    if (clientKey === undefined || client[clientKey] === undefined) throw new Error(`Could not find Stripe client function "${clientKey}"`);
    const clientFn = client[clientKey];
    const syncFn = doc.isNew ? o => clientFn.create(o)
      : o => clientFn.update(idFn(doc), o);

    let syncConfig = formatFn(doc);
    syncConfig = trimObject(syncConfig, indexArrays);

    const result = await syncFn(syncConfig);
    return result;
  } catch (err) {
    console.error(err);
    return { err };
  }
};

/**
 # Module Exports
 */

module.exports = {
  syncStripeClient,
};
