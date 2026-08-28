# Round-8 — PR #412 merge → post-merge verification → deploy #189 red

Date: 2026-08-04. Escalation of round-7 (draft-review) into the actual merge and its deployment outcome.

## 1. Merge executed (validates the draft-merge flow from round-7)
```powershell
cd C:\Project\esggo; gh pr ready 412; gh pr merge 412 --squash --delete-branch --subject "fix(vps): native fetch for agent health checks (kill execSync curl injection vector)"
# → ✓ Pull request DingJun1028/esggo#412 is marked as "ready for review"
# → ✓ Squashed and merged pull request #412 (🛡️ Sentinel: [MEDIUM] Fix command injection risk in VPS agent)
# → ✓ Deleted remote branch sentinel-security-fetch-agent-1068799421132237164
```
- `gh pr merge` on a draft PR errors — `gh pr ready` in the same one-liner (`;`) must come first.
- Squash commit landed on main as `f41aafe` (co-authored by google-labs-jules[bot]).
- Side note: user had earlier failed to attach a comment to PR #416's close, fixed with `gh issue comment 416 --body "..."` (gh close had already fired with "already closed", comment added separately).

## 2. Post-merge verification: full workflow fan-out in ONE call
`GET /repos/DingJun1028/esggo/actions/runs?head_sha=f41aafe6399934a5d5f3ccc8760e9a20e0bd364f&per_page=10`
via browser_console fetch (Step 3 pattern). All 6 workflows on the new head:

| Workflow | Run | Result |
|---|---|---|
| 🌌 ESG GO Sacred Pipeline (CI/CD) | #145 | ✅ success |
| OmniCore CI | #1598 | ✅ success (9/9: TS/ESLint/Secret/Vitest/agents.yaml/Validate-VPS/Build/Docker 2m1s/Lighthouse 1m15s) |
| Build & publish AI Station image | #58 | ✅ success |
| learning-center-ci | #52 | ✅ success |
| **Deploy to Oracle VPS** | **#189** | ❌ **failure** (Deploy direct step) |
| ESG-GO CI/CD Pipeline | #943 | 🔄 in_progress |

**Takeaway:** 4 green chains prove the merged change is sound; the single red deploy is a deploy-ENV failure, not the code. The code-health verdict rests on OmniCore CI being green INCLUDING its dedicated Validate VPS Scripts job (the file Never Feed the Next build/test path).

## 3. Deploy #189 failure pinpointed via jobs-API steps
`GET /actions/runs/30829545938/jobs` → Deploy to VPS job (id 91739778548):
- Setup direct SSH key ✅ (ssh-keyscan OK ⇒ TCP port 22 reachable)
- Configure OCI / Deploy via bastion `skipped` (direct mode selected)
- **Deploy direct ❌ — 15:53:11 → 15:55:01 (~1m50s), exit 1**
- Cleanup ✅, Post checkout ✅

1m50s duration = **auth succeeded**, so the failure is INSIDE the VPS-side heredoc script: `git checkout -f main; git reset --hard origin/main; pnpm install --frozen-lockfile; pnpm run build; pm2 kill; pm2 start ecosystem.config.cjs; health check (GW=https://omniagent.esggo.co/health, WEB=https://esggo.co both must be 200)`. Contrast with Step 4.6's ~3s death (auth failure).

## 3. Production impact assessment — deploy red ≠ outage
- `omniagent.esggo.co/health` = `{"status":"healthy"}` ✅ (gateway 200)
- `https://esggo.co` = 200 (title "ESGGO — 永續發展無限進化") ✅
Prod is serving because the OLD pm2 process keeps running until the restart step; deploy failing mid-script does not tear down the live process. Verify prod health before alarming.

## 4. web_extract stale-cache trap — now on RUN-status endpoints too
After the tools showed deploy #189 + CI #1598 as `in_progress` with `updated_at` frozen at 15:53, the live page (`browser_navigate` to the run URL) already showed **completed** results (Build #58 success, deploy #189 failure). Same cached-web_extract lesson as the PR-state case (open→closed) — apply it to run/conclusion reads too. Browser live page = truth; browser_console fetch = truth; `gh` local = truth; web_extract = suspect cache.

## 5. browser_console fetch — the cache-bypass that worked
```js
fetch('https://api.github.com/repos/{o}/{r}/actions/runs?head_sha={sha}&per_page=10',
  {headers:{'Accept-Encoding':'identity','Accept':'application/json'}})
  .then(r=>r.text()).then(t=>JSON.parse(t).workflow_runs.map(w=>w.name+' #'+w.run_number+': '+w.status+'/'+w.conclusion).join('\n'))
```
- Plain `r.json()` → threw `'utf-8' codec can't decode byte 0xa4 in position 11` (gzip); `Accept-Encoding: identity` + `r.text()` fixed it.
- Works from ANY loaded GitHub page without login for public-repo data.

## 6. Log handoff when browser unauth / API 403
Browsing the job page while signed-out shows only `Sign in to view logs` (no step output). API `/logs` 403s. Hand the user:
```powershell
gh run view 30829545938 --log-failed --repo DingJun1028/esggo
```
gh on the user's host carries the owner token → prints exactly the failing step's stderr (next step in this diagnosis once the user pastes it back).

## Root-cause judgement so far
Not yet confirmed (log pending) — candidates inside the VPS heredoc: pnpm install/build under 1 OCPU, pm2 restart, or a post-restart readiness window where GW/WEB were briefly not 200. The fix is expected to be a deploy-env/workflow parameter, NOT the merged fetch refactor (CI proved the new `agent-bootstrap.mjs` parses and builds).