#!/usr/bin/env bash
# vps/backup.sh — ESGGO 全量備份腳本
# 用法:
#   bash backup.sh                    # 執行完整備份
#   bash backup.sh --db-only          # 僅備份資料庫
#   bash backup.sh --list             # 列出可用備份
#   bash backup.sh restore <name>     # 還原指定備份
#   bash backup.sh --cron             # 排程模式（自動清理舊備份）
#
# 保留策略（--cron 模式）:
#   Daily:   保留 7 天
#   Weekly:  保留 4 週
#   Monthly: 保留 3 個月
#
# 排程範例 (crontab):
#   0 3 * * * /bin/bash /var/www/esggo/vps/backup.sh --cron >> /var/log/esggo-backup.log 2>&1
#   0 3 * * 0 /bin/bash /var/www/esggo/vps/backup.sh --cron --weekly >> /var/log/esggo-backup.log 2>&1
#   0 3 1 * * /bin/bash /var/www/esggo/vps/backup.sh --cron --monthly >> /var/log/esggo-backup.log 2>&1

set -Eeuo pipefail

# ─── 設定 ────────────────────────────────────────────────────────────────────
APP_DIR="${APP_DIR:-/var/www/esggo}"
BACKUP_ROOT="${BACKUP_ROOT:-/var/backups/esggo}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATE_ONLY=$(date +%Y%m%d)
RETENTION_DAILY=7
RETENTION_WEEKLY=4
RETENTION_MONTHLY=3
LOG_FILE="${LOG_FILE:-/var/log/esggo-backup.log}"

# ─── 顏色 ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()   { echo -e "${CYAN}[$(date '+%H:%M:%S')]${NC} $1"; }
ok()    { echo -e "  ${GREEN}✓${NC} $1"; }
warn()  { echo -e "  ${YELLOW}⚠${NC} $1"; }
fail()  { echo -e "  ${RED}✗${NC} $1"; }

# ─── 路徑 ────────────────────────────────────────────────────────────────────
BACKUP_DIR="${BACKUP_ROOT}/${DATE_ONLY}"
LATEST_LINK="${BACKUP_ROOT}/latest"
DB_BACKUP="${BACKUP_DIR}/db"
ENV_BACKUP="${BACKUP_DIR}/env"
ETC_BACKUP="${BACKUP_DIR}/etc"
LOG_BACKUP="${BACKUP_DIR}/logs"
DOCKER_BACKUP="${BACKUP_DIR}/docker"

# ─── 初始化 ────────────────────────────────────────────────────────────────────
init_backup_dir() {
  local dir="$1"
  mkdir -p "$dir"
}

cleanup_old_backups() {
  local mode="${1:-daily}"
  local keep=0
  case "$mode" in
    daily)   keep=$RETENTION_DAILY   ;;
    weekly)  keep=$RETENTION_WEEKLY  ;;
    monthly) keep=$RETENTION_MONTHLY ;;
  esac

  log "清理舊備份 (${mode}, 保留 ${keep} 份)..."
  local count=0
  while IFS= read -r dir; do
    count=$((count + 1))
    if [ "$count" -gt "$keep" ]; then
      rm -rf "$dir"
      ok "已刪除: $(basename "$dir")"
    fi
  done < <(find "$BACKUP_ROOT" -maxdepth 1 -type d -name '20*' | sort -r)
  [ "$count" -le "$keep" ] && ok "無需清理 (共 ${count} 份)"
}

# ─── 備份函數 ────────────────────────────────────────────────────────────────

