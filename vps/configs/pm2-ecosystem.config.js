module.exports = {
  apps: [
    {
      name: 'esggo-core',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/esggo',
      instances: 'max',  // Use all CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      max_memory_restart: '1G',
      error_file: '/var/log/pm2/esggo-error.log',
      out_file: '/var/log/pm2/esggo-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // High availability settings
      watch: false,
      ignore_watch: ['node_modules', 'logs', '.next'],
      kill_timeout: 10000,
      wait_ready: true,
      listen_timeout: 10000,
      // Graceful reload
      reload_signal: 'SIGUSR2',
      // Cluster worker settings
      instance_var: 'INSTANCE_ID',
      // Health check
      health_check_url: 'http://localhost:3000/api/health',
      health_check_grace_period: 3000,
      health_check_interval: 10000,
      health_check_retries: 3
    },
    {
      name: 'omni-gateway',
      script: '/var/www/esggo/omni-server-secure.mjs',
      cwd: '/var/www/esggo',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 8642
      },
      max_memory_restart: '512M',
      error_file: '/var/log/pm2/omni-error.log',
      out_file: '/var/log/pm2/omni-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // High availability
      wait_ready: true,
      listen_timeout: 10000,
      kill_timeout: 5000
    }
  ]
}