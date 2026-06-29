module.exports = {
  apps: [
    {
      name: 'esggo-core',
      script: 'node',
      args: './node_modules/next/dist/bin/next start -p 3000',
      cwd: 'C:\\var\\www\\esggo',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DATABASE_URL: 'file:./dev.db',
      },
      // Health check: ping /api/health every 30s
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
      watch: false,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
    {
      name: 'omniagent-gateway',
      script: 'node',
      args: './src/services/scheduler/crawler-scheduler-boot.js',
      cwd: 'C:\\var\\www\\esggo',
      env: {
        NODE_ENV: 'production',
        PORT: 8643,
        DATABASE_URL: 'file:./dev.db',
      },
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
      watch: false,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
