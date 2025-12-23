#!/bin/bash

# SS HR Consultancy - Frontend Update Script
# Quick script to update only the frontend

set -e

APP_DIR="/var/www/ss-hr-consultancy"
FRONTEND_DIR="$APP_DIR/frontend"

echo "🔄 Updating Frontend..."

cd $FRONTEND_DIR

# Pull latest changes (if using git)
# git pull origin main

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build frontend
echo "Building frontend..."
npm run build

# Copy built files
echo "Copying build to nginx directory..."
sudo rm -rf /var/www/ss-hr-consultancy/frontend/dist/*
sudo cp -r dist/* /var/www/ss-hr-consultancy/frontend/dist/

# Set permissions
sudo chown -R www-data:www-data /var/www/ss-hr-consultancy/frontend/dist

# Reload Nginx
echo "Reloading Nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Frontend updated successfully!"

