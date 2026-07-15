set +e
cd /var/www/esggo
echo "=== migrations dir ==="
ls -la prisma/migrations/ 2>&1 | head
echo "=== migration_lock ==="
cat prisma/migrations/migration_lock.toml 2>&1
echo "=== gateway .env DATABASE_URL ==="
grep DATABASE_URL apps/gateway/.env 2>/dev/null
echo "=== possible dev.db locations ==="
ls -la apps/gateway/dev.db /var/www/esggo/dev.db /var/www/esggo/prisma/dev.db 2>/dev/null
echo "=== pm2 gateway cwd ==="
pm2 describe omniagent-gateway 2>/dev/null | grep -i "cwd\|script" | head