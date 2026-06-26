# vps/log-cleanup.sh — 日誌輪換與清理
# 使用方式：ssh root@VPS "bash -s" < vps/log-cleanup.sh
# 排程：0 4 * * 0 /bin/bash /var/www/esggo/vps/log-cleanup.sh

set -euo pipefail

LOG_DIRS=(
    "/var/www/esggo/logs"
    "/var/log/nginx"
    "/var/log/pm2"
)

MAX_LOG_SIZE="100M"
MAX_LOG_AGE_DAYS=30
PM2_LOG_LINES=10000

echo "[$(date)] === Log Cleanup Start ==="

# 1. 輪換大型日誌
for dir in "${LOG_DIRS[@]}"; do
    [ -d "$dir" ] || continue
    for logfile in "$dir"/*.log; do
        [ -f "$logfile" ] || continue
        size=$(stat -f%z "$logfile" 2>/dev/null || stat -c%s "$logfile" 2>/dev/null || echo 0)
        max_bytes=$(numfmt --from=iec "$MAX_LOG_SIZE")
        if [ "$size" -gt "$max_bytes" ]; then
            rotated="${logfile}.$(date +%Y%m%d_%H%M%S).gz"
            gzip -c "$logfile" > "$rotated"
            > "$logfile"
            echo "  ROTATED: $logfile → $rotated"
        fi
    done
done

# 2. 清理過期日誌
for dir in "${LOG_DIRS[@]}"; do
    [ -d "$dir" ] || continue
    find "$dir" -name "*.log.*.gz" -mtime +${MAX_LOG_AGE_DAYS} -delete -print 2>/dev/null | while read f; do
        echo "  DELETED: $f"
    done
done

# 3. PM2 日誌截斷
if command -v pm2 &>/dev/null; then
    pm2 logs --nostream --lines "$PM2_LOG_LINES" > /tmp/pm2-recent.log 2>/dev/null
    echo "  PM2: log flush done"
fi

# 4. 清理 .next 快取（保留最新）
if [ -d "/var/www/esggo/.next/cache" ]; then
    find "/var/www/esggo/.next/cache" -mtime +7 -delete 2>/dev/null
    echo "  .next/cache: old entries cleaned"
fi

echo "[$(date)] === Log Cleanup End ==="
