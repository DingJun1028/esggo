---
name: tencentdb-agent-memory
description: >
  Wire and operate the TencentDB Agent Memory system
  (@tencentdb-agent-memory/memory-tencentdb) with Hermes / OpenClaw: 0.4.x path
  consolidation, official ctl tooling, gateway config, LLM/embedding engine choices
  (self-hosted Ollama vs free APIs like Groq), TDAI_* env vars, and upgrade pitfalls.
  Use for: installing/upgrading memory-tencentdb, choosing an LLM engine for the
  TDAI gateway, tdai gateway 8420, MEMORY_TENCENTDB_*, Hermes memory.provider
  memory_tencentdb, recall capacity budgets.
triggers:
  - memory-tencentdb
  - TencentDB agent memory
  - TDAI_LLM
  - TDAI_GATEWAY
  - MEMORY_TENCENTDB
  - tdai gateway 8420
  - hermes memory provider
  - install memory tencentdb
  - agent long-term memory
---

# TencentDB Agent Memory (Hermes integration)

Class-level playbook for the TencentDB Agent Memory subsystem: a 4-layer (L0→L3) local-first
memory pipeline (conversation → atoms → scenes → persona) with SQLite + sqlite-vec,
optional Tencent Cloud Vector DB (TCVDB) backend, an OpenAI-compatible Gateway sidecar on
`127.0.0.1:8420`, and a Hermes `memory_tencentdb` provider. Benchmarks: −61.38% tokens,
+51.52% pass rate (WideSearch), PersonaMem 48%→76%.

## When to use
- Wiring a free/cheap LLM engine to the TDAI gateway (self-hosted Ollama, Groq free API, Gemini free tier).
- Installing/upgrading the package, diagnosing install failures, or touching `TDAI_*` / `MEMORY_TENCENTDB_*` env.
- Deciding local SQLite vs cloud TCVDB storage backend.

## Version reality (verified 2026-08)
- npm `latest` = **1.0.1** (`beta` = 1.0.1-beta.2); engines `node>=22.16.0`; MIT; native deps
  `sqlite-vec@0.1.7-alpha.2`, `@node-rs/jieba`, optional `node-llama-cpp` (0.1.3+ moved to optional).
- OpenClaw peer `>=2026.3.7`; Hermes integration via Gateway adapter (TdaiCore + HostAdapter).
- Repo: `TencentCloud/TencentDB-Agent-Memory` (also on GitHub as Tencent/TencentDB-Agent-Memory).

## Path conventions — 0.4.x consolidation (IMPORTANT)
Since 0.4.x ALL data/code lives under `$MEMORY_TENCENTDB_ROOT` (default `~/.memory-tencentdb`):
- `$TDAI_INSTALL_DIR` = `$MEMORY_TENCENTDB_ROOT/tdai-memory-openclaw-plugin` (plugin + node_modules + `src/gateway/server.ts`)
- `$TDAI_DATA_DIR` = `$MEMORY_TENCENTDB_ROOT/memory-tdai` (`tdai-gateway.json` 0600, `logs/`, `gateway.pid`)
- OLD layout `~/tdai-memory-openclaw-plugin` + `~/memory-tdai` is auto-migrated by the official installer.
- Gateway listens `127.0.0.1:8420` (override `MEMORY_TENCENTDB_GATEWAY_HOST/PORT`).
- OpenClaw artifacts live under `~/.openclaw/memory-tdai/` (white-box layers: persona.md, scene_blocks/, L0 JSONL).

## Official tooling (0.4.x+) — prefer over hand-rolled scripts
- `scripts/install_hermes_memory_tencentdb.sh` — official Hermes installer (auto-migrates old dirs,
  supports `HERMES_AGENT_DIR` override for FHS layouts, root-safe, uses `node --import tsx/esm`).
