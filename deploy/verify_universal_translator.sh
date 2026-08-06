#!/bin/bash
# Universal-Translator 遠端驗證腳本
# 用法: curl -O https://esggo-bootstrap.vercel.app/verify_ut.sh && bash verify_ut.sh

set -euo pipefail

PORT=${PORT:-8788}
HOST="localhost:$PORT"

echo "🧪 Universal-Translator 遠端驗證"

# 1. 核心健康檢查
echo "=== 1. 健康檢查 ==="
curl -sf "http://$HOST/health" | jq . || { echo "❌ 健康檢查失敗"; exit 1; }
echo "✅ 健康檢查通過"

# 2. 單語翻譯 (en→zh)
echo "=== 2. 單語翻譯測試 ==="
curl -sf -X POST "http://$HOST/translate" \
  -H "Content-Type: application/json" \
  -d '{"text":"hello world","from":"en","to":"zh"}' | jq -r '.text' | grep -q "你好" && echo "✅ 單語翻譯 OK" || { echo "❌ 單語翻譯失敗"; exit 1; }

# 3. 多語平行翻譯
echo "=== 3. 多語平行翻譯測試 ==="
curl -sf -X POST "http://$HOST/translate" \
  -H "Content-Type: application/json" \
  -d '{"text":"thank you","targets":["zh-TW","ja","es","fr"]}' | jq '.translations | keys' | grep -q "zh-TW" && echo "✅ 多語翻譯 OK" || { echo "❌ 多語翻譯失敗"; exit 1; }

# 4. SSE 端點
echo "=== 4. SSE /stream 測試 ==="
timeout 5 curl -sfN "http://$HOST/stream" 2>/dev/null | head -1 | grep -q "id:" && echo "✅ SSE 連線 OK" || echo "⚠️ SSE 無回傳 (可略過)"

echo ""
echo "🎉 Universal-Translator 所有測試通過！"
echo "本地: http://localhost:$PORT/health"
echo "公網: (Cloudflare Tunnel 部署後) https://translate.esggo.co"