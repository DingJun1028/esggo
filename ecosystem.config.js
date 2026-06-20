module.exports = {
  apps: [
    {
      name: 'esggo-core',
      script: 'npm',
      args: 'start',
      instances: 'max',       // 使用所有可用的 CPU 核心（叢集模式）
      exec_mode: 'cluster',   // 叢集模式，支援負載平衡與零停機重啟
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
