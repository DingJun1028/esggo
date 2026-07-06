#!/usr/bin/env bash
# ============================================================
# ESGGO VPS One-Shot Repair — Paste into Oracle Cloud Console
# Opens SSH + deploys agent + fixes all services
# ============================================================
# Usage: Paste this entire script into Oracle Cloud Serial Console
# ============================================================
set -Eeuo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${GREEN}[OK]${NC} $1"; }
warn() { echo -e "${YELLOW}[!!]${NC} $1"; }
err()  { echo -e "${RED}[XX]${NC} $1"; }
step() { echo -e "\n${CYAN}=== $1 ===${NC}"; }

# ── 1. Open SSH Port ────────────────────────────────────────
step "1. Opening SSH Port 22"
if command -v ufw &>/dev/null; then
  ufw status | grep -q '22/tcp.*ALLOW' && log "SSH already open" || {
    ufw allow 22/tcp
    ufw reload
    log "SSH port 22 opened"
  }
else
  warn "UFW not found, checking iptables..."
  iptables -C INPUT -p tcp --dport 22 -j ACCEPT 2>/dev/null && log "SSH already open" || {
    iptables -I INPUT -p tcp --dport 22 -j ACCEPT
    iptables-save > /etc/iptables/rules.v4 2>/dev/null || true
    log "SSH port 22 opened via iptables"
  }
fi

# Ensure SSH daemon is running
systemctl enable ssh 2>/dev/null || systemctl enable sshd 2>/dev/null || true
systemctl start ssh 2>/dev/null || systemctl start sshd 2>/dev/null || true
log "SSH daemon started"

# ── 2. Deploy VPS Agent ─────────────────────────────────────
step "2. Deploying VPS Agent"
APP_DIR="/var/www/esggo"
AGENT_DIR="${APP_DIR}/vps/comms"
mkdir -p "$AGENT_DIR"

