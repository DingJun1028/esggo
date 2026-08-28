# Windows vec0 / node22 verification recipe (TencentDB Agent Memory)

Empirically verified 2026-08-08 on this Windows box. Capture the working diagnosis,
not the dead ends.

## Symptom
Gateway `/health` -> `embeddingService:true`, init logs show NO "Failed to load sqlite-vec",
embedding config `embedding=enabled, dimensions=768`, yet:
- `l0_vec` / `l1_vec` queries -> `no such module: vec0`
- writes -> `Skipping vec write (no embedding)` (metadata-only)
- semantic recall -> `memory_count:0`

## Root cause
`node` default = v24.x (vite-plus managed). node 24's `node:sqlite` `enableLoadExtension(true)`
+ `db.loadExtension()` returns without throwing but does NOT register the vec0 virtual table
on the live connection. node 22 does not have this bug.

## The fix
Run the Gateway with node 22 (already installed):
`C:\Users\dingj\.vite-plus\js_runtime\node\22.22.1\node.exe`
Hard-code that absolute path in the launch script; do NOT use a `node` alias.

Launch script skeleton (Windows abs paths only — MSYS `/tmp` is unreliable):
```bash
export TDAI_GATEWAY_CONFIG="C:\Users\dingj\AppData\Local\Temp\TencentDB-Agent-Memory-main\tdai-gateway.yaml"
cd /tmp/TencentDB-Agent-Memory-main
exec "/c/Users/dingj/.vite-plus/js_runtime/node/22.22.1/node.exe" --import tsx/esm src/gateway/server.ts
```

## How to VERIFY vectors are actually stored (node22 + vec0 connection)
Do NOT use python stdlib `sqlite3` — it has no vec0 extension and will always report
`no such module: vec0`. Use node22 with the extension loaded:
```js
const { createRequire } = await import('module');
const req = createRequire(import.meta.url);
const v = req('sqlite-vec');
const { DatabaseSync } = req('node:sqlite');
const db = new DatabaseSync('C:/Users/dingj/.memory-tencentdb/memory-tdai/vectors.db', { allowExtension: true });
db.enableLoadExtension(true);
db.loadExtension(v.getLoadablePath());
const n = db.prepare('SELECT count(*) AS c FROM l0_vec').get();
console.log('l0_vec rows:', n.c);  // >0 means vectors persisted
```
(Stop the running gateway first, or use a different db copy — WAL lock blocks a 2nd writer.)

## Key distinctions
- `embeddingService:true` in /health = embedding endpoint reachable. NOT "vectors stored".
- Recall 0 with no chat model = L1 extraction layer empty (needs a chat model; Ollama had
  only `nomic-embed-text`). L0 vectors + BM25 keyword recall still work.
- `Background embedding complete: N/N vectors updated` in gateway log = vectors DID write.

## Env notes
- Nous subscription `NOUS_API_KEY` is NOT a usable OpenAI-compatible LLM key (401 on
  `inference-api.nousresearch.com/v1`). Use Ollama-local embedding instead.
- yaml: put embedding under `memory.embedding:` (gateway passes `config.memory` to Core);
  top-level `embedding:` is ignored.
- Before restart: `netstat -ano | grep 8420` -> `taskkill /PID <id> /F` ALL listeners,
  confirm FREE, then start (avoids silent EADDRINUSE exits leaving a stale process).