- `scripts/memory-tencentdb-ctl.sh` — daily ops: `start/stop/restart/status/health/logs`,
  `config llm|embedding|vdb|vdb-off`, `enable-hermes-memory`. **Not** registered as a bin —
  symlink manually (`sudo ln -sf <pkg>/scripts/memory-tencentdb-ctl.sh /usr/local/bin/memory-tencentdb-ctl`).
- These are **bash** — native on Linux/WSL/VPS; on Windows prefer the Docker greenfield image (below) or WSL.
- Docker greenfield (README 2.A): image bundles hermes-agent + `memory_tencentdb` on `:8420`;
  envs `MODEL_API_KEY / MODEL_BASE_URL / MODEL_NAME / MODEL_PROVIDER=custom`.

## Wiring to Hermes
1. Install + start Gateway (`memory-tencentdb-ctl --hermes start` or supervisor-managed).
2. `memory-tencentdb-ctl --hermes config llm --api-key <k> --base-url <openai-compat>/v1 --model <m> --restart`
   — writes `$TDAI_DATA_DIR/tdai-gateway.json` AND `$HERMES_HOME/env.d/memory-tencentdb-llm.sh`
   (Hermes spawns the Gateway as a subprocess with `os.environ.copy()` — it cannot read shell env,
   so creds MUST go through `env.d/*.sh`).
3. `memory-tencentdb-ctl --hermes enable-hermes-memory` — format-preserving edit of
   `$HERMES_HOME/config.yaml` `memory.provider: memory_tencentdb` (ruamel round-trip preferred; never rewrites whole YAML).
4. Restart Hermes. Hermes Python client reads `MEMORY_TENCENTDB_GATEWAY_API_KEY` etc. automatically.

## Config essentials (verified from 0.3.6+ / 1.0.1)
- Gateway Bearer auth: `server.apiKey` / `TDAI_GATEWAY_API_KEY` (timingSafeEqual; all routes except `/health`)
  + `server.corsOrigins` / `TDAI_CORS_ORIGINS` — **use when exposing via tunnel**.
- Recall capacity budgets: `recall.maxCharsPerMemory` / `recall.maxTotalRecallChars` (0 = unlimited).
- `embedding.sendDimensions=false` for fixed-dim models (BGE-M3); default OpenAI `text-embedding-3-*` Matryoshka.
- `l3TiktokenEncoding` default `cl100k_base` (matches DeepSeek/GLM/MiniMax).
- `offload.mode: "collect"` = capture-only, no L3 compression. `timezone` top-level config (IANA).
- LLM thinking-off: `TDAI_LLM_DISABLE_THINKING` strategy per provider — `vllm|deepseek|dashscope|openai|anthropic|kimi|gemini`
  (pick e.g. `dashscope` for Qwen, `deepseek` for DeepSeek, `gemini` for Gemini).
- Cleaner safety guards: min retention L0:50 / L1:20; blocks delete when expired/total > 80%.

## LLM engine choices (free-tier focus)
| Engine | Wiring | Notes |
|---|---|---|
| **Groq free API** (recommended for memory extraction) | base `https://api.groq.com/openai/v1`, model `qwen3-32b` (60 RPM/1000 RPD) or `gpt-oss-20b` | Non-sync low-frequency → fits free limits; quality > local E4B |
| Gemini Flash free tier (AI Studio key) | Gemini OpenAI-compat endpoint | generous free quota |
| Self-hosted Gemma 4 via Ollama on VPS | `http://<vps>:11434/v1`, model `gemma4:e4b` | free+private; see esggo-vps-toolkit `references/oracle-free-tier-2026.md` for capacity math |
- Embedding default: provider=none (BM25 only); enable OpenAI-compat embedding service for vector recall.

