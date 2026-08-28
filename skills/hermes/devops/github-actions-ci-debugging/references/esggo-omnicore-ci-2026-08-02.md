# esggo OmniCore CI — Round 2 (2026-08-02, PR #416) evidence

Companion to `esggo-omnicore-ci-2026-08.md`. This round proved the blanket
`@/lib/` → `@lib/` rewrite is WRONG for the esggo monorepo and produced the
verify-first methodology now in SKILL.md Step 4.4.

## Repo topology facts (verified 2026-08-02, branch fix/omnicore-ci)
- `tsconfig.json` paths: `"@/*": ["./src/*"]` AND `"@lib/*": ["./lib/*"]`.
  Root tsconfig `include` covers only `src/{impl,lib,types}`; `app/**` is
  excluded (route files are compiled by `next build`, not root tsc).
- `src/lib/` = **real implementation** (85 files: api-utils.ts 2769B,
  firebase-admin.ts, cron-jobs.ts, village-seeder.ts, rate-limit.ts,
  zkp-service.ts, celestial/implementation.ts, cloudflare/*, omni-core/*, …).
- `lib/` = **thin shim layer** (108 files; api-utils.ts = 38B, esggo.ts = 34B,
  firebase.ts = 37B → re-export stubs; no village-seeder / rate-limit /
  cron-jobs / firebase-admin / celestial).
- ⇒ `@/lib/X` is LEGAL whenever `src/lib/X` exists; only targets missing from
  `src/lib/` but present in `lib/` were genuinely broken.

## Import-target comparison (PR #416 diff, 30 unique targets)
- **Genuinely broken (9)** — keep `@lib/`: `adk/arvo-wings-agents`,
  `adk/ten-wings-agents`, `core/5t-protocol`, `services/adk/apostle-dispatcher-server`,
  `services/adk/apostle-squad-manager`, `services/esg/DataOrchestratorServer`,
  `services/esg/ReportGeneratorServer`, `services/google-drive`, `services/ncbdb`.
  (≈ the original "7 files / 11 occurrences" diagnosis.)
- **Mis-scoped (21)** — revert to `@/lib/`: `api-utils` (×65 files),
  `agnes-api`, `ncb-client`, `esg-sonnar`, `five-t-protocol`,
  `celestial/implementation`, `cloudflare`, `omni-core`, `omni-core/omni-kernel`,
  `omni-core/entropy-forge`, `storage-service`, `omni-base/plugin-registry`,
  `prisma`, `village-seeder`, `rate-limit`, `zkp-service`, `firebase`,
  `omni-agent`, `omni-theme`, `sustain-write`, `sustain-write/omni-tag`.
  15 of these have NO `lib/` counterpart → blanket sed created NEW
  `Module not found` errors (village/data → `@lib/village-seeder`, village/vote →
  `@lib/rate-limit` + `@lib/celestial/implementation`).

## CI results on commit 0d19084 (PR #416, 76 files)
- ✅ TypeScript Check / ESLint / Secret Scan / GitGuardian / agents.yaml.
- ❌ Vitest Tests — its failure SKIPPED `Build Check` (build job has
  `needs: [typecheck, eslint, test, secret-scan]`). So the import fixes were
  never exercised; fix the test job first.
- ❌ build (exit 127 = command-not-found @ ci.yml line 45, from the
  "Build & publish AI Station image" workflow — pre-existing, not import-related),
  build-and-test, check-types-sync, Code Quality, Security Scan, Workers Builds,
  原罪煉金 (many are other workflows' pre-existing failures).
- ❌ Validate VPS Scripts — the Docker syntax-check block was fixed, so the
  remaining failure is elsewhere in that job (Bash/Node/secret steps).

## PR body mojibake
`gh pr create --body "中文..."` invoked from a PowerShell-staged `.bat` produced
garbled body text on GitHub (PS 5.1 passes native-exe args in the system ANSI
codepage — Big5 on zh-TW — corrupting UTF-8). Fix: write body to a UTF-8 file,
`gh pr create --body-file body.md` / `gh pr edit N --body-file body.md`.
Commit `-m` lines were ASCII-only and safe.

## Handoff state
Fix-round-2 script staged at
`C:\Project\esggo-learning-center\cron-fix-logs\omnicore-fix2.ps1` (+ `.bat`,
`pr-body-416.md`, `README-fix2.md`): reverts the 21 mis-scoped targets via
quoted-string `.Replace()` (NOT regex — avoids PS 5.1 MatchEvaluator quirks),
re-verifies both alias directions, runs local vitest, commits/pushes, and
`gh pr edit 416 --body-file`. NOT executed: cua-driver session died mid-cron
(`session '…' has ended`) and could not be revived in-session — all
`capture`/`list_windows` failed while `wait`/`list_apps` still worked
(see windows-desktop-automation skill).
