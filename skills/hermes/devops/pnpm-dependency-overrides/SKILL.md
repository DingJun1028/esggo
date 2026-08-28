---
name: pnpm-dependency-overrides
description: Fix pnpm transitive CVEs via workspace overrides.
---

# pnpm Dependency Overrides (CVE / audit remediation)

## When to use
- `pnpm audit` reports HIGH/CRITICAL in transitive deps you don't directly depend on.
- A security scanner (Trivy, Dependabot, GitHub Audit) flags a vulnerable package version in `pnpm-lock.yaml`.
- You need to force a patched version of a deep transitive dep without waiting on the parent to bump.

## ⚠️ HARD RULE — pnpm 11.x overrides location
In **pnpm 11.5.2+** (and the 11.x line), the `pnpm` field in `package.json` is **silently ignored**.
`pnpm install` prints:
```
[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.overrides".
```
and the lockfile does NOT change. Your override *looks* applied but the vulnerable version stays.
**Put overrides in `pnpm-workspace.yaml`** under a top-level `overrides:` mapping:
```yaml
overrides:
  "brace-expansion": ">=5.0.8"
  "fast-uri": ">=3.1.4"
```
Never add `pnpm.overrides` to `package.json` — it wastes a full `pnpm install` (can time out at 180s
on large repos) and fails silently.

## Workflow
1. Identify vulnerable packages + patched versions: `pnpm audit --audit-level high` (read the
   "Vulnerable versions" / "Patched versions" rows). Note the EXACT patched lower bound.
2. Add each to `pnpm-workspace.yaml` `overrides:` with `">=patched"`.
3. Re-resolve lockfile FAST (no full node_modules build, avoids TTY abort
   `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`):
   ```bash
   export CI=true
   pnpm install --lockfile-only
   ```
4. Confirm the override took effect: the `pnpm install --lockfile-only` output must NOT contain
   "[WARN] ... pnpm field ... ignored". Then grep the lockfile for resolved patched versions, e.g.
   `grep -E "brace-expansion@5.0.9" pnpm-lock.yaml`.
5. Verify zero HIGH/CRIT:
   ```bash
   pnpm audit --audit-level high --json | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{const j=JSON.parse(d);const a=Object.values(j.advisories||{});console.log("HIGH/CRIT:",a.filter(x=>x.severity==="high"||x.severity==="critical").length)})'
   ```
## 6. When `pnpm audit --fix=update` does not clear high/critical

On large monorepos, `--fix=update` can fail to reach deep transitive deps and the scanner may
still show high/critical counts after install. Instead of blind retries:

1. Extract the vulnerable module names and patched versions from the audit JSON.
2. Add them to `pnpm-workspace.yaml` `overrides:` with a minimal bound that clears the CVE.
3. Run `pnpm install --lockfile-only` to re-resolve quickly.
4. Re-run `pnpm audit --prod` and confirm the count dropped.

If the audit still shows the same package, verify the override is under `overrides:` in
`pnpm-workspace.yaml` (not `package.json`'s ignored `pnpm` field).

## 7. Merge-conflict hygiene for `pnpm-workspace.yaml`

When `git pull --no-rebase` produces a conflict in `pnpm-workspace.yaml`, the usual conflict is
the `sqlite3` line under `allowBuilds:`. Accept the remote version (`sqlite3: false`) unless you
have a specific reason to enable native builds. The rest of the file should merge cleanly.

## 8. Commit both `pnpm-workspace.yaml` and `pnpm-lock.yaml`

After override changes, stage and commit both files together so CI sees the new resolution.

## Pitfalls
- **Audit can reveal MORE high issues after the first pass.** The original scanner report (e.g. 6
  Trivy HIGHs) is not the whole list — `pnpm audit` may show additional HIGHs (`next`, `sharp`,
  `postcss`) that also fail CI. Audit the FULL remaining list and add overrides for all of them
  before declaring done. Stop only when `audit --audit-level high --json` shows 0 high/critical.
- **Workspace-specific rules.** A monorepo may have multiple `pnpm-workspace.yaml` (e.g. a root
  workspace AND `apps/learning-center/pnpm-workspace.yaml`). Each is independent. Respect each
  workspace's AGENTS.md: some forbid overriding certain transitive deps (e.g. `undici` breaks jsdom
  tests). Don't force-override across workspaces that prohibit it.
- **`>=` lower bound** is what worked in practice, but be aware it can jump a major that breaks a
  parent dep. Prefer the minimal bound that clears the CVE.
