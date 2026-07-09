#!/bin/bash
# ============================================================
# ESGGO — 合併後 VPS 部署腳本 (standby, 待 OCI Browser SSH 貼上執行)
# 前置：PR #147 + #148 已 merge 到 main
# 安全：所有憑證從本機 $SECRETS (gitignored .env.secrets) source，不寫死
# ============================================================
set -euo pipefail

GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'
log(){ echo -e "${GREEN}[✓]${NC} $1"; }
warn(){ echo -e "${YELLOW}[!]${NC} $1"; }
err(){ echo -e "${RED}[✗]${NC} $1"; }

REPO=/var/www/esggo
SECRETS="$REPO/.env.secrets"          # 本機 gitignored 密鑰檔
cd "$REPO"

echo "===== 0. 前置檢查 ====="
# 憑證來源：優先 source 本機 secrets，缺失則從目前 shell env 繼承
if [ -f "$SECRETS" ]; then
  set -a; source "$SECRETS"; set +a
  log "已載入本機憑證: $SECRETS"
else
  warn "找不到 $SECRETS，將使用當前 shell 環境變數 (若不足請先 export)"
fi

# 必要憑證確認
: "${GATEWAY_API_KEY:?需要 GATEWAY_API_KEY (agent 授權用)}"
: "${MYSQL_HOST:?需要 MYSQL_HOST}"
: "${MYSQL_PASS:?需要 MYSQL_PASS}"
: "${ADB_PASS:?需要 ADB_PASS (Oracle ADB admin 密碼)}"
: "${ADB_SERVICE:?需要 ADB_SERVICE (TNS service name, e.g. dbname_high)}"

echo "===== 1. 拉取最新 main ====="
git fetch origin
git checkout main
git reset --hard origin/main
git log --oneline -1
log "main 已同步到 origin/main"

echo "===== 2. 前端 deps / build (如需要) ====="
if [ -d node_modules ]; then
  log "node_modules 存在，跳過 install"
else
  warn "node_modules 不存在，執行 pnpm install"
  corepack enable 2>/dev/null || true
  pnpm install --frozen-lockfile || npm install
fi

echo "===== 3. 部署 OmniDB schema ====="
# deploy-omnidb.sh 會自己讀取 MYSQL_*/ADB_*/WALLET_* 等 env
bash vps/deploy-omnidb.sh || warn "deploy-omnidb.sh 回傳非 0 (部分步驟可能需手動, 見上輸出)"

echo "===== 4. 重新載入 PM2 (含新 vps-agent) ====="
if command -v pm2 >/dev/null 2>&1; then
  pm2 reload vps/ecosystem.esggo.config.cjs || pm2 start vps/ecosystem.esggo.config.cjs
  sleep 3
  pm2 status
  log "PM2 已重載"
else
  err "pm2 未安裝，請先 npm i -g pm2"
fi

echo "===== 5. 健康檢查 ====="
GW=http://127.0.0.1:8642
TOKEN="$GATEWAY_API_KEY"
echo "-- /status --"
curl -s --max-time 5 "$GW/status" | head -c 400; echo
echo "-- /agents (需授權) --"
curl -s --max-time 5 -H "X-Omni-Token: $TOKEN" "$GW/agents" | head -c 400; echo
echo "-- relay 註冊 (vps-agent) --"
curl -s --max-time 5 -X POST "$GW/agent/register" \
  -H "Content-Type: application/json" -H "X-Omni-Token: $TOKEN" \
  -d '{"agentId":"vps-relay-'"$(hostname)"'","name":"VPS Relay Agent","host":"'"$(hostname)"'","channel":"relay","capabilities":["shell","relay"]}' | head -c 300; echo

echo ""
log "部署腳本執行完畢。請確認上方健康檢查輸出均為 200/正常 JSON。"
warn "若 OCI Functions (adb-wallet-fn) 需部署：cd vps/oci && bash deploy.sh (需先 export ADB_OCID/WALLET_PASSWORD/FN_APP/DB_USER/DB_PASSWORD)"