backup_database() {
  log "備份資料庫..."
  local db_src="${APP_DIR}/prisma/dev.db"
  local db_journal="${APP_DIR}/prisma/dev.db-journal"

  if [ ! -f "$db_src" ]; then
    warn "資料庫檔案不存在: $db_src"
    return
  fi

  # 用 sqlite3 備份（確保一致性，避免寫入中損毀）
  if command -v sqlite3 &>/dev/null; then
    sqlite3 "$db_src" ".backup '${DB_BACKUP}/dev.db'"
    ok "SQLite .backup 完成"
  else
    cp -p "$db_src" "${DB_BACKUP}/dev.db"
    ok "直接複製 (sqlite3 未安裝)"
  fi

  # 複製 journal（如存在）
  [ -f "$db_journal" ] && cp -p "$db_journal" "${DB_BACKUP}/dev.db-journal"

  # 備份 Prisma schema（僅參考用）
  cp -p "${APP_DIR}/prisma/schema.prisma" "${DB_BACKUP}/schema.prisma" 2>/dev/null || true

  # 檢查完整性
  if command -v sqlite3 &>/dev/null; then
    if sqlite3 "${DB_BACKUP}/dev.db" "PRAGMA integrity_check;" 2>/dev/null | grep -q '^ok$'; then
      ok "資料庫完整性檢查通過"
    else
      warn "資料庫完整性檢查失敗！"
    fi
  fi

  local db_size
  db_size=$(stat -c%s "${DB_BACKUP}/dev.db" 2>/dev/null || stat -f%z "${DB_BACKUP}/dev.db" 2>/dev/null || echo 0)
  ok "資料庫大小: $(numfmt --to=iec "$db_size" 2>/dev/null || echo "${db_size} bytes")"
}

backup_env() {
  log "備份環境變數與設定..."

  # .env 檔案
  [ -f "${APP_DIR}/.env" ] && cp -p "${APP_DIR}/.env" "${ENV_BACKUP}/.env"
  [ -f "${APP_DIR}/.env.local" ] && cp -p "${APP_DIR}/.env.local" "${ENV_BACKUP}/.env.local"
  [ -f "${APP_DIR}/.env.production" ] && cp -p "${APP_DIR}/.env.production" "${ENV_BACKUP}/.env.production"

  # PM2 設定
  [ -f "${APP_DIR}/ecosystem.config.cjs" ] && cp -p "${APP_DIR}/ecosystem.config.cjs" "${ENV_BACKUP}/ecosystem.config.cjs"

  # PM2 dump（當前行程列表）
  if command -v pm2 &>/dev/null; then
    pm2 dump 2>/dev/null || true
    [ -f /root/.pm2/dump.pm2 ] && cp -p /root/.pm2/dump.pm2 "${ENV_BACKUP}/pm2.dump.pm2"
    ok "PM2 dump 已備份"
  fi

  ok "環境設定備份完成"
}

backup_configs() {
  log "備份系統設定..."

  # Nginx 設定
  if [ -d /etc/nginx ]; then
    tar czf "${ETC_BACKUP}/nginx.tar.gz" -C /etc nginx/ 2>/dev/null || \
    tar czf "${ETC_BACKUP}/nginx.tar.gz" /etc/nginx/ 2>/dev/null
    ok "Nginx 設定備份完成"
  fi

  # SSL 憑證
  local ssl_found=0
  if [ -d /etc/letsencrypt ]; then
    tar czf "${ETC_BACKUP}/letsencrypt.tar.gz" \
      --exclude='*/archive/*' \
      --exclude='*/private/*' \
      -C / etc/letsencrypt/ 2>/dev/null || \
    tar czf "${ETC_BACKUP}/letsencrypt.tar.gz" \
      --exclude='*/archive/*' \
      /etc/letsencrypt/ 2>/dev/null || true
    if [ -f "${ETC_BACKUP}/letsencrypt.tar.gz" ] && [ -s "${ETC_BACKUP}/letsencrypt.tar.gz" ]; then
      ssl_found=1
      ok "SSL 憑證備份完成"
    fi
  fi

  # SSH 設定（authorized_keys、known_hosts）
  if [ -f /root/.ssh/authorized_keys ]; then
    cp -p /root/.ssh/authorized_keys "${ETC_BACKUP}/authorized_keys" 2>/dev/null || true
  fi
  if [ -f /root/.ssh/known_hosts ]; then
    cp -p /root/.ssh/known_hosts "${ETC_BACKUP}/known_hosts" 2>/dev/null || true
  fi

  # 系統 crontab
  crontab -l > "${ETC_BACKUP}/crontab.txt" 2>/dev/null || true
  ok "系統設定備份完成"
}

