---
name: tencentdb-memory-local-ollama
description: "Enable TencentDB memory offline via local Ollama on Windows."
---

# TencentDB Agent Memory — Local Ollama Enablement (Windows)

Enable the `memory_tencentdb` provider entirely offline on Windows using Ollama, so no Groq/cloud key is needed. Complements `hermes-memory-tencentdb-windows` (which covers the cloud/Groq install path).

## Prerequisites
- Ollama on `127.0.0.1:11434`. `nomic-embed-text` pulled (embedding, 768-dim) + a chat model (`qwen2.5:3b-instruct-q4_K_M`) pulled (L1/L2/L3 extraction needs chat, not embedding).
- Gateway repo at `C:\Users\dingj\AppData\Local\Temp\TencentDB-Agent-Memory-main` (from `https://github.com/TencentCloud/TencentDB-Agent-Memory/archive/refs/heads/main.tar.gz` — the Windows .bat only ships in the GitHub repo, NOT the npm tarball).

## Config: `tdai-gateway.yaml` (place in TWO spots)
- `C:\Users\dingj\AppData\Local\Temp\TencentDB-Agent-Memory-main\tdai-gateway.yaml`
- `C:\Users\dingj\.memory-tencentdb\memory-tdai\tdai-gateway.yaml`

```yaml
server:
  host: 127.0.0.1
  port: 8420
  apiKey: "<hex32 same as TDAI_GATEWAY_API_KEY>"
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
Ollama's OpenAI-compatible endpoint accepts ANY Bearer token — `ollama-local` placeholder works. **`llm.model` = chat model; `memory.embedding.model` = embedding model. They MUST differ.**

## Launch script (the ONLY reliable way to start)
```bash
#!/usr/bin/env bash
export TDAI_GATEWAY_CONFIG="C:\\Users\\dingj\\AppData\\Local\\Temp\\TencentDB-Agent-Memory-main\\tdai-gateway.yaml"
export TDAI_LLM_MODEL="qwen2.5:3b-instruct-q4_K_M"
export TDAI_LLM_BASE_URL="http://127.0.0.1:11434/v1"
export TDAI_LLM_API_KEY="ollama-local"
cd "C:\\Users\\dingj\\AppData\\Local\\Temp\\TencentDB-Agent-Memory-main"
exec "/c/Users\dingj/.vite-plus/js_runtime/node/22.22.1/node.exe" --import tsx/esm src/gateway/server.ts
```
Also patch `$LOCALAPPDATA\hermes\.env`: set `TDAI_LLM_MODEL="qwen2.5:3b-instruct-q4_K_M"` so Hermes's own auto-start uses it too.

## CRITICAL pitfalls (each caused hours of misdiagnosis)
1. **node version gates vec0.** node 24's `node:sqlite` on Windows: `db.loadExtension()` returns success but the vec0 virtual table is NOT actually registered → queries on `l0_vec`/`l1_vec` fail with `no such module: vec0`, and vector writes become no-ops. **Use node 22.x** (`C:\Users\dingj\.vite-plus\js_runtime\node\22.22.1\node.exe`). On node 22, vec0 loads correctly and vectors persist.
2. **Hermes plugin auto-starts its own gateway** using node24 + `$LOCALAPPDATA\hermes\.env`'s `TDAI_LLM_MODEL`. A manual node22 start hits `EADDRINUSE`. Fix: `taskkill` the PID on `:8420` first, and double-export env vars in the launch script (and fix `.env`).
3. **`model=nomic-embed-text` used as chat → L1 never writes.** If `llm.model` (or `.env`'s `TDAI_LLM_MODEL`) is the embedding model, L1 extraction logs `"nomic-embed-text" does not support chat` and `l1_vec` stays 0 forever. Confirm startup log shows `StandaloneLLMRunner: model=qwen2.5:3b-instruct-q4_K_M` with NO `does not support chat`.
4. **`no such module: vec0` from python is a FALSE ALARM.** Python's stdlib `sqlite3` doesn't load the sqlite-vec extension, so `SELECT count(*) FROM l0_vec` always errors there. Verify vectors with **node22 + sqlite-vec `loadExtension`** or via `/recall` (`memory_count>0`).
5. **L1 on CPU-only is SLOW (~42s per extraction).** Set `timeoutMs≥180000` and wait. Success log: `[l1-extractor] Extraction complete: extracted=1, stored=1` then `l1_vec` increments.

## Verification (full L0–L3 enablement)
- `l0_vec` has dozens of rows; `l1_vec` ≥ 1 (query via node22+vec0, never python).
- `curl http://127.0.0.1:8420/recall -d '{"query":"...","session_key":"...","max_results":5}'` returns `memory_count>0, "strategy":"hybrid"`.
- Startup log contains `StandaloneLLMRunner: model=qwen2.5:3b-instruct-q4_K_M` and no `does not support chat`.
- `/health` → `{"status":"ok","stores":{"vectorStore":true,"embeddingService":true}}`.

## API surface
- `POST /capture` — fields `user_content`, `assistant_content`, `session_key`. Header `Authorization: Bearer <TDAI_GATEWAY_API_KEY>`. Returns `{"l0_recorded":N,...}`.
- `POST /recall` — fields `query`, `session_key` (optional), `max_results`. Returns `{"context":"...","memory_count":N}`.
- `GET /health` — status + stores.

Reference launch script + yaml template: `references/launch-offline-ollama.md`.
