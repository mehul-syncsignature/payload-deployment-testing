// netlify/functions/admin.js
const express = require('express')
const serverless = require('serverless-http')
const payload = require('payload')

const app = express()

// Initialize Payload with admin-specific options
payload.init({
  secret: process.env.PAYLOAD_SECRET,
  postgresConfig: {
    url: process.env.DATABASE_URI,
    pool: { max: 1 },
  },
  express: app,
  // Minimal config for admin routes only
  admin: {
    user: 'users', // Collection for admin users
  },
  collections: [
    // Only include collections needed for admin
  ],
})

module.exports.handler = serverless(app)
