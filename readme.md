## Eidolon

An opinionated Express Server Boilerplate with Scaffolding for the following features:
  - Redis
  - Socket.io
  - Stripe (Payments)
  - Twilio (Telephony)

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

REDIS { An optional JSON object containing redis credentials.
  "url" // URL of the redis instance.
  "password" // An optional password for the redis instance.
}

REDIS_URL // A URL to a redis instance. Used if the REDIS object isn't defined. This value is populated by Heroku's REDIS addon.

```
