/*
 # model.token.js
 # Token Mongoose Model
 */

/**
 # Module Dependencies
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const config = require('../configs');

/*
 # Utility Methods
 */

/*
 # Schema
 */

// https://stripe.com/docs/api#create_sku

const schema = new Schema({
    price: { type: Number, required: true, default: 9999 },
    currency: { type: String, required: true, default: 'usd' },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    active: { type: Boolean, default: true },
    attributes: [String],
    metadata: Object,
    inventory: {
      type: { type: String, required: true, default: 'infinite' },
      quantity: Number,
      value: String,
    },
    image: String, // Goods only
    packageDimensions: Object, // Goods only
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

schema.pre('save', async function(next) {
  try {
    const storefront = config.get('storefront');
    const { client } = storefront.stripe;
    const skuFn = this.isNew ? (p) => client.skus.create(p) : (p) => client.skus.update(this._id.toString(), p);

    let skuConfig = {
      active: this.active,
      price: this.price,
      currency: this.currency,
      product: this.product.toString(),
      attributes: this.attributes,
      metadata: this.metadata,
      inventory: this.inventory,
      image: this.image,
      packageDimensions: this.packageDimensions,
    };

    if (this.isNew) {
      skuConfig.id = this._id.toString();
      skuConfig.type = this.type;
      
    }

    skuConfig = Object.keys(skuConfig).reduce((a, key) => {
      const obj = { ...a };
      const value = skuConfig[key];

      if (Array.isArray(value) && value.length > 0) {
        obj[key] = value;
      } else if (!Array.isArray(value) && value !== undefined) {
        obj[key] = value;
      }
      return obj;
    }, {});

    const sku = await skuFn(skuConfig);

    return sku;
  } catch (err) {
    console.error(err);
    return err;
  }
});

schema.pre('remove', async function (next) {
  try {
    const storefront = config.get('storefront');
    const { client } = storefront.stripe;
    return await client.skus.del(this._id.toString());
  } catch (err) {
    console.error(err);
    return err;
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

module.exports = mongoose.model('SKU', schema);
