#!/usr/bin/env bash
set -euo pipefail

# ── VPS 持久化強化 ──────────────────────────────
# 用法: bash scripts/vps-setup.sh
# 可重複執行 (idempotent)

echo "=== 1. Swap 空間 (2G) ==="
if ! swapon --show | grep -q /swapfile; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  if ! grep -q '/swapfile' /etc/fstab; then
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
  fi
  echo "  Swap 已建立 (2G)"
else
  echo "  Swap 已存在 $(swapon --show | tail -1 | awk '{print $3}')"
fi

echo "=== 2. PM2 log rotation ==="
pm2 install pm2-logrotate 2>/dev/null || true
pm2 set pm2-logrotate:max_size 50M 2>/dev/null || true
pm2 set pm2-logrotate:retain 7 2>/dev/null || true
pm2 set pm2-logrotate:compress true 2>/dev/null || true
echo "  PM2 logrotate 已設定 (50M/保留7天/壓縮)"

echo "=== 3. PM2 startup ==="
PM2_STARTUP=$(pm2 startup systemd -u "$(whoami)" --hp "$HOME" 2>&1 | tail -3)
if echo "$PM2_STARTUP" | grep -q "already"; then
  echo "  PM2 startup 已啟用"
else
  echo "$PM2_STARTUP"
  echo "  PM2 startup 已設定"
fi
pm2 save --force

echo "=== 4. .env symlink (Gateway) ==="
if [ ! -L /var/www/esggo/apps/gateway/.env ] && [ -f /var/www/esggo/.env ]; then
  ln -sf /var/www/esggo/.env /var/www/esggo/apps/gateway/.env
  echo "  .env symlink 已建立"
elif [ -f /var/www/esggo/apps/gateway/.env ]; then
  echo "  .env 已存在"
else
  echo "  WARN: 根目錄 .env 不存在"
fi

echo "=== 5. PM2 服務狀態 ==="
pm2 list

echo ""
echo "=== 完成 ==="
