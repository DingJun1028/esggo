---
name: esggo-dependabot-override
description: Resolve Dependabot alerts via pnpm overrides in esggo.
---

# ESGGO Dependabot Override Resolution

## Workflow

1. Fetch open alerts: `gh api repos/DingJun1028/esggo/dependabot/alerts?state=open&per_page=100`
2. Group by ecosystem and severity.
3. For npm alerts: add overrides to `pnpm-workspace.yaml` with `<major` upper bound (AGENTS.md #4).
4. Run `pnpm install` then `pnpm audit --prod` to verify zero prod vulns.
5. Commit and push.

## Key Rules

- Never use bare `>=` without upper bound — pnpm may jump across major versions.
- Never override transitive dev deps pinned by a parent dep (AGENTS.md #5).
- Document excluded deps with explicit rationale comments in pnpm-workspace.yaml (AGENTS.md #7).