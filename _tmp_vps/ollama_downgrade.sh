#!/usr/bin/env bash
# VPS Ollama 降級腳本：gemma4:e4b (9.6GB) -> gemma4:e2b (~1.5GB)
# 適用：VPS 161.118.248.180 (Oracle ARM, 2.8G 可用 RAM)
# 用法：ssh 登入後 bash /tmp/ollama_downgrade.sh

set -e
echo "=== [1/5] 停止 Ollama (釋放記憶體) ==="
pkill -9 ollama 2>/dev/null || true
sleep 3

echo "=== [2/5] 移除過大模型 gemma4:e4b ==="
ollama rm gemma4:e4b 2>&1 || echo "（模型可能已不存在）"

echo "=== [3/5] 重新啟動 Ollama serve ==="
nohup ollama serve > /tmp/ollama_vps.log 2>&1 &
disown
sleep 5
curl -s -m5 -o /dev/null -w "ollama_http=%{http_code}\n" http://localhost:11434/ || echo "OLLAMA_NOT_UP"

echo "=== [4/5] 拉取 gemma4:e2b (小模型, 適合 VPS) ==="
ollama pull gemma4:e2b 2>&1 | tail -5

echo "=== [5/5] 更新 HUB .env + 重啟 ==="
ENV=/opt/esggo/apps/omni-blueprint-hub/.env
sed -i 's/^OLLAMA_MODEL=.*/OLLAMA_MODEL=gemma4:e2b/' "$ENV" 2>/dev/null || echo "OLLAMA_MODEL=gemma4:e2b" >> "$ENV"
cd /opt/esggo/apps/omni-blueprint-hub && pm2 restart omni-blueprint-hub 2>&1 | tail -2
sleep 4

echo "=== 驗證 /generate 端點 ==="
curl -s -m60 -X POST http://localhost:8787/generate \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"用一句話說明 ESG 永續發展的重要性","max_tokens":128}' | head -c 600
echo ""
echo "DONE"
