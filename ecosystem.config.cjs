module.exports = {
  apps: [
    {
      name: 'esggo-core',
      cwd: 'C:/Project/esggo',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      node_args: '-r dotenv/config',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,      // 崩潰時自動重啟（永久運行）
      watch: false,           // 生產環境關閉 watch
      max_memory_restart: '1G', // 若單一進程記憶體超過 1GB 則自動重啟
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_development: {
        NODE_ENV: 'development',
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/esggo-error.log',
      out_file: './logs/esggo-out.log',
      merge_logs: true,
    },
    {
      name: 'omni-gateway',
      cwd: 'C:/Project/esggo',
      script: 'node',
      args: '--import tsx server.ts',
      node_args: '-r dotenv/config',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/omni-gateway-error.log',
      out_file: './logs/omni-gateway-out.log',
      merge_logs: true,
    },
    // 若未來需要獨立的純背景情報 Agent Worker，可於下方解除註解並設定
    /*
    {
      name: 'esggo-owl-worker',
      script: 'npm',
      args: 'run worker:owl',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
      }
    }
    */
  ],
};
