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
  const secret = auth.jwt.secretOrKey;
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

/*schema.methods.authenticate = async function(password) {
  let result;
  try {
    result = await bcrypt.compare(password, this.hash);
    if (result) {
      this.tsLogin.push(Date.now());
      await this.save();
      return result;
    }
  } catch(err) {
    console.error(err);
    return result;
  }
};*/

schema.methods.authenticatePassword = async function(password) {
  let result;
  try {
    return await bcrypt.compare(password, this.hash);
  } catch(err) {
    console.error(err);
    return result;
  }
};

schema.methods.generateJWT = function() {
  return generateJWT(this._id);
}

schema.methods.linkIdentity = async function(identity) {
  try {
    identity.ownerId = this._id;
    this.identities.push(identity._id);

    if (identity.email && !this.emails.includes(identity.email)) {
      this.emails.push(identity.email);
    }

    return this;
  } catch (err) {
    console.error(err);
    return this;
  }
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

schema.statics.authenticateEmail = async function(email, password, register = false) {
  const result = {};
  try {

    if (!email) throw 'Cannot authenticate email, no email defined.';
    if (!password) throw 'Cannot authenticate email, no password defined.';

    const User = this;
    let ts = Date.now();
    let identity = await Identity.findIdentity('email', email);
    let user;

    if (identity) { // Login Flow >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      user = await identity.getUser();
      if (!user) throw `User not found for Identity ${identity._id}.`;
      if (!user.hash) throw `User ${user._id} does not support Email Login.`;
      // ^ THIS SHOULD TRIGGER RESET PASSWORD PROCESS TO SET PASSWORD.

      const authenticated = await user.authenticatePassword(password);
      if (authenticated !== true) throw `Could not authenticate Email Login for ${email}`;

      user.tsLogin.push(ts);
      identity.tsAccessed = ts;

      await user.save();
      await identity.save();

      result.user = user;
      result.identity = identity;
      result.authenticated = authenticated;

    } else if (register) { // Registration Flow >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      const hash = await User.hashPassword(password);

      user = new User({ email, hash, tsLogin: [ts] });
      identity = new Identity({
        ownerId: user._id,
        type: 'email',
        key: email,
        source: 'user',
        email,
        tsAccessed: ts,
      });

      await user.linkIdentity(identity);
      await user.save();
      await identity.save();

      result.user = user;
      result.identity = identity;
      result.authenticated = true;

    } else {
      throw `Identity not found for ${email}`;
    }
    return result;
  } catch (err) {
    console.error(err);
    result.err = err;
    return result;
  }
}

schema.statics.authenticateSocial = async function(type, profile) {
  const result = {};
  try {
    const User = this;
    const id = profile.id;
    let ts = Date.now();
    let socialIdentity = await Identity.findIdentity(type, id);
    let emailIdentity;
    let user;

    // If the socialIdentity exists, login, otherwise register.
    if (socialIdentity) { // Login Flow >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      console.log('TODO: CHECK FOR SOCIAL PROFILE UPDATES');
      /*
          

          >>>>> TODO: CHECK IF PROFILE DATA HAS CHANGED
          >>>>> WHAT IF THERE IS A COLLISION WITH EXISTING?


       */

      // Get the user attached to the socialIdentity and return credentials.
      user = await socialIdentity.getUser();
      if (!user) throw `User not found for Identity ${socialIdentity._id}.`;

      user.tsLogin.push(ts);
      socialIdentity.tsAccessed = ts;

      await user.save();
      await socialIdentity.save();

      result.user = user;
      result.identity = socialIdentity;
      result.authenticated = true;

    } else { // Registration Flow >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      // Does an Identtiy exist with the email address?
      const identities = await Identity.findIdentitiesByEmail(profile.email);
      let currentIdentity;
      
      // See if we have an valid identity to link to.
      if (identities.length > 0) {
        identities.some((i) => {
          let linkable = i.tsValidated;
          if (linkable) currentIdentity = i;
          console.log(i);
          console.log(linkable);
          return linkable;
        });
      }

      // If we found a valid identity to link, use that instead.
      if (currentIdentity) {
        user = await currentIdentity.getUser();
        user.tsLogin.push(ts);
      } else {
        user = new User({ email: profile.email, tsLogin: [ts] });
      }

      // Create identity for social account.
      socialIdentity = new Identity({
        ownerId: user._id,
        type,
        key: id,
        source: 'user',
        email: profile.email,
        displayName: profile.displayName,
        gender: profile.gender,
        metadata: profile.metadata,
        tsValidated: ts,
        tsAccessed: ts,
      });

      // Create identity for social email.
      emailIdentity = new Identity({
        ownerId: user._id,
        type: 'email',
        key: profile.email,
        source: type,
        email: profile.email,
        tsValidated: ts,
      });

      await user.linkIdentity(socialIdentity);
      await user.linkIdentity(emailIdentity);
      await user.save();
      await socialIdentity.save();
      await emailIdentity.save();

      result.user = user;
      result.identity = socialIdentity;
      result.authenticated = true;
    }
    return result;
  } catch (err) {
    console.error(err);
    result.err = err;
    return result;
  }
}
      
      /*const identities = await Identity.find({ email: profile.email, })
        .where('email').equals(profile.email)
        .where('type').ne('email');*/


/**
 # Module Exports
 */

module.exports = mongoose.model('User', schema);
