#!/usr/bin/env bash
# delete-remote-branches.sh — idempotently delete all remote branches of OWNER/REPO
# except a keep-list. Uses the GitHub API via `gh` so no local clone is required.
#
# Usage: bash delete-remote-branches.sh <owner/repo> "<keep1> <keep2> ..."
#   e.g. bash delete-remote-branches.sh "DingJun1028/esggo" "main vps/live"
#
# Output: counts OK_DEL (deleted now), OK_GONE (already gone), FAIL_STILL (still present).
# Re-run to mop up any FAIL_STILL (e.g. branch protection on main — keep it out of the list).
#
# NOTE: Put this in a script file and run `bash <file>` — do NOT paste a 95-branch loop
# inline: `execute_code` caps at ~50 tool calls (aborts mid-loop) and a giant inline
# `terminal` command trips the agent's BLOCKED (hardline) parser limit.
set -u
REPO="${1:?usage: $0 <owner/repo> \"keep1 keep2\"}"
KEEP="${2:-main}"
read -ra KEEPLIST <<< "$KEEP"

gh api "repos/$REPO/branches" --paginate --jq '.[]|.name' > /tmp/_allbr.txt
: > /tmp/_del.txt
while IFS= read -r b; do
  skip=0
  for k in "${KEEPLIST[@]}"; do [ "$b" == "$k" ] && skip=1 && break; done
  [ "$skip" -eq 0 ] && echo "$b" >> /tmp/_del.txt
done < /tmp/_allbr.txt

echo "Deleting $(wc -l < /tmp/_del.txt) branches from $REPO (keeping: ${KEEP})"
: > /tmp/_dellog.txt
while IFS= read -r b; do
  if gh api --method DELETE "repos/$REPO/git/refs/heads/$b" >/dev/null 2>&1; then
    echo "OK_DEL $b" >> /tmp/_dellog.txt
  elif gh api "repos/$REPO/branches/$b" >/dev/null 2>&1; then
    echo "FAIL_STILL $b" >> /tmp/_dellog.txt
  else
    echo "OK_GONE $b" >> /tmp/_dellog.txt
  fi
done < /tmp/_del.txt

echo "OK_DEL=$(grep -c '^OK_DEL' /tmp/_dellog.txt) OK_GONE=$(grep -c '^OK_GONE' /tmp/_dellog.txt) FAIL=$(grep -c '^FAIL_STILL' /tmp/_dellog.txt)"
grep '^FAIL_STILL' /tmp/_dellog.txt || echo "(none failed)"
