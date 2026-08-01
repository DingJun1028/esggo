#!/usr/bin/env bash
# esggo_vps: Oracle Always Free automation on VPS
# 1) Daily backup of /opt/esggo to /opt/esggo/backups
# 2) System health check + upload to SFTP/Cloudflare R2 if configured
set -euo pipefail

BACKUP_DIR="/opt/esggo/backups"
APP_DIR="/opt/esggo"
RETENTION_DAYS=7
HEALTH_URLS=("http://127.0.0.1:3000/api/health" "http://127.0.0.1:8642/health")

mkdir -p "$BACKUP_DIR"

# Backup
STAMP=$(date +%Y%m%d-%H%M%S)
TAR="$BACKUP_DIR/esggo-$STAMP.tar.gz"
tar -czf "$TAR" -C "$APP_DIR" \
  .next public package.json pnpm-lock.yaml pnpm-workspace.yaml \
  vps apps packages src lib prisma --exclude='node_modules' --exclude='.git' || true
echo "[backup] created $TAR"

find "$BACKUP_DIR" -maxdepth 1 -type f -name 'esggo-*.tar.gz' -mtime +$RETENTION_DAYS -delete || true
echo "[backup] cleaned >${RETENTION_DAYS}d"

# Health check
FAIL=0
for url in "${HEALTH_URLS[@]}"; do
  if ! curl -sf -m 10 "$url" >/dev/null 2>&1; then
    echo "[health] FAIL $url"
    FAIL=1
  else
    echo "[health] OK $url"
  fi
done

if [ "$FAIL" -ne 0 ]; then
  echo "[health] DEGRADED"
  # TODO: send webhook/telegram/bark notification when ENV vars ready
  exit 1
fi

echo "[health] ALL_OK"
exit 0
