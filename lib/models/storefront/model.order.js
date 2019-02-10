/*
 # model.order.js
 # Order Mongoose Model
 */

/**
 # Module Dependencies
 */

const mongoose = require('mongoose');

const { Schema } = mongoose;

const config = require('../../configs');
const constants = require('../../constants');
const { syncStripeClient } = require('./utils.storefront');

/*
 # Critical Variables
 */

const CON = constants.storefront;

/*
 # Critical Variables
 */

/*
 # Utility Methods
 */

const syncStripe = d => syncStripeClient(d, 'orders', (doc) => {
  const syncConfig = {
    status: doc.status,
    metadata: doc.metadata,
  };

  if (doc.isNew) {
    syncConfig.id = doc._id.toString();
    syncConfig.attributes = doc.attributes;
  } else {
    // syncConfig.
  }

  return syncConfig;
});


/*
 # Schema
 */

const schema = new Schema({
  provider: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String },
  email: { type: String },
  userId: { type: String },
  customerId: { type: String },
  charge: { type: String },
  coupon: { type: String },
  currency: { type: String, required: true, default: 'usd' },
  items: [{
    type: { type: String, required: true },
    id: { type: String, required: true },
  }],
  metadata: Object,
},
{
  timestamps: {
    createdAt: 'tsCreated',
    updatedAt: 'tsUpdated',
  },
});

/*
 # Middleware
 */

schema.pre('save', async function () {
  try {
    const storefront = config.get('storefront');
    const { stripe } = storefront;
    if (stripe !== undefined) {
      const stripeUpdate = await syncStripe(this);
      if (stripeUpdate.err) throw new Error(stripeUpdate.err);
    }
    return this;
  } catch (err) {
    console.error(err);
    return { err };
  }
});

schema.pre('remove', async function () {
  try {
    const storefront = config.get('storefront');
    const { stripe } = storefront;
    if (stripe !== undefined) await stripe.client.orders.del(this._id.toString());

    // TODO: Remove all associated Skus ===========================================

    return this;
  } catch (err) {
    console.error(err);
    return { err };
  }
});

/**
 # Schema Methods
 */

/**
 # Static Schema Methods
 */


/**
 # Module Exports
 */

module.exports = mongoose.model('Order', schema);
