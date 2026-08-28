---
name: sse-monitor-pitfalls
description: "SSE monitor pitfalls: poll-push split, VPS verify."
version: 1.1.0
author: Hermes Agent (DingJun1028)
license: MIT
platforms: [linux, windows]
metadata:
  hermes:
    tags: [sse, node, monitor, broadcast, pm2, msys, debugging, pitfalls]
---

# SSE Monitor / Broadcast 系統 — 通用陷阱與驗證模式

建 SSE 監視+轉播伺服器（Node http + EventSource）時反覆踩的坑。適用任何「輪詢固定連結 → 即時推送」架構。

## 1. 推送源 vs 輪詢源必須分兩張表

**陷阱**：把「講者 POST 推送」的源（如 studio）放進輪詢 URL 表（如 `SOURCES`），值是假字串。
啟動時 `for ([src,url] of Object.entries(SOURCES)) poll()` 會對假 URL 調 `fetch` → `Failed to parse URL from <假字串>`。
訂閱者會一直收到 `event: snapshot` + `event: error`。

**正確結構**：
```js
const SOURCES = { 'akkadu-kxxf': 'https://real.url' };        // 輪詢源 (真 URL)
const PUSH_SOURCES = new Set(['studio']);                    // 推送源 (僅收 POST, 不輪詢)
// /stream 端點:
const isPolled = !!SOURCES[src], isPushed = PUSH_SOURCES.has(src);
if (!isPolled && !isPushed) return res.writeHead(404)...;   // 兩者都不是才 404
// 連線時:
if (cached) sendSnapshot(cached);
else if (isPolled) poll(src, SOURCES[src]);                   // 推送源絕不輪詢
```
通用規則：**任何推送式來源絕不能塞進輪詢 URL 表**。

## 2. patch 重構變數區 → 先 grep 全檔再刪

**陷阱**：重構時把 `const LANG_TARGETS` / `const LANG_DEFAULT` 隨 SOURCES 一起刪，但 `/speak` 端點仍用 `LANG_TARGETS` → `500 Internal Server Error` + `ReferenceError: LANG_TARGETS is not defined`。
**規則**：patch 改動變數宣告區時，先 `grep -n LANG_TARGETS 檔案` 確認沒有別處引用再刪。`node --check` 只查語法不查未定義變數，所以刪完必須實跑一次 POST 端點確認。

## 3. 驗證策略：本機**可以**常駐，用 wrapper 繞開 job control

> **v1.1 更正**：舊版本說「本機跑不起來，只能上 VPS 驗證」——那是繞路。已找到可行做法。

- 直接 `terminal(background=true, "cd X && node server.mjs")` 會 exit 1
  （`no job control in this shell`）——**不是程式錯**，是 git-bash 非互動 shell 沒有 job control。
- **解法**：包 wrapper 用 `exec` 取代行程，就能穩定常駐：
  ```bash
  # run.sh
  #!/usr/bin/env bash
  cd "$(dirname "$0")" || exit 1
  exec node monitor-server.mjs
  ```
  ```bash
  terminal(background=true, command="bash /path/to/run.sh")
  ```
  env 前綴（`PORT=8799 node ...`）同樣觸發此問題 → 寫進 wrapper 或 `.env` 檔。
- 本機跑起來後即可完整端對端驗證，**不必每次改動都上 VPS**。用不同 port（8799）避開生產 8787。
- 端對端驗證 SSE：**先開連線聽，再 POST 推事件**（時間窗順序很重要）。
- 殺掉本機服務：`taskkill //PID` 和 `cmd //c taskkill` 在 git-bash 下都無效，用
  `powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8799 -State Listen -EA SilentlyContinue | ForEach-Object { Stop-Process -Id \$_.OwningProcess -Force }"`，
  再 curl 探測確認 `PORT_FREE`。

## 4. 行為驗證等價於 pnpm test

`.mjs` (Node ESM) 專案常無 `pnpm test/lint/typecheck` 針對 `.mjs` 的腳本。
適用驗證 = `node --check`（語法）+ 實跑 SSE/POST 端對端。從不宣稱成功而沒看到真實輸出。

**把端對端測試寫成可重跑的腳本**（`_smoke-test.mjs`），而不是每次手打 curl：
```js
const BASE = process.env.BASE || 'http://localhost:8799';
let pass = 0, fail = 0;
const ok = (c, m) => { c ? (pass++, log('  PASS', m)) : (fail++, log('  FAIL', m)); };
// ... 各項斷言
process.exit(fail ? 1 : 0);     // 關鍵：非零退出碼，才能被 deploy.sh 的 set -e 攔截
```
同一支腳本用 `BASE=` 切換本機 / 公網，本機綠了才推，推完再跑一次公網。

## 5. SSE 生產化必備四件事

一個「能動」的 SSE 服務離「可上線」還差這些，全部是實際踩過才補的：

| 項目 | 做法 | 為何必要 |
|---|---|---|
| **事件回放緩衝** | 每 channel 存最近 N 筆（環形），新訂閱者連上立即補送 | 否則晚進的觀眾看到空白畫面，以為壞了。heartbeat 不入緩衝 |
| **keep-alive ping** | 每 25s 寫 `: ka\n\n`（SSE 註解行） | 穿透 nginx / Cloudflare 閒置逾時，避免連線被中斷 |
| **靜態資產白名單** | `PUBLIC_FILES` Set，未列一律 404 | 只靠 `filePath.startsWith(__dirname)` **不夠**——fetch 會正規化 `/../`，真正洩漏的是**同目錄**的 `.mjs`/`.json`/`.conf` 原始碼 |
| **優雅關閉** | SIGTERM/SIGINT 先 `res.end()` 所有 SSE 連線再 `server.close()`，5s 保險退出 | SSE 是長連接，直接 kill 會讓客戶端卡住。pm2 需配 `kill_timeout: 8000` |

