/*
 # model.user.js
 # User Mongoose Model
 */

/**
 # Module Dependencies
 */

const mongoose = require('mongoose');

const { Schema } = mongoose;

const bcrypt = require('bcrypt-nodejs');
// const jwt = require('jsonwebtoken');

const config = require('../../../configs');
const constants = require('../../../constants');

const { mail } = require('../../../modules');
const mailTemplates = require('../../../mail');

const {
  generateEmailValidationEmail,
  generatePasswordResetEmail,
} = mailTemplates.user;

/*
 # Critical Variables
 */

const constUser = constants.user;

/*
 # Utility Methods
 */

const getProvider = (provider) => {
  const storefront = config.get('storefront');
  if (!storefront[provider]) throw new Error(`Cannot get "${provider}" Client: Provider is not configured.`);
  return storefront[provider];
};

/*
 # Schema
 */

const schema = { methods: {}, statics: {} };

/*
 # Middleware
 */

/**
 # Schema Methods
 */

schema.methods.getCustomer = async function (provider = 'stripe') {
  try {
    getProvider(provider);
    if (provider === 'stripe') return this.getCustomerStripe();
    return undefined;
  } catch (err) {
    console.error(err);
    return { err };
  }
};

schema.methods.upsertCustomer = async function (provider = 'stripe', params) {
  try {
    getProvider(provider);
    if (provider === 'stripe') return this.upsertCustomerStripe(params);
    return undefined;
  } catch (err) {
    console.error(err);
    return { err };
  }
};

schema.methods.getOrCreateCustomer = async function (provider = 'stripe', params) {
  const customerIds = this.customerIds || {};
  const isNew = customerIds[provider] === undefined;
  try {
    getProvider(provider);
    if (provider === 'stripe') return isNew ? this.upsertCustomerStripe(params) : this.getCustomerStripe();
    return undefined;
  } catch (err) {
    console.error(err);
    return { err };
  }
};

schema.methods.addPaymentSource = async function (source, provider = 'stripe') {
  let customerId = this.customerIds[provider];
  try {
    getProvider(provider);
    console.log(customerId);

    // Create the customer if it doesn't exist.
    if (!customerId) {
      const customer = await this.upsertCustomer(provider, {});
      customerId = customer.id;
    }

    // Create the Source.
    if (provider === 'stripe') return await this.addPaymentSourceStripe(source);
    return undefined;
  } catch (err) {
    console.error(err);
    return { err };
  }
};

// ==== STRIPE ====

schema.methods.getCustomerStripe = async function () {
  try {
    const { client } = getProvider('stripe');
    if (!this.customerIds.stripe) return undefined;
    return client.customers.retrieve(this.customerIds.stripe);
  } catch (err) {
    return { err };
  }
};

schema.methods.upsertCustomerStripe = async function (params = {}) {
  try {
    const { client } = getProvider('stripe');
    const sConfig = { ...params };
    const isNew = this.customerIds.stripe === undefined;

    // Determine the right function to use with the Stripe API.
    const sFn = isNew ? o => client.customers.create(o) : o => client.customers.update(this.customerIds.stripe, o);

    // Apply default config if we're creating a new Customer.
    if (this.customerIds.stripe === undefined) {
      sConfig.email = sConfig.email || this.email;
      sConfig.description = `User ${this._id.toString()}`;
    }

    // If we don't have a customer, create one. Otherwise update the existing customer.
    const customer = await sFn(sConfig);
    // const customer = sConfig;
    if (!customer) throw new Error(`Could not upsert customer for user ${this._id.toString()}.`);
    if (isNew) {
      this.customerIds.stripe = customer.id;
      await this.save();
    }

    return customer;
  } catch (err) {
    return { err };
  }
};

/* schema.methods.getPaymentSourcesStripe = async function () {
  try {
    const { client } = getProvider('stripe');
  } catch (err) {
    return { err };
  }
}; */

schema.methods.addPaymentSourceStripe = async function (params) {
  try {
    const { client } = getProvider('stripe');

    const customerId = this.customerIds.stripe;
    if (!customerId) throw new Error('Cannot add payment source: Customer undefined.');

    let sConfig = { customer: customerId };
    if (typeof params === 'string') {
      sConfig = { original_source: params, ...sConfig };
    } else if (typeof params === 'object') {
      sConfig = { ...params, ...sConfig };
    } else {
      throw new Error(`Could not create Stripe Source for user ${this._id.toString()}: Invalid params defined.`);
    }
    const source = await client.sources.create(sConfig);
    if (!source) throw new Error(`Could not create source for user ${this._id.toString()}.`);
    return source;
  } catch (err) {
    return { err };
  }
};

// Consider whether to treat customer like any other identity.
/* schema.methods.getCustomer = async function (email, source) {
  let result;
  try {
    const storefront = config.get('storefront');
    const { client } = storefront.stripe;
    let customer;

    if (this.customerIds.stripe) {
      customer = await client.customers.retrieve(this.customerIds.stripe);
      if (!customer) throw new Error('Could not retrieve customer.');
    } else {
      customer = await client.customers.create({ email, source });
      if (!customer) throw new Error('Could not create customer.');
      this.customerIds.stripe = customer.id;

      // >>>>> TODO: ADD NEW IDENTITY FOR CUSTOMER / EMAIL

      await this.save();
    }
    result = customer;
    return result;
  } catch (err) {
    // console.error(err);
    return result;
  }
}; */

/* schema.methods.addPaymentSource = async function ({
  provider = 'stripe',
  email,
  source,
}) {
  const storefront = config.get('storefront');
  let result;
  try {
    if (provider === 'stripe') {
      const { client } = storefront.stripe;
      const customer = await this.getCustomer(email, source);
    } else {
      throw new Error(`Cannot add Payment Source for Provider: ${provider}`);
    }
    return result;
  } catch (err) {
    console.log(err);
    return result;
  }
} */

/* schema.methods.createCharge = async function ({
  email,
  source,
  amount,
  description,
  currency = 'usd',
}) {
  let result;
  try {
    const storefront = config.get('storefront');
    const { client } = storefront.stripe;

    const customer = await this.getCustomer(email, source);
    if (!customer) throw new Error('Could not create charge: Could not retrieve customer.');

    // >>>>> TODO: CREATE SCHEMA FOR CHARGES INSTEAD OF DOING THIS HERE

    const charge = await client.charges.create({
      customer: customer.id,
      description: description || `$${(amount / 100).toPrecision(3)} charge for ${this.email} (${this._id})`,
      amount,
      currency,
    });

    result = charge;
    return result;
  } catch (err) {
    // console.error(err);
    return result;
  }
}; */

/**
 # Static Schema Methods
 */

/**
 # Module Exports
 */

module.exports = schema;
