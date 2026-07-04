module.exports = {
  apps: [
    {
      name: 'esggo-core',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/esggo',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      max_memory_restart: '1G',
      error_file: '/var/log/pm2/esggo-error.log',
      out_file: '/var/log/pm2/esggo-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'omni-gateway',
      script: '/var/www/esggo/omni-server-secure.mjs',
      cwd: '/var/www/esggo',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 8642
      },
      max_memory_restart: '512M'
    }
  ]
}
