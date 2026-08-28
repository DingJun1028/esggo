#!/usr/bin/env bash
# ESGGO best-practice sweep verification — run after edits, before commit.
# Usage: bash scripts/verify-sweep.sh
set -e
cd "$(git rev-parse --show-toplevel)"

echo "=== typecheck (tsc -p tsconfig.core.json) ==="
pnpm run typecheck

echo "=== error-leak remaining (target: 0) ==="
git grep -nE '\(error as Error\)\.message|error\.message' -- 'app/**/route.ts' 'esggo-omni-center/app/**/route.ts' 2>/dev/null \
  | grep -vE 'console\.(error|log|warn)' | wc -l

echo "=== vitest (auth + error-leak proofs) ==="
npx vitest run tests/json-error-internal.test.ts tests/cron-auth.test.ts tests/memory-auth.test.ts
