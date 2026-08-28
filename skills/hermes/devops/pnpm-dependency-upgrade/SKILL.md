---
name: pnpm-dependency-upgrade
description: Upgrade pnpm deps and triage Dependabot alerts.
---

# pnpm Dependency Upgrade — ESGGO

## Trigger
Use when upgrading dependencies in the esggo pnpm monorepo, especially when Dependabot alerts need triage and PR creation.

## Workflow

### 1. Fetch Dependabot Alerts
`gh alert` is unavailable in gh v2.x. Use the REST API directly:
```bash
gh api repos/DingJun1028/esggo/dependabot/alerts?state=open&per_page=100
```
Parse the JSON to extract: package name, ecosystem (npm/pip), severity, CVE/GHSA IDs, manifest path, vulnerable version range, and first patched version.

### 2. Triage by Ecosystem and Severity
- **npm alerts**: affect `esggo-omni-center/pnpm-lock.yaml` and `apps/learning-center/pnpm-lock.yaml`
- **pip alerts**: check if any Python dependencies are scanned (currently 0 for this repo)
- Sort by severity (critical > high > medium > low)
- Group by package to deduplicate across manifests

### 3. Check Current Versions in Lockfiles
```bash
grep -E "^  <package>@<version>:" pnpm-lock.yaml
```
Check both root `pnpm-lock.yaml` and `apps/learning-center/pnpm-lock.yaml`.

### 4. Apply Upgrades

#### Direct dependencies
```bash
pnpm update <package>@<patched-version>
```

#### Transitive dependencies (locked by parent)
If a transitive dep (e.g., undici locked by jsdom) won't upgrade via `pnpm update`:
1. Add an override in `pnpm-workspace.yaml`:
   ```yaml
   overrides:
     "undici": ">=7.29.0 <8"
   ```
2. Run `pnpm install` to regenerate the lockfile
3. **Verify** the override doesn't break the parent package's tests

#### AGENTS.md Rule 5 Exception
Do NOT use overrides for packages where the AGENTS.md explicitly warns against it (undici is dev-only transitive via jsdom — overrides are acceptable here per the exception for dev-only deps).

### 5. Verify
```bash
pnpm test
pnpm build
pnpm peers check
```
If tests fail after override, investigate the transitive dependency chain and consider pinning the parent package instead.

### 6. Commit and PR
- One purpose commit per upgrade set
- Include CVE/GHSA references in commit message
- Push and create PR targeting `main` branch

## Pitfalls
- **`gh alert` command missing**: gh v2.96.0 doesn't have the `alert` subcommand. Always use `gh api repos/<owner>/<repo>/dependabot/alerts` instead.
- **Transitive lock-in**: Packages like `jsdom` pin `undici` to a vulnerable version. Upgrading undici directly won't work — you must override or upgrade jsdom.
- **pnpm overrides vs. package.json overrides**: `pnpm-workspace.yaml` overrides apply to the entire workspace. `package.json` overrides only apply to that package. Prefer workspace-level overrides for monorepo-wide fixes.
- **esggo-omni-center is a separate workspace**: It has its own `pnpm-lock.yaml` at `esggo-omni-center/pnpm-lock.yaml` on the `main` branch. Upgrades to the root lockfile don't affect it. Fetch it via `curl https://raw.githubusercontent.com/DingJun1028/esggo/main/esggo-omni-center/pnpm-lock.yaml`.
- **minimumReleaseAgeExclude**: Some packages are excluded from auto-upgrade in `pnpm-workspace.yaml`. Check this list before forcing upgrades.
- **Override version bounds**: Always pin overrides with `<major` upper bound (e.g., `>=7.29.0 <8`) to prevent cross-major jumps. The only exception is same-major patch upgrades where the parent package explicitly constrains the range (e.g., next@16 only accepts ^0.34.5 for sharp). See AGENTS.md #4 and #7.
- **sharp devDep exclusion**: sharp <0.35.0 (GHSA-f88m-g3jw-g9cj) is excluded from overrides because next@16 only accepts ^0.34.5 and sharp is a devDependency. Use `pnpm audit --prod` to confirm prod deps are clean.

## Key Files
- `pnpm-workspace.yaml` — workspace config with overrides and minimumReleaseAgeExclude
- `pnpm-lock.yaml` — root lockfile
- `apps/learning-center/pnpm-lock.yaml` — learning-center sub-workspace lockfile
- `esggo-omni-center/pnpm-lock.yaml` — separate workspace on GitHub `main` branch (fetch via `curl https://raw.githubusercontent.com/DingJun1028/esggo/main/esggo-omni-center/pnpm-lock.yaml`)
- `package.json` — root dependencies