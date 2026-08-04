#!/usr/bin/env bash
# VPS 部署腳本 — Universal Tag (#280) 上線 esggo-core
# 實際服務 /api/tags/* 的是 esggo-core (Next.js, PORT 3000, cwd /var/www/esggo)
# 注意：Prisma client 被 bundle 進 .next，schema 變更後必須整輪 pnpm build
set +e
cd /var/www/esggo
git fetch origin -q
git reset --hard origin/main 2>&1 | tail -1
echo "--- prisma migrate deploy (root prisma/dev.db) ---"
pnpm prisma migrate deploy 2>&1 | tail -8
echo "--- client generate ---"
pnpm prisma generate 2>&1 | tail -2
echo "--- next build (prisma bundled into .next) ---"
pnpm build 2>&1 | tail -12
echo "--- restart esggo-core ---"
pm2 restart esggo-core 2>&1 | tail -2
pm2 status esggo-core 2>&1 | tail -3
