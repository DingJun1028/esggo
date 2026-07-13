#!/usr/bin/env bash
# esggo-core 啟動腳本 — source .env 後啟動 Next.js (確保 OMNI_* env 注入)
set -a
source /var/www/esggo/.env
set +a
cd /var/www/esggo
exec node node_modules/next/dist/bin/next start -p 3000 -H 127.0.0.1
