#!/bin/bash

# Set variables
PM2_PROCESS_NAME="gym-clubhouse"
PROJECT_DIR="$(pwd)" 
HEALTHCHECK_URL="https://portal.gymclubhouse.co.tz"
BUILD_DIR="$PROJECT_DIR/dist"

echo "🚀 Starting deployment script..."

# Pull the latest changes from Git
echo "📥 Pulling latest changes..."
git pull origin master || { echo "❌ Failed to pull latest changes!"; exit 1; }

# Install dependencies (only if needed)
if [ package-lock.json -nt node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install || { echo "❌ Failed to install dependencies!"; exit 1; }
else
    echo "📦 Dependencies are up-to-date. Skipping npm install."
fi

# Build the project
echo "🔨 Building project..."
npm run build || { echo "❌ Build failed!"; exit 1; }

# Restart PM2 process
echo "🔄 Restarting PM2 process: $PM2_PROCESS_NAME..."
pm2 restart "$PM2_PROCESS_NAME" || { echo "❌ PM2 restart failed!"; exit 1; }

# Wait a bit for the app to fully start
sleep 10

# Check if the app is online after restarting
echo "🌐 Checking if $HEALTHCHECK_URL is online after rebuild..."
if curl -s --head --request GET "$HEALTHCHECK_URL" | grep "200 OK" > /dev/null; then
    echo "✅ $HEALTHCHECK_URL is online. No further action needed."
else
    echo "⚠ $HEALTHCHECK_URL is still DOWN! Removing dist folder and forcing a full rebuild..."
    
    # Delete dist folder
    if [ -d "$BUILD_DIR" ]; then
        rm -rf "$BUILD_DIR"
    fi

    # Rebuild again
    echo "🔄 Rebuilding project..."
    npm run build || { echo "❌ Build failed again!"; exit 1; }

    # Restart PM2 process again
    echo "🔄 Restarting PM2 process again: $PM2_PROCESS_NAME..."
    pm2 restart "$PM2_PROCESS_NAME" || { echo "❌ PM2 restart failed again!"; exit 1; }
fi

echo "✅ Deployment completed successfully!"
