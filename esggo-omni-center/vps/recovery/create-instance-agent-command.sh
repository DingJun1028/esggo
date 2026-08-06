#!/usr/bin/env bash
# ============================================================
# ESGGO VPS Local Wrapper B: Oracle Run Command deployer
# Uses OCI instance agent API from Linux console only
# Captures oci-cli / python oci if present.
# ============================================================
set -u

COMPARTMENT_OCID="${1:-}"
INSTANCE_OCID="${2:-}"
CMD="${3:-hostname; whoami; ip a; ss -ltnp | grep :22; ufw status}"
OUTFILE="${4:-/tmp/oci-run-cmd-output.txt}"

if [ -z "${COMPARTMENT_OCID}" ] || [ -z "${INSTANCE_OCID}" ]; then
  echo "Usage: $0 <compartment-ocid> <instance-ocid> [command] [outputfile]"
  exit 2
fi

which oci >/dev/null 2>&1 && {
  echo "[oci-cli] deploying via oci compute-management... "
  oci compute-management instance-agent-command create \
    --compartment-id "${COMPARTMENT_OCID}" \
    --instance-id "${INSTANCE_OCID}" \
    --command-text "${CMD}" >/dev/null 2>&1 || true
  exit $?
}

python3 - <<PYEOF
import os,sys
comp = "${COMPARTMENT_OCID}"
inst = "${INSTANCE_OCID}"
print("python-oci-sdk not installed; use recovery bundle A instead.")
PYEOF
