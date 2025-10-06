// PM2 ecosystem configuration for production deployment
module.exports = {
  apps: [
    {
      name: 'skipaman-backend',
      script: 'dist/server.js',
      instances: 'max', // Use all CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      // Auto-restart settings
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Health monitoring
      health_check_grace_period: 3000,
      
      // Environment variables (override with actual production values)
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 5000,
        MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/skipaman_store',
        JWT_SECRET: process.env.JWT_SECRET || 'your-production-jwt-secret-here',
        JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-production-refresh-secret-here',
        JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '30d',
        EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
        EMAIL_PORT: process.env.EMAIL_PORT || 587,
        EMAIL_USER: process.env.EMAIL_USER || '',
        EMAIL_PASS: process.env.EMAIL_PASS || '',
        EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@skipamanstore.com',
        FRONTEND_URL: process.env.FRONTEND_URL || 'https://yourdomain.com',
        ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@skipamanstore.com',
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123456',
        MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 5242880,
        UPLOAD_PATH: process.env.UPLOAD_PATH || 'uploads/',
        RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS || 900000,
        RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
        SOCKET_CORS_ORIGIN: process.env.SOCKET_CORS_ORIGIN || 'https://yourdomain.com'
      }
    }
  ],

  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server-ip',
      ref: 'origin/main',
      repo: 'https://github.com/yourusername/skipamanstore.git',
      path: '/var/www/skipaman-backend',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};









