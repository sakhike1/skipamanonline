# 🚀 Skipaman Store - Production Deployment Guide

This guide will help you deploy your Skipaman Store backend to a live server where it runs automatically 24/7.

## 📋 Prerequisites

### 1. Server Requirements
- **VPS/Cloud Server**: DigitalOcean, AWS, Google Cloud, or similar
- **Operating System**: Ubuntu 20.04+ or CentOS 8+
- **RAM**: Minimum 2GB (4GB recommended)
- **Storage**: Minimum 20GB
- **Node.js**: Version 18+ installed
- **MongoDB**: Local installation or MongoDB Atlas cloud database

### 2. Domain & SSL
- Domain name pointing to your server
- SSL certificate (Let's Encrypt recommended)

## 🛠️ Deployment Steps

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB (if using local database)
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx (for reverse proxy)
sudo apt install nginx -y
```

### Step 2: Upload Your Code

```bash
# Clone your repository
git clone https://github.com/yourusername/skipamanstore.git
cd skipamanstore/backend

# Install dependencies
npm install

# Build the application
npm run build
```

### Step 3: Environment Configuration

Create production environment file:

```bash
# Create production .env file
nano .env.production
```

Add these variables (replace with your actual values):

```env
NODE_ENV=production
PORT=5000

# Database (use MongoDB Atlas for production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skipaman_store?retryWrites=true&w=majority

# JWT Secrets (generate strong secrets)
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-here
JWT_REFRESH_EXPIRE=30d

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# Frontend URL
FRONTEND_URL=https://yourdomain.com

# Admin Configuration
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-admin-password

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads/

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Socket.io
SOCKET_CORS_ORIGIN=https://yourdomain.com
```

### Step 4: Start with PM2

```bash
# Create logs directory
mkdir -p logs

# Start the application with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Step 5: Nginx Configuration

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/skipaman
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration (replace with your certificate paths)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # API routes
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.io
    location /socket.io/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Serve static files (uploads)
    location /uploads/ {
        alias /var/www/skipaman-backend/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Frontend (if serving from same server)
    location / {
        root /var/www/skipaman-frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/skipaman /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔧 Management Commands

### PM2 Commands
```bash
# Check status
pm2 status

# View logs
pm2 logs skipaman-backend

# Restart application
pm2 restart skipaman-backend

# Stop application
pm2 stop skipaman-backend

# Reload application (zero-downtime)
pm2 reload skipaman-backend

# Monitor
pm2 monit
```

### Update Deployment
```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Build application
npm run build

# Reload with zero downtime
pm2 reload ecosystem.config.js --env production
```

## 📊 Monitoring & Maintenance

### 1. Health Monitoring
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Monitor server resources (CPU, RAM, Disk)
- Set up log rotation

### 2. Backup Strategy
```bash
# MongoDB backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/skipaman_store" --out=/backups/mongodb_$DATE
```

### 3. Security
- Keep system updated
- Use strong passwords
- Enable firewall
- Regular security audits

## 🚨 Troubleshooting

### Common Issues

1. **Server won't start**
   ```bash
   pm2 logs skipaman-backend
   ```

2. **Database connection issues**
   - Check MongoDB URI
   - Verify network connectivity
   - Check firewall settings

3. **High memory usage**
   ```bash
   pm2 restart skipaman-backend
   ```

4. **SSL certificate issues**
   ```bash
   sudo certbot renew --dry-run
   ```

## 📈 Scaling

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy)
- Multiple server instances
- Database clustering

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Use caching (Redis)

## 🔒 Security Checklist

- [ ] Strong JWT secrets
- [ ] HTTPS enabled
- [ ] Firewall configured
- [ ] Regular updates
- [ ] Database access restricted
- [ ] File upload restrictions
- [ ] Rate limiting enabled
- [ ] Security headers configured

---

## 📞 Support

For deployment issues:
1. Check PM2 logs: `pm2 logs`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify environment variables
4. Test database connectivity

Your Skipaman Store backend will now run 24/7 and handle user registrations, logins, and orders automatically! 🎉









