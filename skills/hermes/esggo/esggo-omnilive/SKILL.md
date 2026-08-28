---
name: esggo-omnilive
description: OmniLive live-subtitle player + faster-whisper STT pipeline.
---

# esggo-omnilive

OmniLive = ESGGO 萬能即時轉譯雙語字幕播放器, 位於 `C:\Project\esggo\apps\omnilive`。
四流程: 音訊擷取 (getDisplayMedia/system-mic) → 語音辨識 (apps/stt faster-whisper) → 雙語翻譯 (免費鏈 google-gtx→mymemory→原文) → SSE 字幕播放器。
Zoom 會議為主輸入: 分享畫面務必勾「分享聲音」。

## Architecture (零依賴 Node 24, 純 ESM)
- `server.mjs` — HTTP: `/health` `/config` `/api/transcribe`(音訊bytes→whisper→雙語字幕) `/api/speak`(手動字幕) `/api/room`(建立分享房間) `/stream`(SSE 廣播) 靜態 `public/index.html`。
- `lib/`: `config.mjs`(集中 env) `audio-source.mjs` `stt.mjs`(transcribe + `vadSegments`/`vadSegmentsAny`) `translate.mjs`(mock 縫 `opts.mock`/`OMNILIVE_TRANSLATE_MOCK`) `subtitle.mjs`(BilingualSubtitle + SubtitleStore) `errors.mjs`。
- `start.mjs` — 一鍵啟動器: 若 `OMNILIVE_AUTOSTART_STT!=false` 且 apps/stt 未跑, 用 venv python 帶起 faster-whisper 再啟 OmniLive。`npm start` 指向它。
- `apps/stt` — 獨立 faster-whisper 微服務 (Python, `server.py`), 端口 8791。模型 VPS 實際跑 `small` (CPU 即時場景); `medium` 太慢(20-30s/段)不適合即時字幕。⚠️ **2026-08-17 已將 `apps/stt/server.py` 與 `apps/omnilive/server.mjs` 修復 commit 進 git (commit 7b0740c14)**, 不再只在 VPS。但 VPS 的 `/var/www/esggo/apps/stt/` 非 git repo, 部署時仍需 `scp apps/stt/server.py esggo-vps:/var/www/esggo/apps/stt/server.py` + `pm2 restart stt-whisper --update-env`。部署流程與地雷詳見 `apps/omnilive/DEPLOY.md`。

## ✅ ACCEPTED VERIFICATION CHAIN (用戶驗收門檻 — 全過才算完成)
```bash
cd C:/Project/esggo/apps/omnilive
node --test test/*.test.mjs      # 必須 21/21 pass (含房間密碼/VAD/過期)
npx tsc -p tsconfig.omnilive.json  # TS=0 (app-scope, strict:false)
node verify.mjs                  # 離線 mock 縫驗收 12 項
node scripts/e2e-voice.mjs       # 真實語音 E2E (edge-tts MP3 → whisper → 雙語字幕)
```
寫結果到 `e2e-result.json` 以避開 non-interactive shell 吞 stdout 問題 (見 PITFALLS)。

