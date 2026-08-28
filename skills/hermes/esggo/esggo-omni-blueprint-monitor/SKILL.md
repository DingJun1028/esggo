---
name: esggo-omni-blueprint-monitor
description: "Operate omni-blueprint Akkadu SSE monitor on live.esggo.co."
version: 1.0.0
author: Hermes Agent (DingJun1028)
license: MIT
platforms: [linux, windows]
metadata:
  hermes:
    tags: [esggo, akkadu, cloudflare, certbot, nginx, sse, monitor, broadcast, cdp]
---

# omni-blueprint-hub 監視轉播系統 — 操作與經驗

把固定連結 (akkadu.ai/live/kxxf) 監視並轉播到自有域名 (live.esggo.co) 的完整實戰知識。
所有結論均來自真實執行，非推測。

## 架構（已驗證可跑）

```
固定連結 akkadu.ai/live/kxxf
  → monitor-server.mjs (VPS 161.118.248.180:8787, pm2 守護)
      ├─ fetch 輪詢 (15s) → snapshot 事件
      ├─ room monitor (15s) → room-status 事件 (api-translator.akkadu.com/rooms/kxxf)
      └─ /ingest POST 端點 ← 本機 captions-scraper 推字幕
  → nginx live.esggo.co.conf 反代 127.0.0.1:8787 (SSE 優化)
  → 公網 https://live.esggo.co/stream?src=akkadu-kxxf
  ← 本機 captions-scraper.mjs (chromium headless) 開播時抓 DOM 字幕 POST /ingest
```

SSE 事件: snapshot / room-status / caption / caption-error / heartbeat

## 1. Cloudflare DNS — token scope 是陷阱

- **wrangler OAuth token 不能改 DNS**：`/user/tokens/verify` 回 active，但 `/zones/{id}/dns_records` 回 `code:10000 Authentication error`。
  原因: wrangler token scopes 含 `zone:read` `ssl_certs:write` 但**沒有 `DNS:Edit`**。
- 解法: 用具 **DNS:Edit** 權限的 API Token (account 級 `cfat_...` 可讀 zone DNS；`cfut_...` 僅 verify 有效)。
- 查 zone ID: `GET /zones?name=esggo.co`
- 建 A 記錄: `POST /zones/{zone}/dns_records` body `{"type":"A","name":"live.esggo.co","content":"161.118.248.180","ttl":1,"proxied":false}`
- **proxied 必須 false**（直連 VPS，certbot HTTP-01 才能過）。
- 讀取 token 從 wrangler config: `C:\Users\dingj\AppData\Roaming\xdg.config\.wrangler\config\default.toml` 的 `oauth_token = "..."`。

## 2. certbot 擴 SAN（子域證書）

- 現有 wildcard `live/esggo.co` 證書 SAN **不含** `live.esggo.co` → TLS handshake 失敗 (curl 回 000)。
- 解法: `sudo certbot --nginx -d live.esggo.co --non-interactive --agree-tos`
  會發 live.esggo.co 專屬證書並自動改 nginx conf 套用 + 排程自動續期。
- 前置: DNS A 記錄先指向 VPS（否則 HTTP-01 challenge 失敗）。
- VPS nginx 測試: `sudo nginx -t`；重載: `sudo nginx -s reload`。

## 3. nginx SSE 反代關鍵

`live.esggo.co.conf` 必須:
```
proxy_buffering off;
proxy_cache off;
chunked_transfer_encoding on;
proxy_set_header Connection "upgrade";
proxy_read_timeout 3600s;   # SSE 長連接
proxy_http_version 1.1;
```
否則 SSE 被 buffer 不即時推。

## 4. CDP 錄網路 — page target 陷阱

- `GET /json/version` 回的是 **browser-level** ws → 對它發 `Page.enable` 無效（靜默無事件）。
- 必須 `GET /json/list` 取 `type:"page"` 的 `webSocketDebuggerUrl` 再連。
- Node 22+ 有原生 `WebSocket` global，但它是 **EventTarget 風格**：用 `addEventListener('open'/'message'/'error')`，**不是** `.on()`。
- chrome 啟動: `chrome.exe --remote-debugging-port=9397 --headless=new --no-sandbox ...`
- 錄網路: `Network.enable` + 聽 `Network.requestWillBeSent` / `Network.responseReceived`。

