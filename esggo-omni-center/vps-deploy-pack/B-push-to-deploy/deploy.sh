#!/usr/bin/env bash
set -euo pipefail
REPO_DIR="${REPO_DIR:-/opt/esggo}"
cd "$REPO_DIR"
echo "[deploy] pull"
git pull --ff-only
echo "[deploy] build + up"
docker compose up -d --build
echo "[deploy] prune old images"
docker image prune -f
echo "[deploy] health"
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
