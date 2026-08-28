# esggo PR #412 — round-7 (2026-08-04): draft bot-PR review & merge

## Context
PR #416 (`fix/omnicore-ci`) closed as superseded (round-6). "下一步" → PR #412,
a Sentinel/Jules auto security PR: `🛡️ [MEDIUM] Fix command injection risk in VPS agent`,
**`draft: true`**, 1 commit (+23/−13, `vps/agent-bootstrap.mjs` only), head
`sentinel-security-fetch-agent-1068799421132237164` @ `7003058e`, base `d9dd3f4` (2026-07-31 main).

## The fix (reviewed, approved)
`collectHealth()` → async; `check(name, port, path)` swapped subshell
`curl -s -o /dev/null -w "%{http_code}" ... http://localhost:${port}${path}` for native
`fetch(..., { signal: AbortSignal.timeout(3000) })` + try/catch. Semantics preserved:
- curl `'000'→stopped` ≡ fetch `throw→stopped`; HTTP 4xx/5xx → `running`+`unhealthy` on both.
- `AbortSignal.timeout` needs Node ≥17.3; VPS runs Node v22.23.1 — fine.
- NOT touched (by design): `executePending` → `localExec(cmd.command)` is the agent's core
  feature (remote command execution behind gateway `X-Omni-Token` auth), not the vuln surface.
- Minor non-blocking: two `await check(...)` run serially (≤3s each) — `Promise.all` would parallelize.

## CI attribution: run #1532 (2026-07-31) = red, but NOT the PR's fault
`GET actions/runs/30615784229/jobs` → 8 jobs:
- TypeScript Check ✅, **Validate VPS Scripts ✅** (incl. `node --check` on the fetched .mjs —
  positive proof the PR change parses), ESLint ✅, Secret Scan ✅
- Vitest/Build one red (base's broken `@/lib/` imports — #1545-era, fixed on main later)
- Lighthouse CI + Docker Build Test `skipped` (needs-chain downstream of the red job)
Blameless attribution: `agent-bootstrap.mjs` is never imported by Next build/tests, so the
red job cannot be caused by this PR. base was broken at branch time; main `6185b842` is now
fully green ⇒ merged PR goes green.

## Draft-PR merge mechanics (learned)
- `GET pulls/412` on a draft returns `"draft": true, "mergeable": null` — GitHub does NOT
  compute mergeability for drafts. `gh pr merge` on a draft fails; must `gh pr ready` first.
- Singleton-file PR whose path main never touched (main's agent-bootstrap still curl-based) ⇒
  conflict-free by construction ⇒ merge safe over the red historical run.

## Command block delivered to user (PowerShell)
```
cd C:\Project\esggo
gh pr ready 412
gh pr merge 412 --squash --delete-branch --subject "fix(vps): native fetch for agent health checks (kill execSync curl injection vector)"
```

## Side note: gh vs cached-API discrepancy (also round-6)
`gh pr close` answered `already closed` while `web_extract` api.github.com payload still showed
`state: open, closed_at: null` (stale cache). `browser_navigate` to the PR HTML page showed the
title-bar `Closed` badge — live browser + gh agree, cached web_extract loses. For mutation
outcomes, verify with gh or a live browser page, never a single cached API excerpt.

## VPS validation (parallel thread)
Hermes terminal backend IS the VPS (`161.118.248.180`); `getsockname failed: Not a socket`
= local SSH-client socket error, NOT VPS downtime. OCI console (Running, IP unchanged) +
external probes confirmed health: `http://161.118.248.180/` → "AI Station 全自動影音生產線"
(nginx 200), `https://omniagent.esggo.co/health` → `{"status":"healthy"}` (gateway).
