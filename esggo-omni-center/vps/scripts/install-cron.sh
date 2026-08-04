#!/bin/bash
# Install ESGGO cron jobs
set -euo pipefail

CRON_FILE="/var/www/esggo/vps/configs/cron-esggo"

if [ ! -f "$CRON_FILE" ]; then
  echo "ERROR: $CRON_FILE not found"
  exit 1
fi

# Backup existing crontab
crontab -l > /tmp/cron-backup-$(date +%Y%m%d_%H%M%S) 2>/dev/null || true

# Install new jobs (append, avoid duplicates)
(crontab -l 2>/dev/null; cat "$CRON_FILE") | sort -u | crontab -

echo "Cron jobs installed successfully"
crontab -l | grep -E "(backup|health|logrotate)"
