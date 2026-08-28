# TencentDB Agent Memory — Server-stack v3 data-plane API (verified 2026-08-13)

The global-images core (`tdai-memory-core`, port **8420**) exposes an **agentmemory v3** data-plane.
Container source comment confirms: *"data-plane calls now use /v3/* endpoints"*. This is the verified
write/recall surface used by the OA-Team knowledge-avatar sync (`scripts/tdai-memory-sync.mjs`).

## Base + auth
- Base: `http://127.0.0.1:8420` (core). Proxy `tdai-proxy` on **8096** (`/health` → `{"status":"ok","version":"0.2.0"}`).
- Auth: header `Authorization: Bearer <key>` **+** `x-tdai-service-id: default`.
- Key = contents of `/opt/esggo/apps/tencentdb-memory/.admin-key` (39 bytes, `sk-mem-...`).
- The VPS **host shell does NOT have** `TDAI_GATEWAY_API_KEY` (container-internal) — read the key from `.admin-key`.

## Verified endpoints
- **Write conversation memory**: `POST /v3/conversation/add`
  body `{"messages":[{"role":"user","content":"..."}]}` → `{"code":0,"message":"ok","data":{"accepted_ids":["msg-..."],"total_count":1}}`
- **Query / recall**: `POST /v3/conversation/query` → `{data:{messages:[...]}}` (round-trips what you wrote)
- **Knowledge CRUD**: `/v3/knowledge/create | get | update | delete | list`
- Other v3 routes (from container source): `/v3/conversation/count|delete|search`, `/v3/meta`,
  `/v3/internal/meta`, `/v3/instance/destroy`, `/v1/l1/summarize`…`/v1/l4/generate`.

## PITFALL: write paths that 404
These ALL 404 — the path does NOT take a serviceId segment:
`/v3/{service}/memory`, `/v1/{service}/memory`, `/memory`, `/v3/default/knowledge`,
`/v3/default/knowledge/{id}`, `/v1/default/ingest`, `/knowledge/ingest`.
Use the **flat** form `/v3/conversation/add` (service comes from the `x-tdai-service-id` header, not URL).

## PITFALL: reachability + where to run sync scripts
- `8420` only listens **inside the VPS private network**. A `fetch('http://127.0.0.1:8420/...')` from your
  **local** dev machine FAILS (`fetch failed`) even though the stack is "healthy".
- Sync/adapters that write to swarm memory must run **ON THE VPS** (VPS `crontab` entry `avatar-daily.sh`
  that `cd /opt/esggo && node scripts/tdai-memory-sync.mjs`), NOT from a local Hermes `cronjob`
  (which executes locally and cannot reach 8420).
- When a path 404s, enter the container and grep its source for the real route:
  `docker exec tdai-memory-core grep -rnoE '/v3/[a-zA-Z0-9/_-]+' /app/hermes-plugin`
  → reveals `/v3/conversation/add`, `/v3/knowledge/create`, etc. The old agentmemory docs' `/v3/{service}/memory`
  is WRONG for this fork.

## How the real endpoint was found (debug path)
1. `curl /v3/default/memory` → 404; `/v1/default/memory` → 404; `/memory` → 404.
2. Entered container: `docker exec tdai-memory-core grep -rnoE '/v3/[a-zA-Z0-9/_-]+' /app/hermes-plugin`
   → listed all real routes incl. `/v3/conversation/add`.
3. `POST /v3/conversation/add` with `{"messages":[{"role":"user","content":"..."}]}` → `{"code":0,"message":"ok"}`.
4. `POST /v3/conversation/query` → returned the written message (round-trip proven).

## Operational lessons (added 2026-08-13)
- **Run sync scripts ON THE VPS, not via a local Hermes `cronjob`.** A Hermes `cronjob` spawns on the
  local dev box; `fetch('http://127.0.0.1:8420/...')` from there fails with `fetch failed` because 8420
  only listens inside the VPS private network. The correct scheduler is a **VPS-native crontab** entry:
  `0 5 * * * /bin/bash /home/ubuntu/deploy-scripts/avatar-daily.sh` where the script does
  `cd /opt/esggo && node scripts/tdai-memory-sync.mjs`. Do NOT rely on a local Hermes cron for anything
  touching 8420/8125/8096. A manual `cronjob(action='run')` will also fail with a model 404 if the
  job's skill chain tries to call an LLM instead of the VPS — it is the wrong execution surface entirely.
- **Key source order in sync adapters**: `TDAI_GATEWAY_API_KEY` env → else read file `.admin-key`
  (at repo root, and at `/opt/esggo/apps/tencentdb-memory/.admin-key`). The VPS host shell does NOT
  export `TDAI_GATEWAY_API_KEY` (that is container-internal), so the file fallback is mandatory.
- **Don't `git pull` inside the VPS cron if the VPS worktree has uncommitted changes** — `git pull` aborts
  with "Please commit your changes or stash them" and the cron silently produces no output. Either keep
  the VPS worktree clean (CI pushes, VPS only reads) or skip `git pull` in the cron and rely on a prior
  `git push` from the dev box. The working script writes the adapter file directly via `cat` over ssh
  when the VPS is behind on a commit.
- **Guard against test-type leakage into canonical**: `scripts/sync-vault-types.ts --apply` writes new
  types from `.avatar-types.d.ts` into `shared/types.ts`. A probe type like `IAvatarProbeTest` will
  cleanup step (regex `/export\s+(?:type|interface|enum)\s+IAvatarProbe[A-Za-z0-9_]*\s*\{[^]*?\}\n?/g`) at the end of the cron loop to strip `IAvatarProbe*` before commit.
- **`git add -A` leaks untracked `node_modules`** when `.gitignore` lacks that exact path (e.g. `e2e-k1/node_modules/`
  is NOT covered by `apps/*/node_modules`). Always `git add` the specific changed files (or `git diff --cached --name-only`
  and grep for `node_modules` before commit). If leaked, `git reset -q` unstages everything (safe, keeps working tree),
  add the missing `.gitignore` line, then re-add specific files.
