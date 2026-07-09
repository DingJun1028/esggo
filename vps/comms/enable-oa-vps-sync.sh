#!/usr/bin/env bash
# ============================================================
# OA_VPS 雙向同步啟動腳本 — 在 VPS (OCI Console) 執行
# 授權：用戶授予「萬能代理」自行開防火牆並打通雙向同步
# 作用：起 relay-server (0.0.0.0:9999) + 開 ufw 9999 + 跑 vps-agent 輪詢
# 安全：TOKEN 從 env 讀 (ESGGO_RELAY_TOKEN)，缺失 fail-fast
# ============================================================
set -euo pipefail

# 憑證：必須從 .env.secrets 或當前 shell 取得，不硬編
if [ -f /var/www/esggo/.env.secrets ]; then
  set -a; source /var/www/esggo/.env.secrets; set +a
fi
: "${ESGGO_RELAY_TOKEN:?需要 ESGGO_RELAY_TOKEN (export 或 source vps/.env.secrets)}"

echo "===== 1. 開防火牆 (ufw 9999) ====="
ufw allow 9999/tcp || true
ufw reload || true
ufw status verbose | grep 9999 || echo "(9999 rule set)"

echo "===== 2. 起 relay-server (0.0.0.0:9999, 背景常駐) ====="
cd /var/www/esggo/vps/comms
pkill -f "relay-server.py" 2>/dev/null || true
nohup env ESGGO_RELAY_TOKEN="$ESGGO_RELAY_TOKEN" ESGGO_RELAY_HOST=0.0.0.0 ESGGO_RELAY_PORT=9999 python3 relay-server.py > /var/log/esggo-relay.log 2>&1 &
echo "relay_pid=$!"

echo "===== 3. 健康檢查 relay ====="
sleep 2
curl -s --max-time 5 "http://127.0.0.1:9999/status" -H "X-Auth-Token: $ESGGO_RELAY_TOKEN"; echo

echo "===== 4. 起 vps-agent (輪詢 relay /cmd, 回 /result = 雙向同步) ====="
if [ -x /opt/esggo/vps-agent.sh ]; then
  pkill -f "bash /opt/esggo/vps-agent.sh" 2>/dev/null || true
  nohup bash /opt/esggo/vps-agent.sh 127.0.0.1 9999 "$ESGGO_RELAY_TOKEN" > /var/log/vps-agent.log 2>&1 &
  echo "agent_pid=$!"
else
  echo "[!] /opt/esggo/vps-agent.sh 不存在 — 請先跑 console 引導腳本生成它，再重跑本步驟"
fi

echo ""
echo "OA_VPS 雙向同步樞紐已啟動。本機可用："
echo "  RELAY_URL=http://100.108.241.29:9999 bash vps/comms/relay-cli.sh status"
echo "  RELAY_URL=http://100.108.241.29:9999 bash vps/comms/relay-cli.sh cmd 'whoami'"