## Windows native node version (CRITICAL — 2026-08-08 empirical)
- **node 24 on Windows silently breaks vec0 vector storage** even though the Gateway *appears* healthy.
  Symptom: `/health` returns `embeddingService:true`, gateway init logs show **NO** "Failed to load sqlite-vec"
  or degraded error, embedding config reports `embedding=enabled, dimensions=768`, yet every `l0_vec`/`l1_vec`
  query returns `no such module: vec0` and writes are `Skipping vec write (no embedding)` (metadata-only).
  Root cause: node 24's `node:sqlite` `enableLoadExtension(true)` + `db.loadExtension()` *returns without throwing*
  but the vec0 virtual table is **never registered on the live DB connection** — so the table structure may exist
  in `sqlite_master` but any query against it fails. node 22 does NOT have this bug.
- **Fix: run the Gateway with node 22, not the default `node` (which is v24 on this box).** A node 22 is already
  installed at `C:\Users\dingj\.vite-plus\js_runtime\node\22.22.1\node.exe` (vite-plus manages 20/22/24 side-by-side).
  Hard-code that absolute path in the Gateway launch script (e.g. `exec "<that node22>" --import tsx/esm src/gateway/server.ts`);
  do NOT rely on a `node` alias. Verified: node22 + `loadExtension(getLoadablePath())` creates vec0 tables and
  `l0_vec` accrues real rows (count > 0) on write.
- **`no such module: vec0` is usually a FALSE NEGATIVE when you query with python's stdlib sqlite3.** Python's
  `sqlite3` module does not load the vec0 extension, so `SELECT count(*) FROM l0_vec` always fails there. The REAL
  check is to open the DB with node22 + `loadExtension(getLoadablePath())` and query `l0_vec` — or watch the gateway
  log for `Background embedding complete: N/N vectors updated`. If that line appears, vectors ARE stored.
- **`embeddingService:true` in /health does NOT mean vectors are stored.** That field only means the embedding
  *endpoint* is reachable. Vector persistence depends on vec0 (node-version gated, above). Separately, semantic
  *recall* returns 0 when there is no **chat model** for L1 extraction (see embedding model caveat below).
- **L1/L2/L3 extraction needs a chat model, not just an embedding model.** Ollama with only `nomic-embed-text`
  (embedding) and no chat model → L1 extraction fails → recall (which queries the L1 layer) returns 0 even though
  L0 vectors exist. `ollama pull <chat-model>` was network-blocked in this environment; without a local chat model
  you get L0/BM25 only. L0 vectors themselves are still usable.
- **Nous subscription key is NOT an OpenAI-compatible LLM key.** `NOUS_API_KEY` against
  `https://inference-api.nousresearch.com/v1` returns 401 `invalid key`. Don't use it as `TDAI_LLM_API_KEY`.
  Prefer Ollama-local embedding (base `http://127.0.0.1:11434/v1`, apiKey empty/placeholder, model `nomic-embed-text`,
  and put the embedding config under `memory.embedding:` in the yaml — NOT a top-level `embedding:`).
- **Gateway config file resolution**: reads `TDAI_GATEWAY_CONFIG` env → else `tdai-gateway.yaml` in CWD → else in
  dataDir. Multiple background launches are independent spawns; if 8420 is already held, the new Gateway exits with
  `EADDRINUSE` silently and the OLD process (with old config) keeps serving. Always `netstat -ano | grep 8420`,
  `taskkill /PID /F` ALL listeners, confirm FREE, then start. Use `TDAI_GATEWAY_CONFIG` pointing at an absolute
  Windows path to guarantee the yaml is found regardless of CWD.
- **MSYS `/tmp` path mismatch**: under git-bash, `write_file('/tmp/x')` and bash `/tmp` resolve to
  `C:\Users\dingj\AppData\Local\Temp\<subdir>`, NOT the directory you think. Write scripts/yaml with full Windows
  absolute paths (`C:\Users\dingj\...`) to avoid "script not found / env not passed" confusion.

