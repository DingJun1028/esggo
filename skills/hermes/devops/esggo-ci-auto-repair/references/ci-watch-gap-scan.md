# CI-Watch Cron Loop — gap-scan, dedup, state-advance

Reusable bash/python snippets for the 15-min OA-TWINS CI-watch cron turn
(`esggo-ci-auto-repair`). Copy and modify; do not hand-type each time.

## 1. Retry wrapper for any `gh` API call (TLS timeouts are common)
```bash
for a in 1 2 3 4; do
  out=$(gh issue create --repo DingJun1028/esggo -t "..." -F "..." -l "OmniAgent,auto-fix,github_actions" 2>&1)
  if echo "$out" | grep -qE "issues/[0-9]+"; then echo "OK=$out"; break; fi
  echo "attempt$a: $out"; sleep 3
done
```

## 2. Gap scan — find failures created AFTER the watcher's poll snapshot
```bash
STATE=$(cat "C:/Users/dingj/.hermes/scripts/gh-error-watch.state" 2>/dev/null || echo 0)
gh run list --repo DingJun1028/esggo --limit 30 \
  --json databaseId,workflowName,conclusion,createdAt \
  | python3 -c "import sys,json; d=json.load(sys.stdin); \
    f=[r for r in d if r.get('databaseId',0)>int('$STATE') and r.get('conclusion')=='failure']; \
    print('GAP_FAILURES='+str(len(f))); \
    [print(r['databaseId'], r['workflowName'], r['createdAt']) for r in f]"
```

## 3. Confirm a gap run's root cause (don't trust the watcher's hint)
```bash
gh run view <run_id> --repo DingJun1028/esggo --log-failed > /c/Project/_ci_logs/r_<run_id>.log 2>&1
grep -q "Cannot create components during render" /c/Project/_ci_logs/r_<run_id>.log && echo "ESLINT static-components"
grep -q "TYPES_OUT_OF_SYNC" /c/Project/_ci_logs/r_<run_id>.log && echo "TYPESSYNC"
grep -qi "Permission denied (publickey)" /c/Project/_ci_logs/r_<run_id>.log && echo "SSHH"
```

## 4. Advance watcher state to current newest run (prevents next-poll duplicates)
```bash
NEWEST=$(gh run list --repo DingJun1028/esggo --limit 1 --json databaseId \
  | python3 -c "import sys,json;print(json.load(sys.stdin)[0]['databaseId'])")
printf '%s' "$NEWEST" > "C:/Users/dingj/.hermes/scripts/gh-error-watch.state"
```

## 5. Append a gap run to an existing root-cause tracker (comment, not new issue)
```bash
gh issue comment <issue#> --repo DingJun1028/esggo -F "C:/Project/_ci_logs/comment.md"
```

## Recurring esggo root causes seen this turn (2026-08-08)
- **ESLint `react-hooks/static-components`** "Cannot create components during render" —
  error-level, NOT fixable by `pnpm lint --fix`; fix = hoist component definitions
  out of render scope. Recurs simultaneously in ESG-GO CI/CD, OmniCore CI, 🌌 Sacred Pipeline.
- **learning-center-ci `check-types-sync`** `TYPES_OUT_OF_SYNC` (missing 7 translate/types).
- **Deploy to Oracle VPS** `Permission denied (publickey)` exit 255 (`ssh_deploy_key`,
  NOT auto-repairable — needs manual console access to add the pubkey).
