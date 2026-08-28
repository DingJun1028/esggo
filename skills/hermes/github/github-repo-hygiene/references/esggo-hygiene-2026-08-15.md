# Session Reference: esggo Repo Hygiene 2026-08-15

## Observed failure mode

- GitHub Actions workflow `ESG-GO CI/CD Pipeline`, `OmniCore CI`, `learning-center-ci` failed at install stage with `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`.
- `pnpm install --frozen-lockfile` failed in CI but succeeded locally because CI enforces the frozen lockfile.

## Verified root cause

- `pnpm-workspace.yaml` gained override entries for `tar` and `js-yaml` without regenerating `pnpm-lock.yaml`.
- Workspace overrides count did not match lockfile overrides count.

## Verified fix

- Run `pnpm install --lockfile-only --no-frozen-lockfile`.
- Commit only `pnpm-lock.yaml`.
- Confirm with `pnpm install --frozen-lockfile` exits 0.

## Canonical evidence

- Fix commit: `e0340efff5a456d63aec87935d80cdd7daee7e88`
- Related PR: #757
- After this fix, OmniCore CI and learning-center-ci were green on main.

## Tracker noise

- Multiple duplicate `[OA-TWINS-AUTO-REPAIR]` issues were created for the same root cause.
- Cleanup: close duplicates and keep one canonical tracker per root cause.

## Auth hardening

- `src/lib/webhook-auth.ts` `verifyWebhookSignature()` was patched to reject mismatched buffer lengths before `timingSafeEqual`.