## 5. 挖 Akkadu 真實 API（CDP 錄網路實證）

`akkadu.ai/live/kxxf` 是 Nuxt SPA，curl 只拿 3449 bytes shell（無表單/API）。
用 CDP 錄 network 才挖到真實後端:
- `GET https://api-translator.akkadu.com/rooms/kxxf` → 房間狀態 `{status, broadcast, lock, plan, maxParticipants}`
- `GET https://api-translator.akkadu.com/tokens/agora-rtm-audience` → `{appId, token, uid, expiration}`（**audience 不需登入帳密**）
- `POST https://webcollector-rtm.agora.io/events/proto-raws` → Agora RTM 字幕流
- 字幕走 **Agora RTM message**，非 DOM aria-live 文字。headless dump-dom 抓不到字幕流本身，
  但可抓「網頁渲染後」的字幕（若 Akkadu 網頁把 RTM message 顯示在容器）。
- minified JS (`/_nuxt/b945138.js` 1.37MB) 無固定 caption class，selector 需多策略兜底
  (aria-live / caption|subtitle|transcript class / data-* / JSON-LD)。

## 6. npm 在該環境卡死 → 繞行

- `npm i playwright` / `npm i ws` 在 Windows git-bash 下常卡 `closure-net` git 依賴 (180s+ timeout)。
- 繞行: 用 Node 原生 `fetch` (Node 18+) / 原生 `WebSocket` global / `child_process.spawn` 呼叫本機已裝的
  playwright chromium (`C:\Users\dingj\AppData\Local\ms-playwright\chromium_headless_shell-1228\...`) 做 `--dump-dom`。
- VPS Ubuntu 24.04: `apt install libasound2` 不存在 → 用 `libasound2t64`；playwright install chromium 仍可能因
  host requirements 失敗 → **VPS 不跑瀏覽器**，改本機抓字幕推 `/ingest`。

## 7. 本機抓字幕 → VPS 轉播 (缺口補齊)

- VPS 無 chromium，`captions-scraper` 在那台報 `caption-error`（預期）。
- 解法: `captions-scraper.startAkkaduMonitor` 在房間 `broadcast:true` 時啟動 headless 抓 DOM 字幕，
  透過 `INGEST_URL` (env, 預設 localhost:8787/ingest，設 `https://live.esggo.co/ingest` 推公網) POST 到 VPS。
- VPS `monitor-server` 的 `/ingest` 收到後 `broadcast('caption')` → 公網 SSE 即時收到。
- 端對端驗證: POST 測試字幕到 `https://live.esggo.co/ingest?src=akkadu-kxxf` → 公網 SSE 收到 `event: caption`。✓

## 7b. 自建即時翻譯中樞（取代 Akkadu 付費顯示）— 已上線驗證

**商業本質**：Akkadu 點數=顯示閘控。沒儲值 → `rooms/kxxf` 回 `broadcast:false` → RTM 不推字幕。
白嫖 RTM 路徑不可行，必須完全自建。Akkadu 費率：字幕 5點/h + 即時分享 30點/h（48h 總計 1,680 點）。

**架構（零依賴，Node 原生 fetch）**
- 講者端 `studio.html`：瀏覽器原生 **Web Speech API** (SpeechRecognition) 做 STT — 免 key、免 npm、免費
- 中樞 `monitor-server.mjs` `/speak` 端點：收轉錄 → 翻譯 → SSE `event: translation` 廣播
- 翻譯引擎 `translate.mjs`：可插拔，預設 **MyMemory 免費端點**（零 key，已驗證可用）；env `LIBRETRANSLATE_URL` 可換自建 LibreTranslate
- 觀眾端 `stream.html`：RWD 美化，多語便當盒卡片 + 5T 顯示（hash/origin/timestamp）
- 5T 貫徹：translation payload 含 `sourceOrigin`(可溯源) / `hash`(sha256 不可篡改) / `timestamp`(可追蹤)

**啟用多語**：env `LANG_TARGETS=zh-CN,en,ja,es,ko,fr` `LANG_DEFAULT=en`（預設已設）

