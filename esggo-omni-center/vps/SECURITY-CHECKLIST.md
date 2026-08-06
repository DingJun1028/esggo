# ESGGO VPS — Security Pre-Deploy Checklist

Run this before every merge to `main` that touches `vps/`. Most items are
enforced automatically by the `validate-vps-scripts` CI job; the manual ones
are called out.

## 1. Secrets never in git
- [ ] No real credentials committed. `git diff` of the PR contains only
      variable **names**, never values (`ocid1.*`, `AKIA*`, `ghp_*`,
      `xox*`, `-----BEGIN*PRIVATE KEY-----`, live API keys).
- [ ] `.env.secrets` and `.env.secrets.*` are gitignored AND un-tracked
      (`git ls-files | grep -E '\.env\.secrets' ` returns nothing).
- [ ] Every secret is read from `process.env` / `$ENV` only, sourced from the
      gitignored `.env.secrets` at runtime.

## 2. No hardcoded default secrets in code
- [ ] No script sets `TOKEN="${TOKEN:-<literal-secret>}"`. A missing secret
      must **fail fast** (`${TOKEN:?...}`) or read from env with empty default
      and be required at runtime — never embed the literal value.
- [ ] Shared credentials (relay token, gateway key) are defined in exactly ONE
      place (`.env.secrets`); scripts only consume them.

## 3. Network exposure (defense in depth)
- [ ] Long-running servers bind `127.0.0.1`, not `0.0.0.0`, unless an
      upstream proxy (nginx) or firewall is the only public entry.
- [ ] The gateway (`omni-server.mjs`) binds loopback; nginx terminates TLS
      and proxies `/` → `http://127.0.0.1:8642`.
- [ ] Sensitive endpoints (`/agent/*`, `/agents`, `/execute`) require
      `requireAuth` (validates `X-Omni-Token`).
- [ ] Public endpoints (`/status`) must not leak topology (agent IDs, hosts,
      channels). Sensitive fields are gated behind a valid token.

## 4. Branch / history hygiene
- [ ] No floating commits: every change lands via a feature branch + PR.
- [ ] Squash-merge only after confirming the PR diff does not accidentally
      carry an unmerged/orphan commit's files.
- [ ] Stale remote branches (`feat/*`, `chore/*` already merged) are deleted
      after merge to avoid clutter and accidental reuse.
- [ ] `main` requires 1 approving review (branch protection). Self-approval is
      blocked by GitHub; relax protection only to merge, then restore it.

## 5. Deploy runbook
- [ ] `vps/deploy-after-merge.sh --dry-run` prints the full command sequence
      with no side effects — reviewed before the real run.
- [ ] `vps/oci/check-prereqs.sh` passes (CLI tools + required env) before any
      OCI Functions deploy.

## Incident pattern (what we fixed)
- `app.listen('0.0.0.0')` + unauthenticated `/agent/*` = remote command queue
  exposure → fixed: loopback bind + `requireAuth` on all `/agent/*`.
- Hardcoded relay token `esggo-relay-20260707` in 3 scripts → fixed: read from
  env, fail fast if unset.
- `/status` returned full agent topology to anyone → fixed: gated behind token.
- `.env.secrets` tracked by git → fixed: gitignored + `git rm --cached`.
- Orphan commit `4b6e95022` pulled into a squash via a stale local `main` →
  fixed: always `git fetch` + rebase local main onto `origin/main` before
  branching.
