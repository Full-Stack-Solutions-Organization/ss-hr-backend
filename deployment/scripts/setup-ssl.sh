#!/bin/bash

# SS HR Consultancy - SSL Setup Script
# This script sets up SSL using Let's Encrypt

set -e

echo "🔒 Setting up SSL with Let's Encrypt..."

# Check if domain is provided
if [ -z "$1" ]; then
    echo "❌ Error: Domain name required"
    echo "Usage: ./setup-ssl.sh your-domain.com"
    exit 1
fi

DOMAIN=$1
EMAIL=${2:-"admin@${DOMAIN}"}

# Install Certbot if not already installed
if ! command -v certbot &> /dev/null; then
    echo "📦 Installing Certbot..."
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
fi

# Obtain SSL certificate
echo "🔐 Obtaining SSL certificate for $DOMAIN..."
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL

# Test auto-renewal
echo "🧪 Testing certificate renewal..."
sudo certbot renew --dry-run

# Set up auto-renewal cron job (if not already set)
if ! crontab -l | grep -q "certbot renew"; then
    echo "⏰ Setting up auto-renewal cron job..."
    (crontab -l 2>/dev/null; echo "0 0,12 * * * certbot renew --quiet") | crontab -
fi

echo "✅ SSL setup completed!"
echo ""
echo "Your site is now available at: https://$DOMAIN"
echo "Certificate will auto-renew before expiration"

