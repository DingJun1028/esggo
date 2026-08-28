# TencentDB Agent Memory — Windows enablement detail

## Installer (from setup skill)
`scripts/setup-hermes-memory-tencentdb.bat` installs the plugin to
`%LOCALAPPDATA%\hermes\plugins\memory_tencentdb`, writes 9 `TDAI_*` vars to Hermes `.env`,
and starts the gateway on 8420. Then:
`hermes config set memory.provider memory_tencentdb` (do NOT hand-edit config.yaml).

## Gateway yaml structure (dataDir: `%USERPROFILE%\.memory-tencentdb\memory-tdai\tdai-gateway.yaml`)
```yaml
server:
  host: 127.0.0.1
  port: 8420
  apiKey: "<TDAI_GATEWAY_API_KEY>"   # 32-char Bearer; generated via curl, must prepend
data:
  baseDir: "C:\\Users\\<user>\\.memory-tencentdb\\memory-tdai"
memory:
  embedding:                         # NOT top-level `embedding:` — gateway reads memory.embedding
    provider: openai
    baseUrl: "http://127.0.0.1:11434/v1"
    apiKey: "ollama-local"           # Ollama ignores fake key
    model: "nomic-embed-text"
    dimensions: 768
llm:
  baseUrl: "http://127.0.0.1:11434/v1"
  apiKey: "ollama-local"
  model: "qwen2.5:3b-instruct-q4_K_M"   # MUST be a chat model, not nomic-embed-text
  maxTokens: 4096
  timeoutMs: 180000
```
Bearer key header: `Authorization: Bearer <TDAI_GATEWAY_API_KEY>`. Without it → 401.

## Patched loader (src/core/store/sqlite.ts, node 24 fallback)
```ts
const sqliteVec = require("sqlite-vec");
this.db.enableLoadExtension(true);
const loadPath = (sqliteVec.getLoadablePath && sqliteVec.getLoadablePath()) || undefined;
if (loadPath) this.db.loadExtension(loadPath);
else sqliteVec.load(this.db);
```

## Working node 22 startup script (start_tdai_node22.sh)
```bash
#!/usr/bin/env bash
export TDAI_GATEWAY_CONFIG="C:\\Users\\<user>\\AppData\\Local\\Temp\\TencentDB-Agent-Memory-main\\tdai-gateway.yaml"
cd "C:\\Users\\<user>\\AppData\\Local\\Temp\\TencentDB-Agent-Memory-main"
exec "/c/Users/<user>/.vite-plus/js_runtime/node/22.22.1/node.exe" --import tsx/esm src/gateway/server.ts
```
Launch: `bash "<abs path>\start_tdai_node22.sh" > /tmp/gw.log 2>&1` (background).
Multiple node versions coexist under `.vite-plus/js_runtime/node/`; a stray `node22.14.0`
process can hold 8420 and read a stale yaml — always kill the listener first.

## Verify vectors really exist (node, not python)
```js
const { createRequire } = await import('module');
const req = createRequire(import.meta.url);
const v = req('sqlite-vec');
const { DatabaseSync } = req('node:sqlite');
const db = new DatabaseSync('C:/Users/<user>/.memory-tencentdb/memory-tdai/vectors.db', { allowExtension: true });
db.enableLoadExtension(true); db.loadExtension(v.getLoadablePath());
console.log(db.prepare('SELECT count(*) AS c FROM l0_vec').get());  // real count
```

## API surface
- `POST /capture`  body `{user_content, assistant_content, session_key}`
- `POST /recall`   body `{query, session_key?, max_results?}`
- `GET  /health`  → `{"status":"ok","stores":{"vectorStore":true,"embeddingService":true}}`

## Gotchas observed
- Recall `memory_count:0` until L1 extraction ran (needs chat model + warmup ~2 convos).
- L0 vectors write via async background (`Background embedding complete: N/N vectors updated`);
  the synchronous upsert logs `(no embedding — metadata-only write)` first — that is normal.
- `nomic-embed-text` in `llm.model` → `"nomic-embed-text" does not support chat` (extraction fails).
