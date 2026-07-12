set +e
cd /var/www/esggo
echo "--- gateway status ---"
pm2 status omniagent-gateway 2>&1 | grep -A1 "omniagent-gateway" | head -3
echo "--- 1. sync ESG tags ---"
curl -s -X POST http://127.0.0.1:3000/api/tags/universal -H 'Content-Type: application/json' -d '{"action":"sync-esg"}' 2>&1 | head -c 300
echo ""
echo "--- 2. autoPair via local Gemma 4 ---"
curl -s -X POST http://127.0.0.1:3000/api/tags/pair -H 'Content-Type: application/json' -d '{"mode":"auto","entityType":"regulation","entityId":"test-1","content":"本公司承諾 2030 年碳中和，減少溫室氣體排放。"}' 2>&1 | head -c 400
echo ""
echo "--- 3. list universal tags ---"
curl -s http://127.0.0.1:3000/api/tags/universal 2>&1 | head -c 400
echo ""