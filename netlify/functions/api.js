const express = require('express')
const serverless = require('serverless-http')
const payload = require('payload')

const app = express()

// Initialize Payload
payload.init({
  secret: process.env.PAYLOAD_SECRET,
  postgresConfig: {
    url: process.env.DATABASE_URI,
  },
  express: app,
})

// Handle the API routes
module.exports.handler = serverless(app)
