#!/usr/bin/env bash
set -euo pipefail
echo "[1/3] backup nginx configs"
sudo cp -a /etc/nginx/sites-available/esggo /etc/nginx/sites-available/esggo.bak.$(date +%Y%m%d-%H%M%S) 2>/dev/null || true
echo "[2/3] apply gzip-enabled configs (choose mode)"
if [ -f /var/www/esggo/vps/nginx-esggo.conf ]; then
  sudo cp /var/www/esggo/vps/nginx-esggo.conf /etc/nginx/sites-available/esggo
elif [ -f /var/www/esggo/vps/nginx-esggo-docker.conf ]; then
  sudo mkdir -p /etc/nginx/conf.d
  sudo cp /var/www/esggo/vps/nginx-esggo-docker.conf /etc/nginx/conf.d/esggo.conf
fi
echo "[3/3] test and reload"
sudo nginx -t
sudo systemctl reload nginx || sudo service nginx reload || true
echo "=== nginx gzip enabled ==="
