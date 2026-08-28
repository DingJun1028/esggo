---
name: sqlite-vec-windows
description: Enable sqlite-vec vec0 vector memory on Windows Node.
---

# sqlite-vec / vec0 on Windows

## When to use
- A Node.js agent framework (TencentDB Agent Memory, or similar) needs local vector
  storage via `sqlite-vec` (`vec0` virtual tables) on Windows.
- You see `no such module: vec0` and suspect the extension isn't loading.
- L1/L2/L3 extraction fails with `"<model>" does not support chat`.
- You must verify vectors were actually written.

## Hard-won facts (durable)

### 1. Node version matters — node 22 works, node 24 is finicky on Windows
`node:sqlite` (experimental) in node 24 on Windows often rejects the convenience loader
`sqliteVec.load(db)` even though `enableLoadExtension(true)` was called. The reliable path:

- **Preferred:** run the gateway/server with an installed **node 22** (e.g.
  `C:\Users\<user>\.vite-plus\js_runtime\node\22.22.1\node.exe`). Verify with
  `node -e` that `new DatabaseSync(':memory:',{allowExtension:true})` + `loadExtension(getLoadablePath())`
  can `CREATE VIRTUAL TABLE t USING vec0(embedding float[3])`.
- **If you must use node 24:** patch the loader. Replace
  ```ts
  sqliteVec.load(this.db);
  ```
  with:
  ```ts
  const loadPath = (sqliteVec.getLoadablePath && sqliteVec.getLoadablePath()) || undefined;
  if (loadPath) this.db.loadExtension(loadPath);
  else sqliteVec.load(this.db);
  ```
  `getLoadablePath()` returns the absolute `.dll` path
  (`node_modules/sqlite-vec-windows-x64/vec0.dll`); explicit `loadExtension(path)` is more
  robust than the internal resolver on Windows.

### 2. `no such module: vec0` from python is a FALSE NEGATIVE
Python's stdlib `sqlite3` does **not** load the `vec0` extension. Querying a vec0 table
from python (`SELECT count(*) FROM l0_vec`) throws `no such module: vec0` even when the
gateway wrote vectors successfully. This misled debugging for many iterations.
**To verify vectors actually exist, use node with the extension loaded:**
```js
const { createRequire } = await import('module');
const req = createRequire(import.meta.url);
const v = req('sqlite-vec');
const { DatabaseSync } = req('node:sqlite');
const db = new DatabaseSync('C:/path/vectors.db', { allowExtension: true });
db.enableLoadExtension(true);
db.loadExtension(v.getLoadablePath());
console.log(db.prepare('SELECT count(*) AS c FROM l0_vec').get()); // real row count
```
Or trust the gateway's own logs: look for
`[L0-vec-index-bg] Background embedding complete: N/N vectors updated`.

### 3. Ollama needs TWO models — embedding ≠ chat
Agent memory systems (e.g. TencentDB) use `embedding` for vectors and `llm`/chat for
L1/L2/L3 extraction. A common mistake is pointing `llm.model` at the embedding model:
- `nomic-embed-text` → embedding ONLY. Putting it in `llm.model` fails with
  `"nomic-embed-text" does not support chat`.
- You need a real chat model for extraction: `qwen2.5:3b-instruct-q4_K_M` (or llama3.1:8b).
- Both can run on the same Ollama instance (`http://127.0.0.1:11434/v1`); Ollama ignores
  fake `apiKey` values, so set `apiKey: "ollama-local"` to satisfy strict OpenAI-SDK
  "API key required" checks.

### 4. Config-path resolution (TencentDB gateway)
The gateway resolves its yaml via `TDAI_GATEWAY_CONFIG` env → `./tdai-gateway.yaml` (CWD) →
`dataDir/tdai-gateway.yaml`. When launching from a script, `export TDAI_GATEWAY_CONFIG` to an
absolute Windows path AND `cd` to the repo root so CWD fallback also works. Confusion about
which process holds port 8420 (stale PIDs, multiple node versions) is the #1 cause of
"config not applied" — always `netstat -ano | grep ':8420'` and kill the listener before
restarting, then confirm the loaded model in the startup log
(`Creating StandaloneLLMRunner: model=...`).

## Verification checklist
- [ ] `health` returns `embeddingService:true`
- [ ] startup log shows `embedding=enabled, dimensions=768` and the correct `llm.model`
- [ ] `Background embedding complete: N/N vectors updated` appears after a capture
- [ ] vector count confirmed via node-with-extension (not python)
- [ ] recall returns `memory_count > 0` only after L1 extraction ran (needs chat model)

## See also
- `references/tencentdb-agent-memory.md` — full yaml structure, Ollama dual-model wiring,
  patched `sqlite.ts` snippet, and a working node22 startup script.
- The protected setup skill `hermes-memory-tencentdb-windows` covers the installer
  (`scripts/setup-hermes-memory-tencentdb.bat`) and `hermes config set memory.provider
  memory_tencentdb`. Patch THAT skill (via `hermes curator adopt`) to fold in the node22 /
  vec0 / dual-model learnings above.