## CRITICAL FIXES learned this session
0. **【最後突破】caster 建立房間後 SSE 沒重連 → 主持人無字幕、觀眾有** — 這是「觀眾字幕準確度非常高、主持人本機完全沒字幕」現象的根因, 直接證明伺服器/STT/翻譯/SSE 廣播全正常, 問題只在 caster 前端。**根因: `connectSSE()` 在頁面載入時用空 room 連 (那時還沒建房間); 按『建立分享連結』後 `history.replaceState` 把 URL 換成帶 `?room=XXX` 的主持人連結, 但舊碼 `if(es)return` 擋住重連 → caster 的 SSE 一直掛空房間, 收不到自己播音的房間字幕。** viewer 用 `?room=XXX` 開頁面初次就連對 → 有字幕。**修法: `connectSSE()` 開頭先 `if(es){es.close();es=null;}`; `createRoom` 的 `history.replaceState` 後呼叫 `connectSSE()` 重連正確房間。** 診斷訣竅: 當「一端有字幕一端沒有」時, 立刻比較兩端 SSE 訂閱的 room 是否一致, 而非懷疑 STT。
1. **【根因級】AudioContext 預設 48kHz 但前端當 16kHz 包 WAV → 慢速怪聲 + whisper 幻覺** — `new AudioContext()` 預設 48000Hz, 但 `ScriptProcessor` 輸出與 `encodeWav` 都假設 16000Hz。速率錯 3 倍 → 播放/辨識時聲音慢 3 倍、低沉 → whisper 全聽錯幻覺出 "Thanks for watching"/"Yeah"。**修法: 建立 AudioContext 時強制 `new AudioContext({sampleRate:16000})`**。這是「擷取文字亂猜」的最終根因, 比切句/VAD/模型都更早命中。驗證: 用『⬇ 下載擷取音訊』鈕存 wav, ffprobe 看 sample_rate 必須=16000 且聽起來正常速度。
2. **前端送 raw PCM 會被 whisper 拒讀** — `stt.py` 把 body 存成 `.webm` 但 PyAV 實際探位元組; 真正穩定的做法是前端 `sendChunk` 包成 **WAV 容器** (`encodeWav(pcm,16000)`) 再 POST, 且 `stt.py` 依魔數選副檔名 (RIFF→.wav, EBML→.webm, mp3/ogg→正確)。
3. **lang=auto 強制導致 whisper 偶發 500** — `server.mjs` 呼叫 STT 時硬寫 `sttLang: CFG.sttLang`(='auto'), 忽略前端 `lang=en/zh-TW`。whisper auto-detect 偶爾崩 → 500 → 前端看不到字幕。**修法: `server.mjs` transcribe handler 讀 `q.get('lang')||CFG.sttLang` 透傳。** (VPS 檔案, 見上方警告)
3b. **【自動語言判斷 繁中↔英文 全鏈路】** — 場景只有兩種語言: 英文 ↔ 繁體中文。做法: `lib/translate.mjs` 加 `detectLang(text)` (CJK 漢字佔比 >15% → 判 zh-TW 否則 en, **不含平假名/片假名** 避免誤判日文; 日文不在範圍); `translate(text,'auto','auto')` 時 `f=detected; t=(to&&to!=='auto'&&to!==detected)?to:(detected==='zh-TW'?'en':'zh-TW')`; `config.mjs` 預設 `OMNILIVE_FROM='auto'`; `pipeline()` 在 `CFG.from==='auto'||CFG...` 分支設 `from='auto'`。**前端 `from`/`to` select 加 `🌐 自動` 選項 (預設), 且 `flushWindow` 送 STT 時 `lang==='auto'` 不帶 `lang` 參數** (避免 auto→whisper 500)。
   - **🔴 子 bug (已踩): `translate()` 算出偵測後的 `f`/`t` 但後續快取 key/實際翻譯/回傳仍用原始 `from`/`to` → google-gtx 收 `sl=auto,tl=en` 翻英文得原文 (看起來「沒翻譯」)。** 修法: 偵測後 `from=f; to=t;` 寫回, 全函數用偵測後語言對。務必端對端送真實音訊驗證 `target` 確實是另一語。
   - **CJK 正則零亂碼技巧**: 在正則字面寫中文字元會因工具/終端字型渲染成看似亂碼 (如把 `豈`U+F900 顯示成日文樣), 且 patch/write_file 反覆寫入時可能真壞。**一律用 `\u` 跳脫**: `const CJK = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/;` 讓原始碼純 ASCII, 永不失真。若已寫壞, 用 Python 位元組精準替換: `data.replace(b'const CJK = /[...bytes...]/;', b'const CJK = /[\\u4e00-\\u9fff...]/;')` (注意 Python 裡反斜線要 `\\u`)。
4. **spawn 非 .exe 報 EFTYPE** — `startServer`/e2e 啟 OmniLive 必須 `spawn(process.execPath, ['server.mjs'])` 而非 `['server.mjs']`; 啟 apps/stt 用 `[venvPy, 'server.py']`。
5. **房間過期** — `createRoom` 加 `expiresAt=Date.now()+CFG.roomTtlMs`; `cleanupRooms()` 每 `CFG.roomCleanupIntervalMs` 回收「過期且無活躍觀眾」房間; `/api/room/:id` 回 `expiresAt`/`expired`。
6. **房間密碼** — 只存 SHA-256 hash (`crypto`); `/stream?pwd=` 接受明文或 hash, 無/錯→401; 觀眾連結攜帶 hash 非明文。
7. **VAD 擴展到 webm** — `vadSegmentsAny()` 對 WAV 本地解碼, 對 webm/ogg/mp3 經主機 `ffmpeg -i in -ar 16000 -ac 1 -f wav out` 轉 WAV 後 `vadSegments`。
8. **`assert.match(string, regexp)` 陷阱** — Node assert 的 match 第二參必須 RegExp; 用 `assert.ok(/re/.test(x))`。
9. **`/stream` 不預建房間會 404** — 改為首次訂閱即開放建立, 但 password 檢查仍生效。

