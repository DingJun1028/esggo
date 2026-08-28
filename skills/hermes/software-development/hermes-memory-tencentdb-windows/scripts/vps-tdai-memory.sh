#!/usr/bin/env bash
# vps-tdai-memory.sh — TencentDB Memory Gateway standalone on VPS（A 路徑合併一鍵腳本）
# 2026-08-01 建立。用途：記憶 gateway 跑在 VPS（Linux，官方 bash 工具鏈），
# Windows Hermes 用 v2 provider（TDAI_MEMORY_*）經 Cloudflare Tunnel 連入；
# 同機 Ollama Gemma4 E4B 為「私有 LLM 備援」，主要引擎仍建議 Groq 免費 API。
# 前置：root/sudo、docker。Oracle A1 縮水(2/12)後 RAM < 8GB 自動跳過本地 LLM。
# 用法：bash vps-tdai-memory.sh            # LLM 走 Groq（需先 export TDAI_LLM_API_KEY）
#       LLM_MODE=local bash vps-tdai-memory.sh   # 本地 Gemma4 E4B（RAM>=8GB）
# log：$HOME/vps-tdai-memory.log
set -uo pipefail
LOG="$HOME/vps-tdai-memory.log"
exec > >(tee -a "$LOG") 2>&1
echo "=== vps-tdai-memory $(date -Iseconds) ==="

# ---------- 1/7 資源盤點 ----------
echo "[1/7] 資源盤點"
free -h; echo; df -h / | tail -1; echo "CPU: $(nproc)"
command -v docker >/dev/null || { echo "!! docker 未安裝"; exit 1; }
RAM_GB=$(free -g | awk '/Mem:/{print $2}')

# ---------- 2/7 RAM 決策 ----------
if [ "$RAM_GB" -lt 8 ]; then
  echo "[2/7] RAM ${RAM_GB}GB < 8GB → 本地 LLM 出局（Oracle A1 縮水 2/12），強制 Groq"
  LLM_MODE=groq
else
  LLM_MODE=${LLM_MODE:-local}
  echo "[2/7] RAM ${RAM_GB}GB 充足 → LLM_MODE=$LLM_MODE"
fi

# ---------- 3/7 （可選）Ollama Gemma4 E4B：綁 127.0.0.1:11434 ----------
if [ "$LLM_MODE" = local ]; then
  echo "[3/7] 啟動 Ollama（僅綁 127.0.0.1）"
  docker rm -f ollama >/dev/null 2>&1 || true
  docker run -d --name ollama --restart unless-stopped -v ollama:/root/.ollama -p 127.0.0.1:11434:11434 ollama/ollama
  echo "  拉取 gemma4:e4b（--moe 選配 gemma4:26b-a4b，RAM>=16GB 才考慮）"
  docker exec ollama ollama pull gemma4:e4b || { echo "  !! pull 失敗：docker exec ollama ollama search gemma4 查 tag，或 HF GGUF 匯入"; }
  for i in $(seq 1 30); do curl -sf http://127.0.0.1:11434/v1/models >/dev/null 2>&1 && break; sleep 2; done
  curl -sf http://127.0.0.1:11434/v1/chat/completions -H 'Content-Type: application/json' \
    -d '{"model":"gemma4:e4b","messages":[{"role":"user","content":"ping"}],"max_tokens":8}' \
    >/dev/null && echo "  ✅ 推理驗證通過" || echo "  ⚠️ 推理驗證失敗（看上面錯誤）"
  ss -tlnp 2>/dev/null | grep 11434 | grep -q 127.0.0.1 && echo "  ✅ 僅綁 127.0.0.1"
  export TDAI_LLM_BASE_URL="http://127.0.0.1:11434/v1"
  export TDAI_LLM_MODEL="gemma4:e4b"
  export TDAI_LLM_API_KEY="local"
else
  echo "[3/7] 略過本地 LLM（Groq 模式）"
  export TDAI_LLM_BASE_URL="${TDAI_LLM_BASE_URL:-https://api.groq.com/openai/v1}"
  export TDAI_LLM_MODEL="${TDAI_LLM_MODEL:-openai/gpt-oss-20b}"
  [ -n "${TDAI_LLM_API_KEY:-}" ] || echo "  ⚠️ TDAI_LLM_API_KEY 未設定（Groq key: console.groq.com 免費）"
