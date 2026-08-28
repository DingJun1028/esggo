# 伺服器端 STT（faster-whisper）安裝與運維

萬能即時翻譯的「語音轉字幕」核心。免費零 key，CPU 推理，跨平台（不依賴瀏覽器 Web Speech API）。

## 架構
```
studio.html (MediaRecorder: 麥克風 / 系統音/Zoom對方)  --POST /transcribe-->  server.mjs
   --fetch http://127.0.0.1:8791/transcribe-->  stt_service.py (faster-whisper)
   <-- {text, language} --  studio 再 POST /speak --> SSE 觀眾端字幕
```
- `stt_service.py`：Python 標準庫 `http.server`，faster-whisper 模型只載一次；`POST /transcribe` 收 raw audio bytes（webm/ogg/wav/mp3/flac/m4a），支援 `?lang=zh-TW` 鎖定語言加速降幻覺。
- 語言對映：`zh-TW/zh-CN/zh-Hant → zh`，`en→english` 等（`_LANG_MAP`）。

## VPS 安裝（一次性）
```bash
# 1. 確認 sudo + ffmpeg（faster-whisper 解碼 need）
sudo apt install -y ffmpeg
ffmpeg -version   # 必須有

# 2. 建真正 venv（系統是 PEP668 externally-managed，不能 pip install 到系統 python）
python3 -m venv /opt/esggo/stt_venv
source /opt/esggo/stt_venv/bin/activate
pip install --upgrade pip
pip install faster-whisper        # 1.2.x，含 onnxruntime/ctranslate2/av

# 3. 啟動（指定端口避開佔用，見下方坑）
# ⚠️ 不要用 nohup & 啟動（SSH 斷線會被殺）→ 用 pm2 守護，詳見「啟動/重啟 SOP」
STT_PORT=8791 pm2 start /opt/esggo/apps/universal-translator/stt_service.py --interpreter /opt/esggo/stt_venv/bin/python --name stt
# 首次請求會下載 whisper-base (~140MB)，模型載入後續即時
```

## 啟動/重啟 SOP（⚠️ 必須 pm2 守護，2026-08-08 實證）

**絕對不要用 `nohup python ... &` 或 `setsid ... & disown` 啟動 STT**：SSH session 關閉時整個 process tree 會被 reaped，進程死掉後用戶「講話完全沒字幕」且 node `/transcribe` 回 502（靜默失敗）。**唯一可靠做法 = pm2 守護**（與 node server 同機制，不隨 SSH 斷開而死）。

```bash
# 首次啟動 / 重新啟動（pm2 程序名固定為 stt）
ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 "cd /opt/esggo && source stt_venv/bin/activate && pm2 delete stt 2>/dev/null; STT_PORT=8791 pm2 start /opt/esggo/apps/universal-translator/stt_service.py --interpreter /opt/esggo/stt_venv/bin/python --name stt"
# 模型載入 ~20s (watch: pm2 list 看 stt online; ss -tlnp | grep 8791 確認 LISTEN)

# 確認在跑
pm2 list | grep stt
ss -tlnp | grep 8791
tail -6 /tmp/stt.log     # 應見 "[STT] 模型就緒, 監聽 :8791"（若顯 :8790 是 log 舊字串, 實際聽 8791）
```