## FLOATING OVERLAY UI & COURSE FEATURE (2026-08-20 重構方向)
OmniLive 現在走「漂浮式半透明一體成形字幕層」, 不再是面板式工作台。關鍵模式:
- **全屏透明浮層**: `body{position:fixed;inset:0;pointer-events:none;background:transparent;container-type:size}` — 字幕直接浮在 Zoom/YouTube 影片上, 不擋底層操作; 只有工具條/課程窗 `pointer-events:auto`。
- **玻璃擬態工具條**: 功能收成圖示膠囊 `backdrop-filter:blur(18px) saturate(160%)`, **只留必要四鍵** 🪟(開獨立漂浮窗) / 🎙️(收音) / 🔗(分享連結+QR) / ⚙️(設定面板)。**toggle 行為: 壓一次出現/激活, 壓第二次縮合/取消** — 每個圖示按鈕都要有明確 `active` class 切換, 否則用戶會以為「點不動」。位置/課程/主題等細項收進 ⚙️ 面板。
- **黑底 70% 透明字幕 (用戶指定)**: `bgToggle` 預設勾選, 開啟時每行 `background:rgba(0,0,0,.7)` (非漸層); 關閉則僅 `text-shadow`。符合字幕最佳實踐可讀性。
- **🔗 分享連結/QR**: 工具條 🔗 直接從 `viewerLink.value` (或 `location` 組出 `?room=X`) 取得觀眾連結 → `navigator.clipboard.writeText` + 彈出 QR Code 彈窗 (`new QRCode(q,{...})`); 若尚無房間則提示先 ⚙️ 建立。不用離開字幕層即可分享。
- **九宮格定位 + 原生拖曳**: `--sub-pos`(top/center/bottom) + `--sub-align`(left/center/right) CSS 變數; 字幕塊 `pointerdown`→`setPointerCapture`→`pointermove` 原生拖曳 (零套件)。
- **RWD**: Container Queries `@container (max-width:600px)`, `dvh` 動態視窗高度, `clamp()` 流體字級。
- **一鍵獨立漂浮視窗**: 🪟 按鈕 `window.open('/floating.html?room=X','omnilive_float','width=480,height=300,...')` 開獨立小窗 — 與 Zoom 並排/置頂同步顯示雙語字幕, 真正蓋在其他頁面上。`floating.html` 黑底50%透明、可拖曳標題列、訂閱同房間 SSE。⚠️ 瀏覽器 pop-up 擋截 → 需提示用戶允許本站開新視窗。
- **課程即時解說 (`/api/course` + `course.html`)**: 獨立介面 `course.html?room=X` (左即時字幕/右課程浮窗), 每 45s 把累積字幕 POST `/api/course` → 本地 Ollama `qwen2.5:3b` 產結構化 JSON。依賴: VPS Ollama 在 `127.0.0.1:11434` (`systemctl is-active ollama`)。
  - 回傳結構: `{summary, keypoints[], terms[{term,en,wiki,explain}], similar_cases[]}`。
  - `generateCourse()` 用 `fetch(OOLLAMA_URL/api/generate)` + `format:'json'` + `options.temperature:0.3`, **timeout 120s** (Ollama 冷啟動載入模型首次 >60s 會 abort)。
  - 限制: `text.slice(-6000)` 避免超 context。前端 `courseAcc` 累積字幕輪詢。

