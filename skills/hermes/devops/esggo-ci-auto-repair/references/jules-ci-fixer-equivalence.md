# Jules CI Fixer → OA-TWINS Auto-Repair Equivalence (Free-Compute Mapping)

Source: user pasted Jules release notes (Google paid SaaS, 2025-05 → 2026-02).
Hard constraint: user forbids paid APIs ("只用免費算立"), prefers self-hosted.
Decision: do NOT call jules.googleapis.com. Map capability to free self-hosted instead.

## Jules capabilities → esggo free equivalents (verified 2026-08-09)
| Jules feature | esggo free equivalent | Status |
|---------------|----------------------|--------|
| CI Fixer (auto-fix failed PR CI, resubmit loop) | `.github/workflows/auto-repair.yml` (OA-TWINS Auto-Repair) | ✅ running on main |
| Commit Authoring (co-author / user-only) | 5T `source_origin` dual-sign / anonym (soul.md §17.2) | ✅ architecture |
| Scheduled Tasks | Hermes cron | ✅ available |
| MCP (external services) | OAB OmniAgentBus + webhook | 🔄 per-service |

## auto-repair.yml mechanics (verified on esggo main)
- Trigger: `workflow_run` on upstream CI, `conclusion == 'failure'`
- Downloads REAL failure logs: `gh api /repos/{repo}/actions/runs/{id}/logs`
- Detects 8 error types (typescript, eslint, test, secret-scan, ...)
- Auto-fixes per type, opens repair PR (committer `auto-repair@esggo.co`)
- Telegram 萬能分身 tracker notifies

## esggo-auto-repair Worker (Cloudflare free tier)
- Deployed; health check:
  `curl -s --max-time 15 https://esggo-auto-repair.dingjunhong1028.workers.dev/health`
  → `{"status":"ok","queue":true,"webhookConfigured":false,"patConfigured":false}`
- NEEDS to fully activate: GitHub Secrets `WEBHOOK_SECRET` + `REPAIR_PAT` (repo-scoped PAT).
- This is a FREE Cloudflare-layer Jules-CI-Fixer equivalent — NOT Google paid.

## Verification commands (run BEFORE claiming "integrated")
```bash
# 1. Prove OA-TWINS Auto-Repair actually runs
gh run list --repo DingJun1028/esggo --workflow auto-repair.yml --limit 5
# → e.g. run 31257593762 success 2026-08-08T12:35:35Z

# 2. Worker health (free tier)
curl -s --max-time 15 https://esggo-auto-repair.dingjunhong1028.workers.dev/health

# 3. Confirm workflow file present on main
gh api repos/DingJun1028/esggo/contents/.github/workflows/auto-repair.yml --jq '.sha'

# 4. List all repair/scheduled-related workflows
gh api repos/DingJun1028/esggo/actions/workflows --jq \
  '.workflows[] | select(.name|test("repair|ci|schedul|auto";"i")) | "\(.name) \(.path)"'
```

## Soul.md mapping chapter
`esggo-learning-center/esggo-omni-center/soul-chapter-17-jules-mapping.md`
(§17.1 CI Fixer, §17.2 Commit Authoring, §17.3 MCP→OAB, §17.4 honest status table)
Indexed in `soul-seed.md` §17.
