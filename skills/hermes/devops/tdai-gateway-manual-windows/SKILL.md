---
name: tdai-gateway-manual-windows
description: Manually run/debug the TencentDB memory gateway on Windows.
---

# TencentDB Agent Memory Gateway — manual Windows operation

The official `scripts/setup-hermes-memory-tencentdb.bat` hides a lot. When it misfires, or you want local/free operation (no Groq key), you must launch the gateway yourself:

```
cd <repo>/TencentDB-Agent-Memory-main
node --import tsx/esm src/gateway/server.ts
```

This skill is the battle-tested field guide for that path. All findings below are from a real Windows 11 + node 24/22 + Ollama session.

## 0. The one rule that breaks everything: NODE VERSION
- **node 24.x breaks the vector store.** `node:sqlite` in node 24 reports `Cannot enable extension loading because it was disabled at database creation` even when `new DatabaseSync(path, { allowExtension: true })` is set, and `require("sqlite-vec").load(db)` silently fails → `l0_vec`/`l1_vec` report `no such module: vec0` → VectorStore enters degraded no-op mode.
- **node 22.x works.** `sqlite-vec` `getLoadablePath()` + `db.loadExtension(path)` builds `vec0` virtual tables fine (hand-tested: `CREATE VIRTUAL TABLE t USING vec0(embedding float[3])` → OK).
- If `C:\Users\dingj\.vite-plus\js_runtime\node\22.22.1\node.exe` exists, use it directly. Don't rely on `node` on PATH (it may be 24).

## 1. Launch script (verified)
Write a bash launcher and background it:
```bash
#!/usr/bin/env bash
# FORCE yaml llm config: env overrides yaml, so clear the TDAI_LLM_* vars
unset TDAI_LLM_BASE_URL
unset TDAI_LLM_API_KEY
unset TDAI_LLM_MODEL
export TDAI_GATEWAY_CONFIG="C:\\path\\to\\repo\\tdai-gateway.yaml"
cd /path/to/repo/TencentDB-Agent-Memory-main
exec "/c/Users/dingj/.vite-plus/js_runtime/node/22.22.1/node.exe" --import tsx/esm src/gateway/server.ts
```
- `setx TDAI_LLM_*` from a prior session will silently override your YAML `llm:` block. If the gateway logs `StandaloneLLMRunner: model=gpt-4o` (or any non-Ollama model) despite your YAML saying `qwen2.5`, env is winning. `unset` them in the launcher.
- Background it: `terminal(background=true, command='bash "C:\\...\\launcher.sh" > /tmp/gw.log 2>&1', notify_on_complete=true)`.

## 2. Config file resolution (where the YAML must live)
- Gateway resolves config via `resolveConfigPath()`: (1) `TDAI_GATEWAY_CONFIG` env, (2) `./tdai-gateway.yaml` in CWD, (3) `<dataDir>/tdai-gateway.yaml`.
- **MSYS /tmp pitfall:** in git-bash, `/tmp` maps to `C:\Users\dingj\AppData\Local\Temp`, NOT `C:\tmp`. Always write the yaml with a Windows-absolute `write_file` path (e.g. `C:\Users\dingj\AppData\Local\Temp\TencentDB-Agent-Memory-main\tdai-gateway.yaml`) and set `TDAI_GATEWAY_CONFIG` to the same Windows path to be safe.
- **embedding config nesting:** the gateway passes `config.memory` to the TDAI Core. So embedding goes under `memory.embedding:`, NOT a top-level `embedding:`. Top-level `embedding:` is ignored (gateway logs `embedding=none`).
- **Docker `start-memory-core.sh` lands in this exact trap:** the esggo VPS script generates a top-level `embedding:` block, so even with Ollama installed + `nomic-embed-text` pulled, the deployed `tdai-memory-core` reports `embeddingService: false` / `dimensions=0`. The node launch below (yaml with `memory.embedding:` nested) is the working fix. See `tencentdb-agent-memory-deploy` → "Ollama self-hosted variant → Path B" for the VPS framing of this same issue.
- yaml shape that works (local Ollama, no external key):
```yaml
server:
  host: 127.0.0.1
  port: 8420
  apiKey: "<hex32>"
data:
  baseDir: "C:\\Users\\dingj\\.memory-tencentdb\\memory-tdai"
memory:
  embedding:
    provider: openai
    baseUrl: "http://127.0.0.1:11434/v1"
    apiKey: "ollama-local"
    model: "nomic-embed-text"
    dimensions: 768
llm:
  baseUrl: "http://127.0.0.1:11434/v1"
  apiKey: "ollama-local"
  model: "qwen2.5:3b-instruct-q4_K_M"
  maxTokens: 4096
  timeoutMs: 180000
```

## 3. Local Ollama = free backend (no Groq needed)
- Ollama usually already has `nomic-embed-text` (embedding) and, if a prior pull succeeded, `qwen2.5:3b-instruct-q4_K_M` (chat/LLM). Verify: `ollama list`.
- Ollama accepts ANY Bearer token on its OpenAI-compat `/v1` endpoints (the `apiKey` value is cosmetic — set it to anything non-empty, e.g. `ollama-local`).
- Pulling new models often fails offline (network-restricted env) — check `ollama list` before assuming a model is missing; a finished manifest + blobs may already be present.

