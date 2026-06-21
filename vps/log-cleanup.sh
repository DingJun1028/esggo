#!/usr/bin/env bash
set -Eeuo pipefail

# ESGGO VPS Log Rotation & Cleanup Script
# Usage: sudo ./vps/log-cleanup.sh

LOG_DIR="/var/log/esggo"
MAX_LOG_SIZE="100M"
KEEP_DAYS=7

log() { echo "==> [Log] $1"; }

# Create log directory if missing
mkdir -p "$LOG_DIR"

# Rotate PM2 logs
log "Rotating PM2 logs..."
pm2 reloadLogs 2>/dev/null || true

# Rotate large application logs
log "Rotating large application logs..."
find /var/www/esggo/logs -name "*.log" -type f -size +${MAX_LOG_SIZE} -exec bash -c '
    for f; do
        mv "$f" "${f}.old"
        gzip -9 "${f}.old" 2>/dev/null || true
        touch "$f"
    done
' bash {} + 2>/dev/null || true

# Remove old rotated logs
log "Removing old rotated logs..."
find "$LOG_DIR" -name "*.log.old.gz" -mtime +${KEEP_DAYS} -delete 2>/dev/null || true
find /var/www/esggo/logs -name "*.log.old.gz" -mtime +${KEEP_DAYS} -delete 2>/dev/null || true

# Clean archived deployments
log "Cleaning old deployment archives..."
find /var/www/esggo -name "backup-*.tar.gz" -type f -mtime +${KEEP_DAYS} -delete 2>/dev/null || true

# Clean tmp files
log "Cleaning tmp files..."
rm -rf /tmp/esggo-* 2>/dev/null || true

# Show disk usage
log "Current log disk usage:"
du -sh "$LOG_DIR" 2>/dev/null || true
du -sh /var/www/esggo/logs 2>/dev/null || true

log "Log cleanup completed."