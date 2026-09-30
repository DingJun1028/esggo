# OmniLive 部署與運維筆記

> 這份筆記記錄 2026-08-17 實戰踩過的坑與修復，部署時照著做可避免重蹈覆轍。

## ⚠️ 2026-09-30 實測更正（優先採用本節，與下方舊內容衝突時以此為準）

### 現行真實拓撲

> 🔴 **本節 2026-09-30 晚間已再次更正**：OmniLive 與 STT **由 PM2 管理，不是 systemd**。
> 下方表格的「管理者」欄位已修正；當時誤判的 systemd 遷移已完整回退（unit 已刪除）。

| 元件 | 監聽 | 管理者 | 位置 |
|---|---|---|---|
| OmniLive 服務 | `*:8797` | **root PM2 app `omnilive-translator`** | `/var/www/esggo/apps/omnilive` |
| STT (faster-whisper) | `127.0.0.1:8791` | **root PM2 app `stt-whisper`** | `/var/www/esggo/apps/stt` |
| Cloudflare Tunnel | — | `cloudflared.service` (systemd) | `/etc/cloudflared/config.yml` |

**管理指令一律用 PM2**：

```bash
sudo pm2 list                      # 6 個 app（見下）
sudo pm2 restart omnilive-translator
sudo pm2 restart stt-whisper
sudo pm2 logs omnilive-translator --lines 50
```

`pm2-root.service`（`ExecStart=/usr/lib/node_modules/pm2/bin/pm2 resurrect`）為**開機自啟入口**，`enabled` + 應保持 `active`。2026-09-30 曾發現它 `enabled` 但 `inactive`（daemon 只靠某次 SSH session 存活），已 `systemctl start` 修好——這才是本機真正的單點故障。

### 🔴 診斷陷阱：`pm2 list` 只看到 logrotate ≠ 沒有 PM2

**症狀**：用 `ubuntu` 身分跑 `pm2 list` 只看到 `pm2-logrotate`，容易誤判「這台機不用 PM2，服務是裸行程」，於是改用 systemd 接管。

**真相**：PM2 有**兩套 daemon**，分屬不同使用者：

- `/root/.pm2` → **root PM2 v7.0.3 God Daemon**，管 6 個關鍵 app：`esggo-core` / `omniagent-gateway` / `universal-translator` / `stt-whisper` / `deerflow` / `omnilive-translator`
- `/home/ubuntu/.pm2` → 只有 `pm2-logrotate`

**正確查法**：`sudo pm2 list` 或 `sudo pm2 jlist`。用 `pm2 list`（無 sudo）會看到錯誤的（小的）那一套。

### 🔴 誤判後果：systemd 與 PM2 搶埠 → EADDRINUSE 永迴圈

若在 PM2 已管理的情況下又建 systemd unit 搶同一個埠，兩邊互相重啟：

- systemd 側：`NRestarts` 一路升到 **91**，`SubState=auto-restart`，日誌刷 `Error: listen EADDRINUSE :::8797`
- **PM2 側仍 online、health 仍回 200** ← 最容易誤判成「遷移成功」
- 真相：PM2 的行程在服務，systemd 實例在無限重啟白燒 CPU（實測 **95.7%**）

**判別法**（務必做，健康檢查不足以判斷）：

```bash
sudo ss -ltnp | grep 8797                    # holder 的 PID
sudo cat /proc/<holderPID>/cgroup | tail -1  # PM2 撐的會是 session-*.scope，不是 system.slice/*
# 或直接問真正的管理者：
sudo pm2 jlist | python3 -c "import sys,json;[print(p['name'],p.get('pid'),p['pm2_env']['status'],'restarts=',p['pm2_env']['restart_time']) for p in json.load(sys.stdin)]"
```

**教訓**：在這台 VPS 上要判斷服務歸誰管，**先 `sudo pm2 jlist` 確認有沒有 PM2 托管**（特別是舊的、只有 SSH session 撐著的 daemon），再談 systemd。本專案 20 個 systemd unit（aistation / cloudflared / n8n / oa-swarm / esggo-gateway / ftg-journey…）與 PM2 是**並存**的兩套體系，不能想當然。

**更正要點**（皆為 2026-09-30 實測確認）：

1. **由 PM2 管理（root daemon）。** app 名是 `omnilive-translator` 與 `stt-whisper`。`pm2-root.service` 負責開機 resurrect。
2. **對外埠是 8797，不是 8795。** 8795 是 hermex PWA 的埠（由 nginx 持有）。`package.json` 的 `health` script 仍寫 8795，屬殘留。
3. **STT 模型是 `base` 不是 `small`。** env 變數真名為 `WHISPER_MODEL` / `WHISPER_DEVICE` / `WHISPER_COMPUTE` / `STT_PORT`（**不是** `MODEL_SIZE` / `DEVICE` / `COMPUTE_TYPE`）。切換模型用 `sudo pm2 set stt-whisper:WHISPER_MODEL <size> && sudo pm2 restart stt-whisper --update-env`。

### 開機自啟與重啟