fi

# ---------- 4/7 安裝 memory-tencentdb（官方 bash 工具鏈，standalone） ----------
echo "[4/7] 安裝 memory-tencentdb"
mkdir -p ~/.memory-tencentdb
if [ ! -d ~/.memory-tencentdb/tdai-memory-openclaw-plugin/src/gateway ]; then
  cd ~/.memory-tencentdb
  rm -rf tmp-tdai && mkdir tmp-tdai && cd tmp-tdai
  npm init -y --silent
  npm install @tencentdb-agent-memory/memory-tencentdb@latest --omit=dev || \
    { echo "  !! npm 失敗 → 設 npm config set registry https://registry.npmmirror.com 重試"; exit 1; }
  cp -r node_modules/@tencentdb-agent-memory/memory-tencentdb ~/.memory-tencentdb/tdai-memory-openclaw-plugin
  cd ~/.memory-tencentdb/tdai-memory-openclaw-plugin && npm install --omit=dev && npm install tsx
  rm -rf ~/.memory-tencentdb/tmp-tdai
else
  echo "  已存在，跳過安裝"
fi

# ---------- 5/7 Gateway Bearer + 啟動 ----------
echo "[5/7] Gateway 鑑權 + 啟動"
export TDAI_GATEWAY_API_KEY="${TDAI_GATEWAY_API_KEY:-$(openssl rand -hex 16)}"
export TDAI_DATA_DIR="${TDAI_DATA_DIR:-$HOME/.memory-tencentdb/memory-tdai}"
mkdir -p "$TDAI_DATA_DIR"
# 調校檔（0.3.6+ 容量治理）
cat > "$TDAI_DATA_DIR/tdai-gateway.json" <<'JSON'
{ "timezone": "+08:00", "recall": { "strategy": "hybrid", "maxResults": 5,
  "maxCharsPerMemory": 1500, "maxTotalRecallChars": 6000 }, "bm25": { "language": "zh" } }
JSON
cd ~/.memory-tencentdb/tdai-memory-openclaw-plugin
nohup node --import tsx/esm src/gateway/server.ts >> "$TDAI_DATA_DIR/gateway.log" 2>&1 &
echo "  Gateway PID $!（key=${TDAI_GATEWAY_API_KEY:0:6}…${TDAI_GATEWAY_API_KEY: -4} 已設定；完整值見下方第 7 節唯一明文輸出）"
for i in $(seq 1 30); do curl -sf http://127.0.0.1:8420/health >/dev/null 2>&1 && break; sleep 1; done
curl -s http://127.0.0.1:8420/health || { echo "  ⚠️ /health 失敗 → 看 $TDAI_DATA_DIR/gateway.log"; }

# ---------- 6/7 安全確認 ----------
echo "[6/7] 埠綁定確認（應只見 127.0.0.1:8420 與 11434）"
ss -tlnp 2>/dev/null | grep -E '8420|11434' || true
if ss -tln 2>/dev/null | grep -q ':8420'; then
  if ss -tln 2>/dev/null | grep ':8420' | grep -q '127.0.0.1:8420'; then
    echo "  ✅ Gateway 僅綁 127.0.0.1"
  else
    echo "  ⚠️ Gateway 綁了非 localhost 位址 → 立即限流（勿裸奔）:"
    echo "     sudo ufw allow from <你的固定IP>/32 to any port 8420"
    echo "     sudo ufw deny 8420   # 其餘全擋；或查 server.ts 是否支援監聽位址 env"
  fi
fi

# ---------- 7/7 輸出 Windows Hermes 接線（v2 provider） ----------
echo
echo "=== Windows Hermes 接線（v2 provider，經 Cloudflare Tunnel） ==="
echo "  TDAI_MEMORY_ENDPOINT = https://<你的tunnel網域>"
echo "  TDAI_MEMORY_API_KEY   = $TDAI_GATEWAY_API_KEY"
echo "  TDAI_MEMORY_SERVICE_ID = default"
echo "  config.yaml: memory: { provider: memory_tencentdb_v2 }"
echo "  Tunnel：cloudflared tunnel route 到 http://127.0.0.1:8420 + Access policy 限自己（勿用 VPS 裸 IP）"
echo "=== 完成。log: $LOG ==="
