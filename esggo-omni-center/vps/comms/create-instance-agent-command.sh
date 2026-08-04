#!/usr/bin/env bash
# ESGGO OCI Instance Agent Command Creator
# Prereq: export OCI_APP_ACCESS_TOKEN=<token> OCI_TENANCY_ID=<tenancy> OCI_COMPARTMENT_ID=<comp>
set -euo pipefail

SCRIPT_PATH="${1:-/c/var/www/esggo/vps/comms/vps-agent-v2.sh}"
INSTANCE_ID="${2:-}"
REGION="${OCI_REGION:-ap-southeast-1}"

if [ ! -f "$SCRIPT_PATH" ]; then
  echo "ERROR missing script: $SCRIPT_PATH"
  exit 1
fi

if [ -z "${OCI_APP_ACCESS_TOKEN:-}" ]; then
  echo "ERROR missing OCI_APP_ACCESS_TOKEN"
  exit 1
fi

if [ -z "${OCI_COMPARTMENT_ID:-}" ]; then
  echo "ERROR missing OCI_COMPARTMENT_ID"
  exit 1
fi

NOW=$(date +%Y%m%d_%H%M%S)
OUTPUT_BUCKET="${OCI_NAMESPACE:-esggo}"
OUTPUT_OBJECT="agent-output/${NOW}.out"
DISPLAY_NAME="ESGGO-Agent-${NOW}"

PAYLOAD=$(cat <<EOF
{
  "compartmentId": "${OCI_COMPARTMENT_ID}",
  "displayName": "${DISPLAY_NAME}",
  "executionTimeOutInSeconds": 600,
  "target": {
    "instanceId": "${INSTANCE_ID}"
  },
  "content": {
    "source": {
      "sourceType": "COMMAND",
      "command": "$(sed 's/"/\\"/g' "$SCRIPT_PATH")"
    },
    "output": {
      "outputType": "OBJECT_STORAGE_URI",
      "outputUri": "https://objectstorage.${REGION}.oraclecloud.com/n/${OUTPUT_BUCKET}/b/esggo-agent-output/o/${DISPLAY_NAME}.out"
    }
  }
}
EOF
)

echo "POST /20180530/instanceAgentCommands"
echo "instance: ${INSTANCE_ID}"
RESP=$(curl -sS -w "\nHTTP_STATUS:%{http_code}" \
  -X POST "https://iaas.${REGION}.oraclecloud.com/20180530/instanceAgentCommands" \
  -H "Authorization: Bearer ${OCI_APP_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  --max-time 30 || true)

HTTP=$(echo "$RESP" | grep -o 'HTTP_STATUS:[0-9]*' | cut -d: -f2 || true)
BODY=$(echo "$RESP" | sed '/HTTP_STATUS:/d')
echo "HTTP_STATUS: ${HTTP:-000}"
printf '%s\n' "$BODY" | python3 -m json.tool 2>/dev/null || printf '%s\n' "$BODY"
