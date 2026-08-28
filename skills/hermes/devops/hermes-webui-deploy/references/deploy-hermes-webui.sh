#!/usr/bin/env bash
# deploy-hermes-webui.sh — OA-Team VPS 部署 Hermes WebUI (無人值守)
# 用法: bash deploy-hermes-webui.sh
# 前提: 主機已裝 hermes-agent (which hermes → /opt/hermes-venv/bin/hermes)
set -euo pipefail
TS="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "[$TS] OA-Team 部署 Hermes WebUI 開始"

# 1. 確保倉庫存在
if [ ! -d "$HOME/hermes-webui" ]; then
  echo "[$TS] 克隆 hermes-webui ..."
  git clone --depth 1 https://github.com/nesquena/hermes-webui.git "$HOME/hermes-webui"
fi
cd "$HOME/hermes-webui"

# 2. 關鍵: 指向 hermes-agent 的 venv Python (否則 bootstrap 報 cannot-import-both)
#    找法: readlink -f $(which hermes)
if [ -z "${HERMES_WEBUI_PYTHON:-}" ]; then
  HERMES_WEBUI_PYTHON="$(readlink -f "$(which hermes)" 2>/dev/null || echo /opt/hermes-venv/bin/python)"
fi

# 3. 環境變數 (僅 loopback, 使用者經 SSH tunnel 存取)
export HERMES_WEBUI_PORT=8799          # 避開 8787 (常被 monitor-server 佔用)
export HERMES_WEBUI_HOST=127.0.0.1
export HERMES_WEBUI_AGENT_DIR="$HOME/.hermes/hermes-agent"
export HERMES_WEBUI_STATE_DIR="$HOME/.hermes/webui"
export HERMES_HOME="$HOME/.hermes"
export HERMES_WEBUI_PYTHON

# 安全提醒: 若對外暴露必須設 HERMES_WEBUI_PASSWORD
if [ -n "${HERMES_WEBUI_PASSWORD:-}" ]; then
  echo "[$TS] ⚠️  偵測到 HERMES_WEBUI_PASSWORD, 將對外暴露 (確保防火牆/僅信任網路)"
else
  echo "[$TS] ℹ️  僅 bind 127.0.0.1, 存取: ssh -N -L 8799:127.0.0.1:8799 esggo-vps 後開 http://localhost:8799"
fi

# 4. 啟動 (ctl.sh 後台 daemon)
chmod +x ctl.sh start.sh 2>/dev/null || true
if [ -f ctl.sh ]; then
  ./ctl.sh start
else
  HERMES_WEBUI_PORT=8799 HERMES_WEBUI_HOST=127.0.0.1 nohup "$HERMES_WEBUI_PYTHON" server.py > "$HOME/.hermes/webui.log" 2>&1 &
fi

# 5. 健康檢查 (重試 5 次, 每次 3 秒; ctl 啟動後 bootstrap 需 60-120s, 首次會慢)
for i in $(seq 1 5); do
  if curl -sf http://127.0.0.1:8799/health >/dev/null 2>&1; then
    echo "[$TS] ✅ WebUI 健康 (http://127.0.0.1:8799/health OK)"
    echo "[$TS] 本機瀏覽器存取: ssh -N -L 8799:127.0.0.1:8799 esggo-vps 後開 http://localhost:8799"
    exit 0
  fi
  echo "[$TS] 健康檢查 $i/5 失敗, 3 秒後重試..."
  sleep 3
done
echo "[$TS] ❌ 健康檢查失敗 (5/5), 檢查 $HOME/.hermes/webui.log"
tail -20 "$HOME/.hermes/webui.log" 2>/dev/null || true
exit 1
