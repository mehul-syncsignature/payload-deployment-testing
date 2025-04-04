#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status

# Debug information
echo "== Environment Information =="
node --version
npm --version
echo "NODE_ENV: $NODE_ENV"
echo "Current directory: $(pwd)"
echo "Files in current directory:"
ls -la

# Create necessary directories
echo "== Creating directories =="
mkdir -p public
mkdir -p netlify/functions

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "== Installing dependencies =="
  npm install
fi

# Build Payload if applicable
if [ -f "payload.config.js" ]; then
  echo "== Building Payload =="
  npx cross-env PAYLOAD_CONFIG_PATH=payload.config.js payload build
fi

# Create a minimal public directory for Netlify
echo "== Setting up public directory =="
echo '{}' > public/payload-config.json

# Copy any assets if they exist
if [ -d "src/assets" ]; then
  echo "== Copying assets =="
  cp -r src/assets public/
fi

# Create a basic index.html to avoid 404
echo "== Creating index.html =="
cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payload CMS API</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }
    .card { background: #f9f9f9; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    code { background: #eee; padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.9rem; }
  </style>
</head>
<body>
  <h1>Payload CMS API</h1>
  <div class="card">
    <h2>API Endpoints</h2>
    <p>The following endpoints are available:</p>
    <ul>
      <li><code>/admin</code> - Payload CMS Admin panel</li>
      <li><code>/api/...</code> - API endpoints</li>
      <li><code>/media/...</code> - Media files</li>
    </ul>
  </div>
</body>
</html>
EOF

echo "== Build completed successfully =="