## 4. CRITICAL misdiagnosis trap: python "no such module: vec0" is a FALSE NEGATIVE
- Standard-library `sqlite3` in Python does NOT load the `vec0` extension. Querying `SELECT count(*) FROM l0_vec` from Python ALWAYS errors `no such module: vec0` — even when the gateway wrote vectors successfully.
- **To truly verify vectors were written, query through node + sqlite-vec (which has vec0 loaded):**
```bash
"/c/Users/dingj/.vite-plus/js_runtime/node/22.22.1/node.exe" --import tsx/esm -e "
const { createRequire } = await import('module');
const req = createRequire(import.meta.url);
const v = req('sqlite-vec');
const { DatabaseSync } = req('node:sqlite');
const db = new DatabaseSync('C:/Users/dingj/.memory-tencentdb/memory-tdai/vectors.db', { allowExtension: true });
db.enableLoadExtension(true); db.loadExtension(v.getLoadablePath());
for (const t of ['l0_vec','l1_vec','l0_fts','l1_fts']) {
  try { console.log(t+':', db.prepare('SELECT count(*) c FROM '+t).get().c); }
  catch(e){ console.log(t+': ERR',e.message); }
}
"
```
- Also stop the gateway first (WAL lock) if you get `unable to open database file`.

## 5. Verification sequence (what "fully working" looks like in logs)
- Startup: `Using remote embedding (provider=openai, model=nomic-embed-text)`, `Store created: ... embedding=enabled, dimensions=768`, `Stores initialized: ... embedding=openai`, `Gateway listening on http://127.0.0.1:8420`, `auth=ENABLED (Bearer)`.
- On capture: `[L0-vec-index-bg] Background embedding complete: 2/2 vectors updated (NNNms)` → vectors ARE written.
- For L1: `StandaloneLLMRunner: model=qwen2.5:3b-instruct-q4_K_M` and `[l1-extractor] Extracting from N new messages`. L1 writes to `l1_vec`/`l1_fts`.

## 6. Known blocker: Ollama 0.32.6 + qwen2.5 Chinese encoding
- Through BOTH `/v1/chat/completions` and native `/api/chat`, qwen2.5:3b on Ollama 0.32.6 returned English "your input appears to be encoded/scrambled" for Chinese prompts — i.e. the L1 extraction prompt (Chinese) gets garbled, so L1 may produce no usable records. If `l1_vec` stays 0 while `l0_vec` grows, suspect this. Mitigations: try a different local model, or a newer Ollama build, or route LLM through an OpenAI-compatible endpoint that handles UTF-8 correctly.

## 7. Bearer auth check
- No key → write returns 401. With `server.apiKey` set and `Authorization: Bearer <key>` → 200. `auth=ENABLED (Bearer)` in startup log confirms.
- **API surface gotcha (2026-08-18):** two route families appear in docs/code —
  - Python client / `tencent-mem.ts` historically used `POST /v3/conversation/add` + `POST /v3/conversation/search` (§8.3).
  - Live 2026-08 build actually serves **`POST /capture`** (body `user_content/assistant_content/session_key`) + **`POST /search/memories`** (body `query/maxResults`) + **`GET /health`** (free, no Bearer).
  - `dispatch` calling the `/v3/conversation/*` routes silently fails (scaffold echo). Always probe the running build: `curl :8420/health` and `curl -X POST :8420/capture` to confirm which surface is live before wiring the OA adapter.

## 8. Recovery: Docker daemon dies → gateway dies (2026-08 session fix)
When the Docker Desktop engine is recycled (daemon stop / crash), any node-launched `MemoryCore` gateway also exits (its process is in the same session/namespace and loses its filesystem sockets). Recovery sequence that was proven live:
1. Wait for the daemon: loop `docker info` until it returns a version (`29.6.2`).
2. Restart the node gateway with the same launcher (node22 + unset TDAI_LLM_* + TDAI_GATEWAY_CONFIG):
   `bash C:/Users/dingj/AppData/Local/hermes/scripts/tdai-launch.sh > /tmp/tdai-gw.log 2>&1` (background=true).
3. Wait ~15s, then verify: `curl :8420/health` must return `{"status":"ok","stores":{"vectorStore":true,"embeddingService":true},...}`.
4. If it still reports `embeddingService:false`, re-check (a) node is 22 (not 24), (b) TDAI_LLM_* vars are unset, (c) the YAML uses nested `memory.embedding:` (not top-level).
5. Re-run `npm install` in `MemoryCore` if you see `Cannot find package 'tsx'`.

## 9. Docker 3-service stack (`apps/tencentdb-memory`) — the preferred path
This is the bundled `esggo` deployment: `tdai-memory-core` (8420) + `tdai-memory-hub` (8125/8424) + `tdai-proxy` (8096). One-liners: `./start-all.sh` (or `PULL=1 ./start-all.sh` to refresh images). Images: `agentmemory/memory-core|memory-hub|memory-proxy:latest`.

