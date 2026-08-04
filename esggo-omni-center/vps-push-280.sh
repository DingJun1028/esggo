#!/usr/bin/env bash
# VPS schema 推送腳本 — 僅同步 DB schema 到 esggo-core（不重建 .next）
# 用於 schema 變更但無須整輪 build 的輕量場景
set +e
cd /var/www/esggo
echo "--- ensure schema applied to esggo-core DB (root prisma/dev.db) ---"
pnpm prisma migrate deploy 2>&1 | tail -8
echo "--- restart esggo-core to pick up client change ---"
pm2 restart esggo-core 2>&1 | tail -2
pm2 status esggo-core 2>&1 | tail -3
