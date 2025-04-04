// // netlify/functions/admin.js
// const express = require('express')
// const serverless = require('serverless-http')
// const payload = require('payload')
// const path = require('path')

// const app = express()

// // Make sure all paths are properly defined
// try {
//   payload.init({
//     secret: process.env.PAYLOAD_SECRET,

//     // Set explicit paths to avoid undefined path errors
//     configPath: path.resolve(__dirname, '../../payload.config.js'),

//     // Use PostgreSQL connection
//     postgresConfig: {
//       url: process.env.DATABASE_URI,
//       pool: { max: 1 },
//     },

//     express: app,
//     onInit: () => {
//       console.log('Payload initialized in admin function')
//     },
//   })
// } catch (error) {
//   console.error('Payload initialization error:', error)
// }

// // Handle all routes
// app.use((req, res, next) => {
//   // Make sure req.path is defined
//   if (!req.path) {
//     return res.status(400).send('Invalid request path')
//   }
//   next()
// })

// module.exports.handler = serverless(app)

const express = require('express')
const serverless = require('serverless-http')
const payload = require('payload')
const path = require('path')
const { fileURLToPath } = require('url')

const app = express()

// Define fallback paths in case environment paths are undefined
const DEFAULT_CONFIG_PATH = './payload.config.js'

// Wrap initialization in a try/catch to handle errors gracefully
try {
  // Check for environment variables before using them
  if (!process.env.PAYLOAD_SECRET) {
    console.warn('Warning: PAYLOAD_SECRET environment variable is not set')
  }

  if (!process.env.DATABASE_URI) {
    console.warn('Warning: DATABASE_URI environment variable is not set')
  }

  // Initialize Payload with explicit configuration
  payload.init({
    secret: process.env.PAYLOAD_SECRET || 'default-secret-replace-in-production',

    // Use explicit config path to avoid undefined path errors
    configPath: path.resolve(__dirname, DEFAULT_CONFIG_PATH),

    // PostgreSQL configuration with fallback
    postgresConfig: process.env.DATABASE_URI
      ? {
          url: process.env.DATABASE_URI,
          pool: { max: 1 },
        }
      : undefined,

    express: app,

    // Add minimal required collections if config file is missing
    collections: [
      // Fallback collections in case config file can't be loaded
      {
        slug: 'users',
        auth: true,
        fields: [],
      },
      {
        slug: 'media',
        upload: {
          staticDir: './media',
        },
        fields: [],
      },
    ],

    onInit: () => {
      console.log('Payload initialized in admin function')
    },
  })
} catch (error) {
  console.error('Payload initialization error:', error)
  // Continue serving the express app even if Payload fails to initialize
}

// Middleware to handle undefined paths
app.use((req, res, next) => {
  if (!req.path) {
    return res.status(400).json({
      error: 'Invalid request path',
      message: 'The request path is undefined',
    })
  }
  next()
})

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Express error:', err)
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message,
  })
})

module.exports.handler = serverless(app)
