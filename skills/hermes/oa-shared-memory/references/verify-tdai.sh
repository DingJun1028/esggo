#!/usr/bin/env bash
# 5T Verification script for TencentDB Agent Memory deployment
# Usage: bash references/verify-tdai.sh [--host HOST] [--key-file PATH]
set -euo pipefail

HOST="${1:-http://127.0.0.1:8420}"
PROXY="${2:-http://127.0.0.1:8096}"
KEY_FILE="${3:-/c/Users/dingj/esggo/apps/tencentdb-memory/.admin-key}"

echo "=== 5T Verification ==="
echo "Host: $HOST"
echo "Proxy: $PROXY"
echo ""

# Traceable
echo -n "1. Traceable (admin key verify): "
KEY=$(cat "$KEY_FILE" | tr -d '\n')
printf '{"user_key":"%s"}' "$KEY" > /tmp/auth_verify.json
curl -sf --max-time 5 "${HOST}/v3/meta/auth/verify" \
  -X POST -H "Content-Type: application/json" -H "x-tdai-service-id: default" \
  -d "@/tmp/auth_verify.json" 2>&1 | python3 -c "import sys,json; d=json.load(sys.stdin); print('valid:', d['data']['valid'], 'userId:', d['data']['user']['user_id'])"

# Trackable
echo -n "2. Trackable (containers): "
docker ps --format '{{.Names}}' --filter "name=tdai-" | wc -l | python3 -c "import sys; print(f'{int(sys.stdin.read().strip())} containers running')"

# Tangible
echo -n "3. Tangible (proxy end-to-end): "
RESP=$(curl -sf --max-time 30 "${PROXY}/claude-code/default/v1/messages" \
  -H "Authorization: Bearer ${KEY}" \
  -H "x-tdai-service-id: default" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{"model":"qwen2.5:3b-instruct-q4_K_M","max_tokens":20,"messages":[{"role":"user","content":"What is 1+1?"}]}' 2>&1)
echo "$RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['content'][0]['text'][:30])" 2>/dev/null || echo "FAILED"

# Transparent
echo -n "4. Transparent (health): "
for port in 8420 8125 8096 8424; do
  code=$(curl -sf --max-time 3 "http://127.0.0.1:${port}/health" -o /dev/null -w "%{http_code}" 2>/dev/null || echo "000")
  echo -n "port${port}:$code "
done
echo ""

# Trustworthy
echo -n "5. Trustworthy (pipeline): "
curl -sf --max-time 3 "${HOST}/health" | python3 -c "import sys,json; d=json.load(sys.stdin); pw=d['services']['pipelineWorker']; print(f'tasks={pw[\"tasksConsumed\"]} consumed, {pw[\"tasksCompleted\"]} completed')"
