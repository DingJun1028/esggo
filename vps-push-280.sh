set +e
cd /var/www/esggo
echo "--- copy existing db to gateway location (preserve old data) ---"
cp prisma/dev.db apps/gateway/dev.db 2>/dev/null || echo "no source db, will create fresh"
echo "--- db push schema -> apps/gateway/dev.db (gateway's actual DB) ---"
DATABASE_URL="file:./apps/gateway/dev.db" pnpm prisma db push --skip-generate 2>&1 | tail -12
echo "--- restart gateway ---"
pm2 restart omniagent-gateway 2>&1 | tail -2
sleep 2
pm2 status omniagent-gateway 2>&1 | tail -3