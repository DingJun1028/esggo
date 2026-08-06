set +e
echo "=== all pm2 processes ==="
pm2 list 2>&1 | head -20
echo "=== listening ports (3000/3001/80/443) ==="
ss -tlnp 2>/dev/null | grep -E ":3000|:3001|:80|:443" | head
echo "=== node/next processes ==="
ps aux 2>/dev/null | grep -iE "next|nuxt|node" | grep -v grep | grep -v "omni-server" | head
echo "=== firebase apphosting config? ==="
ls -la apphosting.yaml 2>/dev/null && cat apphosting.yaml 2>/dev/null | head -20
echo "=== any supabase/DATABASE_URL in root .env? ==="
grep -h "DATABASE_URL\|SUPABASE\|FIREBASE" /var/www/esggo/.env 2>/dev/null | head