## VERSIONING & DEPLOY BRANCH MODEL (2026-08-20)
三分支可隨時切換, 避免破壞穩定版:
- `main` — 穩定基礎 (不含新 UI/課程)。
- `feature/omnilive-progressive-subtitles` — 字幕合併/活躍句 UI, 部署在 **8795** (生產)。
- `feature/omnilive-new-ui` — 漂浮玻璃 UI + 課程解說, 部署在 **8796** (測試)。
- 對外 `omnilive.esggo.co` (cloudflared Tunnel) 用 `sudo python3` 改 `/etc/cloudflared/config.yml` 的 `service: http://127.0.0.1:8795`↔`8796` 後 `sudo systemctl restart cloudflared` 切換 (已建 DNS, 即時生效)。
- ⚠️ **分支管理陷阱**: 本機 cwd 會在 session 間跳回 `main` → 在 feature 分支 commit 可能誤落 main。修復: `git checkout feature/... && git cherry-pick <commit>` 把誤落 main 的 commit 移過去; main 用 `git revert --no-edit` (非破壞) 還原。VPS `git reset --hard origin/feature/...` 部署會被 Hermes 安全層標 flag 但 auto-approve (這是部署動作, 可接受)。
- 測試後合併: `git checkout feature/omnilive-new-ui && git merge --ff-only origin/main` (Hermes 拒 `reset --hard` 時的非破壞替代)。
- **⚠️ 不要用 `start.mjs` 當 pm2 入口** — `start.mjs` 是啟動器, 它 spawn 的 `server.mjs` 子程序才是聽 8795 的 web server; pm2 監控父進程, 子程序死了父仍顯 online → 8795 空窗 → cloudflared **502 Bad Gateway**。**正確: `pm2 start server.mjs --name omnilive` (直接跑 server.mjs)**。
- **STT 升級模型 crash-loop** — `pm2 set stt-whisper:WHISPER_MODEL small` 後 `pm2 restart stt-whisper --update-env`; 切記 `fuser -k 8791/tcp` 清掉手動 `setsid` 殘留實例, 否則 port 衝突讓 pm2 的 stt-whisper 一直 "address already in use" 重啟 (278 次)。`pm2 save` 固化。
- **502 是重啟瞬間現象** — 每次 `pm2 restart omnilive` 8795 短關, cloudflared 連不上幾秒 → 對外 502; 等 cloudflared 重連 (loop 試幾次 curl) 即恢復 HTTP 200。本機 health OK 不代表對外 OK。
- **固定 6s 窗 + 2s 重疊切句** — `onaudioprocess` 只塞滑動緩衝(留最近 8s), `setInterval(flushWindow,6000)` 每 6s 送最近 6s (重疊 2s)。比 VAD(靜音觸發) 適合 Zoom/YouTube 連續音訊 (幾乎無靜音→VAD 憋到 15s 才吐→斷句爛)。`inflight` 旗標防併發堆積 (STT 單 worker, 前端每 6s 送會堆積→ClientDisconnect 500 惡性循環); **inflight 必加 45s 超時保護** — 否則 medium 慢模型(20-30s)會永久卡死 inflight → 字幕完全停擺。
- **whisper 抗幻覺參數** (VPS `server.py` model.transcribe): `temperature=[0.0,0.2,0.4]`, `condition_on_previous_text=False`(防上段幻覺污染下段的關鍵), `vad_filter=True`, `no_speech_threshold=0.8`, `compression_ratio_threshold=2.2`, `log_prob_threshold=-0.8`。弱音/邊界不再硬編。
- **除錯鈕『⬇ 下載擷取音訊』** — 錄音時累積 `debugBuf`(完整 Float32), 按鈕 `encodeWav`+Blob 下載。用途: 親耳聽前端送給 STT 的是否為「慢速怪聲(48k 錯配)/弱音/靜音」, 直接定位幻覺源, 比猜準。
- **SSE 伺服器端已證明會 broadcast** — 驗證整條路徑: VPS 上 `(timeout 30 curl -s -N 'http://127.0.0.1:8795/stream?room=X' >/tmp/sse.txt &)` 背景聽 + 另送真實 wav 到 `/api/transcribe?room=X` → grep `event: subtitle` 應出雙語。若伺服器有 broadcast 但瀏覽器沒字幕 → 問題在前端 SSE 連線/渲染, 非後端。
- 瀏覽器工具 (browser-use) 與 cua-driver 在本機環境常 402/未安裝 → 自動化視覺測試做不到, 改用 ffprobe + curl 送真實 wav 驗證 STT/伺服器鏈。

## PITFALLS (Windows / Node 24 / git-bash)
- Node 24 無全域 `EventSource` → 測試/verify 用 `test/sse-helper.mjs` (fetch streaming 解析 text/event-stream), 勿 `new EventSource`。
- `verify.mjs` 呼叫 `process.exit` 在 Node24/Win 觸 UV assertion → 改設 `process.exitCode` + `unref` timer。
- non-interactive shell 會吞 `2>&1 | tee` 與背景 `>log` 輸出 → 腳本自寫 `e2e-result.json` / `e2e-run.log` 供讀取。
- MSYS 路徑: 給原生工具用 `C:/Users/x` 前向斜線; 勿用 `/tmp` (不存在)。`$LOCALAPPDATA/Temp` 才是 Windows 暫存。
- 背景 spawn 的常駐服務 (server.mjs) 可能被回收 → 手動探針若回 `OL DOWN` 多半是回收非邏輯錯, 用前台 `timeout 8 node server.mjs` 確認有 `listening on :8795`。
- `apps/stt/.venv` 在 hermes venv 下建置; `pyttsx3` 需 pywin32 易失敗 → 真實語音 fixture 改用 `edge-tts` (純 Python, 偶發 DNS 失敗需重試迴圈)。

## references/ (session-specific detail)
- `references/e2e-voice-workflow.md` — 真實語音 E2E 腳本結構/陷阱/結果判讀。
- `references/room-security.md` — 房間密碼 + 過期清理 實作要點。
- `references/vad-ffmpeg.md` — vadSegments/vadSegmentsAny + ffmpeg 轉檔細節。
- `references/vps-deploy-debug.md` — VPS 部署拓撲/502 根因/STT crash-loop/SSE 整條路徑驗證指令 (這輪實戰總結)。
- `apps/omnilive/DEPLOY.md` — 同倉部署筆記: 7 個實戰地雷 + 部署流程 + 除錯工具 (caster SSE 重連 / 48k→16k 慢速 / lang 透傳 / 併發堆積 / 6s 窗切句 / start.mjs 502 / 模型切換)。改完前端/後端照此部署。