補充：`/healthz` 端點回 uptime / 各 channel 訂閱數 / 版本 / 記憶體 / 引擎，
是排錯與驗證的第一入口（也讓 deploy script 能判斷「起來的是不是新版」）。

## 7. 單一 http.createServer 回調 + 額外 `server.on('request')` 監聽器碰撞（本 session 實證）

**陷阱**：在 `http.createServer((req,res)=>{...})` 主回調裡已有靜態路由邏輯，又另寫一條 `server.on('request', (req,res)=>{ if(req.url.startsWith('/stream')) {...SSE...} })` 想處理 SSE。結果：

1. 主回調對 `GET /stream` 的靜態分支先把 `urlPath === '/stream'` 對映成 `/stream.html` 並 `res.end(HTML)` 回傳了 **HTML 頁面**，第二個 listener 拿到的 `res` 已結束 → SSE 客戶端收到 HTML，EventSource 解析失敗、一直重連。
2. 更糟：SSE 客戶端集合 `sseClients` 永遠為空，WS→SSE 廣播靜默失效，觀眾端收不到字幕。

**正確結構**：不要拆兩個 listener。把 SSE 處理**合併進主回調最前面**，並在靜態路由前 `return`：

```js
// 在主 callback 健康檢查之後、靜態 UI 之前攔截
if (req.url.startsWith('/stream') && req.method === 'GET') {
  res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control':'no-cache', 'Connection':'keep-alive', 'Access-Control-Allow-Origin':'*' });
  const client = { res, id: Date.now() + Math.random() };
  sseClients.add(client);
  res.write(`id: ${client.id}\nevent: heartbeat\n\n`);
  req.on('close', () => sseClients.delete(client));
  return; // ← 關鍵：不進靜態路由
}
```

**TDZ 規則**：`const sseClients = new Set()` 與 `broadcastTranslation()` 必須宣告在 `http.createServer(...)` 之前（或至少在主回調之外、模組頂層），否則主回調閉包在請求到來時雖已初始化，但宣告順序錯亂易踩 `ReferenceError`。最穩：寫在 `writeJson` 輔助函式之後、`const server = ...` 之前。

**靜態路由別名修正**：`/stream` 無 `.html` 結尾，若靜態分支寫 `urlPath === '/stream' || urlPath === '/stream.html'`，會把 `/stream` 當成頁面服務。SSE 攔截後，靜態分支只保留 `urlPath === '/stream.html'`（真正的頁面）。

## 8. VPS Tunnel 驗證：本機直連 IP:port 可能被防火牆擋

**陷阱**：服務走 Cloudflare Tunnel（`translate.esggo.co → 127.0.0.1:8788`），VPS 的 8788 埠**不對外裸露**。從本機 `curl http://161.118.248.180:8788/...` 會 `Connection timed out`，但 `pm2` 顯示 online、外部網址正常 → 誤判服務掛了。

**正確驗證順序**：
1. 先 `curl -sSf https://<外部網址>/health` 確認 Tunnel 通。
2. 要對服務本體做端對端（繞過 Tunnel 與防火牆）：在 VPS 本機 `ssh ... "cd /opt/... && node _smoke.mjs"` 連 `127.0.0.1:8788`（localhost 不受防火牆限）。
3. headless browser 工具無法跑麥克風/WebSpeech/`getDisplayMedia`/Whisper-WASM —— 這些本機授權與實體音訊只能交使用者在本機 Chrome/Edge 驗證。

**外部依賴（CDN/模型）可達性先驗證**：在寫入 `import(...)` 或模型路徑前，先用 `curl -sI` 探：
- transformers.js CDN：`https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0` → 200
- Whisper 模型（v3 `onnx-community` 命名空間，檔在 `onnx/` 子目錄）：`https://huggingface.co/onnx-community/whisper-tiny/resolve/main/onnx/encoder_model_quantized.onnx` → 302→200（注意 `Xenova/*` 舊命名已 404，勿用）

## 6. 外部 API 呼叫：平行 + 引擎鏈 + 兜底

多語翻譯 / 多目標外呼時：
- **序列 `for...await` → `Promise.all`**：延遲從 N×RTT 降為 1×RTT（實測 6 語 2.2s vs 逐一累加）。
- **引擎鏈 + 兜底**：`自建 → 免費公共 → 回原文`。永遠有輸出，轉播絕不中斷。
- **LRU 快取**：相同輸入直接命中（實測 2267ms → 19ms）。
- **標記實際引擎**：回傳 `engines: {zh: 'mymemory', en: 'passthrough'}`，可溯源、可觀測降級。

## Self-audit
- [ ] 推送源不在輪詢 URL 表
- [ ] patch 刪變數前 grep 全檔確認無引用
- [ ] 本機用 wrapper 常駐 + 獨立 port 做端對端（不是只能上 VPS）
- [ ] SSE 端對端先連後推
- [ ] 端對端測試是可重跑腳本且失敗時非零退出
- [ ] 回放緩衝 / keep-alive / 白名單 / 優雅關閉 四件事齊備
- [ ] 外部 API 平行呼叫 + 引擎兜底 + 快取