## Pitfalls (learned the hard way)
1. **Windows npm install stalls**: 11-min hang, log ends with a single `npm warn deprecated node-domexception`, EXITCODE=1
   → registry connectivity stall. Mitigate: preflight registry reachability, npmmirror fallback, `--no-audit --no-fund`,
   short fetch timeout, clean half-installed `node_modules` first. (Package itself is healthy — problem was local registry path.)
2. **0.4.x path migration**: fresh installs must use `~/.memory-tencentdb/`; older docs/README snippets show
   `~/tdai-memory-openclaw-plugin` — verify which layout the installed version expects.
3. **Docker container 401 on first message** (issue #77): config.yaml `model.api_key` must be set, not just `.env`.
4. **DeepSeek + tool-calling instability** (issue #58): `enableTools=false` must omit tools entirely.
5. **Port 8420 conflict**: pre-check before gateway start; `MEMORY_TENCENTDB_GATEWAY_PORT=18420` escape hatch.
6. **1.0.1 latest is NOT 0.x** — changelog [Unreleased] contains timezone config etc.; always re-check `npm view` + CHANGELOG before quoting features.
7. **Windows node 22 vs 24 vec0 bug + false-negative diagnosis** — see "Windows native node version" subsection above. THIS is the single most common "vectors not persisting" cause on Windows.
8. **Host networking DNS 失效** — when the proxy Docker container uses `--network host`, config.yaml entries referencing Docker service names (`http://memory-core:8420`) fail to resolve, causing auth/verify `fetch failed`. Replace ALL occurrences with `http://127.0.0.1:8420` for host networking. Affects: `tdai.endpoint`, `skill.endpoint`, `auth.url`. Verified: auth/verify returns 401 with DNS name, 200 with 127.0.0.1.

## Full server stack (global-images / Docker) — 不同於 npm 套件路徑

`TencentCloud/TencentDB-Agent-Memory` 倉庫的 `deploy/global-images/` 是**完整伺服器棧**（Docker），與上方 npm `memory-tencentdb` 套件（Hermes 本地 SQLite+Gateway）是兩回事：
- npm 套件 = Hermes `memory.provider: memory_tencentdb`（單機、L0–L3 管線）。
- 本棧 = 獨立部署的**共享記憶後端**（多容器，可供 OA-Team 蜂群等共享），`start-all.sh` 一鍵拉起 MemoryCore(8420)+MemoryHub/Panel(8125)+Knowledge(8424)+Proxy(8096)。
- 兩者可並存：Hermes 用 npm 版做自身記憶，esggo 蜂群用本棧做共享中樞。

部署實戰（端口、Groq 注入、CRLF/chmod/nohup/ufw 坑、驗證）見 `references/tencentdb-global-images-vps-2026-08.md`。

## Verification
- `memory-tencentdb-ctl --hermes health` → `{"status":"ok",...}`; `status` prints mode/port/data paths.
- Hermes: `tr '\0' '\n' < /proc/$(pgrep -n hermes-agent)/environ | grep -E 'TDAI_|MEMORY_TENCENTDB_'` (Linux).
- Agent tools appear as `tdai_memory_search` / `tdai_conversation_search` (max 3 calls/round).
- **Server-stack 驗證**（非 npm 版）：VPS 內 `curl -sf localhost:8420/health` → `{"status":"ok",...}`；`curl -sf localhost:8125/` → Panel HTML；admin key 存 `.admin-key`（`sk-mem-...`）。

Full verified detail (changelog highlights, env-var table, Groq limits, Gemma sizes, benchmarks):
`references/versions-and-tooling-2026.md`

Windows-specific node22/vec0 pitfall + the verified diagnosis recipe (do NOT query vec0 with python stdlib;
use node22 + loadExtension): `references/windows-vec0-node22-verification.md`

Full server-stack (global-images) VPS deploy recipe + pitfalls:
`references/tencentdb-global-images-vps-2026-08.md`.

3-environment deployment (local + VPS + Cloudflare Tunnel) + host networking DNS pitfall:
`references/vps-deploy-and-host-networking-pitfalls.md`.