backup_logs() {
  log "備份近期日誌..."

  # PM2 日誌（最近 5000 行）
  mkdir -p "${LOG_BACKUP}/pm2"
  for f in "${APP_DIR}/logs"/*.log "${APP_DIR}/logs"/*.err; do
    [ -f "$f" ] && tail -5000 "$f" > "${LOG_BACKUP}/pm2/$(basename "$f")" 2>/dev/null
  done

  # Nginx 日誌（壓縮，不佔空間）
  if [ -d /var/log/nginx ]; then
    for f in /var/log/nginx/*.log; do
      [ -f "$f" ] && cp "$f" "${LOG_BACKUP}/$(basename "$f")" 2>/dev/null || true
    done
  fi

  ok "日誌備份完成"
}

backup_docker_volumes() {
  log "備份 Docker Volumes..."

  # 檢查 docker
  if ! command -v docker &>/dev/null; then
    warn "Docker 未安裝，跳過 Volume 備份"
    return
  fi

  local volumes
  volumes=$(docker volume ls -q --filter name=esggo 2>/dev/null || true)
  if [ -z "$volumes" ]; then
    warn "無 esggo 相關 Docker Volume"
    return
  fi

  for vol in $volumes; do
    log "  備份 volume: $vol"
    docker run --rm \
      -v "${vol}:/source:ro" \
      -v "${DOCKER_BACKUP}:/backup" \
      alpine:3.20 \
      tar czf "/backup/${vol}.tar.gz" -C /source . 2>/dev/null || true
  done
  ok "Docker volumes 備份完成"
}

create_symlink() {
  # 更新 latest 符號連結
  rm -f "$LATEST_LINK"
  ln -s "$BACKUP_DIR" "$LATEST_LINK"
  ok "latest → ${BACKUP_DIR}"
}

print_summary() {
  local total_size
  total_size=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)
  echo ""
  echo "═══════════════════════════════════════════"
  echo "  備份完成"
  echo "  位置: ${BACKUP_DIR}"
  echo "  大小: ${total_size}"
  echo "  時間: $(date '+%Y-%m-%d %H:%M:%S')"
  echo "  內容:"
  echo "    ├─ DB:    $(find "${DB_BACKUP}" -type f 2>/dev/null | wc -l) 檔案"
  echo "    ├─ Env:   $(find "${ENV_BACKUP}" -type f 2>/dev/null | wc -l) 檔案"
  echo "    ├─ Etc:   $(find "${ETC_BACKUP}" -type f 2>/dev/null | wc -l) 檔案"
  echo "    ├─ Logs:  $(find "${LOG_BACKUP}" -type f 2>/dev/null | wc -l) 檔案"
  echo "    └─ Vol:   $(find "${DOCKER_BACKUP}" -type f 2>/dev/null | wc -l) 檔案"
  echo "═══════════════════════════════════════════"
}

# ─── 還原函數（選擇性） ──────────────────────────────────────────────────────

cmd_restore() {
  local backup_name="${1:-}"
  if [ -z "$backup_name" ]; then
    echo "用法: $0 restore <備份名稱>"
    echo "可用備份:"
    ls -1 "$BACKUP_ROOT" 2>/dev/null | grep '^20' || echo "  (無備份)"
    exit 1
  fi

  local restore_from="${BACKUP_ROOT}/${backup_name}"
  if [ ! -d "$restore_from" ]; then
    echo "錯誤: 備份 ${backup_name} 不存在"
    exit 1
  fi

  echo "⚠️  正在還原備份: ${backup_name}"
  echo "    來源: ${restore_from}"
  echo ""
  echo "    將還原以下項目:"
  [ -f "${restore_from}/db/dev.db" ] && echo "    - 資料庫 (prisma/dev.db)"
  [ -f "${restore_from}/env/.env" ] && echo "    - 環境變數 (.env)"
  [ -f "${restore_from}/etc/nginx.tar.gz" ] && echo "    - Nginx 設定"
  [ -f "${restore_from}/etc/letsencrypt.tar.gz" ] && echo "    - SSL 憑證"
  echo ""

  # 先停止服務
  echo "停止服務..."
  pm2 stop ecosystem.config.cjs 2>/dev/null || true
  sleep 2

  # 還原資料庫
  if [ -f "${restore_from}/db/dev.db" ]; then
    cp -p "${restore_from}/db/dev.db" "${APP_DIR}/prisma/dev.db"
    echo "  資料庫已還原"
  fi

  # 還原 .env
  if [ -f "${restore_from}/env/.env" ]; then
    cp -p "${restore_from}/env/.env" "${APP_DIR}/.env"
    echo "  .env 已還原"
  fi

  # 還原 Nginx
  if [ -f "${restore_from}/etc/nginx.tar.gz" ]; then
    tar xzf "${restore_from}/etc/nginx.tar.gz" -C / 2>/dev/null || \
    tar xzf "${restore_from}/etc/nginx.tar.gz" -C / etc/nginx/ 2>/dev/null
    echo "  Nginx 設定已還原"
  fi

  # 還原 SSL
  if [ -f "${restore_from}/etc/letsencrypt.tar.gz" ]; then
    tar xzf "${restore_from}/etc/letsencrypt.tar.gz" -C / 2>/dev/null || true
    echo "  SSL 憑證已還原"
  fi

  # 重啟服務
  echo "重啟服務..."
  nginx -t && nginx -s reload 2>/dev/null || echo "  Nginx reload 跳過"
  pm2 start ecosystem.config.cjs 2>/dev/null || true
  echo "✅ 還原完成"
}

# ─── 列表 ─────────────────────────────────────────────────────────────────────

cmd_list() {
  echo "═══ ESGGO 備份列表 ═══"
  echo ""

  local found=0
  while IFS= read -r dir; do
    local name
    name=$(basename "$dir")
    local size count db_size
    size=$(du -sh "$dir" 2>/dev/null | cut -f1)
    count=$(find "$dir" -type f 2>/dev/null | wc -l)
    db_size="N/A"
    if [ -f "${dir}/db/dev.db" ]; then
      db_size=$(stat -c%s "${dir}/db/dev.db" 2>/dev/null || stat -f%z "${dir}/db/dev.db" 2>/dev/null || echo "N/A")
      db_size=$(numfmt --to=iec "$db_size" 2>/dev/null || echo "$db_size")
    fi

    if [ -L "${BACKUP_ROOT}/latest" ] && [ "${dir}" = "$(readlink -f "${BACKUP_ROOT}/latest")" ]; then
      echo "  ▶ ${name}  ← latest    大小: ${size} 檔案: ${count} DB: ${db_size}"
    else
      echo "    ${name}              大小: ${size} 檔案: ${count} DB: ${db_size}"
    fi
    found=1
  done < <(find "$BACKUP_ROOT" -maxdepth 1 -type d -name '20*' | sort -r)

  [ "$found" -eq 0 ] && echo "  (無備份)"

  echo ""
  echo "使用: bash $0 restore <名稱> 來還原"
}

# ─── Main ─────────────────────────────────────────────────────────────────────

case "${1:-}" in
  --cron)
    init_backup_dir "$BACKUP_DIR"
    init_backup_dir "$DB_BACKUP"
    init_backup_dir "$ENV_BACKUP"
    init_backup_dir "$ETC_BACKUP"
    init_backup_dir "$LOG_BACKUP"
    init_backup_dir "$DOCKER_BACKUP"
    backup_database
    backup_env
    backup_configs
    backup_logs
    backup_docker_volumes
    create_symlink
    print_summary

    # 根據參數決定清理策略
    if [ "${2:-}" = "--weekly" ]; then
      cleanup_old_backups weekly
    elif [ "${2:-}" = "--monthly" ]; then
      cleanup_old_backups monthly
    else
      cleanup_old_backups daily
    fi
    ;;

  --db-only)
    init_backup_dir "$BACKUP_DIR"
    init_backup_dir "$DB_BACKUP"
    backup_database
    ;;

  restore)
    cmd_restore "${2:-}"
    ;;

  --list|-l)
    cmd_list
    ;;

  *)
    # 一般執行：備份 + 不清理
    init_backup_dir "$BACKUP_DIR"
    init_backup_dir "$DB_BACKUP"
    init_backup_dir "$ENV_BACKUP"
    init_backup_dir "$ETC_BACKUP"
    init_backup_dir "$LOG_BACKUP"
    init_backup_dir "$DOCKER_BACKUP"
    backup_database
    backup_env
    backup_configs
    backup_logs
    backup_docker_volumes
    create_symlink
    print_summary
    echo ""
    echo "提示: 使用 --cron 參數啟用自動清理"
    ;;
esac
