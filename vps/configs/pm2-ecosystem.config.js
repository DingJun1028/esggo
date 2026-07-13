module.exports = {
  apps: [
    {
      name: 'esggo-core',
      script: 'pnpm',
      args: 'run start',
      cwd: '/var/www/esggo',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_TELEMETRY_DISABLED: '1',
        OMNI_DB_PWD: process.env.OMNI_DB_PWD || '',
        OMNI_TNS: process.env.OMNI_TNS || 'omniurag_high',
        OMNI_WALLET_DIR: process.env.OMNI_WALLET_DIR || '/root/.wallet',
        OMNI_WALLET_PWD: process.env.OMNI_WALLET_PWD || '',
        OMNI_PYTHON: process.env.OMNI_PYTHON || '',
        LOCAL_GEMMA_SERVER_URL: process.env.LOCAL_GEMMA_SERVER_URL || '',
        LOCAL_GEMMA_MODEL: process.env.LOCAL_GEMMA_MODEL || 'gemma3:4b',
        LOCAL_GEMMA_VISION_MODEL: process.env.LOCAL_GEMMA_VISION_MODEL || 'gemma3:4b'
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