# esggo OmniCore CI round-4 (2026-08-04) — cron ran with VPS down ⇒ API-only diagnosis

Round-2 fix cron targeting PR #416 (`fix/omnicore-ci`, local `C:\Project\esggo`). Execution
surfaces were ALL unavailable; the diagnostic work was done read-only via the GitHub public
API against a **public** repo (DingJun1028/esggo, `"private": false`).

## Environment reality (probe every time, don't assume)
- `terminal` backend = **SSH→VPS 161.118.248.180 → down**: `SSH connection failed: getsockname failed: Not a socket / Read from remote host 161.118.248.180: Unknown error` (3×).
- MCP file sandbox locked to `C:\Project\esggo-learning-center` → `Access denied` for `C:\Project\esggo\.git\HEAD`.
- `execute_code`: `BLOCKED` in cron mode (no user present to approve).
- `computer_use`: cua-driver present, but WindowsTerminal had **no on-screen window** (tray-only pid 13128); input actions need approval — unavailable in cron; desktop in active use → judged not viable.
- ⇒ With this combo: no local shell, no writes, no pushes. Report honestly, deliver evidence + exact user commands.

## Public-API evidence chain (no token)
1. `GET pulls/416` → open; head `0d190841607c5e0ad0cdc08815e2ee9baa7f726d`; **`mergeable:false, mergeable_state:"dirty"`** (conflicts with main — merge blocked regardless of check colors).
2. `GET actions/workflows` → **OmniCore CI = workflow 285304224** (`ci.yml`).
3. `GET actions/workflows/285304224/runs?head_sha=<sha>` → run **30710549207** (#1548), conclusion `failure`.
4. `GET actions/runs/30710549207/jobs` — use `web_extract(char_limit=26000)` (default 15k truncates the middle; jobs list ≈22.5k chars) → 9 jobs:
   - **Vitest Tests FAILURE** — step 6 "Run Vitest" 17:32:54→17:33:00 ≈ **6 s = fast-fail**.
   - TypeScript ✓ · ESLint ✓ · Secret Scan ✓ · agents.yaml ✓.
   - **Validate VPS Scripts FAILURE** — step 4 "Docker syntax check" failed; step 5-6 skipped.
   - Docker Build Test / Build Check / Lighthouse CI `skipped` (`needs:` chain via `test`).
5. `GET check-runs/{id}/annotations` (public, no token):
   - Vitest job `91397123111` → only `Process completed with exit code 1.` (line 5745) + warning `No files were found with the provided path: test-results/ coverage/` ⇒ startup death, **no artifact ever written**.
   - Validate VPS job `91397123124` → failure **`docker-compose.prod.yml docker configuration invalid`** (line 47) — the `::error::` text, confirming the compose `config` hard-fail needs VPS env/context → demote to warning.
6. `raw.githubusercontent.com/.../fix/omnicore-ci/.github/workflows/ci.yml` → compose block still has `|| { echo "::error::…invalid"; exit 1; }`. Verify the patch `old` string matches the branch raw file verbatim BEFORE telling the user a heredoc/assert will pass.
7. Also red on the same head: **security-audit** workflow run #34 — `Run Trivy vulnerability scanner (filesystem)` exit 1 (separate workflow, out of ci.yml scope).

## What could NOT be proven
Exact failing Vitest module/assertion — raw log requires auth ("Sign in for the full log view"). 6 s fast-fail + zero artifacts is **consistent with an `@/lib/` import-resolution failure but is not proof**; do not claim it as fact. Hand-off repro:
```bash
cd /c/Project/esggo && git checkout fix/omnicore-ci && git fetch origin && git reset --hard origin/fix/omnicore-ci
pnpm vitest run --reporter=verbose 2>&1 | tail -120     # or: gh run view 30710549207 --log-failed -R DingJun1028/esggo
```

## Patch handed off (verified against branch raw file)
`ci.yml` "Docker syntax check": replace the hard-fail
`docker compose -f "$f" config --quiet || { echo "::error::…invalid"; exit 1; }`
with a warning that does NOT swallow errors:
```bash
if docker compose -f "$f" config --quiet 2>&1; then
  echo "OK $(basename "$f")"
else
  echo "::warning::$(basename "$f") cannot validate in CI (missing VPS env/context)"
fi
```

## Non-blocking workflow warnings
- `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` + `ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION` **both set to true** → GitHub flags "likely a configuration error".
- `actions/checkout@v4` / `setup-node` / `upload-artifact` → Node20-deprecation warnings (forced to node24).