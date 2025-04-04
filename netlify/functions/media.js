// netlify/functions/media.js
const express = require('express')
const serverless = require('serverless-http')
const payload = require('payload')

const app = express()

// Initialize Payload with media-specific options
payload.init({
  secret: process.env.PAYLOAD_SECRET,
  postgresConfig: {
    url: process.env.DATABASE_URI,
    pool: { max: 1 },
  },
  express: app,
  // Minimal config for media routes only
  collections: [
    // Only media-related collections
  ],
})

// Only handle media routes
app.use((req, res, next) => {
  if (req.path.startsWith('/media')) {
    next()
  } else {
    res.status(404).send('Not found')
  }
})

module.exports.handler = serverless(app, {
  binary: ['image/*', 'application/pdf', 'video/*'],
})
