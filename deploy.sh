#!/bin/bash

# Add global npm binaries to PATH
export PATH="$PATH:$(npm bin -g)"

# Set variables
PM2_PROCESS_NAME="gym-clubhouse"
PROJECT_DIR="$(pwd)"
HEALTHCHECK_URL="https://portal.gymclubhouse.co.tz"
BUILD_DIR="$PROJECT_DIR/dist"
SERVER_FILE="server.js"  # The main file to run

echo "🚀 Starting deployment script..."

# Ensure 'serve' is installed globally
if ! command -v serve >/dev/null 2>&1; then
    echo "⚠ 'serve' is not installed globally. Installing 'serve' globally..."
    npm install -g serve || { echo "❌ 'serve' installation failed!"; exit 1; }
else
    echo "✅ 'serve' is already installed globally."
fi

# Check if PM2 is installed globally; install if not.
if ! command -v pm2 >/dev/null 2>&1; then
    echo "⚠ PM2 is not installed globally. Installing PM2 globally..."
    npm install -g pm2 || { echo "❌ PM2 installation failed!"; exit 1; }
    hash -r  # Refresh command lookup hash
else
    echo "✅ PM2 is already installed globally."
fi

# Set Git configuration for GitHub
echo "🔧 Configuring Git settings..."
git config pull.rebase false  # Use merge when pulling changes
git config --global user.email "jbnyamasheki@gmail.com"
git config --global user.name "slymackjr"

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

# Check if PM2 process exists; if not, start it using server.js; otherwise, restart it.
if ! pm2 describe "$PM2_PROCESS_NAME" >/dev/null 2>&1; then
    echo "🔄 PM2 process '$PM2_PROCESS_NAME' not found. Starting process using $SERVER_FILE..."
    pm2 start "$SERVER_FILE" --name "$PM2_PROCESS_NAME" || { echo "❌ PM2 start failed!"; exit 1; }
else
    echo "🔄 Restarting PM2 process: $PM2_PROCESS_NAME..."
    pm2 restart "$PM2_PROCESS_NAME" || { echo "❌ PM2 restart failed!"; exit 1; }
fi

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

    # Restart PM2 process again (start if not running, restart if it is)
    if ! pm2 describe "$PM2_PROCESS_NAME" >/dev/null 2>&1; then
        echo "🔄 PM2 process '$PM2_PROCESS_NAME' not found. Starting process using $SERVER_FILE..."
        pm2 start "$SERVER_FILE" --name "$PM2_PROCESS_NAME" || { echo "❌ PM2 start failed again!"; exit 1; }
    else
        echo "🔄 Restarting PM2 process again: $PM2_PROCESS_NAME..."
        pm2 restart "$PM2_PROCESS_NAME" || { echo "❌ PM2 restart failed again!"; exit 1; }
    fi
fi

echo "✅ Deployment completed successfully!"
