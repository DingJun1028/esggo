#!/bin/bash
set -euo pipefail

# ============================================================
# OmniAgent Gateway VPS Deployment Script v2.0
# Target: Oracle Cloud VM.Standard.A1.Flex (ARM64)
# Host:   161.118.248.180 | Ubuntu 24.04 | 4 OCPU / 24 GB
# ============================================================

VPS_IP="161.118.248.180"
APP_DIR="$HOME/omniagent-gateway"
APP_PORT="8642"
APP_NAME="omniagent-gateway"
NODE_VERSION="20"

echo "════════════════════════════════════════════════════"
echo "🚀 OmniAgent Gateway Deployment v2.0"
echo "   Target: $VPS_IP | Ubuntu 24.04 (ARM64)"
echo "════════════════════════════════════════════════════"

# ── 1. System update ──────────────────────────────────────
echo ""
echo "📦 [1/9] Updating system packages..."
sudo apt-get update -y && sudo apt-get upgrade -y
sudo apt-get install -y curl git ufw fail2ban unzip

# ── 2. Node.js (v20 LTS, ARM64 compatible) ────────────────
echo ""
echo "⚙️  [2/9] Installing Node.js v${NODE_VERSION} (ARM64)..."
if ! command -v node &> /dev/null || [[ "$(node -v)" != v${NODE_VERSION}* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
node -v && npm -v
echo "✅ Node.js ready"

# ── 3. PM2 process manager ────────────────────────────────
echo ""
echo "⚙️  [3/9] Installing PM2..."
sudo npm install -g pm2 pm2-logrotate
pm2 set pm2-logrotate:max_size 50M
pm2 set pm2-logrotate:retain 7
echo "✅ PM2 ready"

# ── 4. App directory ──────────────────────────────────────
echo ""
echo "📁 [4/9] Setting up app directory: $APP_DIR"
mkdir -p "$APP_DIR"
cd "$APP_DIR"

# ── 5. Write package.json ─────────────────────────────────
echo ""
echo "📝 [5/9] Writing package.json..."
cat <<'PKGJSON' > package.json
{
  "name": "omniagent-vps-gateway",
  "version": "2.0.0",
  "type": "module",
  "main": "omni-server.mjs",
  "scripts": {
    "start": "node omni-server.mjs",
    "dev": "node --watch omni-server.mjs"
  },
  "dependencies": {
    "express": "^4.19.2",
    "cors": "^2.8.5",
    "@google/generative-ai": "^0.21.0",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.3.1",
    "dotenv": "^16.4.5"
  }
}
PKGJSON
npm install --production
echo "✅ Dependencies installed"

# ── 6. Copy server file ───────────────────────────────────
echo ""
echo "📤 [6/9] Deploying omni-server.mjs..."
# This script assumes omni-server.mjs is uploaded alongside deploy-omni.sh
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/omni-server.mjs" ]; then
  cp "$SCRIPT_DIR/omni-server.mjs" "$APP_DIR/omni-server.mjs"
  echo "✅ Server file copied from $SCRIPT_DIR"
else
  echo "⚠️  omni-server.mjs not found next to deploy script."
  echo "   Please manually upload it to $APP_DIR before continuing."
fi

# ── 7. Environment file ───────────────────────────────────
echo ""
echo "🔑 [7/9] Configuring environment..."
if [ ! -f "$APP_DIR/.env" ]; then
  cat <<ENVFILE > "$APP_DIR/.env"
# OmniAgent Gateway v2.1 — Environment Configuration
# Edit this file and restart PM2: pm2 restart omniagent-gateway

# ── AI Providers (at least one required) ──────────────────
# Priority: Gemini → OpenRouter → Mock Templates
GEMINI_API_KEY=your_gemini_api_key_here

# OpenRouter (https://openrouter.ai/keys) — unlocks 27 free models
# Free models: Llama 3.3 70B, Qwen3 480B, NVIDIA Nemotron, GPT-OSS 120B, etc.
OPENROUTER_API_KEY=your_openrouter_api_key_here

# ── Server ────────────────────────────────────────────────
PORT=${APP_PORT}
NODE_ENV=production
VPS_IP=${VPS_IP}
SITE_URL=http://${VPS_IP}:${APP_PORT}
SITE_NAME=ESGGO OmniAgent Gateway

# ── Optional: Supabase ────────────────────────────────────
# NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# ── Optional: CORS allowlist ──────────────────────────────
# Leave empty to allow all origins (development/internal use)
# ALLOWED_ORIGINS=https://yourdomain.com,https://esggo.app
ENVFILE
  echo "⚠️  .env template created — EDIT $APP_DIR/.env with real keys!"
else
  echo "ℹ️  .env already exists, skipping."
fi
chmod 600 "$APP_DIR/.env"

# ── 8. Firewall (UFW + Oracle Cloud iptables note) ────────
echo ""
echo "🛡️  [8/9] Hardening firewall..."
sudo ufw --force reset
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp      comment 'SSH'
sudo ufw allow 80/tcp      comment 'HTTP'
sudo ufw allow 443/tcp     comment 'HTTPS'
sudo ufw allow ${APP_PORT}/tcp comment 'OmniAgent Gateway'
sudo ufw --force enable
sudo ufw status verbose

# Fail2Ban for SSH brute-force protection
sudo systemctl enable --now fail2ban
echo "✅ Firewall configured"

# NOTE: Oracle Cloud also enforces Security Lists / NSGs in the console.
# Ensure port ${APP_PORT} is open in OCI > Networking > Security Lists.
echo "⚠️  ORACLE CLOUD REMINDER: Open port ${APP_PORT} in OCI Security Lists/NSGs!"

# ── 9. PM2 launch ─────────────────────────────────────────
echo ""
echo "🚀 [9/9] Launching OmniAgent Gateway via PM2..."
cd "$APP_DIR"

pm2 delete "$APP_NAME" 2>/dev/null || true
pm2 start omni-server.mjs \
  --name "$APP_NAME" \
  --exp-backoff-restart-delay 1000 \
  --max-memory-restart 4096M \
  --time \
  --env production

pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u "$USER" --hp "$HOME"

echo ""
echo "════════════════════════════════════════════════════"
echo "✅ OmniAgent Gateway Deployment COMPLETE!"
echo "════════════════════════════════════════════════════"
echo ""
echo "  📡 Status endpoint : http://${VPS_IP}:${APP_PORT}/status"
echo "  🗂  App directory   : $APP_DIR"
echo "  📋 PM2 logs        : pm2 logs $APP_NAME"
echo "  🔁 Restart server  : pm2 restart $APP_NAME"
echo ""
echo "  📝 TODO (Required):"
echo "     1. Edit .env:  nano $APP_DIR/.env"
echo "     2. Open OCI Security List for port ${APP_PORT}"
echo "     3. (Optional) Install Nginx + Certbot for HTTPS:"
echo "        sudo apt install -y nginx certbot python3-certbot-nginx"
echo ""
echo "════════════════════════════════════════════════════"
