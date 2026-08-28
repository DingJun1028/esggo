# Node.js / PM2 部署假完成陷阱 — 實戰轉錄（2026-08-23）

> 附屬 `esggo-vps-deploy-verify` §8。通用 Node 部署防假完成模式，非環境相依。
> 核心：pm2 `online` 是假象——pm2 接受 start 任務即標 online，進程可能瞬崩。

## 場景
經 `go-to-esggo-vps` 部署 universal-translator (8788) standalone server。
原貼腳本：`fuser -k 8788; pm2 delete; cat server_standalone.js; pm2 start; pm2 save; curl -I`。

## 失敗轉錄（真實）

### 1. pm2 online 但 HTTP=000（假完成）
```
[PM2] Starting ... server_standalone.js ... Done.
│ 11 │ universal-translator │ ... │ online │ ...
[PM2] Saving current process list... Successfully saved
-- 防假完成驗證 --
health HTTP=000 body=
index HTTP=000
viewer HTTP=000
```

### 2. error log 揭根因
```
/home/ubuntu/.pm2/logs/universal-translator-error.log
  ReferenceError: require is not defined in ES module scope, you can use import instead
  code: 'EADDRINUSE', errno: -98, syscall: 'listen', address: '::', port: 8788
```
- `package.json` 含 `"type": "module"` → `.js` 的 `require()` 不可用
- `sudo fuser -k 8788` 無 sudo 權未殺舊佔用 → EADDRINUSE

## 修復指令（真實可用）
```bash
# 確認釋放
pm2 delete universal-translator 2>/dev/null
pkill -f 'server_standalone.js' 2>/dev/null
sudo fuser -k 8788/tcp 2>/dev/null
sleep 1
(ss -ltnp 2>/dev/null || netstat -ltnp 2>/dev/null) | grep 8788 || echo '8788_FREE'

# 寫 ESM 版（.mjs 強制 ESM）
cat << 'EOF' > /opt/esggo/apps/universal-translator/server_standalone.mjs
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const publicDir = path.join(process.cwd(), 'public');
const indexHtml = fs.existsSync(path.join(publicDir,'index.html')) ? fs.readFileSync(path.join(publicDir,'index.html')) : '<h1>Ready</h1>';
const server = http.createServer((req,res)=>{ res.setHeader('Access-Control-Allow-Origin','*');
  if(req.url.split('?')[0]==='/health'){res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify({status:'ok',version:'2.0.0'}));}
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'}); res.end(indexHtml); });
server.listen(8788,'0.0.0.0',()=>console.log('standalone ESM on 8788'));
EOF

cd /opt/esggo/apps/universal-translator
node --check server_standalone.mjs && echo SYNTAX_OK
pm2 start server_standalone.mjs --name universal-translator --update-env
pm2 save
sleep 3

# 防假完成真判（非只看 pm2 online）
curl -sS -m 10 -o /tmp/h.json -w 'health=%{http_code} ' http://127.0.0.1:8788/health && cat /tmp/h.json && echo
curl -sS -m 10 -o /dev/null -w 'index=%{http_code}\n' http://127.0.0.1:8788/
curl -sS -m 10 -o /dev/null -w 'viewer=%{http_code}\n' http://127.0.0.1:8788/viewer.html
curl -sS -m 10 -o /dev/null -w 'public=%{http_code}\n' https://translate.esggo.co/
```

## 成功轉錄（真實）
```
health_http=200
{"status":"ok","version":"2.0.0"}
index_http=200
viewer_http=200
public_translate=200
```

## CrewAI / Ollama 附記（同源驗證原則）
- `crewai` 裝完首跑若報 `Model qwen2.5:3b-instruct-q4_K_M not found: 404`，
  先 `curl http://127.0.0.1:11434/api/tags` 查 VPS 實際模型名（本例 `qwen2.5:3b`）再設 env。
- Ollama 小模型 + CrewAI agent 有 `tools`/`allow_delegation` → `None or empty`；
  load_crew 後遍歷 `a.tools=[]; a.allow_delegation=False; a.function_calling_llm=None`。
- （模型名以實機 `api/tags` 為準，不硬編；此條屬環境細節提醒，非通用硬規則）
