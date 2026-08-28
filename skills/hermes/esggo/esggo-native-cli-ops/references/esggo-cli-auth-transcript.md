# esggo CLI Auth — Session Transcript (condensed)

Source of truth: esggo repo `cli/` folder. Repo root `C:\Users\dingj\esggo`.

## CLI inventory (native TypeScript)
- `cli/omnicli`  → bin `omni`  — OmniGateway / Omni ecosystem control interface
- `cli/oa-cli`    → bin `oa`    — OA-Team 30 agent squad control interface
- `cli/esggo-cli` → bin `esggo` — ESG-GO swarm core data control interface

Each has `src/index.ts`, `src/gateway.ts`, `src/index.test.ts`, `tsconfig.json`, `package.json` with `bin`.

## Build (verified)
```
cd C:/Users/dingj/esggo/cli/omnicli
npm install      # exit 0; esbuild postinstall warnings harmless
npm run build    # tsc -> dist/index.js (2943B for omnicli)
node "C:\Program Files\nodejs\node.exe" dist/index.js --help
```
`omni --help` → commands: gateway, route, auth.
`omni auth --help` → subcommand `check [options]` (验证 TDAI Bearer 鑑權有效性).
`omni auth check --help` → options: `--dry-run` (预演), `--live` (实查).

## Auth reality (the gotcha)
- `omni auth check` (no flag) defaults to `--dry-run` → prints `[DRY-RUN] omni auth check → 將呼叫 Gateway /auth/verify` and a `[5T:Traceable]` line. It does NOT hit the gateway. Do not read this as "authorized".
- `omni auth check --live` calls `gatewayRequest('/auth/verify')`.
- `src/gateway.ts`: `return { url: cfg.url || 'http://localhost:8420', token: cfg.token };` — hardcoded `localhost:8420`. Injected `TDAI_GATEWAY_HOST=127.0.0.1` is IGNORED.
- Actual `--live` result observed: `[BLOCKER] Gateway 鑑權失敗: Gateway /auth/verify failed: Gateway 502: <!DOCTYPE html>...esggo.co | 502: Bad gateway`. This is a Cloudflare 502 (tool targets esggo.co domain path), NOT "Bearer valid".

## Why local auth cannot succeed
- Local `:8420` is LISTENING but owned by `com.docker.backend.exe` (PID 4592) and `wslrelay.exe` (PID 11692) — Docker/WSL port-forward shell, not esggo gateway.
- Direct socket probe `127.0.0.1:8420/auth/verify` → `HTTP/1.1 404 Not Found {"error":"Not found: GET /auth/verify"}`.
- The real esggo 8420 in source is the TencentDB MemoryCore gateway (`packages/oa-framework/src/adapters/tencent-mem.ts`: `coreUrl: oa.memoryGateway ?? 'http://127.0.0.1:8420'`), not OmniGateway auth.
- Conclusion: OmniGateway `/auth/verify` server is NOT in the local esggo source tree (full rglob found no server-side registration). It must be deployed (VPS, 典 5) for `--live` to verify.

## OmniSecret (秘密聖櫃) env injection
- `C:\Users\dingj\secret-vault\ENV20230818.env` — 41 keys, master vault.
- `C:\Users\dingj\secret-vault\tdai_gateway.env` — gateway runtime env (TDAI_GATEWAY_HOST=127.0.0.1, TDAI_GATEWAY_PORT=8420, TDAI_LLM_BASE_URL=http://127.0.0.1:11434/v1, TDAI_GATEWAY_API_KEY=[REDACTED]).
- Inject pattern: read .env, filter lines starting with `TDAI_`, set into subprocess `env` dict. Never print values.
- Env naming mismatch: `apps/gateway/sync/server.ts` (OmniAgent sync engine, port 8650) refuses to start: `FATAL: OMNI_KEY / GATEWAY_API_KEY not set` even with `TDAI_GATEWAY_API_KEY` injected. Some services expect BARE names. Alias when launching.

## Port probe gotcha
`urllib.request.Request(..., timeout=5)` raises `unexpected keyword argument 'timeout'` in this Python env. Use raw `socket.connect` with `settimeout` for port checks.