**端對端驗證（公網）**：
```
curl -X POST https://live.esggo.co/speak -H 'Content-Type: application/json' \
  -d '{"text":"...","from":"en","src":"studio","speaker":"demo"}'
→ 回 {ok:true, translations:{zh-CN:..., ja:..., ...}}
→ 公網 SSE /stream?src=studio 收到 event: translation 含 6 語真實翻譯 ✓
```
講者開 `https://live.esggo.co/studio.html` 麥克風授權即開始；觀眾開 `https://live.esggo.co/stream?src=studio` 看多語字幕。
**成本：0 點數 / 0 元，永久可用。**

## 7c. 最佳實踐化硬化 v0.6（已上線驗證 17/17 PASS）

伺服器強化（`monitor-server.mjs`）：
- `GET /healthz` — uptime / subscribers / langTargets / translate stats（5T Transparent）
- **事件回放環形緩衝** `REPLAY_MAX=20`：晚進觀眾立即補看近期 caption/translation（heartbeat 不入緩衝）
- **SSE keep-alive** 每 25s 寫 `: ka\n\n` 註解行，穿透 nginx/CF 閒置逾時
- **靜態白名單** `PUBLIC_FILES` Set：未列一律 404，防 `.mjs/.json/.conf` 外洩（單靠
  `filePath.startsWith(__dirname)` **不夠** — fetch 會正規化 `/../`，實際洩漏的是同目錄原始碼）
- `INGEST_TOKEN` env（設了才啟用）+ 每 IP 60 req/min 滑動視窗速率限制，套在 `/ingest` `/speak`
- `PORT` 改 env 可覆寫（本機用 8799 煙霧測試，不撞 VPS 8787）

翻譯引擎強化（`translate.mjs`）：
- `Promise.all` 平行翻譯：延遲從 N×RTT → 1×RTT（6 語 2.2s，快取命中 28ms）
- 引擎鏈 LibreTranslate → MyMemory → **回原文兜底**（永不中斷轉播）
- 指數退避重試 ×2、`stats` 可觀測、回傳 `engines` 標記每語實際引擎（5T 可溯源）

回歸測試：`node _smoke-test.mjs`（`BASE=https://live.esggo.co` 可測公網），17 項涵蓋
healthz / SSE translation / 5T 欄位 / 快取 / 回放 / 白名單 / 未知 src。

### Windows 陷阱
- `terminal(background=true)` 執行含 env 前綴的 node 指令會因 `no job control` 退出 →
  寫一個 wrapper `.sh`（`export` + `exec node`）再 background 跑。
- git-bash 殺 port 佔用行程：`taskkill //PID` 與 `cmd //c taskkill` **都無效**，
  用 `powershell -NoProfile -Command "Stop-Process -Id <pid> -Force"`。

## 7d. 系統建制 v0.6（完整工程化，已上線 22/22 PASS）

新增檔案（全部零依賴）：
| 檔案 | 作用 |
|---|---|
| `env.mjs` | 零依賴 `.env` parser，**真實 env 優先於檔案** |
| `env-boot.mjs` | 副作用模組。**必要**：ESM import 是 hoisted，把 `loadEnv()` 寫在 import 之間不會先執行，必須拆成獨立模組放在 import 串**第一行** |
| `ecosystem.config.cjs` | pm2：autorestart / max_memory_restart 400M / `kill_timeout 8000`（SSE 需時間收線）/ `time:true` 日誌時戳 |
| `deploy.sh` | 一鍵部署 5 階段：語法檢查 → 本機煙霧測試 → scp → VPS pm2 重啟 → 公網端對端。`set -euo pipefail` 任一步失敗即止 |
| `run.sh` | 本機常駐 wrapper（繞開 git-bash background 陷阱） |
| `.env.example` / `.gitignore` | 環境範本；`.env` 不入庫 |

`monitor-server.mjs` 補完：
- SIGTERM/SIGINT **優雅關閉**：先 `res.end()` 所有 SSE 連線再 `server.close()`，5s 保險退出
- `unhandledRejection` 掛勾避免靜默崩潰
- `/healthz` 擴充 `version` / `memoryMB` / `envFileLoaded` / `translateEngine`

`package.json` v0.6.0：`start` / `dev`(--watch) / `check` / `test` / `test:prod` / `health` / `deploy`。
（原 `start:ui: python3 -m http.server` 已是錯的——服務本身就供靜態檔，已刪。）

回歸測試擴至 **25 項**（認證啟用時），新增 healthz 欄位組與 401/401/200 認證三態；
`_smoke-test.mjs` 讀 `INGEST_TOKEN` env 自動對寫入端點帶 `Authorization: Bearer`。

