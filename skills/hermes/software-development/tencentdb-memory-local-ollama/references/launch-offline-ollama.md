# Launch & Config Reference — TencentDB Memory (local Ollama, Windows)

## 1. `tdai-gateway.yaml` (copy to BOTH paths)
Path A: `C:\Users\dingj\AppData\Local\Temp\TencentDB-Agent-Memory-main\tdai-gateway.yaml`
Path B: `C:\Users\dingj\.memory-tencentdb\memory-tdai\tdai-gateway.yaml`

```yaml
server:
  host: 127.0.0.1
  port: 8420
  apiKey: "676cb13c2a057b53a65f8afee73ea6d7"
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

## 2. `start_tdai_node22.sh` (double-export to defeat Hermes auto-start)
```bash
#!/usr/bin/env bash
export TDAI_GATEWAY_CONFIG="C:\\Users\\dingj\\AppData\\Local\\Temp\\TencentDB-Agent-Memory-main\\tdai-gateway.yaml"
export TDAI_LLM_MODEL="qwen2.5:3b-instruct-q4_K_M"
export TDAI_LLM_BASE_URL="http://127.0.0.1:11434/v1"
export TDAI_LLM_API_KEY="ollama-local"
cd "C:\\Users\\dingj\\AppData\\Local\\Temp\\TencentDB-Agent-Memory-main"
exec "/c/Users/dingj/.vite-plus/js_runtime/node/22.22.1/node.exe" --import tsx/esm src/gateway/server.ts
```

## 3. Also fix Hermes `.env` (so plugin auto-start uses chat model, not embedding)
File: `C:\Users\dingj\AppData\Local\hermes\.env`
Set:
```
TDAI_LLM_MODEL="qwen2.5:3b-instruct-q4_K_M"
TDAI_LLM_BASE_URL="http://127.0.0.1:11434/v1"
```

## 4. Verify vectors with node22+vec0 (python's sqlite3 gives false `no such module`)
```bash
"/c/Users/dingj/.vite-plus/js_runtime/node/22.22.1/node.exe" --import tsx/esm -e "
const { createRequire } = await import('module');
const req = createRequire(import.meta.url);
const v = req('sqlite-vec');
const { DatabaseSync } = req('node:sqlite');
const db = new DatabaseSync('C:/Users/dingj/.memory-tencentdb/memory-tdai/vectors.db', { allowExtension: true });
db.enableLoadExtension(true); db.loadExtension(v.getLoadablePath());
for (const t of ['l0_vec','l1_vec']) {
  try { console.log(t, db.prepare('SELECT count(*) c FROM '+t).get().c); }
  catch(e){ console.log(t,'ERR',e.message); }
}
"
```

## 5. Recall check (proves L1 semantic recall works)
```bash
curl -sS -m5 -X POST http://127.0.0.1:8420/recall \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 676cb13c2a057b53a65f8afee73ea6d7" \
  -d '{"query":"多語言支援需求","session_key":"l1probe","max_results":5}'
# expect: {"context":"...","strategy":"hybrid","memory_count":1}
```

## 6. Kill any stale gateway before starting
```bash
for p in $(netstat -ano 2>/dev/null | grep ':8420' | grep LISTEN | awk '{print $5}'); do taskkill /PID $p /F; done
```
