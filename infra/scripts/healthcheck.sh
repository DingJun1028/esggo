#!/usr/bin/env bash
set -euo pipefail
FRONTEND=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/ || echo 000)
GATEWAY=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8642/status || echo 000)
if [ "$FRONTEND" != "200" ] || [ "$GATEWAY" != "401" ]; then
  echo "HEALTHCHECK_FAILED: frontend=$FRONTEND gateway=$GATEWAY"
  exit 1
fi
echo "HEALTHCHECK_OK: frontend=$FRONTEND gateway=$GATEWAY $(date)"