```bash
sudo pm2 restart omnilive-translator
sudo pm2 restart stt-whisper
systemctl status pm2-root.service      # 應為 active（開機 resurrect 入口）
curl -sf http://127.0.0.1:8797/health
curl -sf http://127.0.0.1:8791/health
```

> STT 重啟需載入模型，實測約 20s。PM2 自帶崩潰重啟（`restarts` 計數可查），不需 systemd 的 `Restart=always`。

### 實測效能基線（2026-09-30，4 核 CPU / base 模型 / int8）

| 場景 | 延遲 | 倍率 |
|---|---|---|
| 6.87s 中文音訊完整檔 | 7.4–7.9s | ~1.1x rt |
| 2s 串流 chunk（`OMP_NUM_THREADS=2`） | 4.65s | 1.39x rt |
| 3s 串流 chunk（`OMP_NUM_THREADS=2`） | **2.70s** | **0.90x rt ✅** |
| 0.5s 靜音 | 0s | — |

`small` 模型品質更高（96.8% vs 92% 字元相似度）但 18.8s 推論 = **2.73x rt**，不適合即時串流，故維持 `base`。
`OMP_NUM_THREADS=2` 於 4 核實測**優於** 4（8.17s vs 9.64s）——過度訂閱反效果，已寫入 unit。

### 翻譯引擎降級

`google-gtx` 對 `curl` 持續回 **429**（Google 反爬），但 Node `fetch` + `Mozilla/5.0` UA 回 **200**。因此 `curl` 診斷 gtx 失敗**不代表**服務失效；以 `engine` 欄位為準（`mymemory` = gtx 當次失敗後降級，`google-gtx` = 正常）。免費引擎品質較差，翻譯結果可能較差。

### 品牌詞保護（`lib/translate.mjs` `maskGlossary`）

免費引擎會把專有詞當一般字詞翻掉（實測 `OmniLive` → `Universal & Surplus` / `Omni-Live`）。已加佔位符遮蔽 + 還原，涵蓋 `OmniLive` / `esggo` / `Hermes` / `whisper` / `ffmpeg` / `Cloudflare` / `Zoom` / `MyMemory`。測試見 `test/glossary.test.mjs`（8 例）。新增品牌詞請同時加進 `GLOSSARY` 與測試。

## 架構

- **OmniLive**（port 8795）：即時雙語字幕播放器。前端 `public/index.html` 擷取螢幕/麥克風音訊 → POST `/api/transcribe` → 後端 `server.mjs` 轉發到 STT → 雙語翻譯 → SSE 廣播給房間。
- **STT**（port 8791，獨立 pm2 `stt-whisper`）：faster-whisper，`/var/www/esggo/apps/stt/server.py`。
- **Cloudflare Tunnel**：`omnilive.esggo.co` → `127.0.0.1:8795`。

## VPS 部署流程（改完前端/後端後）

```bash
# OmniLive (在 /opt/esggo/apps/omnilive, git mirror)
cd /opt/esggo/apps/omnilive
git fetch origin && git merge --ff-only origin/main
pm2 restart omnilive
sleep 3
curl -sf http://127.0.0.1:8795/health   # 應回 {"status":"ok",...}
pm2 save

# STT (在 /var/www/esggo/apps/stt, 非 git, 直接編輯 server.py)
# 編輯完重啟:
pm2 restart stt-whisper --update-env
sleep 8
curl -sf http://127.0.0.1:8791/health   # 應回 {"status":"ok","model":"small",...}
pm2 save
```

> ⚠️ `apps/stt/server.py` 必須 commit 進 git（已在 `apps/stt/` 下追蹤）。VPS 上直接改過的內容若沒回寫本地 git，重裝/還原會丟失。
> ⚠️ **不要用 `git reset --hard`**（Hermes 安全層會擋）。用 `git merge --ff-only origin/main` 代替。

## 已知地雷（按嚴重度）

### 1. caster 建立房間後 SSE 沒重連 → 主持人無字幕、觀眾有
- **現象**：觀眾連 `?room=XXX` 開頁面有字幕；主持人按「建立分享連結」後本機無字幕。
- **根因**：`connectSSE()` 在頁面載入時用**空 room** 連（那時還沒建房間）；建立房間後 URL 變更，但 `if(es)return` 擋住重連 → SSE 掛空房間。
- **修法**：`connectSSE()` 開頭先 `es.close()`；`createRoom` 換 URL 後呼叫 `connectSSE()`。

### 2. AudioContext 預設 48kHz 被當 16kHz 送 → 慢速怪聲 + whisper 幻覺
- **現象**：下載擷取音訊聽起來像慢動作、低沉；whisper 幻覺 "Thanks for watching"。
- **根因**：`new AudioContext()` 預設 48k，前端卻包成 16k WAV 送 STT → 速率錯 3 倍。
- **修法**：`new AudioContext({sampleRate:16000})`。

