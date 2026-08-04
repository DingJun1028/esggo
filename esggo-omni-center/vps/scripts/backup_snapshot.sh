#!/usr/bin/env bash
set -euo pipefail

TIMESTAMP=$(date -u +%Y%m%d_%H%M%S)
ARCHIVE_NAME="esggo_snapshot_${TIMESTAMP}.tar.gz"
BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"

PROJECT_DB="./projects.db"
KANBAN_DIR="./kanban"

tar -czf "$BACKUP_DIR/$ARCHIVE_NAME" -C "$(pwd)" "$PROJECT_DB" "$KANBAN_DIR"

cd "$BACKUP_DIR"
ls -1t esggo_snapshot_*.tar.gz | tail -n +6 | while read -r old; do
    rm -f "$old"
done

echo "Backup created at $BACKUP_DIR/$ARCHIVE_NAME"