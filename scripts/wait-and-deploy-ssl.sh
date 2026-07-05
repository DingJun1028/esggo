#!/bin/bash
# wait-and-deploy-ssl.sh - Wait for DNS propagation and deploy Let's Encrypt SSL
set -euo pipefail

DOMAIN="${1:-esggo.com}"
VPS_IP="161.118.248.180"
MAX_ATTEMPTS=60
WAIT_SECONDS=30

echo "=== Waiting for DNS propagation: ${DOMAIN} -> ${VPS_IP} ==="

check_dns() {
  dig +short "$DOMAIN" @8.8.8.8 @1.1.1.1 2>/dev/null | grep -q "^${VPS_IP}$"
}

attempt=0
while [ $attempt -lt $MAX_ATTEMPTS ]; do
  attempt=$((attempt + 1))
  echo "Attempt $attempt/$MAX_ATTEMPTS - Checking DNS..."
  
  if check_dns; then
    echo "✓ DNS propagated successfully!"
    break
  fi
  
  echo "DNS not ready yet, waiting ${WAIT_SECONDS}s..."
  sleep $WAIT_SECONDS
done

if ! check_dns; then
  echo "✗ DNS not propagated after $((MAX_ATTEMPTS * WAIT_SECONDS / 60)) minutes"
  echo "Please ensure A record points to ${VPS_IP}"
  exit 1
fi

echo "=== Deploying Let's Encrypt SSL ==="
ssh -o ConnectTimeout=10 root@${VPS_IP} "certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos -m admin@${DOMAIN} --redirect"

echo "=== Verifying SSL deployment ==="
ssh -o ConnectTimeout=10 root@${VPS_IP} "nginx -t && systemctl reload nginx"

echo "✅ SSL deployment complete!"