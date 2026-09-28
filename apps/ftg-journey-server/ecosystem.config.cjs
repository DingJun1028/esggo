module.exports = {
  apps: [
    {
      name: 'ftg-journey-server',
      script: './server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        // 2026-09-28: 由 8792 改為 8787。
        // 本檔原先寫 8792，但 nginx proxy_pass、deploy-oracle.yml 的健康檢查
        // 與 deploy 腳本一律使用 8787 —— 三者對 8787 的共識是唯一可信來源。
        // 保留 8792 會造成「pm2 顯示 online、8787 卻無人監聽 → 對外 502」
        // 這種要等下一次部署才會浮現的分歧。
        //
        // 注意：真正執行於 VPS 的是 repo 根目錄的 ecosystem.config.cjs
        // （deploy-oracle.yml 以 `pm2 start ecosystem.config.cjs` 啟動它）。
        // 本檔不由任何 workflow 執行，僅供本機開發與手動啟動參考；
        // 兩者的 ftg 條目應保持一致。
        PORT: 8787,
        NODE_ENV: 'production',
        // 金鑰一律由環境變數注入，不再寫在檔中（舊版把真實金鑰明文 commit 進
        // git 歷史，等同外洩）。啟動前請先備妥 JWT_SECRET 環境變數或 .env。
        JWT_SECRET: process.env.JWT_SECRET || '',
        DB_PATH: '/var/www/esggo/apps/ftg-journey-server/ftg-journey.db',
        UPLOAD_DIR: '/var/www/ftg-journey-web/uploads/',
        GOOGLE_CLIENT_ID: '',
        ADMIN_EMAILS: 'dingjunhong1028@gmail.com',
        STAFF_DOMAINS: '@esggo.co,@ftg.com.tw'
      },
      max_restarts: 10,
      restart_delay: 5000,
      max_memory_restart: '256M'
    }
  ]
};
