#!/usr/bin/env bash
# repo: templates/deploy-via-ssh.sh
set -euo pipefail
APP_DIR="${APP_DIR:-/opt/esggo}"
COMPOSE_DIR="${COMPOSE_DIR:-vps}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
echo "[deploy] begin"
cd "${APP_DIR}" || { echo "missing ${APP_DIR}"; exit 1; }
git stash || true
git pull origin main || true
if [ -d "${COMPOSE_DIR}" ]; then
  cd "${COMPOSE_DIR}"
  docker compose -f "${COMPOSE_FILE}" build --no-cache || true
  docker compose -f "${COMPOSE_FILE}" up -d --remove-orphans || true
  docker compose -f "${COMPOSE_FILE}" ps || true
fi
echo "[deploy] done"
