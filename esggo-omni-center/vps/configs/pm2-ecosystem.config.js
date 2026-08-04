module.exports = {
  apps: [
    {
      name: 'esggo-core',
      script: '/var/www/esggo/vps/scripts/start-esggo-core.sh',
      cwd: '/var/www/esggo',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_TELEMETRY_DISABLED: '1'
      },
      max_memory_restart: '1G',
      error_file: '/var/log/pm2/esggo-error.log',
      out_file: '/var/log/pm2/esggo-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      autorestart: true,
      restart_delay: 3000,
      max_restarts: 10,
      merge_logs: true
    },
    {
      name: 'omniagent-gateway',
      script: 'node',
      args: 'omni-server.mjs',
      cwd: '/var/www/esggo/vps',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 8642,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
        GATEWAY_API_KEY: process.env.GATEWAY_API_KEY || ''
      },
      max_memory_restart: '512M',
      error_file: '/var/log/pm2/omni-error.log',
      out_file: '/var/log/pm2/omni-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      autorestart: true,
      restart_delay: 5000,
      max_restarts: 5,
      merge_logs: true
    }
  ]
}