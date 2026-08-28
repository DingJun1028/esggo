# Case study: 17 CI failures → 5 root causes (2026-08-08, cron)

Worked example of the triage discipline in SKILL.md. Useful because the watcher's own
classification was wrong on **every** entry, and one root cause was invisible to log-grep.

## What the watcher said vs. what was true

`gh-error-watch.py` returned 17 `new_failures`. Its `error_type` was wrong across the board and its
`log_excerpt` contained only job group headers — zero error lines.

| Workflow | watcher said | actual root cause |
|---|---|---|
| `.github/workflows/ci.yml` | (empty log) | **startup_failure** — YAML parse error |
| `🌌 ESG GO Sacred Pipeline` | `eslint` | `ERR_PNPM_IGNORED_BUILDS sqlite3@5.1.7` |
| `learning-center-ci` | `eslint` | same pnpm cause |
| `Deploy OmniGateway Worker` | `eslint` | same pnpm cause (inside wrangler custom build) |
| `Deploy to Oracle VPS` | `dependency` | `Permission denied (publickey)`, exit 255 |
| `ESG-GO CI/CD Pipeline` | `dependency` | bash syntax + Trivy CRITICAL secret |

17 runs collapsed to **5 causes across 6 workflows** (repeated pushes re-fire every workflow).
Filed 5 issues (#430–#434), not 17.

## The invisible one

`ci.yml` run 31231596682: `--log-failed` → `log not found`; jobs endpoint → `total_count: 0`.
Local repro gave the exact line:

```
yaml.scanner.ScannerError: mapping values are not allowed here
  in ".github/workflows/ci.yml", line 52, column 16
```

The corruption — a `with:` key orphaned below two `- run:` steps:

```yaml
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
          cache: "pnpm"          # <-- orphan, breaks the whole mapping
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
```

Repeated **identically in 4 jobs**, plus `pnpm/action-setup@v4` duplicated in 5 jobs. The first
`patch` attempt was correctly refused citing line 68 — a *second* copy — which is how the repeat was
discovered. One `replace_all=true` call fixed all four and restored validity.

## The pnpm one

`git show HEAD:pnpm-workspace.yaml` had **no `sqlite3` key at all** under `allowBuilds` — that, not
the local placeholder, was what CI saw. The working tree separately held pnpm's auto-written
`sqlite3: set this to true or false`, which parses as a *string* and would not have fixed anything.

Chose `false`: no `package.json` declares `sqlite3`; the lockfile shows it only as an optional peer of
`knex` / `@mikro-orm/knex`. `false` makes the existing ignore explicit — zero behaviour change.

## Evidence that the fix worked

| check | result |
|---|---|
| `yaml.safe_load('.github/workflows/ci.yml')` | OK, 10 jobs |
| `allowBuilds.sqlite3` type assert | `False` (bool) |
| `pnpm install --frozen-lockfile` | exit 0, `ERR_PNPM_IGNORED_BUILDS` gone |
| `pnpm typecheck` (exit code captured, not piped) | exit 0, 0 TS errors |
| CI on merged `main`, run 31233395903 | **`total_count` 0 → 10**, 3 PASS |
| regression grep for `cannot find module` etc. | empty |

Failures that remained (Vitest, ESLint, Validate VPS Scripts, Secret Scan, Lighthouse, Docker, and
`Build Check` via `needs:`) were **pre-existing and previously unobservable** — they had never run,
because the workflow scheduled zero jobs. Unblocking an install/parse gate reveals downstream debt;
say so explicitly rather than letting it read as a regression.

## Process notes

- PR #435 was **merged by another agent** while verification was still running. Re-read
  `gh pr view --json state` rather than assuming your PR is still open.
- A `git stash` used to isolate the change let a concurrent merge overwrite 8 files of the user's
  uncommitted work. Recovered by pinning the dropped stash SHA to
  `oa-twins/worktree-backup-20260808`. Use `git worktree` next time — see SKILL.md CRITICAL pitfalls.
- P0 that outranked all of the above: Trivy found
  `CRITICAL: Google (gcp-service-account) — firebase-service-account.json:2`, and the file was
  tracked, in HEAD, un-ignored, in a **PUBLIC** repo. Reported for provider-side revocation; not
  bundled into the CI-fix PR.
