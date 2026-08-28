---
name: esggo-native-cli-ops
description: "esggo native CLI build, run, and OmniSecret auth ops."
---

# esggo Native CLI Ops (OmniCLI / oa-cli / esggo-cli)

## When to load
- User says "OmniCLI", "OmniAPI", "oa-cli", "esggo-cli", or asks to "授權使用" / "啟動 自主授權" for 萬能分身.
- User references OmniSecret (秘密聖櫃, `C:\Users\dingj\secret-vault\`) as the key source.
- Building/running any esggo CLI from Hermes terminal or execute_code.

## Reality check (avoid the trap)
These are **native TypeScript CLIs in the esggo repo**, NOT tools in the Hermes tool set:
- `C:\Users\dingj\esggo\cli\omnicli`  → bin `omni`  ("OmniGateway / Omni 生態系統命令控制介面")
- `C:\Users\dingj\esggo\cli\oa-cli`    → bin `oa`    ("OA-Team 30 萬能代理小隊命令控制介面")
- `C:\Users\dingj\esggo\cli\esggo-cli` → bin `esggo` ("ESG-GO 萬能蜂群核心數據命令控制介面")

`tool_search` for "OmniCLI"/"OmniAPI" returns NOTHING — expected, not a bug. Inspect the repo with `execute_code` (Path.rglob) to confirm. User explicitly said memory was corrupted about these being Hermes tools.

## Build & run pattern
```bash
cd C:/Users/dingj/esggo/cli/omnicli
npm install            # exit 0; esbuild postinstall warns are harmless
npm run build          # tsc → dist/index.js
node dist/index.js --help
```
- `node` is at `C:\Program Files\nodejs\node.exe`.
- `npm run build` emits `dist/index.js` (≈3KB for omnicli). Verify exists before running.
- Subcommands: `gateway` (status), `route` (list), `auth` (check).

## OmniCLI auth pattern (the actual "授權使用")
```
omni auth check --dry-run   # previews, prints [DRY-RUN], does NOT call gateway
omni auth check --live      # actually calls Gateway /auth/verify
```
- `--live` needs a running Gateway serving `/auth/verify` at the endpoint omnicli targets.
- omnicli hardcodes `http://localhost:8420` (src/gateway.ts: `cfg.url || 'http://localhost:8420'`). It IGNORES injected `TDAI_GATEWAY_HOST`/`TDAI_GATEWAY_PORT` env — so pointing env at 127.0.0.1 does not redirect it.
- Local 8420 is occupied by Docker/WSL (`com.docker.backend.exe`, `wslrelay.exe` forwarding shell) with NO `/auth/verify` route → 404/502. The real esggo 8420 is the TencentDB MemoryCore gateway (`packages/oa-framework`), not OmniGateway auth.
- Conclusion: `--live` auth only succeeds when a real OmniGateway service (with `/auth/verify`) is deployed — typically VPS (典 5), not bare local. Do NOT report "授權成功" on `--dry-run` or on a 502 — both are non-success.

## OmniSecret (秘密聖櫃) integration
- Master vault: `C:\Users\dingj\secret-vault\ENV20230818.env` (41 keys; contains `TDAI_GATEWAY_API_KEY`, `TDAI_GATEWAY_HOST=127.0.0.1`, `TDAI_GATEWAY_PORT=8420`, `TDAI_LLM_BASE_URL=http://127.0.0.1:11434/v1`).
- Gateway config: `C:\Users\dingj\secret-vault\tdai_gateway.env` (same `TDAI_*` keys; the gateway runtime env source).
- Inject only the needed prefix to run a CLI: read .env, filter `TDAI_`, set into `env` dict for subprocess. Never print key VALUES.
- **Env naming mismatch pitfall**: some esggo services read BARE names (`GATEWAY_API_KEY`, `OMNI_KEY`) while vault stores `TDAI_GATEWAY_API_KEY`. e.g. `apps/gateway/sync/server.ts` refuses with `FATAL: OMNI_KEY / GATEWAY_API_KEY not set` even when `TDAI_GATEWAY_API_KEY` is injected. Map/alias when launching.

## Free-compute composition lessons (recurring user theme)
- **CI/CD**: prefer `ghcr.io` + `GITHUB_TOKEN` (auto-auth, ZERO extra secrets) over DockerHub (needs `DOCKERHUB_USERNAME`/`TOKEN`). `gh` CLI pre-authed (keyring token; output auto-redacted).
- **GitHub repo name MUST be lowercase** — `DingJun1028/crawl4ai-amd64` push fails with "repository name must be lowercase"; use `dingjun1028/...`.
- **pip pin conflicts**: `crawl4ai==0.5.0` + `playwright==1.47.0` → `ResolutionImpossible`. Loosen pins (>=) and split install steps.
- **VPS gateway**: OmniGateway auth belongs on VPS (Oracle Always Free ARM A1), not local. Local role = CLI client + Ollama free backend.

## Pitfalls (do NOT repeat)
1. Do not `tool_search` for OmniCLI/OmniAPI — they are repo CLIs. Inspect with execute_code.
2. `--dry-run` is NOT authorization. A 502/404 is NOT "Bearer valid". Report blocking honestly.
3. omnicli ignores `TDAI_GATEWAY_*` host/port env (hardcoded localhost:8420).
4. Env naming: vault uses `TDAI_` prefix; some services expect bare names.
5. `urllib.request` `timeout=` kwarg errors in this Python env — use `socket` for port probes.
6. Memory corruption happens: user said memory was corrupted about these tools. Verify against repo reality, don't trust stale memory.

## References
- `references/esggo-cli-auth-transcript.md` — detailed build + auth + gotcha transcript.
- `references/free-compute-cicd.md` — Crawl4AI AMD64 ghcr.io CI/CD working recipe.
