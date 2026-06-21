#!/usr/bin/env bash
set -Eeuo pipefail

# ESGGO SSL Certificate Setup Script (Let's Encrypt + Certbot)
# Usage: sudo ./vps/setup-ssl.sh <domain>

DOMAIN="${1:-}"
if [ -z "$DOMAIN" ]; then
    echo "Error: Domain name required"
    echo "Usage: sudo ./vps/setup-ssl.sh <domain>"
    exit 1
fi

log() { echo "==> [SSL] $1"; }

# Install Certbot if not present
if ! command -v certbot >/dev/null 2>&1; then
    log "Installing Certbot..."
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
fi

# Create ACME challenge directory
log "Creating ACME challenge directory..."
mkdir -p /var/www/certbot

# Request certificate
log "Requesting SSL certificate for ${DOMAIN}..."
certbot --nginx -d "$DOMAIN" -d "www.${DOMAIN}" --non-interactive --agree-tos --redirect

# Auto-renewal cron job
log "Setting up auto-renewal cron job..."
cat > /etc/cron.d/esggo-ssl-renew <<'EOF'
0 3 * * * root certbot renew --quiet --post-hook "systemctl reload nginx"
EOF

chmod 644 /etc/cron.d/esggo-ssl-renew

log "SUCCESS: SSL certificate installed and auto-renewal configured."
log "Certificate expires: $(certbot certificates | grep -A1 "Certificate Name:" | tail -1)"