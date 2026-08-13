#!/usr/bin/env bash
# DeerFlow docker-compose 守護腳本 (由 pm2 管理)
# 確保 VPS 重啟後 DeerFlow 容器自起, 並持續監控
set -e
cd /opt/deer-flow
echo "[deerflow] ensuring containers up..."
docker compose -p deer-flow-dev -f docker/docker-compose-dev.yaml up -d --remove-orphans 2>&1 | tail -5 || true
echo "[deerflow] watchdog active — monitoring containers (Ctrl-C to stop)"
while true; do
  # 若關鍵容器掛了, 重新拉起
  if ! docker ps --format '{{.Names}}' | grep -q 'deer-flow-gateway'; then
    echo "[deerflow] gateway down — restarting..."
    docker compose -p deer-flow-dev -f docker/docker-compose-dev.yaml up -d 2>&1 | tail -3 || true
  fi
  sleep 30
done
