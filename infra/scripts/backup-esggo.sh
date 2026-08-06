#!/usr/bin/env bash
set -euo pipefail
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/esggo"
mkdir -p "$BACKUP_DIR"
tar -czf "$BACKUP_DIR/esggo-code-$DATE.tar.gz" \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.git \
  --exclude=*.db \
  --exclude=*.db-journal \
  /var/www/esggo
echo "Backup created: $BACKUP_DIR/esggo-code-$DATE.tar.gz"
