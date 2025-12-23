#!/bin/bash

# SS HR Consultancy - Backend Update Script
# Quick script to update only the backend

set -e

APP_DIR="/var/www/ss-hr-consultancy"
BACKEND_DIR="$APP_DIR/backend"

echo "🔄 Updating Backend..."

cd $BACKEND_DIR

# Pull latest changes (if using git)
# git pull origin main

# Install dependencies
echo "Installing dependencies..."
npm ci --production=false

# Build backend
echo "Building backend..."
npm run build

# Restart with PM2
echo "Restarting backend..."
pm2 restart ss-hr-backend --update-env

echo "✅ Backend updated successfully!"
pm2 logs ss-hr-backend --lines 20

