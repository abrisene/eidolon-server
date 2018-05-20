## Eidolon

An opinionated Express Server Boilerplate with Scaffolding for the following features:
  - Redis
  - MongoDB / Mongoose
  - Socket.io
  - Stripe (Payments)
  - Twilio (Telephony)
  - Pug

## Installation

Run:

```
touch .env
npm install
npm run start
```

### Environment Variables

Webpack looks for the environment variables below in an .env file in the app's root directory:

```
APP_NAME // A String passed into the Redux store.

PORT // Port for the http Server, Passed to Express.

TWILIO { // An optional JSON object containing Twilio credentials.
  "account" // The Twilio account ID.
  "key" // The Twilio account's key.
}

STRIPE { // An optional JSON object containing Stripe credentials.
  "secretKey" // The account's Secret Key.
  "publicKey" // The account's Public Key.
}


MONGODB { An optional JSON object containing redis credentials.
  "url" // URL of the mongoDB database.
}

MONGODB_URL // A URL to a mongoDB database.

PROD_MONGODB // A URL to a mongoDB database. This value is populated by Heroku's Mongo Lab addon.

REDIS { An optional JSON object containing redis credentials.
  "url" // URL of the redis instance.
  "password" // An optional password for the redis instance.
}

REDIS_URL // A URL to a redis instance. This value is populated by Heroku's Redis addon.

REDISCLOUD_URL // A URL to a redis instance. This value is populated by Heroku's Redis Cloud addon.

```
