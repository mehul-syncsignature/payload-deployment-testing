// netlify/functions/api.js
const express = require('express')
const serverless = require('serverless-http')
const app = express()

// Basic routing to distribute traffic to other functions
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Route admin requests to admin function
app.all('/admin*', (req, res) => {
  res.redirect(307, '/.netlify/functions/admin' + req.url.replace('/admin', ''))
})

// Route media requests to media function
app.all('/media*', (req, res) => {
  res.redirect(307, '/.netlify/functions/media' + req.url.replace('/media', ''))
})

// Route API data requests to data function
app.all('/api*', (req, res) => {
  res.redirect(307, '/.netlify/functions/data' + req.url.replace('/api', ''))
})

module.exports.handler = serverless(app)