### ⚠️ STT 在 SSH 關閉後被殺（FIRST-CLASS pitfall, 2026-08-08 實證）
- **現象**：用 `nohup python stt_service.py > /tmp/stt.log 2>&1 &` 或 `setsid ... & disown` 在 SSH 裡啟動 STT，命令看起來成功（`launched_pid=xxx`）、當時 `ss` 也顯 LISTEN。但 SSH 連線一斷，**進程被 systemd/logind 清場殺掉** → 8791 DEAD → 用戶「講話完全沒字幕」（前端 POST `/transcribe` → node fetch `127.0.0.1:8791` 連不上 → 502 → 字幕區顯錯誤卡/或完全無反應）。
- **根因**：`nohup`/`setsid` 只能脫離當前 shell，但 VPS 的 session 管理（logind 對 SSH 登出的 cgroup 清場）仍會回收整個 session 下的 descendants。pm2 是常駐 daemon（自己的 cgroup / systemd 註冊），不受 SSH 斷線影響。
- **診斷三步（看不到用戶 console 時的定位法）**：
  1. `ssh ... "ss -tlnp | grep 8791 || echo DEAD"` — 若 DEAD，STT 掛了，這就是根因。
  2. `ssh ... "pm2 list | grep stt"` — 若無 stt 或 status 不是 online，重啟它。
  3. `ssh ... "pgrep -af stt_service | wc -l"` — 若 >1 表示有殘留 zombie（舊 `Address already in use` 那次產生多個），先 `pkill -9 -f stt_service.py` 再 `pm2 start` 單一實例。
- **修法**：一律用上方 pm2 命令啟動/重啟。之後 `pm2 list` + `ss -tlnp | grep 8791` 雙重確認 LISTEN 才算完成。
- **教訓**：任何「長期後台服務」在 VPS 上都不能靠 SSH `&` 存活——一律走 pm2（node server 已是如此，STT 也要一致）。改完 STT 代碼後的部署 SOP：VPS `git pull` + `pm2 restart stt`（不是 nohup 重啟）。

## 端到端驗證（⚠️ 測試音陷阱 — FIRST-CLASS）
```bash
# 對外經 node（確認 /transcribe 路由 + query 剝離正確）
curl -sS --max-time 30 -X POST 'https://translate.esggo.co/transcribe?lang=zh-TW' --data-binary @C:/tmp/zh_test.wav
```

### ⚠️ espeak 合成音「偽陽性」陷阱（2026-08-08 實證，重要）
- **espeak / eSpeakNG 合成語音無法用來驗證 whisper 轉錄準確率**。whisper 對機械合成音完全無法識別，會回一堆數字（如 `"4-1-3-2-5-2-8-2-4..."`）或 `"I'm sorry I'm sorry..."`（sine wave 幻覺）。這會讓你**誤以為 pipeline 通了就代表語音轉字幕可用**——其實只證明「音訊 bytes 進得去、JSON 出得來」，**沒證明任何一種人類語言能被正確轉錄**。
- 本會話曾因此連續數輪「看起來通」卻從未用真實人聲驗證，直到用戶回報「沒有效果」才暴露。
- **唯一可靠的驗證 = 真實人聲錄音**（使用者麥克風/Zoom 實錄）。whisper 對真實人聲準確率公認很高（這是事實），但離線環境下載不到樣本時，不要聲稱「語音轉字幕已驗證可用」，應誠實標注「pipeline 通，待真實人聲驗證」。
- VPS 當前**離線**：HuggingFace / Common Voice / LibriSpeech / openslr 均只回 15-30 bytes 錯誤頁（`curl -L` 也一樣），無法下載真實語音樣本。這是環境限制，非代碼缺陷。
- 若要在 VPS 跑 smoke test，只能確認「收到合法 JSON 且 language 欄正確」，**不可把 synthetic 轉錄文字當成功指標**。

### 文字→雙語字幕鏈的可靠驗證（繞開語音）
studio 的 `onText` 直接收文字，所以可用 `POST /speak` 模擬「已轉錄文字 → 翻譯 → SSE」，完整驗證除 STT 以外的全鏈：
```bash
# 中文源 → 雙語 (en+zh-TW)
curl -sS -X POST 'http://localhost:8788/speak' -H 'Content-Type: application/json' \
  -d '{"text":"今天的會議很重要","from":"zh-TW","to":"en","targets":["en","zh-TW"],"room":"t1"}'
# 觀眾端並行收 SSE: curl -N 'http://localhost:8788/stream?room=t1' 看 event: translation
```