### 3. lang=auto 強制 → whisper 偶發 500
- **現象**：STT 日誌出現 `POST /transcribe?lang=auto` 500。
- **根因**：`server.mjs` 呼叫 STT 時硬寫 `sttLang: CFG.sttLang`（=auto），忽略前端 `lang=en/zh-TW`。auto 偵測偶爾崩。
- **修法**：`const reqLang = q.get('lang') || CFG.sttLang;` 透傳前端語言。

### 4. 前端併發堆積 → ClientDisconnect 500 連環
- **現象**：每 4s 送一次，STT 單 worker 忙不過來，客戶端 timeout 斷開。
- **修法**：`sendChunk`/`flushWindow` 加 `sttInflight` 旗標（上一個沒回就不送），並加 45s 超時保護防永久卡死。

### 5. 固定 4s 硬切 → 句中斷句破碎
- **現象**：長句被切成半句，whisper 硬猜 → 碎字/重複。
- **修法**：`flushWindow` 每 6s 送「最近 6s 音」，與上段重疊 2s（滑動緩衝），適合 Zoom/YouTube 連續音訊。

### 6. start.mjs 當 pm2 入口 → 502 間歇
- **現象**：`start.mjs` spawn `server.mjs` 子程序，父進程 online 但子程序死 → 8795 空窗 → cloudflared 502。
- **修法**：pm2 直接跑 `node server.mjs`，不經 `start.mjs`。

### 7. STT 模型選擇
- `small`：CPU 推理 4-8s/段，即時字幕推薦。
- `medium`：更準但 20-30s/段，延遲過大不適即時場景（除非要最高準確度不在意延遲）。
- 切換：`pm2 set stt-whisper:WHISPER_MODEL small|medium` + `pm2 restart stt-whisper --update-env`。
- 首次載模型中 (~1.5GB) 需數分鐘，期間 health 暫時拿不到屬正常。

### 8. POST /api/* 上線前無認證 → 任何人可打爆主機
- **現象**：`/api/room`、`/api/transcribe`、`/api/speak`、`/api/course` 原本完全開放。
  這四個端點會實際吃 CPU —— STT 要跑 whisper，`/api/course` 要跑本地 LLM
  （實測單次 115 秒）。任何拿到網址的人都能無限觸發，把主機燒乾。
- **修法**：設定 `OMNILIVE_HOST_KEY`，所有 `POST /api/*` 需帶金鑰否則 401。
  兩種傳遞方式皆可：`X-OmniLive-Key: <key>` 或 `Authorization: Bearer <key>`。
- **刻意不設金鑰時維持開放**（本機開發向後相容），故**上線務必確認已設定**：

  ```bash
  pm2 set omnilive-translator:OMNILIVE_HOST_KEY "$(openssl rand -hex 24)"
  pm2 restart omnilive-translator --update-env
  ```

- **刻意保持公開**：`GET /health`（監控）、`GET /config`（播放器初始化）、
  `GET /stream`（SSE，另由房間密碼保護）、靜態檔案 —— 加驗證會擋掉監控與觀眾端。
- 前端/腳本呼叫需帶金鑰，否則會收到 `401 {"code":"HOST_KEY_REQUIRED"}`。

### 9. 測試用固定 sleep → 整組 ECONNREFUSED
- **現象**：`npm test` 9 個測試全敗，錯誤為 `ECONNREFUSED :8796`。
  但單獨手動啟動 `node server.mjs` 完全正常 —— 服務確實有起來。
- **根因**：測試用固定 `await wait(800)` 睡死等啟動。Node 冷啟動耗時隨機型、
  磁碟與並行負載浮動，800ms 不足以保證已 listen。只有會「輪詢」的測試能過。
- **修法**：改用 `waitReady()` 輪詢 `/health`，等待條件是「服務真的可回應」。
  已加入 `test/server.test.mjs`。
- **另一個坑**：`node --test` 預設**並行**跑各測試檔，每檔都 spawn 服務 →
  機器飽和、測試變慢 3 倍且開始失敗。已在 `package.json` 加上
  `--test-concurrency=1`（實測 131s/3 敗 → 47s/全過）。
- **不要**把 `waitReady()` 改回固定 sleep；也不要拿掉 `--test-concurrency=1`。


## 除錯工具

- 前端「⬇ 下載擷取音訊」鈕：錄音時按一下下載 WAV，親耳確認擷取層是否有聲音/慢速/靜音。
- 伺服器端 SSE 驗證：
  ```bash
  # 終端機監聽某房間 SSE, 另開送音, 看是否廣播 subtitle 事件
  (timeout 30 curl -s -N 'http://127.0.0.1:8795/stream?room=TEST' > /tmp/sse.txt &)
  curl -s -X POST 'http://127.0.0.1:8795/api/transcribe?room=TEST&vad=1&lang=en' \
    --data-binary @/path/to/test.wav -H 'content-type: audio/wav'
  grep 'subtitle' /tmp/sse.txt
  ```

## 驗收門檻
- 主持人與觀眾**兩端**都出現雙語字幕。
- 字幕準確對應影片語言（無 "Thanks for watching" 類幻覺）。
- 字幕每 ~6s 一段、從下往上 roll-up。
- `https://omnilive.esggo.co/health` 回 200。