- Don't run a full `pnpm install` to test overrides — use `--lockfile-only`. A full install on a
  large monorepo exceeds the 180s foreground timeout.

## ⛔ HARD RULE — esggo: `undici` MUST stay `>=7.29.0 <8`
Verified 2026-08-17 (commit `00fdf211a` regression, fixed in `dc18ebe2c`).
`undici@8` **deleted** `lib/handler/wrap-handler.js`; `jsdom@29.1.1` hard-`require`s that exact path.
Overriding `undici` to `">=8.0.0 <9"` turns **3 workflows red at once** and the failures look unrelated:
| Workflow | Visible symptom |
| --- | --- |
| `OmniCore CI` | `Failed to collect page data for /api/sustain-write/v5/documents` |
| `learning-center-ci` | vitest jsdom env `MODULE_NOT_FOUND` |
| `Deploy to Oracle VPS` | same Next build error **on the VPS** — looks like an SSH/deploy fault but is NOT |

Diagnosis in one command (`undici@7` has the file, `undici@8` does not):
```bash
for d in node_modules/.pnpm/undici@*; do echo "$d:"; ls "$d/node_modules/undici/lib/handler/" | grep wrap; done
```
Functional proof after fixing (must print the resolved path, then `JSDOM OK`):
```bash
node -e "console.log(require.resolve('undici/lib/handler/wrap-handler.js',{paths:['node_modules/.pnpm/jsdom@29.1.1/node_modules/jsdom/lib/jsdom/browser/resources/']}))"
node -e "const {JSDOM}=require('./node_modules/.pnpm/jsdom@29.1.1/node_modules/jsdom/lib/api.js');console.log('JSDOM OK ->',new JSDOM('<p>5T</p>').window.document.querySelector('p').textContent)"
```
Keep the explanatory comment ABOVE the override line — it was deleted during a Dependabot sweep and
that deletion is what allowed the regression. **Never "widen to the major where the patch lives" for
`undici`**; it violates AGENTS.md #5 (cross-major ban) too.

Corollary: when a Dependabot batch flips several overrides at once and CI goes multi-red, `git show
<commit> -- pnpm-workspace.yaml` FIRST and look for a removed protective comment — one bad bound
usually explains all the reds.

## Pitfalls (added 2026-08-17)
- **Duplicate YAML keys in `pnpm-workspace.yaml` block the ENTIRE install.** `pnpm install` aborts
  with `duplicated mapping key (LINE:COL)` and resolves NOTHING. This happens when you add an
  override for a package that already has one elsewhere in the file (easy to miss when the existing
  entry is in a different comment block, e.g. an old `2026-08-11` batch). **Before adding any
  override, grep the file for the exact key** (`search_files pattern='"vitest"'`). If it exists,
  replace/extend the existing line instead of appending a new one. Same trap for `vite`, `undici`,
  `js-yaml` (we hit vitest, vite, undici, js-yaml duplicates this session).
- **Some CVEs have NO stable fix — do not force a cross-major bound you can't verify.**
  `npm view <pkg> version` may time out (registry flakiness); Dependabot/audit will still flag a
  package whose latest stable IS vulnerable. Example from this session: `vitest`'s latest STABLE is
  `4.1.10` and `5.x` is only beta/rc — so the critical CVE has no stable fix; pin `">=4.1.10"` (lock
  to latest stable) rather than `">=5.0.0 <6"` (which fails with `No matching version found`). When
  `npm view`/`pnpm view` can't resolve a version, prefer the confirmed-latest stable bound over a
  guessed major. Also note `vite` resolved two majors in one lockfile (`vite@7.3.6` from our
  override AND `vite@8.1.3` pulled in as a vitest peer) — that's normal pnpm behavior, not a
  conflict.
- **Verify the resolved version actually landed** by grepping `pnpm-lock.yaml` for the package
  (e.g. `search_files pattern='^  vite@'` in `pnpm-lock.yaml`), don't trust the override string
  alone. After a successful install, confirm with the lockfile read.
- **`pnpm list` / `pnpm why` get misclassified as long-lived servers** by the terminal heuristic on
  this host and abort. Read `pnpm-lock.yaml` directly (grep the package name) to confirm resolved
  versions instead of running those commands.

## References
See `references/esggo-omni-center-case.md` for the real 2026-08-06 esggo fix (6 Trivy HIGHs → 0 via
workspace overrides, including the second-pass `next`/`sharp`/`postcss` additions).
