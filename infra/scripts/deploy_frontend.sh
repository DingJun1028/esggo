#!/bin/bash
# ESGGO Frontend Deployment Script
# Deploys Next.js app to VPS (uses pnpm)

set -e

VPS_HOST="161.118.248.180"
VPS_USER="root"
VPS_DIR="/var/www/esggo"
LOCAL_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== [ESGGO] Frontend Deployment ==="

# 1. Build locally
echo "[Step 1] Building Next.js app locally..."
npm run build

# 2. Sync to VPS (exclude heavy/unnecessary dirs)
echo "[Step 2] Syncing to VPS..."
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude '*.log' \
  --exclude '.turbo' \
  --exclude '.vercel' \
  "$LOCAL_DIR/" "$VPS_USER@$VPS_HOST:$VPS_DIR/"

# 3. Install pnpm if missing, then install deps
echo "[Step 3] Installing dependencies on VPS (pnpm)..."
ssh "$VPS_USER@$VPS_HOST" << 'REMOTE'
cd /var/www/esggo

# Ensure corepack is enabled (supports packageManager field)
corepack enable
corepack prepare pnpm@11.5.2 --activate

# Install all deps (pnpm handles workspaces correctly)
pnpm install --frozen-lockfile || pnpm install

echo "=== Dependencies installed ==="
REMOTE

# 4. Build on VPS
echo "[Step 4] Building on VPS..."
ssh "$VPS_USER@$VPS_HOST" "cd $VPS_DIR && npm run build"

# 5. Restart PM2 process
echo "[Step 5] Restarting PM2 process..."
ssh "$VPS_USER@$VPS_HOST" << 'REMOTE'
cd /var/www/esggo
pm2 delete esggo 2>/dev/null || true
pm2 start npm --name esggo -- start
pm2 save
REMOTE

# 6. Verify
echo "[Step 6] Verifying deployment..."
sleep 5
STATUS=$(ssh "$VPS_USER@$VPS_HOST" "pm2 jlist 2>/dev/null | python3 -c \"import sys,json; d=json.load(sys.stdin); print(d[0]['pm2_env']['status'])\" 2>/dev/null || echo 'unknown'")
echo "PM2 Status: $STATUS"

if [ "$STATUS" = "online" ]; then
    echo "=== Deployment Complete ==="
    echo "URL: http://$VPS_HOST:3000"
else
    echo "=== Deployment may have issues ==="
    echo "Logs: ssh $VPS_USER@$VPS_HOST 'pm2 logs esggo --lines 50'"
fi
