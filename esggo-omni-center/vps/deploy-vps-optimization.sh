#!/bin/bash
# ESGGO VPS Complete Optimization Deployment (One-shot)
# Usage: sudo bash deploy-vps-optimization.sh
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${GREEN}[+]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[x]${NC} $1"; exit 1; }

echo "=== ESGGO VPS Optimization Suite Deployment ==="

# === 1. Security Hardening ===
log "Applying UFW + Fail2Ban + SSH hardening..."
bash configs/ufw-hardening.sh || warn "Security script completed with warnings"

# === 2. Install core packages ===
log "Installing required packages..."
apt-get update -qq
apt-get install -y -qq \
  nginx fail2ban prometheus node-exporter netdata alertmanager \
  jq curl nc logrotate cron

# === 3. Nginx ===
log "Installing Nginx config..."
cp configs/nginx-esggo.conf /etc/nginx/sites-available/esggo
ln -sf /etc/nginx/sites-available/esggo /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# === 4. PM2 ecosystem ===
log "Installing PM2 ecosystem config..."
cp configs/pm2-ecosystem.config.js /var/www/esggo/ecosystem.config.production.js

# === 5. Monitoring stack ===
log "Deploying Prometheus + Alertmanager + Netdata..."
mkdir -p /etc/prometheus /etc/alertmanager
cp monitoring/prometheus/prometheus.yml /etc/prometheus/
cp monitoring/prometheus/alerts.yml /etc/prometheus/
cp monitoring/alertmanager/alertmanager.yml /etc/alertmanager/
cp monitoring/netdata/netdata.conf /etc/netdata/

systemctl enable --now prometheus alertmanager node-exporter netdata || warn "Some monitoring services may need manual start"

# === 6. Telegram alert relay ===
log "Installing Telegram alert webhook relay..."
cp services/telegram-alert.sh /usr/local/bin/
chmod +x /usr/local/bin/telegram-alert.sh
cp services/telegram-alert.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now telegram-alert || warn "Failed to start telegram service"

# === 7. Logrotate ===
log "Installing logrotate rules..."
cp configs/logrotate-esggo /etc/logrotate.d/esggo

# === 8. Health check script ===
log "Installing health-check script..."
cp configs/health-check.sh /usr/local/bin/esggo-health-check
chmod +x /usr/local/bin/esggo-health-check

# === 9. Cron jobs ===
log "Installing scheduled jobs..."
bash scripts/install-cron.sh || warn "Cron install may have warnings"

# === 10. Final verification ===
log "Final service status check..."
systemctl is-active --quiet nginx && echo "  nginx: OK" || warn "nginx not running"
systemctl is-active --quiet prometheus && echo "  prometheus: OK" || warn "prometheus not running"
systemctl is-active --quiet netdata && echo "  netdata: OK" || warn "netdata not running"
systemctl is-active --quiet telegram-alert && echo "  telegram-alert: OK" || warn "telegram-alert not running"

echo ""
echo -e "${GREEN}=== ESGGO VPS Optimization Deployment Completed ===${NC}"
echo "Next steps:"
echo "  1. Verify monitoring: http://161.118.248.180:19999 (Netdata)"
echo "  2. Test Telegram alerts by triggering a test alert"
echo "  3. Check PM2: pm2 status"
echo "  4. Backup logs: /var/log/esggo-backup.log"
