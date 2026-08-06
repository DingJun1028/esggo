#!/usr/bin/env bash
# inspect-vps.sh - 盤點 VPS Docker 容器（在 VPS 上執行）
set -euo pipefail
OUT="${1:-inventory.json}"
if ! command -v docker >/dev/null 2>&1; then echo "docker 未安裝"; exit 1; fi

# 終端摘要
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'

# 完整結構化匯出
docker inspect $(docker ps -q) > /tmp/_inspect.json 2>/dev/null || true

# 簡易 index 清單
idx=0
for id in $(docker ps -q); do
  name=$(docker inspect --format '{{.Name}}' "$id")
  image=$(docker inspect --format '{{.Config.Image}}' "$id")
  status=$(docker inspect --format '{{.State.Status}}' "$id")
  ports=$(docker inspect --format '{{range $k,$v := .NetworkSettings.Ports}}{{$k}} {{end}}' "$id")
  echo "[$idx] $name | $image | $status | $ports"
  idx=$((idx+1))
done

echo "[ok] 終端摘要如上；完整 docker inspect 在 /tmp/_inspect.json"
