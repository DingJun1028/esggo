---
name: oa-team-memory-integration
description: "Wire OA-Team dual-hive to TencentDB Agent Memory."
version: 1.0.0
author: ESG-GO OA-Team
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [esggo, oa-team, tencentdb-memory, dual-hive, 60-colony, 5t, shared-memory]
---

# OA-Team + TencentDB Agent Memory Integration

Integrate OA-Team 60-colony dual-hive (蜂王 01-30 + 蜂后 31-60) with TencentDB Agent Memory (MemoryCore :8420 + MemoryHub :8125 + Proxy :8096) for shared long-term memory across local/VPS agents.

## Trigger

- Deploying TDAI locally or on VPS
- Wiring OA-Team agents to shared memory backend
- Debugging `tdai-memory-hub` startup failures on Windows
- Setting up healthchecks + alerts for memory pipeline

## Quick Start

```bash
cd apps/tencentdb-memory
cp .env.example .env
./start-all.sh          # or PULL=1 ./start-all.sh
./verify.sh
```

Endpoints:
- Core health: `http://localhost:8420/health`
- Panel: `http://localhost:8125/`
- KS health: `http://localhost:8424/health`

## Windows-Specific Fixes (MANDATORY)

### 1. Docker Desktop engine may be down
If `docker ps` fails with `npipe:////./pipe/dockerDesktopLinuxEngine`:
```bash
start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
for i in $(seq 1 20); do if docker ps >/dev/null 2>&1; then break; fi; sleep 4; done
```

### 2. start-memory-hub.sh detect_host_ip bug
The bundled `detect_host_ip()` fails on Windows:
- `hostname -I` returns empty
- `ipconfig getifaddr` is macOS-only (Windows prints help text)
- Empty/garbage IP becomes `http://:8096` → container Python config crashes with `SyntaxError: unterminated string literal`

**Fix**: Patch `detect_host_ip()` in `start-memory-hub.sh`:
- Add IPv4 regex guard `^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$` to all branches
- Strip `\r` from all IP outputs
- Fallback to `host.docker.internal` (not `localhost`) when detection fails

### 3. init-admin HTTP=000
The script calls `/usr/bin/curl` which is absent in MSYS. Workaround:
```bash
curl -sS -X POST -H "Content-Type: application/json" -H "x-tdai-service-id: default" \
  http://localhost:8420/v3/internal/meta/user/init-admin \
  -d '{"username":"admin","user_key":"<key-from-.admin-key>"}' 
# Expect 200 (first run) or 409 (already exists)
```

### 4. Node libuv assertion on Windows
`process.exit()` in async handlers triggers `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)` → exit code 127.
**Fix**: use `process.exitCode = N` instead.

## Core API Routes (verified)

| Operation | Method | Path |
|-----------|--------|------|
| Health | GET | `/health` |
| Write conversation | POST | `/v3/conversation/add` |
| Search conversation | POST | `/v3/conversation/search` |
| Atomic search | POST | `/v3/atomic/search` |
| Core read | POST | `/v3/core/read` |
| Tools list | POST | `/v3/tools/list` |
| Tool call | POST | `/v3/tools/call` |

Auth: `Authorization: Bearer <user_key>` + `x-tdai-service-id: <service>` header.

## 60-Agent Dual-Hive Memory Mapping

Each of the 60 agents maps to a `MemoryAsset` with:
- `alignment`: `umbra` (暗系蜂王 01-30) or `lumen` (光系蜂后 31-60)
- `archetype`: e.g. Smith, Depth, Architect, Weaver, Seer, Shaper, Painter, Flow, Narrator, Resonator, Herald, Bridger, Erode, Nexus, Skinner, Scout, Wraith, Lens, Purifier, Hawk, Ward, Curator, Echo, Seal
- `kind`: `chat_memory` / `skill` / `wiki` / `codegraph`
- `visibility`: `private` / `team` / `restricted` / `agent`

See `references/oa-team-60-memory-mapping.md` for the full table.

## Healthcheck Pattern

Use a two-bee probe with usage thresholds:
- Write 2 messages (Bee-07 + Bee-03) to a shared session
- Recall from both sides
- Fail if writes < 2 or recalls < 1 (pipeline-alive-but-unused false positive)
- Quiet mode (`HEALTHCHECK_QUIET=1`) for cron: only print on failure

## Cron + Telegram Alerting

```bash
cronjob(action='create',
  name='OA-Team 記憶健康檢查',
  schedule='every 180m',
  workdir='C:/Project/esggo',
  deliver='telegram:<chat_id>',
  prompt='Run scripts/oa-memory-healthcheck.mjs with TDAI_GATEWAY_URL=http://127.0.0.1:8420. Read TDAI_GATEWAY_API_KEY from apps/tencentdb-memory/.admin-key at runtime.')
```

## SSH Key Setup (GitHub)

```bash
gh api -X POST /user/keys -f title="<name>" -f key="$(cat ~/.ssh/id_rsa_<name>.pub)"

# ~/.ssh/config
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa_<name>
  IdentitiesOnly yes

ssh -T git@github.com
# Expected: "Hi <user>! You've successfully authenticated..."
```

## pnpm Overrides Pattern

When adding CVE fixes to `pnpm-workspace.yaml`:
- Use `">=<fixed> <next_major"` range (e.g. `">=7.0.0 <8"`)
- Remove old duplicate entries for the same package
- Verify with `pnpm install --no-frozen-lockfile`
- Check lockfile versions with `grep '^  <pkg>@' pnpm-lock.yaml`
- Don't force cross-major to unreleased versions (e.g. vitest 5.x is beta)

## References

- `references/oa-team-60-memory-mapping.md` — Full 60-agent umbra/lumen table
- `references/windows-tdai-pitfalls.md` — Windows-specific Docker/TDAI workarounds
- `references/core-api-routes.md` — Verified TDAI MemoryCore routes from container source
- `references/healthcheck-usage-threshold.md` — Two-bee probe with usage thresholds
- `references/telegram-cron-alert.md` — Cron job setup with Telegram delivery
