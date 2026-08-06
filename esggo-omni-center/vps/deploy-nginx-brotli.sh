#!/usr/bin/env bash
# ============================================================
# ESGGO VPS — Enable Brotli Compression for nginx
# Best-effort on Ubuntu 24.04 ARM64
# ============================================================
set -euo pipefail

echo "[1/4] install nginx-brotli module"
if ! dpkg -s libnginx-mod-http-brotli >/dev/null 2>&1; then
  sudo apt-get update -y
  sudo apt-get install -y libnginx-mod-http-brotli || sudo apt-get install -y nginx-module-brotli || true
fi

echo "[2/4] enable module"
mapfile -t CONF < <(sudo find /etc/nginx -maxdepth 3 -type f \( -name '*.conf' -o -name 'modules*' \) 2>/dev/null || true)
if [ -f /etc/nginx/modules-enabled/50-mod-http-brotli.conf ]; then
  sudo ln -sf /etc/nginx/modules-enabled/50-mod-http-brotli.conf /etc/nginx/modules-available/50-mod-http-brotli.conf || true
fi

echo "[3/4] append brotli block to esggo configs"
if [ -f /etc/nginx/sites-available/esggo ]; then
  if ! grep -q "brotli on;" /etc/nginx/sites-available/esggo; then
    sudo tee -a /etc/nginx/sites-available/esggo >/dev/null <<'EOF'

        # Brotli compression
        brotli on;
        brotli_types text/html text/plain text/css text/xml application/xhtml+xml application/json application/javascript application/x-javascript application/rss+xml application/atom+xml application/xml application/xml+rss image/svg+xml font/woff font/woff2;
        brotli_comp_level 6;
        brotli_min_length 256;
        brotli_static on;
EOF
  fi
fi

if [ -f /etc/nginx/conf.d/esggo.conf ]; then
  if ! grep -q "brotli on;" /etc/nginx/conf.d/esggo.conf; then
    sudo tee -a /etc/nginx/conf.d/esggo.conf >/dev/null <<'EOF'

        # Brotli compression
        brotli on;
        brotli_types text/html text/plain text/css text/xml application/xhtml+xml application/json application/javascript application/x-javascript application/rss+xml application/atom+xml application/xml application/xml+rss image/svg+xml font/woff font/woff2;
        brotli_comp_level 6;
        brotli_min_length 256;
        brotli_static on;
EOF
  fi
fi

echo "[4/4] test and reload"
sudo nginx -t || { echo 'nginx configtest failed'; exit 1; }
sudo systemctl reload nginx || sudo service nginx reload || true
echo "=== brotli enabled ==="