## 坑（FIRST-CLASS）
- **端口 8790 被 docker-proxy 佔用**：VPS 上某 Docker 容器把 `127.0.0.1:8790 → container:8787` 映射走了，STT 服務 bind 會 `OSError 98 Address already in use`。**改用 8791**（server.mjs 用 `process.env.STT_PORT || 8791`，stt_service.py 用 `STT_PORT` env）。排查占用：`ss -tlnp | grep 8790` 看到 `docker-proxy` 即此因。
- **STT 服務 bind 失敗後進程直接退**，但 `ss` 仍顯「監聽」是因為更早的殘留 socket（zombie）。殺占用者：`PID=$(ss -tlnp | grep 8791 | grep -oP 'pid=\K[0-9]+' | head -1); kill -9 $PID`。
- **node `/transcribe` 回 404 usage**：路由判斷 `url === '/transcribe'` 在帶 `?lang=` 時失效，必須 `url.split('?')[0] === '/transcribe'`。
- **音訊 body 必須 raw bytes，不能走文字 readBody**：`server.mjs` 的 `readBody(req)` 會 `Buffer.toString('utf-8')` 把二進制音訊損毀。`/transcribe` 路由必須用專用 `readBodyRaw(req)`（只 `Buffer.concat` 不 decode），再 `fetch(..., {body: new Uint8Array(audioBuf)})` 轉呼 STT。若誤用 `readBody` 或 `Buffer.from(string,'utf-8')` 重建，whisper 收損毀 bytes 會回亂碼/空。
- **模型載入慢**（首次 ~10-20s 下載），curl 要給 `--max-time 30`；啟動後先 `sleep` 再測。
- **pm2 沒重載新碼**：`pm2 reload` 偶發跑舊 server.mjs（404 明明檔案有路由），改用 `pm2 restart universal-translator` 或 `pm2 delete + start`。

## 前端介面迭代偏好（用戶明確授權，2026-08-08）
- 用戶回報「沒有語音轉字幕」→「沒有效果」後，明確說「**介面也可以更換了**」＝授權直接重做 studio UI，不必再問。重做方向：**極簡化**——單一「▶ 開始語音轉字幕」大按鈕 + 模式切換徽章（🎤麥克風/🖥系統音/🌐瀏覽器）+ 來源語(預設自動偵測) + 目標語 multiple-select(預設 en+zh-TW) + 即時字幕卡片 + QR。
- 「**QR code 也可以做一起**」＝把觀眾端 QR 整合進主流程：**start() 時自動生成 room + 呼叫 showQR()**，不要等到使用者點額外按鈕。觀眾一開轉錄就能掃碼進半透明浮層。保留「重新生成 QR」按鈕作備用。
- **語音自動偵測 + 雙向預設**：STT 模式 fetch `/transcribe?lang=auto`（讓 faster-whisper 自動偵測，回 `language` 欄），`addUtterance(text, detectedLang)` 用偵測語作 `fromLang`；目標語預設 `[en, zh-TW]` 解決「回中文後還翻英文」——無論講中文或英文，觀眾都看到雙語（英文↔繁中）。
- 不依賴瀏覽器 Web Speech API 作主路徑（Firefox/Safari 不支援、語言標籤不穩）；主路徑走「麥克風→伺服器 faster-whisper STT」跨平台最穩。

## 前端模式說明（studio.html）
- 🎤 麥克風：`getUserMedia` + 瀏覽器 Web Speech API（備用）
- 🎙 電腦聲音：`getDisplayMedia({audio:true})` 選「分享系統音」（Zoom 對方+電腦放音都納入）→ 伺服器 STT（無法選系統音則降級麥克風）
- ☁ 伺服器轉錄：`getUserMedia` 麥克風 → 伺服器 STT（跨平台最穩）
- 三模式都用 `MediaRecorder` 分段（4s）錄音 → `POST /transcribe` → 拿文字 → `addUtterance` 走 `/speak`。
- **目標語可控**：studio 頂部「翻譯成」multiple-select，預設 `[en]`，不再硬塞 5 語（解決「回中文後還翻英文」困擾）。
