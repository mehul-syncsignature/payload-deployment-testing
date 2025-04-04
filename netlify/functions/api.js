const express = require('express')
const payload = require('payload')
const serverless = require('serverless-http')

const app = express()

// Initialize Payload
payload.init({
  secret: process.env.PAYLOAD_SECRET,
  // If you're using PostgreSQL
  postgresConfig: {
    url: process.env.DATABASE_URI,
  },
  // Or for MongoDB
  // mongoURL: process.env.MONGODB_URI,
  express: app,
})

// Handle the API routes
module.exports.handler = serverless(app)