# Create the agent script inline
cat > "${AGENT_DIR}/vps-agent.sh" << 'AGENTEOF'
#!/usr/bin/env bash
set -euo pipefail
RELAY_IP="${1:-100.108.241.29}"
RELAY_PORT="${2:-9999}"
AUTH_TOKEN="${3:-esggo-relay-$(date +%Y%m%d)}"
POLL_INTERVAL=3
RETRY_INTERVAL=10
VPS_IP=$(curl -s --max-time 5 http://checkip.amazonaws.com 2>/dev/null || echo "unknown")

log() { echo "[AGENT $(date +%H:%M:%S)] $1"; }

exec_command() {
  local cmd_id="$1" command="$2"
  log "Executing: $command"
  local stdout="" stderr="" exit_code=0
  stdout=$(eval "$command" 2> >(stderr=$(cat); echo "$stderr" >&2)) || exit_code=$?
  local result=$(cat <<RESJSON
{"commandId":"$cmd_id","vpsIp":"$VPS_IP","stdout":$(echo "$stdout" | head -c 50000 | python3 -c "import sys,json; print(json.dumps(sys.stdin.read()))" 2>/dev/null || echo '""'),"stderr":$(echo "$stderr" | head -c 10000 | python3 -c "import sys,json; print(json.dumps(sys.stdin.read()))" 2>/dev/null || echo '""'),"exitCode":$exit_code,"hostname":"$(hostname)","ts":"$(date -Iseconds)"}
RESJSON
)
  curl -s -o /dev/null -X POST "http://${RELAY_IP}:${RELAY_PORT}/result" \
    -H "Content-Type: application/json" -H "X-Auth-Token: ${AUTH_TOKEN}" \
    -d "$result" --max-time 10 2>/dev/null || true
  log "Result sent (exit=$exit_code)"
}

log "Starting agent — relay=${RELAY_IP}:${RELAY_PORT} VPS=${VPS_IP}"
while true; do
  response=$(curl -s --max-time 5 "http://${RELAY_IP}:${RELAY_PORT}/cmd" \
    -H "X-Auth-Token: ${AUTH_TOKEN}" 2>/dev/null || echo '{"idle":true}')
  if echo "$response" | grep -q '"idle":true'; then
    sleep "$POLL_INTERVAL"; continue
  fi
  cmd_id=$(echo "$response" | python3 -c "import sys,json; print(json.loads(sys.stdin.read()).get('id',''))" 2>/dev/null || echo "")
  command=$(echo "$response" | python3 -c "import sys,json; print(json.loads(sys.stdin.read()).get('command',''))" 2>/dev/null || echo "")
  [ -n "$cmd_id" ] && [ -n "$command" ] && exec_command "$cmd_id" "$command"
  sleep "$POLL_INTERVAL"
done
AGENTEOF
chmod +x "${AGENT_DIR}/vps-agent.sh"
log "Agent script deployed"

# ── 3. Fix Nginx ────────────────────────────────────────────
step "3. Fixing Nginx"
if command -v nginx &>/dev/null; then
  nginx -t 2>/dev/null && {
    systemctl reload nginx
    log "Nginx reloaded"
  } || {
    warn "Nginx config test failed, attempting repair..."
    # Check if default config is broken
    if [ -f /etc/nginx/sites-enabled/default ]; then
      rm -f /etc/nginx/sites-enabled/default
    fi
    nginx -t 2>/dev/null && systemctl restart nginx && log "Nginx repaired" || warn "Nginx needs manual config"
  }
else
  warn "Nginx not installed"
fi

# ── 4. Fix PM2 Services ─────────────────────────────────────
step "4. Fixing PM2 Services"
if command -v pm2 &>/dev/null; then
  pm2 update 2>/dev/null || true
  
  # Check if ecosystem config exists
  ECOSYSTEM="${APP_DIR}/ecosystem.config.cjs"
  if [ ! -f "$ECOSYSTEM" ]; then
    cat > "$ECOSYSTEM" << 'ECOSYS'
module.exports = {
  apps: [
    {
      name: 'esggo-core',
      cwd: '/var/www/esggo',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      env: { NODE_ENV: 'production', PORT: 3000 },
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '1G',
      autorestart: true,
    },
    {
      name: 'omniagent-gateway',
      cwd: '/var/www/esggo/apps/gateway',
      script: 'omni-server.mjs',
      interpreter: 'node',
      env: { PORT: 8642, NODE_ENV: 'production' },
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '512M',
      autorestart: true,
    },
  ],
};
ECOSYS
    log "PM2 ecosystem config created"
  fi

  # Start/restart services
  cd "$APP_DIR"
  pm2 delete all 2>/dev/null || true
  pm2 start "$ECOSYSTEM" 2>/dev/null || true
  pm2 save --force 2>/dev/null || true
  
  # Setup PM2 startup
  pm2 startup systemd -u "$(whoami)" --hp "$HOME" 2>/dev/null || true
  
  log "PM2 services started"
  pm2 list
else
  warn "PM2 not installed, installing..."
  npm install -g pm2 2>/dev/null || true
  log "PM2 installed — run this script again"
fi

# ── 5. Fix Swap ─────────────────────────────────────────────
step "5. Ensuring Swap"
if ! swapon --show | grep -q /swapfile; then
  fallocate -l 2G /swapfile 2>/dev/null || dd if=/dev/zero of=/swapfile bs=1M count=2048 2>/dev/null
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  log "Swap created (2G)"
else
  log "Swap already exists"
fi

# ── 6. Fix .env Symlink ─────────────────────────────────────
step "6. Fixing .env"
if [ -f "${APP_DIR}/.env" ] && [ ! -L "${APP_DIR}/apps/gateway/.env" ]; then
  ln -sf "${APP_DIR}/.env" "${APP_DIR}/apps/gateway/.env"
  log ".env symlink created"
elif [ -L "${APP_DIR}/apps/gateway/.env" ]; then
  log ".env symlink exists"
else
  warn "No .env file found at ${APP_DIR}/.env"
fi

# ── 7. Start Agent (background) ─────────────────────────────
step "7. Starting VPS Agent (background)"
nohup bash "${AGENT_DIR}/vps-agent.sh" > "${APP_DIR}/logs/agent.log" 2>&1 &
log "Agent PID: $!"

# ── 8. Verify ───────────────────────────────────────────────
step "8. Verification"
echo ""
echo "SSH:    $(systemctl is-active ssh 2>/dev/null || systemctl is-active sshd 2>/dev/null || echo 'unknown')"
echo "Nginx:  $(systemctl is-active nginx 2>/dev/null || echo 'not installed')"
echo "PM2:    $(pm2 list 2>/dev/null | head -5 || echo 'not running')"
echo "Agent:  $(ps aux | grep vps-agent | grep -v grep | wc -l) process(es)"
echo "Swap:   $(swapon --show /swapfile | tail -1 | awk '{print $3}' || echo 'none')"
echo ""
echo -e "${GREEN}=== VPS Repair Complete ===${NC}"
echo "SSH should now be accessible from local machine"
echo "Agent is polling local relay for commands"
echo ""
echo "If SSH still doesn't work, check Oracle Cloud Security List:"
echo "  → Networking → Virtual Cloud Networks → Subnet → Security Lists"
echo "  → Add Ingress Rule: Source 0.0.0.0/0, Destination Port 22, TCP"
