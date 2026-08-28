---
name: best-practice-audit-workflow
description: Create Hermes cron prompts from best-practice checklists.
tags: [workflow, audit, cron, best-practice, 5t]
---

# Best-Practice Audit Workflow

Use this when the user wants best practices materialized into a project checklist and a Hermes `cronjob` prompt that periodically verifies compliance.

## When to Use

- User says: "最佳實踐", "best practices", "checklist", "audit", "合規檢查"
- User asks to turn a checklist into an automated check
- User wants a cron-based verifier for deployment, Docker, SSL, secrets, CI/CD, or 5T compliance

## Deliverables

| # | Artifact | Purpose |
|---|----------|---------|
| 1 | `BEST-PRACTICES.md` in the project root | Human-readable checklist mapped to real repo files/commands |
| 2 | `cron-best-practice-check.md` in the project root | Self-contained Hermes cron prompt template |
| 3 | Hermes `cronjob create` call | Scheduled job that runs the audit on a cadence |

## Project Checklist Structure

A good `BEST-PRACTICES.md` has these sections, each mapped to actual files in the repo:

1. **Deployment chain** — scripts, compose files, CI workflows, `.gitignore` coverage
2. **CI/CD gates** — lint/test/build/deploy healthchecks
3. **Docker hygiene** — restart policies, healthchecks, secret mounts, networks
4. **Secrets management** — GitHub Secrets, VPS `.env`, rotation cadence, file permissions
5. **SSL/TLS** — certbot, fallback certs, auto-renew cron, certificate expiry checks
6. **5T protocol mapping** — Task/Team/Trust/Time/Transfer table with repo-specific evidence
7. **Entropy & maintenance rhythm** — weekly/monthly cadence
8. **Incident classification** — P0/P1/P2/P3 with exact recovery commands
9. **Quick-reference commands** — copy-pasteable terminal snippets

## Cron Prompt Template Structure

The cron prompt must be self-contained and executable by a fresh agent with no chat history. Use this structure:

```markdown
# Hermes Cron — <Project> Best-Practice Auto Check

## Mission
Unattended 5T audit of <project> against BEST-PRACTICES.md.

## Reference Files
- <absolute paths to checklist, deploy scripts, compose files, CI workflows>

## Check Steps
1. Deployment chain: <exact commands + acceptance criteria>
2. Docker health: <SSH command + acceptance criteria>
3. HTTP/HTTPS: <curl commands + acceptance criteria>
4. SSL/TLS: <certbot command + acceptance criteria>
5. Secrets: <gh secret list or equivalent + acceptance criteria>
6. 5T audit: <table + acceptance criteria>

## Output Format
Structured Markdown report with:
- Summary: pass/fail/warning counts + overall conclusion
- Detail: checklist with [x] or [ ] per item, include real values (status codes, ms, container names)
- Entropy recommendations
- Next actions

## Exception Handling
- SSH failure -> WARNING, continue
- HTTP timeout -> FAIL, include error
- Missing file -> FAIL, include path
- GitHub CLI not logged in -> WARNING, suggest `gh auth login`

## Completion Criteria
- [ ] All reference files read
- [ ] All check steps executed
- [ ] Structured report emitted with concrete values
```

## Cron Job Creation Pattern

```bash
hermes cron create \
  --name "<project>-best-practice-check" \
  --schedule "<cron schedule>" \
  --prompt "$(cat '<project-root>/cron-best-practice-check.md')" \
  --skills "oa-team-swarm-ultra,oa-team-swarm" \
  --workdir "<absolute-project-root>" \
  --deliver "origin"
```

### Schedule Guidance

| Cadence | Use When |
|---------|----------|
| `0 0,12 * * *` | Twice-daily production audit |
| `0 0 * * *` | Daily audit |
| `every 6h` | High-churn environments |

### Delivery Guidance

- `origin` — deliver back to the current Hermes chat
- `all` — fan-out to all connected channels
- `local` — silent save only (watchdog-style)

## 5T Report Format

The cron run must emit a report with this shape:

```markdown
# <Project> Auto Check Report

**Timestamp**: <ISO 8601>
**Trigger**: Hermes Cron
**Model**: <actual model>

## Summary
- Pass: N
- Fail: N
- Warning: N
- **Conclusion**: PASS | FAIL | WARNING

## Details
### 1. <Category>
- [x] <item> (<real value>)
- [ ] <item> (<real value>)

## Entropy Recommendations
1. <specific action>

## Next Steps
- [ ] <actionable item>
```

## Pitfalls

1. **Vague reports** — never say "services are healthy"; include container names, status codes, and latency.
2. **Hardcoded paths that don't exist** — verify paths exist before referencing them in the prompt.
3. **Over-permissive delivery** — default to `origin` unless the user explicitly asks for `all`.
4. **Missing acceptance criteria** — every check step must have a pass/fail condition, not just "run this command."
5. **Prompt too long for one cron field** — keep the prompt under ~5KB; move verbose reference material into `BEST-PRACTICES.md` and summarize it in the cron prompt.

## Support Files

- `templates/cron-best-practice-check.md` — starter cron prompt template to copy and customize per project.
- `references/project-mapping.md` — how to map generic 5T categories to a specific repo's real files and commands.

## Verification

- [ ] `BEST-PRACTICES.md` covers all real deployment paths in the repo
- [ ] `cron-best-practice-check.md` is executable by a fresh agent with no chat history
- [ ] `cronjob create` returns `state: scheduled` and a valid `job_id`
- [ ] First manual run produces a structured report with concrete values