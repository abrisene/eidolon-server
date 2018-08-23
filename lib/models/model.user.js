/*
 # model.user.js
 # Users Mongoose Model
 */

/**
 # Module Dependencies
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../configs');

const Identity = require('./model.identity');

/*
 # Critical Variables
 */

const hashCost = 10;

/*
 # Utility Methods
 */

const generateJWT = (id) => {
  const auth = config.get('authentication');
  const secret = auth.jwt.secret;
  const options = {
    expiresIn: auth.jwt.expiration,
    issuer: auth.jwt.issuer,
    audience: auth.jwt.audience,
    subject: id.toString(),
  };

  const token = jwt.sign({}, secret, options);
  return token;
};

/*
 # Schema
 */

const schema = new Schema({
    email: {
      type: String,
      trim: true,
    },
    identities: [{
      type: Schema.Types.ObjectId,
      ref: 'Identity',
    }],
    emails: Array,
    hash: String,
    tsLogin: [Date],
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

/**
 # Schema Methods
 */

schema.methods.authenticate = async function(password) {
  let result;
  try {
    result = await bcrypt.compare(password, this.hash);
    if (result) {
      this.tsLogin.push(Date.now());
      await this.save();
    }
  } catch(err) {
    console.error(err);
  } finally {
    return result;
  }
};

schema.methods.generateJWT = function() {
  return generateJWT(this._id);
}

/**
 # Static Schema Methods
 */

schema.statics.hashPassword = async function(password) {
  try {
    return bcrypt.hash(password, hashCost);
  } catch(err) {
    console.error(err);
  }
}

schema.statics.register = async function(method, payload) {
  try {
    const User = this;

    switch (method) {
      case 'email':
        return await User.registerEmail(payload.email, payload.password);
        break;
      case 'google':
        break;
      case 'facebook':
        break;
      case 'twitter':
        break;
    }
    return;
  } catch(err) {
    console.error(err);
  }
}

schema.statics.registerEmail = async function(email, password) {
  const result = {};
  try {
    const User = this;
    let identity = await Identity.findEmail(email);

    if (identity === null) {
      const hash = await User.hashPassword(password);
      const user = new User({ email, hash });
      identity = new Identity({ ownerID: user._id, type: 'email', email });

      user.emails.push(email);
      user.identities.push(identity._id);

      await user.save();
      await identity.save();
      
      result.user = user;
      result.identity = identity;
      result.authenticated = true;
      result.token = user.generateJWT();
    } else {
      result.err = 'Identity already exists.';
    }
  } catch (err) {
    console.error(err);
  } finally {
    return result;
  }
}

schema.statics.loginEmail = async function(email, password) {
  const result = {};
  try {
    const User = this;
    const identity = await Identity.findEmail(email);

    if (identity !== null) {
      const user = await identity.getUser();

      if (user !== null) {
        const authenticated = await user.authenticate(password);

        if (authenticated === true) {
          result.user = user;
          result.identity = identity;
          result.authenticated = authenticated;
          result.token = user.generateJWT();
        } else {
          result.err = `Incorrect password for Email Login: ${email}`;
        }
      } else {
        result.err = `User not found for Identity ${identity._id}`;
      }
    } else {
      result.err = `Identity not found for ${email}`;
    }
    return result;
  } catch(err) {
    console.error(err);
  } finally {
    return result;
  }
}

/**
 # Module Exports
 */

module.exports = mongoose.model('User', schema);