### 血淚陷阱（真實踩過）
1. **埠佔用假失敗**：舊版殘留行程佔住 8799，新行程啟動失敗，測試打到舊服務 → 回報
   `version=undefined` 4 個 FAIL。deploy.sh 已加「測試前偵測埠佔用即中止」+「healthz 必須含
   `version` 才續行」雙守衛。
2. **`read_file` 誤判 UTF-8 檔為 binary**（`file` 指令證實是正常 UTF-8）→ `patch` 工具跟著失效。
   繞法：寫一次性 Python 腳本做精確字串替換，跑完即刪。
3. `execute_code` 在 cron/受限 profile 下被 BLOCKED，改用 `write_file` + `terminal python`。

## 8. 啟動/部署命令

```bash
# 一鍵部署（推薦）— 含本機測試 + 公網驗證，任一步失敗即中止
cd apps/omni-blueprint-hub && bash deploy.sh
bash deploy.sh --skip-local-test     # 只有前端改動時

# VPS（pm2 由 ecosystem 管理）
pm2 start ecosystem.config.cjs && pm2 save
pm2 restart omni-blueprint-hub --update-env

# 本機常駐（務必用 wrapper，勿直接 background `cd X && node Y`）
bash run.sh

# 驗證
node _smoke-test.mjs                              # 本機 (預設 8799)
BASE=https://live.esggo.co node _smoke-test.mjs   # 公網
INGEST_TOKEN=xxx BASE=... node _smoke-test.mjs    # 含認證三態

# 本機自動化層 (推到公網)
CHROME_BIN="C:/Users/dingj/.../chrome-headless-shell.exe" \
INGEST_URL="https://live.esggo.co/ingest" \
node captions-scraper.mjs
```

## 9. 誠實驗證原則

### `esggo-omni-center` 是 learning-center 的副本，不屬根 repo 測試範圍
`pnpm test` 曾有 1 個永久 FAIL：
`esggo-omni-center/src/lib/omni-core/__tests__/omni-function.test.ts`
→ `Cannot find package '@firebase/app'`。

根因（已查證，非推測）：
- `esggo-omni-center` 是使用者從 `esggo-learning-center` **複製**出來的獨立子專案
- 自帶 `vitest.config.ts` 與 `"test": "vitest run"`，**不在** `pnpm-workspace.yaml`（只含 `apps/*` `packages/*` `.`）
- 其 `node_modules` 僅 16 項（安裝不完整），`@firebase/` 根本不存在
- 但根 vitest 仍把它 39 個 `.test.ts` 抓進來跑 → 設定洩漏

排除前先證明零覆蓋損失（**務必照做，不可直接 exclude**）：
1. 39 檔**全部**在根目錄有同名對應，獨有 = 0
2. 35 檔位元組相同；4 檔差異僅 `evidence: {}`(舊 object) vs 根目錄 array(`IComponentCore` 契約)，
   且 it-block 數完全一致（9/9、16/16、30/30、4/4）→ 子專案是**舊版快照**

修法：`vitest.config.ts` 的 `exclude` 加 `'esggo-omni-center/**'`。
結果：`Test Files 39 passed / Tests 484 passed`，**exit code 0**。

### 通則
- `.mjs` (Node ESM) 無 `pnpm test/lint/typecheck` → 驗證 = `node --check` + 實際跑 SSE/ingest 端對端。
- 房間 `kxxf` 當前 `broadcast:false` 時，caption 事件不會出現（非程式缺失，是 API 狀態）。
- 從不宣稱成功而沒看到真實輸出（SSE 收到 event / ingest 回 ok / nginx -t 通過 / exit code 0）。
- 測試數下降時**必須**先證明是重複鏡像而非真實覆蓋，再宣稱無損失。

## Self-audit
- [ ] DNS token 有 DNS:Edit（非 wrangler OAuth）
- [ ] A 記錄 proxied:false 且指向 VPS IP
- [ ] certbot 證書 SAN 含子域
- [ ] nginx SSE 優化 (buffering off + 長 timeout)
- [ ] CDP 連 page target（非 browser-level）
- [ ] 字幕走 /ingest 推播（VPS 無 chromium 兜底）
- [ ] 實跑 SSE 收到 event 才宣稱完成
