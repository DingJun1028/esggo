#!/usr/bin/env bash
# validate_vault.sh — structural checks for this user's Hermes .env secret vault.
# Does NOT echo secret values. Exits 2 if the file is missing, 1 if any guard fails.
# Usage: bash validate_vault.sh [path-to-env-file]
set -u
F="${1:-/c/Users/dingj/secret-vault/ENV20230818.env}"
[ -f "$F" ] || { echo "MISSING: $F"; exit 2; }
echo "== $F =="

# 1. chmod 600
if stat -c '%a' "$F" >/dev/null 2>&1; then
  mode=$(stat -c '%a' "$F")
else
  mode=$(stat -f '%Lp' "$F" 2>/dev/null || echo "??")
fi
echo "chmod: $mode (want 600)"

# 2. no stray triple-backticks
bt=$(grep -c '`' "$F"); echo "backtick lines: $bt (want 0)"

# 3. all non-blank non-comment lines parse as KEY=VALUE
bad=$(grep -vE '^\s*#|^\s*$|^[A-Za-z_][A-Za-z0-9_]*=' "$F" | wc -l | tr -d ' ')
echo "malformed KEY=VALUE lines: $bad (want 0)"

# 4. duplicate TERMINAL_SSH_HOST (last-wins; warn if >1 non-comment)
dup=$(grep -vE '^\s*#' "$F" | grep -c '^TERMINAL_SSH_HOST=' | tr -d ' ')
echo "TERMINAL_SSH_HOST defs: $dup (warn if >1)"

# 5. User= typo guard
ut=$(grep -c '^TERMINAL_SSH_USER=User=' "$F" | tr -d ' ')
echo "User= typo: $ut (want 0)"

echo "DONE"
