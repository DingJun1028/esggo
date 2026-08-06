#!/usr/bin/env bash
# scripts/sync-bidirectional.sh — 雙向同步腳本
# 用法:
#   ./sync-bidirectional.sh push          # Local → VPS (部署)
#   ./sync-bidirectional.sh pull          # VPS → Local (資料同步)
#   ./sync-bidirectional.sh backup        # VPS 備份
#   ./sync-bidirectional.sh restore FILE  # 回滾 VPS 到指定備份
set -Eeuo pipefail

# ─── 設定（可透過環境變數覆寫） ───
VPS_HOST="${VPS_HOST:-root@161.118.248.180}"
APP_DIR="${APP_DIR:-/var/www/esggo}"
LOCAL_DIR="${LOCAL_DIR:-$(cd "$(dirname "$0")/.." && pwd)}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/esggo}"
RSYNC_OPTS="-rlptz --no-o --no-g --delete --human-readable --stats"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

log()  { echo -e "\033[36m==>\033[0m $1"; }
ok()   { echo -e "\033[32m  OK\033[0m $1"; }
fail() { echo -e "\033[31m  FAIL\033[0m $1"; }

# ─── 排除規則 ───
EXCLUDES=(
  --exclude='.git'
  --exclude='node_modules'
  --exclude='.next'
  --exclude='logs'
  --exclude='*.db'
  --exclude='*.db-journal'
  --exclude='*.log'
  --exclude='.env*'
  --exclude='tmp_*.xlsx'
  --exclude='install.log'
  --exclude='*.bak'
  --exclude='.crush/'
  --exclude='.pnpm-store'
  --exclude='packages/*/node_modules'
  --exclude='apps/*/node_modules'
)

# ─── Push: Local → VPS ───
cmd_push() {
  log "PUSH: Local → VPS (${VPS_HOST}:${APP_DIR})"

  # 1. 編碼檢查
  log "Check encoding..."
  node "${LOCAL_DIR}/scripts/encoding-check.mjs" || { fail "Encoding check failed"; exit 1; }
  ok "Encoding clean"

  # 2. Build 驗證（可選，跳過用 --no-build）
  if [ "${SKIP_BUILD:-false}" != "true" ]; then
    log "Build verification..."
    cd "${LOCAL_DIR}"
    npx next build 2>&1 | tail -5
  fi
  ok "Build passed"

  # 3. Rsync 到 VPS
  log "Syncing to VPS..."
  rsync ${RSYNC_OPTS} "${EXCLUDES[@]}" \
    "${LOCAL_DIR}/" "${VPS_HOST}:${APP_DIR}/"
  ok "Sync complete"

  # 4. VPS 後續處理
  log "Post-deploy on VPS..."
  ssh "${VPS_HOST}" bash -s <<-REMOTE
    set -e
    cd "${APP_DIR}"
    echo "  -> Installing dependencies"
    pnpm install --frozen-lockfile --no-optional 2>/dev/null || pnpm install

    echo "  -> Generating Prisma client"
    npx prisma generate 2>/dev/null || true

    echo "  -> Restarting services"
    pm2 reload ecosystem.config.cjs 2>/dev/null || pm2 start ecosystem.config.cjs
    pm2 save

    sleep 3
    echo "  -> Health check"
    curl -sf http://127.0.0.1:3000/api/health && ok "Next.js OK" || fail "Next.js FAIL"
    curl -sf http://127.0.0.1:8642/status && ok "Gateway OK" || fail "Gateway FAIL"
REMOTE
  ok "Deploy complete"
}

# ─── Pull: VPS → Local ───
cmd_pull() {
  log "PULL: VPS → Local (data sync)"

  # 拉回資料庫備份
  log "Pulling database..."
  rsync -rlptz "${VPS_HOST}:${APP_DIR}/prisma/dev.db" "${LOCAL_DIR}/prisma/dev.db" 2>/dev/null && ok "DB synced" || ok "No DB to sync"

  # 拉回環境設定（不蓋 local）
  log "Pulling .env (if remote is newer)..."
  rsync -rlptzu "${VPS_HOST}:${APP_DIR}/.env" "${LOCAL_DIR}/.env.production" 2>/dev/null && ok ".env saved as .env.production" || true

  # 拉回 logs（tail only）
  log "Pulling recent logs..."
  ssh "${VPS_HOST}" "tail -100 ${APP_DIR}/logs/out.log 2>/dev/null" > "${LOCAL_DIR}/logs/remote-out.log" 2>/dev/null && ok "Logs pulled" || ok "No logs"

  ok "Pull complete"
}

# ─── Backup ───
cmd_backup() {
  local name="esggo_${TIMESTAMP}"
  log "BACKUP: VPS → ${BACKUP_DIR}/${name}"
  ssh "${VPS_HOST}" "mkdir -p ${BACKUP_DIR}/${name}"

  rsync ${RSYNC_OPTS} \
    --include='.next' --include='package.json' --include='pnpm-lock.yaml' --include='ecosystem.config.cjs' \
    --include='prisma/dev.db' --include='apps/**' --include='packages/**' \
    --exclude='*' \
    "${VPS_HOST}:${APP_DIR}/" "${BACKUP_DIR}/${name}/"
  ok "Backup saved: ${BACKUP_DIR}/${name}"

  # 清理舊備份（保留 7 天）
  ssh "${VPS_HOST}" "find ${BACKUP_DIR} -maxdepth 1 -type d -mtime +7 -exec rm -rf {} + 2>/dev/null" || true
  ok "Old backups cleaned"
}

# ─── Restore ───
cmd_restore() {
  local backup_name="${1:-}"
  if [ -z "${backup_name}" ]; then
    log "Available backups:"
    ssh "${VPS_HOST}" "ls -1 ${BACKUP_DIR}/" 2>/dev/null || echo "  (none)"
    echo "Usage: $0 restore BACKUP_NAME"
    exit 1
  fi
  log "RESTORE: ${BACKUP_DIR}/${backup_name} → VPS"
  ssh "${VPS_HOST}" bash -s -- "${backup_name}" <<-REMOTE
    set -e
    BACKUP="${BACKUP_DIR}/\$1"
    if [ ! -d "\$BACKUP" ]; then echo "Backup not found"; exit 1; fi
    cd "${APP_DIR}"
    pm2 stop ecosystem.config.cjs 2>/dev/null || true
    cp "\$BACKUP/.next" .next -r 2>/dev/null || true
    cp "\$BACKUP/prisma/dev.db" prisma/dev.db 2>/dev/null || true
    pm2 start ecosystem.config.cjs 2>/dev/null || true
    echo "Restore complete"
REMOTE
  ok "Restore done"
}

# ─── Main ───
case "${1:-help}" in
  push)     SKIP_BUILD="${2:-false}" cmd_push ;;
  pull)     cmd_pull ;;
  backup)   cmd_backup ;;
  restore)  cmd_restore "${2:-}" ;;
  *)
    echo "ESGGO Bidirectional Sync"
    echo ""
    echo "Usage:"
    echo "  $0 push [--no-build]    Local → VPS (部署)"
    echo "  $0 pull                 VPS → Local (資料同步)"
    echo "  $0 backup               VPS 備份"
    echo "  $0 restore <name>       VPS 回滾"
    echo ""
    echo "Env variables:"
    echo "  VPS_HOST=root@IP  (default: ${VPS_HOST})"
    echo "  APP_DIR=/path     (default: ${APP_DIR})"
    echo "  SKIP_BUILD=true   (跳過本地 build)"
    ;;
esac
