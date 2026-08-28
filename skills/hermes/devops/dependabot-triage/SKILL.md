---
name: dependabot-triage
description: Triage Dependabot security alerts for npm and pip.
---

# Dependabot Alert Triage

## Trigger
Use when reviewing open Dependabot security alerts for the esggo repo or any pnpm/Node.js monorepo.

## Key Finding from This Session
- `gh alert` command does NOT exist in gh v2.96.0. The `alert` subcommand was removed or never added.
- Always use the REST API: `gh api repos/<owner>/<repo>/dependabot/alerts?state=open&per_page=100`
- The output is a JSON array of alert objects with nested `security_advisory`, `security_vulnerability`, and `cvss_severities` fields.

## Alert Structure
Each alert has:
- `number` — alert ID
- `dependency.package.name` — package name
- `dependency.package.ecosystem` — `npm` or `pip`
- `dependency.manifest_path` — lockfile path (e.g., `esggo-omni-center/pnpm-lock.yaml`)
- `dependency.scope` — `runtime` or `development`
- `security_vulnerability.severity` — `critical`, `high`, `medium`, `low`
- `security_vulnerability.vulnerable_version_range` — semver range
- `security_vulnerability.first_patched_version.identifier` — fix version
- `security_advisory.cve_id` — CVE identifier
- `security_advisory.ghsa_id` — GHSA identifier
- `security_advisory.summary` — human-readable description
- `cvss.score` — CVSS v3 score
- `cwes` — CWE classification list

## Triage Process
1. Fetch alerts via REST API
2. Filter by ecosystem (npm vs pip)
3. Sort by severity (critical > high > medium > low)
4. Group by package name to deduplicate across manifests
5. For each package, identify the highest severity and the fix version
6. Check if the fix version is already in the lockfile (may be a transitive dep)
7. Route to `pnpm-dependency-upgrade` skill for the actual upgrade PR

## Severity Classification
- **critical/high**: Immediate upgrade required. Create PR targeting `main` within 24 hours.
- **medium**: Schedule upgrade within the current sprint.
- **low**: Batch with other low-severity fixes or defer to next maintenance window.

## esggo Repo Specifics
- Main branch is `main` (not `master`)
- Two lockfiles: root `pnpm-lock.yaml` and `apps/learning-center/pnpm-lock.yaml`
- Separate workspace `esggo-omni-center/` has its own `pnpm-lock.yaml` on GitHub `main` branch
- 39 open alerts at time of triage (15 high/critical, 24 medium/low)
- 0 pip alerts — Python deps not scanned by Dependabot
- esggo-omni-center is a separate pnpm workspace with its own `pnpm-lock.yaml` and `package.json` — upgrades must be applied there separately via `curl` to fetch the remote lockfile or by running pnpm commands inside that directory if cloned locally
- esggo-omni-center is a separate pnpm workspace with its own `pnpm-lock.yaml` and `package.json` — upgrades must be applied there separately via `curl` to fetch the remote lockfile or by running pnpm commands inside that directory if cloned locally