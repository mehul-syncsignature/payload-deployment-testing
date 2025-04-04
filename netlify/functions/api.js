const express = require('express')
const serverless = require('serverless-http')
const payload = require('payload')

const app = express()

// Add basic error handling
app.use((req, res, next) => {
  try {
    next()
  } catch (error) {
    console.error('Express error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Initialize Payload with better error handling
try {
  payload.init({
    secret: process.env.PAYLOAD_SECRET,
    postgresConfig: {
      url: process.env.DATABASE_URI,
    },
    express: app,
  })
} catch (error) {
  console.error('Payload initialization error:', error)
}

// Handle the API routes
module.exports.handler = serverless(app)
