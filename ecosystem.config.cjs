module.exports = {
  apps: [
    {
      name: 'esggo-core',
      cwd: '/var/www/esggo',
      script: 'pnpm',
      args: 'run start',
      env: { NODE_ENV: 'production', PORT: 3000, HOSTNAME: '127.0.0.1', NEXT_TELEMETRY_DISABLED: '1' },
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '1G',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: 'logs/error.log',
      out_file: 'logs/out.log',
      merge_logs: true,
      autorestart: true,
      restart_delay: 3000,
      max_restarts: 10,
    },
    {
      name: 'omniagent-gateway',
      cwd: '/var/www/esggo/apps/gateway',
      script: 'omni-server.mjs',
      interpreter: 'node',
      env: { NODE_ENV: 'production', PORT: '8642' },
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '512M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: 'logs/gateway-error.log',
      out_file: 'logs/gateway-out.log',
      merge_logs: true,
      autorestart: true,
      restart_delay: 5000,
      max_restarts: 5,
    },
    {
      name: 'universal-translator',
      cwd: '/var/www/esggo/apps/universal-translator',
      script: 'server.mjs',
      interpreter: 'node',
      env: { NODE_ENV: 'production', PORT: '8788', STT_PORT: '8791' },
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '512M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: 'logs/ut-error.log',
      out_file: 'logs/ut-out.log',
      merge_logs: true,
      autorestart: true,
      restart_delay: 3000,
      max_restarts: 5,
    },
    {
      name: 'stt-whisper',
      cwd: '/var/www/esggo/apps/stt',
      script: 'server.py',
      interpreter: '/var/www/esggo/apps/stt/.venv/bin/python3',
      env: { NODE_ENV: 'production', STT_PORT: '8791', WHISPER_MODEL: 'base', WHISPER_DEVICE: 'cpu', WHISPER_COMPUTE: 'int8' },
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '2G',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: 'logs/stt-error.log',
      out_file: 'logs/stt-out.log',
      merge_logs: true,
      autorestart: true,
      restart_delay: 5000,
      max_restarts: 5,
    },
    {
      name: 'deerflow',
      cwd: '/opt/deer-flow',
      script: '/var/www/esggo/vps-deploy/deerflow-watchdog.sh',
      interpreter: 'bash',
      env: { NODE_ENV: 'production' },
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '256M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/var/www/esggo/logs/deerflow-error.log',
      out_file: '/var/www/esggo/logs/deerflow-out.log',
      merge_logs: true,
      autorestart: true,
      restart_delay: 10000,
      max_restarts: 10,
    },
    // ── ftg-journey-server（2026-09-28 重新加入）─────────────────────────
    // 2026-09-27 移除的三項前置條件，至 2026-09-28 已全部滿足：
    //   (1) 部署管線已能建立部署目錄 —— deploy-oracle.yml 的 ftg 段落
    //       會 cp server.js / package.json 到 /var/www/ftg-journey-server
    //       並在 pm2 kill 之前完成（否則 PM2 啟動時檔案仍不存在）。
    //   (2) FTG_JWT_SECRET 已在 GitHub secrets 且 workflow 經 /tmp/ftg_jwt
    //       以 stdin 注入並 export。2026-09-28 診斷更正：舊註解稱
    //       「56 個 secret 中無此兩項」已過時，FTG_JWT_SECRET 現已存在。
    //   (3) server.js 已內建 loadDotEnv()，同目錄 .env 可被讀取。
    //
    // 為何仍需要第 (3) 項：workflow 走 export + --update-env 的環境變數
    // 路徑，理論上已足夠。但 VPS 上的 /var/www/ftg-journey-server/.env
    // 是本機維運手動維護的真實設定來源；沒有 loadDotEnv，該檔形同虛設，
    // 且任何不經 workflow 的手動重啟（如 pm2 restart）都會讓服務因
    // JWT_SECRET 缺失而 crash-loop —— 這正是 2026-09-28 502 事故的成因。
    //
    // PORT 一律以 8787 為準，與 nginx proxy_pass 及 workflow 健康檢查一致。
    // 舊的 apps/ftg-journey-server/ecosystem.config.cjs 寫 8792，與上述
    // 兩者矛盾；該檔不由任何 workflow 執行（GitHub Actions 不執行巢狀
    // 於子目錄的 workflow），但為避免日後誤用造成「部署綠、服務起在
    // 錯誤埠」這種要等下一次部署才會發現的分歧，該檔已同步為 8787。
    {
      name: 'ftg-journey-server',
      cwd: '/var/www/ftg-journey-server',
      script: 'server.js',
      interpreter: 'node',
      instances: 1,
      exec_mode: 'fork',
      env: { NODE_ENV: 'production', PORT: '8787' },
      max_memory_restart: '256M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/var/www/esggo/logs/ftg-journey-error.log',
      out_file: '/var/www/esggo/logs/ftg-journey-out.log',
      merge_logs: true,
      autorestart: true,
      restart_delay: 5000,
      max_restarts: 5,
    },
  ],
};
