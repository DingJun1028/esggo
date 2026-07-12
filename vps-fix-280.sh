set +e
cd /var/www/esggo
echo "--- db push to Next.js db (cwd=/var/www/esggo -> ./dev.db) ---"
DATABASE_URL="file:./dev.db" pnpm prisma db push --skip-generate 2>&1 | tail -4
echo "--- add LOCAL_GEMMA_* to root .env (Next reads this) ---"
grep -q LOCAL_GEMMA_SERVER_URL .env || echo 'LOCAL_GEMMA_SERVER_URL=http://127.0.0.1:11434' >> .env
grep -q LOCAL_GEMMA_MODEL .env || echo 'LOCAL_GEMMA_MODEL=hf.co/unsloth/gemma-4-E2B-it-GGUF:Q4_0' >> .env
grep -q LOCAL_GEMMA_VISION_MODEL .env || echo 'LOCAL_GEMMA_VISION_MODEL=gemma3:4b' >> .env
echo "--- restart Next.js (esggo-core) ---"
pm2 restart esggo-core 2>&1 | tail -1
sleep 4
echo "=== VERIFY ==="
echo "--- 1. sync-esg ---"
curl -s -X POST http://127.0.0.1:3000/api/tags/universal -H 'Content-Type: application/json' -d '{"action":"sync-esg"}' | head -c 200
echo ""
echo "--- 2. autoPair (local Gemma 4) ---"
curl -s -X POST http://127.0.0.1:3000/api/tags/pair -H 'Content-Type: application/json' -d '{"mode":"auto","entityType":"regulation","entityId":"t1","content":"本公司承諾 2030 年碳中和，減少溫室氣體排放。"}' | head -c 350
echo ""
echo "--- 3. list ---"
curl -s http://127.0.0.1:3000/api/tags/universal | head -c 350
echo ""