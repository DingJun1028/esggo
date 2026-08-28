#!/usr/bin/env bash
# Find which local private key matches a pasted VPS public key.
# Usage: find-matching-key.sh <pubkey-prefix|pubkey-file>
#   arg = first ~40 chars of the pubkey body (ssh-rsa AAAA...), OR a path to a .pub file
# Prints "MATCH: <keyname>" + the full pubkey for every local private key whose
# derived pubkey starts with the given prefix.
set -u
ARG="${1:-}"
[ -z "$ARG" ] && { echo "usage: $0 <pubkey-prefix|pubkey-file>"; exit 2; }
if [ -f "$ARG" ]; then
  PREFIX=$(head -1 "$ARG" | awk '{print $2}' | cut -c1-40)
else
  PREFIX="$ARG"
fi
[ -z "${PREFIX:-}" ] && { echo "could not derive prefix from $ARG"; exit 2; }
echo "Searching for pubkey prefix: ${PREFIX:0:30}..."
for k in /c/Users/dingj/.ssh/id_rsa_* /c/Users/dingj/.ssh/esggo* /c/Users/dingj/.ssh/*_key; do
  [ -f "$k" ] || continue
  pub=$(ssh-keygen -y -P "" -f "$k" 2>/dev/null) || continue
  body=$(echo "$pub" | awk '{print $2}')
  if echo "$body" | grep -q "^${PREFIX}"; then
    echo "MATCH: $(basename "$k")"
    echo "  $pub"
  fi
done
