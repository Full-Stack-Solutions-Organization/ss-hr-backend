module.exports = {
  apps: [
    {
      name: 'ss-hr-backend',
      script: 'dist/server.js',
      cwd: '/var/www/ss-hr-consultancy/backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      error_file: '/var/www/ss-hr-consultancy/logs/backend-error.log',
      out_file: '/var/www/ss-hr-consultancy/logs/backend-out.log',
      log_file: '/var/www/ss-hr-consultancy/logs/backend-combined.log',
      time: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      // Restart on file changes (optional, for development)
      // watch: ['dist'],
      // ignore_watch: ['node_modules', 'logs'],
    },
  ],
};

