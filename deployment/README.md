# SS HR Consultancy - EC2 Deployment Guide

This guide will help you deploy both the frontend and backend of SS HR Consultancy on a single EC2 instance using Nginx and PM2.

## 📋 Prerequisites

- EC2 instance running Ubuntu 20.04 or later
- Domain name pointing to your EC2 instance (optional, but recommended)
- SSH access to your EC2 instance
- Your repository cloned or ready to deploy

## 🚀 Quick Start

### Step 1: Initial EC2 Setup

1. SSH into your EC2 instance:
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

2. Clone this repository or upload the deployment files:
   ```bash
   git clone your-repo-url /var/www/ss-hr-consultancy
   # OR upload files manually
   ```

3. Run the setup script:
   ```bash
   cd /var/www/ss-hr-consultancy
   chmod +x deployment/scripts/setup-ec2.sh
   ./deployment/scripts/setup-ec2.sh
   ```

### Step 2: Configure Environment Variables

1. **Backend Environment Variables:**
   ```bash
   cd /var/www/ss-hr-consultancy/backend
   cp .env.example .env
   nano .env
   ```
   
   Required variables:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `MONGODB_URI=your-mongodb-connection-string`
   - `JWT_SECRET=your-jwt-secret`
   - `FRONTEND_PRODUCTION_URL=https://your-domain.com`
   - `FRONTEND_PRODUCTION_URL_TWO=https://www.your-domain.com` (if using www)
   - AWS S3 credentials (if using S3)
   - Redis credentials (if using Redis)
   - Other required environment variables

2. **Frontend Environment Variables:**
   - Update API base URL in your frontend code if needed
   - The frontend will use `/api` which will be proxied to the backend

### Step 3: Configure Nginx

1. Copy the Nginx configuration:
   ```bash
   sudo cp deployment/nginx/ss-hr-consultancy.conf /etc/nginx/sites-available/ss-hr-consultancy
   ```

2. Edit the configuration:
   ```bash
   sudo nano /etc/nginx/sites-available/ss-hr-consultancy
   ```
   
   Replace `your-domain.com` with your actual domain name.

3. Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/ss-hr-consultancy /etc/nginx/sites-enabled/
   sudo rm /etc/nginx/sites-enabled/default  # Remove default site
   ```

4. Test and reload Nginx:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Step 4: Deploy the Application

Run the deployment script:
```bash
chmod +x deployment/scripts/deploy.sh
./deployment/scripts/deploy.sh
```

This will:
- Install dependencies for both frontend and backend
- Build the backend (TypeScript → JavaScript)
- Build the frontend (React → Static files)
- Start the backend with PM2
- Copy frontend files to Nginx directory
- Reload Nginx

### Step 5: Set Up SSL (Optional but Recommended)

1. Make sure your domain points to your EC2 instance
2. Run the SSL setup script:
   ```bash
   chmod +x deployment/scripts/setup-ssl.sh
   ./deployment/scripts/setup-ssl.sh your-domain.com your-email@example.com
   ```

## 🔄 Updating the Application

### Update Backend Only:
```bash
./deployment/scripts/update-backend.sh
```

### Update Frontend Only:
```bash
./deployment/scripts/update-frontend.sh
```

### Update Both:
```bash
./deployment/scripts/deploy.sh
```

## 📊 Monitoring

### Check Backend Status:
```bash
pm2 status
pm2 logs ss-hr-backend
pm2 monit
```

### Check Nginx Status:
```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Check Application Logs:
```bash
# Backend logs
pm2 logs ss-hr-backend

# Application logs
tail -f /var/www/ss-hr-consultancy/logs/backend-combined.log
```

## 🛠️ Troubleshooting

### Backend not starting:
1. Check PM2 logs: `pm2 logs ss-hr-backend`
2. Check if port 5000 is in use: `sudo netstat -tulpn | grep 5000`
3. Verify environment variables are set correctly
4. Check MongoDB connection

### Frontend not loading:
1. Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
2. Verify build files exist: `ls -la /var/www/ss-hr-consultancy/frontend/dist/`
3. Check Nginx configuration: `sudo nginx -t`
4. Verify file permissions: `sudo chown -R www-data:www-data /var/www/ss-hr-consultancy/frontend/dist`

### API requests failing:
1. Check if backend is running: `pm2 status`
2. Check backend logs: `pm2 logs ss-hr-backend`
3. Verify Nginx proxy configuration
4. Check CORS settings in backend

### Socket.io not working:
1. Verify WebSocket proxy configuration in Nginx
2. Check backend Socket.io configuration
3. Check firewall settings (ports 80, 443, and WebSocket connections)

## 🔒 Security Best Practices

1. **Firewall Configuration:**
   ```bash
   sudo ufw allow 22/tcp    # SSH
   sudo ufw allow 80/tcp    # HTTP
   sudo ufw allow 443/tcp   # HTTPS
   sudo ufw enable
   ```

2. **Keep System Updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **Regular Backups:**
   - Set up automated backups for your database
   - Backup application files regularly

4. **Monitor Logs:**
   - Set up log rotation
   - Monitor for suspicious activity

## 📁 Directory Structure

```
/var/www/ss-hr-consultancy/
├── backend/              # Backend source code
│   ├── dist/            # Compiled JavaScript
│   ├── src/             # TypeScript source
│   ├── .env             # Environment variables
│   └── package.json
├── frontend/            # Frontend source code
│   ├── dist/            # Built static files (served by Nginx)
│   ├── src/             # React source
│   └── package.json
├── logs/                # Application logs
│   ├── backend-error.log
│   ├── backend-out.log
│   └── backend-combined.log
└── deployment/          # Deployment scripts and configs
    ├── nginx/
    ├── pm2/
    └── scripts/
```

## 🔄 PM2 Commands

```bash
# Start application
pm2 start ecosystem.config.js

# Stop application
pm2 stop ss-hr-backend

# Restart application
pm2 restart ss-hr-backend

# View logs
pm2 logs ss-hr-backend

# Monitor
pm2 monit

# Save PM2 configuration
pm2 save

# Delete from PM2
pm2 delete ss-hr-backend
```

## 📝 Notes

- The backend runs on port 5000 (internal, not exposed)
- Nginx serves the frontend on port 80/443
- Nginx proxies `/api/*` requests to the backend
- Socket.io connections are proxied through Nginx
- PM2 ensures the backend restarts automatically if it crashes
- SSL certificates auto-renew via Certbot

## 🆘 Support

If you encounter issues:
1. Check the logs first
2. Verify all environment variables are set
3. Ensure all dependencies are installed
4. Check firewall and security group settings
5. Verify domain DNS settings

---

**Happy Deploying! 🚀**

