set +e
cd /var/www/esggo
git fetch origin -q
git reset --hard origin/main 2>&1 | tail -1
echo "--- prisma migrate deploy (prod DB) ---"
pnpm prisma migrate deploy 2>&1 | tail -8
echo "--- client generate ---"
pnpm prisma generate 2>&1 | tail -2
echo "--- gateway env check ---"
grep -E "LOCAL_GEMMA_SERVER_URL|LOCAL_GEMMA_MODEL|LOCAL_GEMMA_VISION_MODEL|DATABASE_URL" apps/gateway/.env 2>/dev/null
echo "--- restart gateway ---"
pm2 restart omniagent-gateway 2>&1 | tail -2
pm2 status omniagent-gateway 2>&1 | tail -3