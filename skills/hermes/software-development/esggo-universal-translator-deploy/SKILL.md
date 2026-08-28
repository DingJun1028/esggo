---
name: esggo-universal-translator-deploy
description: Build, type-gate, deploy 萬能即時翻譯 universal-translator to VPS.
triggers:
  - universal-translator
  - 萬能即時翻譯
  - translate.esggo.co
  - double-TS matrix for plain .mjs
  - deploy node translate to 161.118.248.180
---

# ESG-GO 萬能即時翻譯 — 建置 / 雙向 TS 矩陣 / VPS 部署

app 位於 `apps/universal-translator/`（server.mjs + translate.mjs + public/*.html）。純免費翻譯鏈：Google gtx(零 key, 免費) → LibreTranslate(自建, 選用) → MyMemory(免費) → 原文兜底。

## 雙向 TS 終始矩陣（核心架構）

- **canonical 源**：`esggo/shared/types.ts` — 領域型別一次定義（`TranslateEngine` / `LanguageCode` / `ITranslateRequest` / `ITranslateResult` / `ISpeakPayload` / `ISseTranslationEvent` / `IOmniTypeMatrix`）
- **generator**：`scripts/export-shared-types.js` — 把 map 內的 block 匯出成各 consumer 的 `types/generated/esggo-shared.d.ts`
- **消費端**：`apps/universal-translator/types/generated/esggo-shared.d.ts`（僅 import，不可改）
- **型別守門**：`apps/universal-translator/tsconfig.ut.json`（`allowJs + checkJs + strict`，納入 `.mjs` + 生成 `.d.ts` + `types/decl.d.ts`）

### 接入新領域型別的步驟
1. 在 `shared/types.ts` 加 `export` 區塊
2. 在 `scripts/export-shared-types.js` 的 `map` 加 `['TypeName', 'enum'|'interface'|'type']`
3. 從 consumer 目錄跑 `node ../../scripts/export-shared-types.js`
4. `npx --no-install tsc -p tsconfig.ut.json --noEmit` 必須 0 error

### 讓純 .mjs 服務通過 strict 型別守門的實踐（2026-08-08 實證）
- 檔頭加 `// @ts-check` + `/// <reference path="./types/generated/esggo-shared.d.ts" />`
- 每個函式用 JSDoc `@param`/`@returns`/`@type` 標型別；optional 參數在函式內用 `String(x)` 或 `x || 'default'` 收斂成確定 string（strict 下 `string | undefined` 不能傳給 `string`）
- `enum` 值（`'passthrough'` 等）直接當 `string` 用時，契約介面的 `engine` 欄位要放寬成 `string`（不要用 `TranslateEngine` enum，否則運行期動態引擎值會型別不符）
- 第三方缺 `.d.ts`（如 `ws` 在 pnpm 隔離下找不到）→ 建 `types/decl.d.ts` 做 `declare module 'ws'`
- `req.url` 在 `http.IncomingMessage` 上可能是 `undefined` → 回調開頭 `const url = req.url || '';` 並標 `@type {string}`

### generator 已知 3 bug（已修，詳見 references/generator-fixes.md）
A. SRC 路徑依賴 cwd → 改用 `fileURLToPath(import.meta.url)` 基準
B. ESM `__dirname` 未定義 → 同上修法
C. 多行 `type X = \n | 'a'\n | 'b';` 被大括號配對截斷 → type 改以 `;` 結尾掃描

### ⚠️ 兩條部署路徑（FIRST-CLASS，2026-08-10 修正）
- **手動 SSH 路徑**：目標 `/opt/esggo/apps/universal-translator`，pm2 `universal-translator`(8788)，對外 `translate.esggo.co`。見下方「VPS 部署序列」。
- **CI 自動路徑 `deploy-oracle.yml`**：目標 **`/var/www/esggo`**（根 repo，不是 /opt/esggo！），由 GitHub Actions 推送 main 時自動跑。`ecosystem.config.cjs` 在這個路徑下定義 pm2 服務——**若它沒含 universal-translator，UT 永遠不起，health check `localhost:8788` 恆 000**（這是 2026-08-10 部署紅的最陰險根因，已加 UT 到 ecosystem）。完整失敗模式鏈 + 修復 commit 對照見 **references/deploy-oracle-runbook.md**（SSH 權限 → dubious ownership → chown → pnpm CI → SSH 255 → health 輪詢 → ecosystem 缺 UT → 併發 cancel-in-progress 卡死 → sacred-pipeline lint/CLI-test 紅）。
- 排錯第一動：先 `gh run view <ID> --log-failed` 看是上述哪一環，再對號修復，不要盲目重跑。完整 CI 紅修復手冊（含 sacred-pipeline.yml / ci.yml 的 lint 門檻、CLI 測試 spawnSync(tsx) 脆弱、secret-scan firebase key、eslint warning 閾值、併發 cancel 卡死）見 **references/ci-pipeline-repair.md**。

### VPS 部署序列（161.118.248.180）

### 前置（一次性確認）
- SSH 用 `ubuntu@161.118.248.180`（**不是** root/git@，二者一律 Permission denied）
- key：`~/.ssh/esggo_original`
- app 代碼：`/opt/esggo/apps/universal-translator`
- pm2 進程名：`universal-translator`（端口 8788）
- 對外：`translate.esggo.co` → Cloudflare Tunnel → `127.0.0.1:8788`

### 部署步驟
```bash
# 1. 本機 commit + push origin main (先 fetch + rebase 若有人推過)
# 2. VPS 同步（VPS 常有未提交本地修改，先 stash）
ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 \
  "cd /opt/esggo && git stash push -u -m pre-pull && git pull --ff-only origin main && cd apps/universal-translator && pm2 reload universal-translator"
# 3. 驗證本地健康
ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 "curl -s http://localhost:8788/health"
```
- 端口佔用排查：`ss -tlnp | grep 8788`；舊 node pid 用 `taskkill`(Win) / `kill`(VPS) 清
- 本機跑 server 若用 `terminal(background=true)` 在 Git-Bash 子 shell 下會被 SIGHUP 殺掉 → 改用 Python `subprocess.Popen` 控制最穩（見 references/verify-patterns.md）

### ⚠️ 對外 POST 中文「亂碼」根因（已更正，2026-08-08 實證）
- **舊判斷（錯誤，已廢棄）**：曾以為是 Cloudflare 邊緣把中文替換成 `U+FFFD`（`ef bf bd`）。
- **真實根因（2026-08-08 證實）**：是 **Windows Git-Bash 終端機編碼 artifact**。用 `curl -d '{"text":"中文"...}'` 從 Git-Bash 終端機直接傳時，Bash 把 UTF-8 多 byte 字元以錯誤編碼送給 curl，curl 發出損壞 bytes，Cloudflare 收到非法 UTF-8 才替換成 U+FFFD。
- **證據**：改用檔案載入 UTF-8（`printf '%s' '...' > C:/tmp/x.json` + `curl --data-binary @C:/tmp/x.json`）打對外 `translate.esggo.co` → 回正確英文，無 U+FFFD。Cloudflare 完全正常。
- **結論**：無需登 Cloudflare Dashboard。產品路徑（瀏覽器 WS、studio→SSE fetch、對外檔案法）全部 UTF-8 正常。**驗證對外 REST 時一律用 `--data-binary @file.json`（不要內嵌中文到 `-d`）**，否則會自欺看到亂碼。
- 仍保留 server 端 `readBody(req)` 用 `Buffer.concat(chunks).toString('utf-8')` 累積以防分塊 byte 邊界切斷；回應頭加 `charset=utf-8`（防 server 側 byte 邊界，非防 Cloudflare）。

### Node http 路由 / TS / JS 實戰坑（FIRST-CLASS pitfalls）
- **路由判斷要剝 query string**：`req.url` 含 `?lang=zh-TW`，所以 `url === '/transcribe'` 永遠 false（落到 404）。改用 `url.split('?')[0] === '/transcribe'`，或 `new URL(req.url, 'http://x').pathname`。前端 fetch 帶 `?lang=` 時這坑必現。
- **TS `fetch` body 型別**：strict 下 `fetch(url, {body: buffer})` 報 `Buffer not assignable to BodyInit`。包一層 `new Uint8Array(audioBuf)` 即可。
- **JS 運算子優先級**：`'<span>'+LANG_NAME[x]||x+'</span>'` → `+` 比 `||` 緊，表達式在 `+'<span>'+LANG_NAME[x]`（truthy）處截斷，後面 `</span>` 與內容全丟。一律括號：`'<span>'+(LANG_NAME[x]||x)+'</span>'`。stream.html 曾因此讓字幕標籤只顯半個。
- **pm2 部署後代碼沒更新**：`pm2 reload` 偶發服務舊碼（尤其路由 404 明明檔案有）。保險用 `pm2 restart <name>`，或 `pm2 delete <name> && pm2 start server.mjs --name <name>` 強制全新載入。

### 伺服器端語音轉文字（STT）子系統（2026-08-08 新增）
- 免費零 key：`faster-whisper`（CTranslate2, CPU 優化）跑本地 STT 微服務，跨平台（手機/平板/任意瀏覽器都能用），不依賴瀏覽器 Web Speech API。
- 架構：`studio.html` 用 `MediaRecorder` 錄音（麥克風或系統音/Zoom 對方）→ `POST /transcribe` → `server.mjs` 轉呼本地 `stt_service.py`（監聽 `127.0.0.1:8791`）→ 回 `{text, language}` → studio 再 `POST /speak` 推播 SSE 字幕。
- **STT 必須用 pm2 守護（FIRST-CLASS，2026-08-08 實證）**：VPS 上 `stt_service.py` 必須由 **pm2** 啟動並守護（與 node server 同機制），**絕不能用 `nohup python ... &` 或 `setsid ... & disown`**——這兩種在 SSH session 關閉時整個 process tree 會被 reaped，進程死掉後用戶「講話完全沒字幕」且無錯誤可見（node `/transcribe` 回 502）。啟動命令：
  ```bash
  ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 "cd /opt/esggo && source stt_venv/bin/activate && pm2 delete stt 2>/dev/null; STT_PORT=8791 pm2 start /opt/esggo/apps/universal-translator/stt_service.py --interpreter /opt/esggo/stt_venv/bin/python --name stt"
  # 模型載入 ~20s 後: pm2 list 看 stt 狀態 online; ss -tlnp | grep 8791 確認 LISTEN
  ```
  重啟/確認：`pm2 restart stt`；存活檢查 `pm2 list | grep stt` + `ss -tlnp | grep 8791`。**每次 STT 相關改動後都要確認 8791 真的 LISTEN**，否則用戶端「沒字幕」的根因就是它。
- 詳細安裝/端口/venv 坑見 **references/stt-setup.md**（含 espeak「偽陽性」陷阱：合成音無法驗證 whisper 準確率，須真實人聲）。

### ⚠️ 系統音模式 getDisplayMedia 抓不到音（FIRST-CLASS pitfall, 2026-08-08 實證）
- **現象**：勾「用系統音（電腦 / Zoom 聲音）」→ 開始 → 狀態顯示「系統音收音中 · 第 N 輪」但**字幕區永遠空白**，除錯面板「尚無記錄」。用戶回報「抓不到系統音」。
- **根因（舊版 `startSys` 寫法）**：取得 `getDisplayMedia({video:true,audio:true})` 後**把 video track `stop()` 掉**只留 audio 給 MediaRecorder。Chrome 裡 display stream 的 audio track 與 video track 綁在同一 capture session，**停掉 video 會讓 audio track 一併失效** → MediaRecorder 收到 0 bytes → `rec.onstop` 裡 `if(!chunks.length){rec.start(4000);return;}` 直接跳過 → 永遠不轉錄、不出字幕。這是「看得到在錄、卻什麼都沒抓到」的典型靜默失敗。
- **修法（已部署 `1fb9adeed`）**：
  1. `startSys()` 取得 stream 後**絕對不要 stop video track**——原 display stream 的 video 保持活著，audio track 才不會死。
  2. MediaRecorder 改用**純 audio-only stream**：`const audioOnly=new MediaStream(stream.getAudioTracks());` 再 `new MediaRecorder(audioOnly,{mimeType})`。這樣錄音機只收音、不受 video 状态影響，同時原 display stream 的 video 仍活著保住 audio。
  3. `rec.onstop` 開頭加診斷 `dbg('rec.onstop chunks='+chunks.length+' bytes='+chunks.reduce((a,c)=>a+c.size,0))`，並在 POST 前 `dbg('POST /transcribe bytes='+buf.byteLength)`——日後若再「沒字幕」可直接看 chunks/bytes 是否為 0 定位是「音源沒進來」還是「轉錄失敗」。
- **加即時音量條（已部署 `bea368230`，診斷首選）**：用戶看不到 console 時，最好的「系統音到底抓到沒」指標是 UI 上的 **AudioContext AnalyserNode 音量條**。`startMeter(stream)` 把 `MediaStreamSource→AnalyserNode`，`requestAnimationFrame` 讀 `getByteTimeDomainData` 算峰值畫條。**點開始後條形會動 = 聲音有進來（選擇器有勾「分享音訊」、來源選對）；完全不動 = 沒抓到（最常見是 getDisplayMedia 選擇器沒勾「分享音訊」，或選了「此分頁/無聲源」）**。麥克風模式（Web Speech）也先 `startMic()` 取流給 `startMeter(stream,true)` 偵測後即釋放（Web Speech 不吃 stream）。`stop()` 呼叫 `stopMeter()` 歸零。這把「抓不到系統音」從不可見變成一眼可辨。
- **用戶操作提醒（給用戶的 SOP）**：開始系統音前，瀏覽器會彈「選擇要分享的畫面」對話框——**必須選「整個螢幕」或「Zoom 視窗」並且勾選底部的「分享音訊 / Share audio」**，否則拿到的 audio track 是空的。拿不到 audio track 時 `startSys` 已處理：`if(!a){toast('請在分享視窗勾選「分享音訊」');...return null;}`。
- UIUX 玻璃擬態設計 token 與可抄元件樣板見 **references/uiux-best-practice.md**。
- 系統音模式 getDisplayMedia 抓不到音 + 即時音量條診斷樣板見 **references/system-audio-debug.md**（Chrome 停 video 會殺 audio track、audio-only MediaStream、AnalyserNode 音量條 SOP）。
- **loopback 裝置選擇器＝抓不到系統音的終極解法（2026-08-08 後續實證，已部署 `f84885018`）**：Windows 上 `getDisplayMedia` 選「應用程式視窗」抓不到聲音、選「整個螢幕」又笨重。更穩的路徑是**直接用 `getUserMedia({audio:{deviceId:{exact:devId}, echoCancellation:false, noiseSuppression:false, autoGainControl:false}})` 抓「立體聲混音 / Stereo Mix / What U Hear / Wave / 數位」這類 loopback 錄音端**——這些裝置直接把電腦輸出（含 Zoom 對方聲音）灌進麥克風通道，繞開 getDisplayMedia 的所有坑。實作：`enumerateDevices()` 過濾 `kind==='audioinput'`，用關鍵字 `(stereo mix|立體聲混音|what u hear|loopback|mix|wave|數位|digital)` 標 `loopback` 並 `sort` 排前面，下拉預選 loopback 裝置；`startSys()` 先讀 `#deviceSel.value`，有值就走 getUserMedia loopback 分支，失敗才回落 getDisplayMedia。UI 上 sysChk 勾選時顯示 deviceRow 並 `refreshDevices()`。注意：headless/部分機器無 loopback 裝置（只列到麥克風），此時回落 getDisplayMedia 或麥克風模式。

### 半透明字幕浮層（疊 Zoom）
- `overlay.html`：全屏透明、`pointer-events:none`（點擊穿透到下方 Zoom）、半透明黑底白字，底部中央；工具列（透明度/字體/位置/目標語滑桿）平時隱藏，滑鼠移頂部或按 `H` 喚出。SSE 收 `translation` → 顯示源語+目標語，幾秒後淡出。
- studio 的「觀眾端 QR」連結已改指 `overlay.html?room=xxx`（不再指 stream.html）。觀眾掃碼進半透明浮層，瀏覽器設「永遠置頂」即可固定疊在 Zoom 上。
- **QR 必須同源自帶（不走 CDN）**：中國環境 `cdn.jsdelivr.net` 常被牆，動態 `import()` 從 CDN 載 QR 庫會靜默失敗 → 用戶看到「QR 沒出來」。修法：本機下載 `qrcode.min.js` 進 `public/`，`server.mjs` 靜態路由放行 `.js`，`studio.html` 用 `<script src="./qrcode.min.js">` 同源載入。詳見 **references/qr-same-origin.md**。

### 前端介面迭代偏好（用戶明確授權，2026-08-08 — FIRST-CLASS）
- 用戶回報「沒有語音轉字幕」→「沒有效果」後說「**介面也可以更換了**」＝授權直接重做 studio UI，不必再問確認。重做方向：**極簡化**——單一「▶ 開始語音轉字幕」大按鈕 + 模式切換徽章（🎤麥克風/🖥系統音/🌐瀏覽器）+ 來源語(預設自動偵測) + 目標語 multiple-select(預設 en+zh-TW) + 即時字幕卡片 + QR。
- 「**QR code 也可以做一起**」＝把觀眾端 QR 整合進主流程：**`start()` 時自動生成 room + 呼叫 `showQR()`**，不要等使用者點額外按鈕。觀眾一開轉錄就能掃碼進半透明浮層；保留「重新生成 QR」按鈕備用。
- **語音自動偵測 + 雙向預設**：STT 模式 fetch `/transcribe?lang=auto`（faster-whisper 自動偵測，回 `language` 欄），`addUtterance(text, detectedLang)` 用偵測語作 `fromLang`；目標語預設 `[en, zh-TW]` 解決「回中文後還翻英文」——無論講中文或英文，觀眾都看到雙語（英文↔繁中）。
- **麥克風模式主路徑 = 瀏覽器原生 Web Speech API（Chrome 內建、免費零 key、準確率高、純前端零延遲），伺服器 faster-whisper 降為備援**（2026-08-08 實證修正，已部署 `723192d15`）：`const SR=window.SpeechRecognition||window.webkitSpeechRecognition; const r=new SR(); r.continuous=true; r.interimResults=true; r.lang=primaryLang();` → `r.onresult` 取 final transcript → `onText()`。Web Speech 不可用（Firefox/Safari 不支援、或 `recognition.start()` 拋錯）時才回落 `startMic()`+MediaRecorder+`/transcribe`。**系統音模式因 Web Speech 只吃麥克風，仍只能用伺服器 whisper**（見下方「系統音模式 getDisplayMedia 抓不到音」pitfall）。修正理由：用戶端 Chrome 原生 Web Speech 比 VPS base 模型更準、零延遲，且繞開 VPS STT 偶發死亡（見 STT pm2 守護 pitfall）。語言選擇 chips 點擊要同步 `recognition.lang=primaryLang()`（BCP-47：zh-TW/en-US/ja-JP/es-ES/fr-FR/ko-KR/de-DE）。

### 平台功能補齊與 UIUX 美感標準（2026-08-08 後續 — FIRST-CLASS）

用戶回報「未加實踐優化補齊平台功能」＝不只要單頁好用，**整個平台三頁要功能齊全、風格統一**。補齊清單（已實作並部署）：

1. **`index.html` 改為平台入口導覽**（原舊雙欄手動翻譯頁，風格斷裂）：三張玻璃擬態卡片入口（🎤 收音端 / 🎬 半透明浮層 / 📺 觀眾端）+ 功能特色格 + 首頁 `/health` 健康檢查。不要讓首頁是「另一個翻譯工具」，要串聯三頁。
   - **⚠️ 用戶明確要求「三合一為一體」（2026-08-08 後續實證，已部署 `a8a8f30fb`）：把 studio（控制端）+ overlay（浮層）+ stream（觀眾端 QR）合一到單一 `index.html`**。做法：index.html 重寫為一體化單頁——含語言 chips（`active` Set + `SR_LANG` BCP-47）、sysChk 勾選、音量條、開始鈕（系統音/麥克風雙模式 + 靜音自動降級）、字幕顯示卡、手動輸入推播框、觀眾 QR（`new QRCode($('#qrBox'),{text:location.origin+'/overlay.html?room='+room})`）、來源/音量徽章。房間持久化：`Math.random().toString(36).slice(2,8)` 寫進 `location.search` 的 `room` 參數。舊 `/studio`、`/overlay.html`、`/stream.html` 路由仍保留（server 靜態放行）不失效，但主推進入點改為首頁一體化。**同步原則**：index.html 加的新能力（loopback 裝置選擇器、狀態徽章、靜音自動降級）必須同步回 overlay.html（浮層是實際疊 Zoom 的頁），否則兩頁功能落差。本會話中斷點：overlay.html 的 HTML 元素已加但 JS+CSS 尚未同步，下次接續先補 `listDevices()` + `startSys()` loopback 分支 + 控制綁定 + `updateBadge()`/`updateLevel()` + `.sysrow`/`.badges`/`.badge` 樣式，再 `node --check` 抽取 module 驗證。
2. **`stream.html`（觀眾端）升級為玻璃擬態 + 雙語 + 多目標語 chips**：原本是舊設計、單目標語浮層。跟 overlay 一致風格（青綠 `--accent`、blur、雙語 `.pair` 疊排）。
3. **`studio.html` 加「手動輸入推播」模式**：錄音框下加 `<textarea id="manualInput">` + 推播按鈕 + Enter 送出（免錄音直接出雙語字幕，會議中貼文字用）。複用 `onText()` 即可。
4. **統一配色**：全部頁用同一套 `--accent:#36e0c0` / `--accent2:#5b8cff` 青綠，不要 index 用藍 (`#2563eb`) 斷裂。

**UIUX 美學標準（用戶反覆要求「美感提升 / 全部最佳實踐設計」，須預設遵守）**：
- Glassmorphism：面板 `background:rgba(20,27,41,.72)` + `backdrop-filter:blur(18px)` + `border:1px solid rgba(255,255,255,.09)` + 多層 `box-shadow`。
- 背景：雙 `radial-gradient`（青綠 + 藍）疊深色底，`background-attachment:fixed`。
- 圓角一致（`--radius:18px`），主按鈕用 `linear-gradient(135deg,var(--accent),var(--accent2))` 漸層 + 微光陰影。
- 語言選擇用**可點擊膠囊 chips**（`.chip.on` 亮起）取代隱藏 multi-select，直覺可見。
- 錄音態用**脈動紅點 + 均衡器條動畫**（`@keyframes eq` + `pulse`），給明確視覺回饋。
- 字幕卡進場用 `slideIn` 滑入淡入；浮層用 `pop` 縮放淡入。
- 設計 token 參考 **references/uiux-best-practice.md**（可直接抄的 CSS 變數 + 元件樣板）。

### ⚠️ espeak-ng 絕對不能用來驗證 STT（FIRST-CLASS pitfall, 2026-08-08 實證）

#### 轉錄錯誤可見化（用戶回報「轉錄錯誤字幕沒出現」的修法, 2026-08-08 — FIRST-CLASS）
- **現象**：用戶實際使用時回報「轉錄錯誤字幕沒有出現」。根因不是 STT 掛掉（VPS 8791 與 node `/transcribe` 路由、對外 Cloudflare 全通），而是**錯誤只在 toast 閃 3.5 秒、字幕區完全沒反應** → 用戶以為字幕功能壞了。
- **修法（已部署 studio.html）**：
  1. `onText()` 加**垃圾轉錄過濾**：`clean = text.replace(/[\s\d.,，。、()（）\-_=+*#@!?]/g,'')`；`if(clean.length<2)` 不當字幕，toast 提示「轉錄內容無意義，請靠近麥克風或檢查音源」。這擋掉 espeak 類機械音產的 `1,2,1,2...` 數字串被當字幕推播。
  2. 新增 `showErrorCard(msg)`：轉錄失敗 / HTTP 非 2xx 時，在字幕區 append 一張紅色錯誤卡（不只 toast），讓問題可見。
  3. `rec.onstop` 錄音停止後先 `setStatus('🧠 轉錄中…')` 給視覺回饋，再 fetch `/transcribe`；失敗分支明確 toast + showErrorCard。
  4. 加 **「🎤 測試麥克風」鈕**（錄 4 秒 → 轉錄 → 字幕區顯示原始結果，不推播觀眾端），讓用戶能自行區分「音源問題（靜音/沒授權）」vs「STT 問題（回垃圾/500）」。診斷邏輯：轉錄出文字但 clean<2 → 紅字「麥克風可能太遠/太吵」；HTTP 非 2xx → 紅字「轉錄失敗」；空 text → 紅字「未偵測到語音」。
- **教訓**：任何後端推播失敗都要**同時顯示在 UI 主區域**，不能只靠 toast（toast 會被忽略）。
- **診斷優先（用戶回報「一樣未出現」時的 FIRST-CLASS 紀律）**：不要盲目重寫 UI 再賭一次。先加**可視化除錯面板**（`dbg()` 把每次 transcribe 的原始 HTTP 狀態 + JSON 回應攤在頁面上），並加「🎤 測試麥克風」鈕讓用戶自行區分「音源問題 vs STT 問題」。這能讓你看不到 console 的情況下定位根因。CORS 排除用 `curl -i` 帶 `Origin` 頭看回應頭；鏈路分「對外 / node 代理 / 本地 STT」三段 curl 驗證；base 模型對真實人聲夠用，**不要盲目升 small**。完整樣板見 **references/frontend-debug-panel.md**。
- **驗證**：改完 `studio.html` 一律 `node --check` 抽取出的 module；git commit 後 VPS `pm2 restart` + `curl /health` 確認 `status:ok`；線上用 `browser_navigate` + `browser_console`（確認無 js_errors）與 `browser_vision`（首頁美感確認）。

#### ⚠️ Cloudflare Tunnel 攔截「絕對域名 fetch」→ Failed to fetch（本會話真正根因, FIRST-CLASS, 2026-08-08 實證）
- **現象**：用戶反覆回報「打字翻譯沒成功 / 語音翻譯一樣沒字幕」。後端全通（curl 對外 `/speak` 回 200 + 雙語 JSON、`/transcribe` 回 200、STT 8791 LISTEN、SSE 廣播本機測 PASS），但瀏覽器裡字幕區顯示 `翻譯失敗：Failed to fetch`。**耗了一整輪才定位**。
- **根因**：前端用 `const API=location.origin+'/translate'` 再 `API.replace('/translate','/speak')` → 產生**絕對 URL** `https://translate.esggo.co/speak`。Cloudflare Tunnel 對「同源頁面用絕對域名發出的 fetch」有偶發攔截（TLS/SNI 或邊緣策略），瀏覽器收到 `Failed to fetch`（TYPE 層網路錯，不是 HTTP 4xx/5xx）。`curl` 測同 URL 卻成功——因為 curl 不走瀏覽器的 fetch 管線。相對路徑 `/speak` 則完全正常。
- **證據（瀏覽器 console 實測）**：
  - `fetch('/speak', {method:'POST',...})` → **OK**（回 JSON）
  - `fetch('https://translate.esggo.co/speak', {method:'POST',...})` → **Command failed**（Failed to fetch）
  - 頁面裡 `speakWithRetry` 呼叫絕對 URL → 字幕區出 `翻譯失敗：Failed to fetch（原文已顯示）`
- **修法（已部署 `80d651ff3`）**：所有前端 fetch **改用相對路徑**——`/speak`、`/translate`、`/transcribe`、`/stream`。不再用 `API.replace('/translate','/speak')` 拼絕對 URL。`API` 變數若只供 fetch 用則直接設 `const API=''`（但 QR code / 複製連結仍需 `location.origin+'/overlay.html?room='` 絕對 URL，因為掃碼要絕對路徑——QR 不受 fetch 攔截影響，保留絕對）。
  - ⚠️ 若把 `API=''` 又用 `API.replace('/translate','/speak')`，`''.replace(...)` 回空字串會讓 fetch URL 變空 → 失敗。正確做法是**直接寫死相對路徑字串** `'/speak'`，不要用 `API.replace`。
- **防禦性 fetch（消除 `Unexpected token '<'` 假錯誤，2026-08-08 後續實證，已部署 `39b8729d0`）**：前端 `await r.json()` 若後端偶發回非 JSON（如 Cloudflare 錯誤頁 HTML、或某次網路抖動）會拋 `SyntaxError: Unexpected token '<', "..." is not valid JSON`，用戶看到難看的 `轉錄錯誤：Unexpected token '<'`。修法：所有 `/transcribe`、`/translate`、`/speak` 呼叫包一層 `transcribeRetry`/`translateRetry`——先 `const txt=await r.text()` 再 `try{return JSON.parse(txt);}catch(_){throw new Error('服務回傳非預期格式（網路/逾時），請重試');}`，並保留 `if(!r.ok)throw new Error('HTTP '+r.status)`。這把「HTML 錯誤頁」轉成友好提示，不再洩漏 `<` 到 UI。重試建議 3 次（1s 間隔）後才拋。
- **一體化首頁 status pill 模式**：用 `.pill` + `.dot` 做「來源徽章」(`#srcBadge`：系統音待命/🖥系統音收音中/🎙麥克風收音中) 與「音量徽章」(`#levelBadge`：音量 N%)，`getComputedStyle(el).display` 確認 deviceRow 切換、AnalyserNode loop 裡 `if(running)updateLevel(vol)` 即時更新。一眼看出「現在用什麼源、有沒有抓到聲音」，比 toast 強。

#### 瀏覽器實測重現前端 bug（FIRST-CLASS 驗證技法, 2026-08-08 實證）
- **動機**：`node --check` / `tsc` / curl 全綠，但線上就是錯。語法守門抓不到「運行期 fetch 被攔截」這類問題。必須在真實瀏覽器裡實際跑一次 UI 流程。
- **技法**（用 browser 工具，不需麥克風/真實語音即可重現翻譯路徑）：
  1. `browser_navigate` 到 `https://translate.esggo.co/studio`
  2. `browser_type(ref=輸入框, text='今天的天氣很好')` 打字
  3. `browser_click(ref=推播按鈕)` 觸發頁面 JS
  4. `browser_console(expression="document.querySelector('#transcript').innerText")` 讀字幕區 DOM 文字 → 看是否出雙語（如 `英文Today's weather is good` / `繁中今天的天氣很好`）。**快照 snapshot 不顯示字幕框動態文字，必須用 console 讀 innerText**。
  5. 若要看 fetch 層錯誤，直接在 `browser_console` 跑 `fetch('/speak',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:'x',targets:['en']})}).then(r=>r.text()).then(t=>'OK:'+t).catch(e=>'ERR:'+e.message)` 對比 `fetch('https://translate.esggo.co/speak',...)` 的差異。
- **注意**：console 裡 `typeof API` 測 `API_UNDEFINED` 是**誤導**——module 裡的 `const` 不洩漏到全域作用域，不代表變數未定義；要從 module 內部行為（字幕區結果）判斷。

#### patch 工具字面反斜線 n 損壞（FIRST-CLASS pitfall, 2026-08-08 實證）
- **現象**：用 `patch` 工具改 `onText` 時，那行被寫成 `...json'},\n    body:JSON.stringify(...)`——檔案裡出現**字面值 `反斜線 + n` 兩字元**（不是換行），導致 `node --check` 報 `SyntaxError: Unexpected token`。
- **根因**：patch 的 `new_string` 含真實換行，工具在某次替換把它逸出成字面 `\\n` 寫入檔案。
- **修法**：發現 `node --check` 失敗且錯誤位置在 `}\n    body:` 這類片段時，用 `execute_code` 跑 Python 做字面替換最穩：
  ```python
  path = r'.../public/studio.html'
  s = open(path, encoding='utf-8').read()
  bad = "'application/json'},\\n    body:JSON.stringify"   # 檔案中實為 反斜線+n 兩字元
  good = "'application/json'},\n    body:JSON.stringify"  # 真實換行
  if bad in s: s = s.replace(bad, good)
  open(path, 'w', encoding='utf-8').write(s)
  ```
  ⚠️ Python 字串裡 `\\n`（兩字元）匹配檔案中的損壞，`\n`（單字元）是替換目標真實換行。改完 `node --check` 重跑確認 0 error 再 commit。
- **預防**：對含多行 JS 的編輯，改完一律 `node --check` 抽取出的 module；一旦 FAIL 立即用上面 Python 法修，不要反覆 patch（會再觸發同坑）。

#### browser 驗證 SSE 長連線頁逾時（pitfall, 2026-08-08 實證）
- **現象**：`browser_navigate('https://translate.esggo.co/stream.html?room=...')` **連續 3 次 Operation timed out**（該頁用 `new EventSource` 長連線，瀏覽器快照機制一直等元素 → 逾時），但 `curl -w HTTP=%{http_code}` 回 `200`（0.15s）且 `browser_snapshot` 顯示 SSE `heartbeat` 事件正常收。
- **結論**：SSE 頁 browser_navigate 逾時**不是網站故障**。驗證 SSE 頁請用：(1) `curl` 打 HTTP 狀態碼（確認 200）；(2) `browser_snapshot` 看是否收到 `event: heartbeat` / `event: translation` 原始行（確認連線存活）；不要依賴 browser_navigate 成功與否判斷頁面可否載。

- **現象**：VPS 用 `espeak-ng` 合成中文/英文語音 → `POST /transcribe` → faster-whisper 回一串數字 `3-4-3-4-3-4...`，完全不是原文。
- **根因**：espeak 合成音對 whisper 來說是極不自然的機械音（無韻律/共振峰錯誤），whisper 無法對齊音素，退化成數字串。**這不代表真實人聲失敗**——whisper 對真實人聲準確率公認高。
- **教訓**：不要用 espeak 產生的音檔去「證明 STT 能用」。它只能證明**資料管線通**（音訊能送達、能回 JSON），不能證明**轉錄準確**。要證明準確率，必須用真實人聲錄音（麥克風/Zoom 錄音）；CI/離線環境無法下載公開語料時誠實標註「未用真實人聲實測」。
- VPS 若離線（HuggingFace/Common Voice 只回 15–29 bytes 錯誤頁），也不要聲稱「已用真實語音測過」。

### favicon 404 雜訊（minor, 2026-08-08）
- 瀏覽器自動請求 `/favicon.ico`，未處理會在 console 噴 `404`（與功能無關但吵）。`server.mjs` 在 404 處理前加 `if(url.split('?')[0]==='/favicon.ico'){res.writeHead(204);return res.end();}` 回 204 消除。注意：頁面 console 裡其他紅字（如 `chrome-extension://...`、`Could not establish connection`、`fetchViaServiceWorker production extension not found`、`NSC_EXT_CONTENT_JS_INSERTED`、`Voice Mode Service initialized`）**全是用戶 Chrome 擴充功能日誌，與本工具無關**，不要去修。

### ⚠️ 多 agent 並行推 main 會互蓋（FIRST-CLASS 操作注意, 2026-08-08 實證）
- 本專案有多個 agent 同時推 `origin/main`。現象：本機 `main` 被另一個 agent 的 commit（如 `14577fea0`）硬推覆蓋，導致剛部署的變更（如音量條 `bea368230`）從本地消失，`git status` 看 studio.html 無 `startMeter`（grep 0），但**遠端 main 仍停在正確 commit**。
- **排查/恢復**：先用 `git fetch origin` 確認遠端 HEAD；若本地被蓋，對本地 `main` 執行 `git reset --hard origin/main`（需 auto-approve）把正確 commit 拉回；再 `grep -c 'startMeter' apps/universal-translator/public/studio.html` 確認檔案在；最後 VPS `git fetch origin && git reset --hard origin/main && pm2 reload universal-translator`。
- **部署後務必兩端確認**：本機 `git log -1` + VPS `git log -1` 都應是預期 commit；`curl https://translate.esggo.co/studio | grep -c 'meterFill'` 確認前端元素真的上線（數值 >0）。不要只看本地 commit 就假定 VPS 已同步——另一 agent 的中途推擋可能讓本地/VPS 不一致。
- **`.Jules/palette.md` 大小寫衝突擋 rebase（2026-08-08 實證，FIRST-CLASS）**：Windows NTFS 大小寫不敏感，但 git 索引裡同時出現 `.jules/palette.md` 與 `.Jules/palette.md`（另一個 agent/Jules 寫的未提交 accessibility 學習記錄）。結果 `git status` 一直顯示 ` M .jules/palette.md`（或 `.Jules/`），`git stash`/`git checkout -- .` 都清不掉，`git rebase origin/main` 直接 `cannot rebase: You have unstaged changes` 卡死。→ **解法**：先 `git update-index --assume-unchanged ".Jules/palette.md"` + `git update-index --assume-unchanged ".jules/palette.md"` 把鬼檔忽略，再 `git rebase origin/main`（通常一次成功），最後 `git push origin main`。若仍卡，用 `git stash -u` 含 untracked 全部、rebase、再 `git stash pop`。**絕不要手動編輯或 commit 那個鬼檔**——它會把別 agent 的未提交工作混進你的 commit。另外注意 `git pull` 分叉時用 `git pull --ff-only` 會 abort，直接走 rebase 流程最穩。

## 三元一體 Zoom 會議雙語字幕撥放器（player.html，2026-08-13 實證）
- **功能定位**：`public/player.html` 是一體化「載入 + 撥放 + 字幕」同一頁（內部註解標「一做三員一體」），支援三種來源：(1) 本地檔案 (file input)、(2) 網址 (URL)，(3) **🎥 Zoom 會議模式**（`getDisplayMedia({video:true,audio:true})` 擷取 Zoom 視窗畫面 + 系統音 → 直接設給 `<video>` 播放 + MediaRecorder 切片送 `/speech-to-subtitle` 轉雙語字幕）。
- **終始矩陣接入**：`player.html` 的 `<script type="module">` 開頭加 `/// <reference path="./types/generated/esggo-shared.d.ts" />`，關鍵函式補 JSDoc 型別（`showCaption`/`speechToSubRetry` 等），與 universal-translator 全域矩陣同步。
- **免費鏈不變**：Zoom 模式完全跑在瀏覽器端 `getDisplayMedia` + 免費 STT→翻譯鏈，無付費依賴。用戶操作 SOP：開會前點「🎥 Zoom 會議」→ 選 Zoom 視窗並**勾選「分享音訊」** → 影片元素顯示會議畫面、即時出雙語字幕。
- **前端驗證侷限**：Zoom 模式需真實瀏覽器 + 真實 Zoom 會議才能端到端驗證，CI/headless 無法跑。部署後用 `curl "https://translate.esggo.co/player.html?cb=$(date +%s)" | grep -c 'zoomBtn'` 確認按鈕已上線（>0 即成功），實際字幕流改用戶手測。

## 終始矩陣型別守門閉合（2026-08-13，commit `3744e7fc9`）
- **現狀**：`npx tsc -p tsconfig.ut.json --noEmit` 已 **0 error**（舊版技能寫的「~65 errors 有歷史債不阻塞」已作廢）。
- **閉合關鍵**（詳見 `esggo-ts-matrix-onboard` 技能更新）：canonical `ISpeechToSubtitleResult` 補 `translations?`/`engines?`、生成器 `sync-lang-matrix.mjs` 加 `@type` 註解、`translateToMany` 回傳型別改局部形、server.mjs 消費處 `|| {}` 回落、各 `.mjs` 補 JSDoc。
- **子 agent 警示**：delegate 修矩陣可能因 API 中斷「假成功」（自陳修完但 `git diff` 為空）。任何閉合宣告都必須親跑 `npx tsc` + `node --check` + `pnpm test` 驗證，勿信子 agent 自陳。
- **變更守則**：動 `shared/types.ts` 後必跑 `node ../../scripts/export-shared-types.js` → `npx tsc -p tsconfig.ut.json --noEmit` 確認 0 error 才 push（覺結界：型別同步雙綠燈前勿 push main）。

## 驗證模式（references/verify-patterns.md）
- 型別：`npx --no-install tsc -p tsconfig.ut.json --noEmit` → 0 error
- 行為：Python `subprocess.Popen` 起 server + `curl` 打 `/translate`、`/speak` + 並行 SSE 客戶端收 `event: translation` 原始行（注意過濾 `id:`/`event: heartbeat` 行）
- 對外：browser 工具開 `https://translate.esggo.co/` 走 WS 實測（最貼近使用者）
