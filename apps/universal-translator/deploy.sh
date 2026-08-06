#!/usr/bin/env bash
# ============================================================
# 萬能即時翻譯 — 一鍵部署 (本機 → VPS, pm2 常駐)
# 流程: 語法檢查 → rsync → npm install → pm2 重啟 → 健康檢查
# 用法: bash deploy.sh [--skip-sync]
# ============================================================
set -euo pipefail
cd "$(dirname "$0")"

HOST="${DEPLOY_HOST:-ubuntu@161.118.248.180}"
RPATH="${DEPLOY_PATH:-/opt/esggo/apps/universal-translator}"
KEY="${DEPLOY_KEY:-$HOME/.ssh/esggo_original}"
SSH="ssh -o ConnectTimeout=15 -i $KEY"
SCP="scp -o ConnectTimeout=15 -i $KEY"
PORT="${PORT:-8788}"

FILES="server.mjs translate.mjs package.json .env.example public/*.html"

echo "◆ [1/4] 語法檢查"
node --check server.mjs && node --check translate.mjs && echo "  ✓ 通過"

if [ "${1:-}" != "--skip-sync" ]; then
  echo "◆ [2/4] 同步至 $HOST:$RPATH"
  $SSH "$HOST" "mkdir -p $RPATH"
  # shellcheck disable=SC2086
  $SCP $FILES "$HOST:$RPATH/"
  $SSH "$HOST" "cd $RPATH && npm install --omit=dev >/dev/null 2>&1 && echo '  ✓ deps installed'"
fi

echo "◆ [3/4] pm2 重啟"
$SSH "$HOST" "cd $RPATH && pm2 describe universal-translator >/dev/null 2>&1 && pm2 restart universal-translator --update-env || pm2 start server.mjs --name universal-translator && pm2 save >/dev/null"
sleep 3

echo "◆ [4/4] 健康檢查 (localhost:$PORT)"
$SSH "$HOST" "curl -sf http://localhost:$PORT/health | head -c 200; echo"
echo ""
echo "══════════════════════════════════════════"
echo "✅ 萬能即時翻譯部署完成"
echo "   本地: http://localhost:$PORT/health"
echo "   公網: 經 Cloudflare Tunnel (translate.esggo.co) — 見 README"
echo "════════════════════════════════════════"
