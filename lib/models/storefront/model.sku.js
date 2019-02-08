/*
 # model.sku.js
 # SKU Mongoose Model
 */

/**
 # Module Dependencies
 */

const mongoose = require('mongoose');

const { Schema } = mongoose;

const config = require('../../configs');
const constants = require('../../constants');
const { trimObject } = require('../../common');

/*
 # Critical Variables
 */

const CON = constants.storefront;

/*
 # Utility Methods
 */

const syncStripe = async (doc) => {
  try {
    const storefront = config.get('storefront');
    const { client } = storefront.stripe;
    const sObj = client.skus;
    const syncFn = doc.isNew ? o => sObj.create(o)
      : o => sObj.update(doc._id.toString(), o);
    
    let oConfig = {
      price: doc.price,
      currency: doc.currency,
      product: doc.product.toString(),
      active: doc.active,
      attributes: doc.attributes,
      metadata: doc.metadata,
      inventory: doc.inventory,
      image: doc.image,
    };

    if (doc.isNew) {
      oConfig.id = doc._id.toString();
      oConfig.type = doc.type;
    }

    oConfig = trimObject(oConfig);
    const result = await syncFn(oConfig);

    return result;
  } catch (err) {
    console.error(err);
    return { err };
  }
};

/*
 # Schema
 */

// https://stripe.com/docs/api#create_sku

const schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, default: 9999 },
  currency: { type: String, required: true, default: 'usd' },
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  active: { type: Boolean, default: true },
  status: { type: String, default: 'active' },
  attributes: [String],
  metadata: Object,
  inventory: {
    type: { type: String, required: true, default: 'infinite' },
    quantity: Number,
    value: String,
  },
  image: String, // Goods only
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
    if (stripe !== undefined) await stripe.client.skus.del(this._id.toString());
    return this;
  } catch (err) {
    console.error(err);
    return { err };
  }
});

/**
 # Schema Methods
 */

schema.methods.syncStripe = async function (isNew = false) {
  try {
    const storefront = config.get('storefront');
    const { client } = storefront.stripe;
    const sObj = client.sku;
    const syncFn = isNew ? o => sObj.create(o) : o => sObj.update(this._id.toString(), o);

    const oConfig = {
      price: this.price,
      currency: this.currency,
      product: this.product.toString(),
      active: this.active,
      attributes: this.attributes,
      metadata: this.metadata,
      image: this.image,
    };

    if (this.isNew) {
      oConfig.id = this._id.toString();
      oConfig.type = this.type;
    }

    const result = await syncFn(oConfig);
    return result;
  } catch (err) {
    return { err };
  }
};

schema.methods.activate = function () {
  const PS = CON.productStatus;
  return this.setStatus(PS.active);
};

schema.methods.deactivate = function () {
  const PS = CON.productStatus;
  return this.setStatus(PS.disabled);
};

schema.methods.setStatus = async function (status) {
  let result;
  const PS = CON.productStatus;
  try {
    if (!status) throw new Error(`Could not apply undefined status to SKU: ${this.name}`);
    switch (status) {
      case PS.active:
        this.status = PS.active;
        this.active = true;
        break;
      case PS.staging:
        this.status = PS.staging;
        this.active = true;
        break;
      case PS.debug:
        this.status = PS.staging;
        this.active = true;
        break;
      case PS.disabled:
      default:
        this.status = PS.disabled;
        this.active = false;
        break;
    }
    return this.save();
  } catch (err) {
    result = { err };
    return result;
  }
};

/**
 # Static Schema Methods
 */


/**
 # Module Exports
 */

module.exports = mongoose.model('Sku', schema);
