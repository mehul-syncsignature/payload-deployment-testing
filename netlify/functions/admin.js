// netlify/functions/admin.js
const express = require('express')
const serverless = require('serverless-http')
const payload = require('payload')
const path = require('path')

const app = express()

// Make sure all paths are properly defined
try {
  payload.init({
    secret: process.env.PAYLOAD_SECRET,

    // Set explicit paths to avoid undefined path errors
    configPath: path.resolve(__dirname, '../../payload.config.js'),

    // Use PostgreSQL connection
    postgresConfig: {
      url: process.env.DATABASE_URI,
      pool: { max: 1 },
    },

    express: app,
    onInit: () => {
      console.log('Payload initialized in admin function')
    },
  })
} catch (error) {
  console.error('Payload initialization error:', error)
}

// Handle all routes
app.use((req, res, next) => {
  // Make sure req.path is defined
  if (!req.path) {
    return res.status(400).send('Invalid request path')
  }
  next()
})

module.exports.handler = serverless(app)
