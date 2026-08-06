#!/bin/bash
# Bash syntax verification for deploy scripts
# 用法: bash deploy/verify_bash.sh

set -euo pipefail

SCRIPTS=(
  "deploy/push_and_deploy.sh"
  "deploy/verify_universal_translator.sh"
)

PASS=0; FAIL=0

for s in "${SCRIPTS[@]}"; do
  if [ -f "$s" ]; then
    if bash -n "$s" 2>/dev/null; then
      echo "✅ $s (bash -n PASS)"
      ((PASS++))
    else
      echo "❌ $s (bash -n FAIL)"
      ((FAIL++))
    fi
  else
    echo "⚠️  skip $s (not found)"
  fi
done

echo ""
echo "📊 結果: ${PASS} pass, ${FAIL} fail"
if [ $FAIL -gt 0 ]; then exit 1; fi