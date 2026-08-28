---
name: github-dependabot-triage
description: Triage Dependabot alerts in a multi-lockfile monorepo.
---

# GitHub Dependabot Triage (monorepo edition)

## When to use
You are asked to "fix the Dependabot alerts", "clear the vulnerabilities", "resolve the 91 alerts", or similar, in a repo that has MORE THAN ONE lockfile/package manifest (monorepo).

## Monorepo Reality (CRITICAL)
In `DingJun1028/esggo`, alerts are NOT all in the root `pnpm-lock.yaml`. They live in many independent manifests:
- `pnpm-lock.yaml` (root pnpm workspace — what `pnpm-workspace.yaml` overrides affect)
- `rules-tutorial/functions/package-lock.json` (a tutorial sub-project; can be ×40+ of the total)
- `apps/learning-center/pnpm-lock.yaml`, `esggo-omni-center/apps/learning-center/pnpm-lock.yaml`, `esggo-omni-center/pnpm-lock.yaml`
- `cli/{omnicli,oa-cli,esggo-cli}/package.json`
- `oa-team-crewai/uv.lock`

**Consequence:** adding root `pnpm-workspace.yaml` overrides drives `pnpm audit --prod` → 0, but GitHub's *total* alert count will barely move (e.g. 91 → 80) because most alerts are in OTHER manifests. Do NOT treat "GitHub still shows N alerts" as a failure of your override work. The correct verification target is `pnpm audit --prod` = **No known vulnerabilities found** on the root workspace.

## Workflow
1. Fetch open alerts grouped by manifest path:
   `gh api repos/DingJun1028/esggo/dependabot/alerts?state=open --paginate -q '.[] | .dependency.manifest_path' | sort | uniq -c | sort -rn`
2. Identify which manifest the CURRENT task's deliverable lives in. For `apps/universal-translator`, that's the root `pnpm-lock.yaml`.
3. Resolve ONLY that manifest's alerts (pnpm overrides in `pnpm-workspace.yaml` with `<major` upper bound — never bare `>=`). See `esggo-dependabot-override` for the override mechanics.
4. Verify: `pnpm audit --prod` → zero vulns.
5. For dev-only / unused-code-path vulns: document exclusion with rationale comment (do NOT leave silent).
6. Report scope honestly: root prod audit = 0 is the win; remaining GitHub alerts in other sub-projects are out of scope for a single-deliverable task.

## Scope discipline
When the task is a specific deliverable, fix the relevant workspace, document out-of-scope sub-project alerts in a report, and STOP. Do NOT bulk-dismiss or bulk-override 80 alerts across unrelated projects without explicit user go-ahead — that is a security decision, not mechanical cleanup.

## Dismissal Pitfalls (GitHub alert close)
- Dismissal requires a token with `security_events:write` scope. The standard `gh` token in this env LACKS it → `PATCH` returns **HTTP 422 "Invalid input: data matches no possible input"** — NOT a body-format error. Every format variant (form fields, `--input -`, explicit `-H "Content-Type: application/json"`) fails identically. Do NOT burn turns retrying body shapes; document the exclusion instead and note it needs a scoped token.
- Valid `dismissed_reason` values: `fix_started`, `inaccurate`, `no_bandwidth`, `not_used`, `tolerable_risk`. **`not_vulnerable` is INVALID** (422). For "vulnerable code path is not used" (e.g. `sharp` when the project uses 0 `next/image`), use `not_used`.
- Correct endpoint: `PATCH /repos/{owner}/{repo}/dependabot/alerts/{number}` with JSON body `{"dismissed_reason":"not_used","dismissed_comment":"..."}`.

## Reference files
- `references/gh-commands.md` — copy-paste `gh` recipes: alert grouping by manifest, per-manifest package list, and the exact (blocked) dismissal command variants with the valid `dismissed_reason` values.

## Related skills
- `esggo-dependabot-override` — the pnpm-lockfile override mechanics (user-owned; recommend `hermes curator adopt esggo-dependabot-override` so it can be updated with the monorepo lessons too).
