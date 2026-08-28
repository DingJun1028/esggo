#!/usr/bin/env bash
# ============================================================
# 一鍵部署範本 — 本機 Node 服務 → VPS (pm2)
# 五階段: 語法檢查 → 本機煙霧測試 → 同步 → 遠端重啟 → 公網端對端驗證
# set -euo pipefail: 任一步失敗即中止，絕不在未驗證下宣稱成功
#
# 複製到專案根目錄，改 FILES / HOST / RPATH 即可用。
# 用法: bash deploy.sh  [--skip-local-test]
# ============================================================
set -euo pipefail
cd "$(dirname "$0")"

[ -f .env ] && { set -a; . ./.env; set +a; }

HOST="${DEPLOY_HOST:-ubuntu@1.2.3.4}"
RPATH="${DEPLOY_PATH:-/opt/app}"
KEY="${DEPLOY_KEY:-$HOME/.ssh/id_ed25519}"
PM2NAME="${DEPLOY_PM2_NAME:-my-app}"
BASE_PUB="${DEPLOY_PUBLIC_BASE:-https://example.com}"
LOCAL_PORT="${LOCAL_TEST_PORT:-8799}"
SSH="ssh -o ConnectTimeout=10 -i $KEY"

# 要同步的檔案（明列，不用 rsync 全目錄——避免把 .env / node_modules 推上去）
FILES="server.mjs lib.mjs _smoke-test.mjs ecosystem.config.cjs package.json index.html"

# ---- [1/5] 語法檢查 ----
echo "◆ [1/5] 語法檢查"
for f in $FILES; do
  case "$f" in
    *.mjs|*.js) node --check "$f" ;;
    *.json)     node -e "JSON.parse(require('fs').readFileSync('$f','utf8'))" ;;
  esac
done
echo "  ✓ 全部通過"

# ---- [2/5] 本機煙霧測試 ----
if [ "${1:-}" != "--skip-local-test" ]; then
  echo "◆ [2/5] 本機煙霧測試 (port $LOCAL_PORT)"

  # 埠佔用守衛：舊版殘留行程會讓測試打到錯誤目標並回報「假失敗」
  if curl -sf -m 2 "http://localhost:$LOCAL_PORT/healthz" >/dev/null 2>&1; then
    echo "  ✗ port $LOCAL_PORT 已被佔用（可能是舊版殘留行程）"
    echo "    Windows: powershell -NoProfile -Command \"Get-NetTCPConnection -LocalPort $LOCAL_PORT -State Listen | %{Stop-Process -Id \\\$_.OwningProcess -Force}\""
    echo "    Linux:   fuser -k $LOCAL_PORT/tcp"
    exit 1
  fi

  PORT=$LOCAL_PORT node server.mjs > /tmp/deploy-local.log 2>&1 &
  LOCAL_PID=$!
  trap 'kill $LOCAL_PID 2>/dev/null || true' EXIT

  for _ in $(seq 1 20); do
    curl -sf -m 2 "http://localhost:$LOCAL_PORT/healthz" >/dev/null && break
    sleep 1
  done

  # 確認起來的是「本次版本」而非殘留服務（healthz 必須含 version 欄位）
  if ! curl -sf -m 3 "http://localhost:$LOCAL_PORT/healthz" | grep -q '"version"'; then
    echo "  ✗ 本機服務未正常啟動，log:"; tail -20 /tmp/deploy-local.log; exit 1
  fi

  BASE="http://localhost:$LOCAL_PORT" node _smoke-test.mjs
  kill $LOCAL_PID 2>/dev/null || true
  trap - EXIT
  echo "  ✓ 本機測試通過"
else
  echo "◆ [2/5] 本機煙霧測試 — 已跳過"
fi

# ---- [3/5] 同步 ----
echo "◆ [3/5] 同步至 $HOST:$RPATH"
# shellcheck disable=SC2086
scp -i "$KEY" $FILES "$HOST:$RPATH/"
echo "  ✓ 同步完成"

# ---- [4/5] 遠端語法檢查 + pm2 重啟 ----
echo "◆ [4/5] VPS 語法檢查 + pm2 重啟"
$SSH "$HOST" "cd $RPATH && \
  node --check server.mjs && \
  mkdir -p logs && \
  (pm2 describe $PM2NAME >/dev/null 2>&1 && pm2 restart $PM2NAME --update-env || pm2 start ecosystem.config.cjs) >/dev/null && \
  pm2 save >/dev/null && sleep 4 && curl -sf localhost:8787/healthz | head -4"
echo "  ✓ 服務已重啟"

# ---- [5/5] 公網端對端驗證 ----
echo "◆ [5/5] 公網端對端驗證 ($BASE_PUB)"
$SSH "$HOST" "cd $RPATH && BASE=$BASE_PUB node _smoke-test.mjs"

echo ""
echo "════════════════════════════════════════"
echo "✅ 部署完成並通過端對端驗證"
echo "   $BASE_PUB/healthz"
echo "════════════════════════════════════════"