### 9.1 Windows startup bug — `start-memory-hub.sh` crashes (FIXED in repo)
`detect_host_ip()` on Windows returns **empty** (`hostname -I` yields nothing; the macOS-only `ipconfig getifaddr` branch just prints Windows `ipconfig` help text and captures garbage). Without a guard this produced `MEMORY_HUB_PROXY_PUBLIC_URL=http://:8096`, and the hub container's inline Python config writer threw `SyntaxError: unterminated string literal (detected at line 9)` → container `exited`.
**Fix (landed in `start-memory-hub.sh`):** every branch validates with IPv4 regex `^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$`, and the final fallback is `host.docker.internal` (NOT empty/localhost). With the fix, the log prints `自动探测宿主机地址: MEMORY_HUB_PROXY_PUBLIC_URL=http://host.docker.internal:8096` and the hub comes up healthy.
**If you hit the old crash on a fresh checkout:** set `MEMORY_HUB_PROXY_PUBLIC_URL=http://host.docker.internal:8096` explicitly in `.env` to bypass detection.

### 8.2 Local Ollama wiring (free compute, no Groq)
In `.env` point the LLM at the host Ollama via the Docker Desktop magic hostname:
```
MEMORY_LLM_BASE_URL=http://host.docker.internal:11434/v1
MEMORY_LLM_API_KEY=ollama-local-not-verified
MEMORY_LLM_MODEL=qwen2.5:3b-instruct-q4_K_M
KNOWLEDGE_PUBLIC_BASE_URL=http://host.docker.internal:8424/v3
MEMORY_HUB_PROXY_PUBLIC_URL=http://host.docker.internal:8096
```
`host.docker.internal` resolves **inside containers only** — the MSYS shell on the host cannot resolve it (host-side probes get HTTP=000), but the in-container health check from `tdai-memory-hub` → Ollama returns HTTP=200. This is expected; `verify.sh`'s host-side LLM check false-negatives for this reason.

### 8.3 Real v3 API routes (for cross-agent shared memory)
The Python client / `tencent-mem.ts` adapter use these (confirmed live):
- Write: `POST /v3/conversation/add` body `{sessionId, messages:[{role,content}]}` → `{data:{accepted_ids:[...]}}`
- Recall: `POST /v3/conversation/search` body `{sessionId, query}` → `{data:{messages:[...]}}`
- Alt recall: `POST /v3/atomic/search` → `{data:{items:[...]}}`
- Admin bootstrap: `POST /v3/internal/meta/user/init-admin` `{username,user_key}` → 200 first time, 409 if exists. The generated `user_key` is persisted to `.admin-key`.
- **Auth:** `/v3/conversation/add` requires `Authorization: Bearer <user_key>` (the `.admin-key` value), NOT the gateway apiKey. Local mode has gateway apiKey empty, so use the admin user_key as Bearer.

### 8.4 Two bees sharing one session (proof pattern)
Two OA-Team agents write to the same `sessionId` (e.g. `oa-swarm-shared-xxx`); each can `conversation/search` and see the other's messages. The `tencent-mem.ts` adapter defaults `coreUrl=http://127.0.0.1:8420`, so a local instance is auto-wired. Smoke test: `packages/oa-framework/test/tencent-mem-shared-memory.mjs` (SKIPs cleanly if core unreachable / no key).

### 8.5 Docker Desktop must be running
|`start-all.sh` fails with `failed to connect to the docker API at npipe:////./pipe/dockerDesktopLinuxEngine` if the Docker Desktop daemon isn't up. Launch it (`Docker Desktop.exe`) and wait for `docker ps` to return before running the scripts. On a fresh boot the engine can take 30–60s after the process appears.

### 8.6 Docker-stack wiring verification (2026-08-18 proven)
After `start-all.sh`, confirm the Ollama bridge worked:
- **Core** (`tdai-memory-core` :8420): `curl :8420/health` → `{"status":"ok","stores":{"vectorStore":true,"embeddingService":true}}` (embeddingService must be `true`).
- **LLM probe**: `POST :8420/v3/conversation/add` with Bearer `.admin-key` then `POST :8420/v3/conversation/search` → `Found N matching memories`. If `Found 0`, the LLM layer isn't writing (check `MEMORY_LLM_MODEL` exists in local Ollama: `ollama list`).
- **If gateway restarts and logs `embeddingService:false`/`dimensions=0`** (rare after Docker daemon recycle): stop gateway, `unset TDAI_LLM_*`, relaunch via node22 launcher (`tdai-launch.sh`) — the in-process gateway often recovers faster than the compose stack.
- **Key mismatch guard**: `.env` `MEMORY_LLM_MODEL` MUST be a tag returned by `ollama list` on the **host** (e.g. `qwen2.5:3b-instruct-q4_K_M`). A typo silently makes `embeddingService:false` because Ollama 404s on unknown tags and the gateway swallows the error as "no embedding provider".
