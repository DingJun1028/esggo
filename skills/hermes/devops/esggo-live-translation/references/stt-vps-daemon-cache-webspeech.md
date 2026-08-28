# universal-translator — 2026-08-08 部署與語音辨識實戰教訓

## 1. STT 服務 (faster-whisper :8791) 必須用 pm2 守護
- 根因：用 `nohup ... &` 或 `setsid ... & disown` 透過 SSH 啟動，SSH 斷線時 session teardown 會殺掉整個進程樹 → whisper 微服務靜默死亡。
- node `server.mjs` 在 `/transcribe` 拿到 ECONNREFUSED → 502 → 前端無字幕。
- 修法（驗證可用）：
  ```bash
  ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 "cd /opt/esggo && source stt_venv/bin/activate && \
    pm2 delete stt 2>/dev/null; \
    STT_PORT=8791 pm2 start /opt/esggo/apps/universal-translator/stt_service.py \
      --interpreter /opt/esggo/stt_venv/bin/python --name stt"
  # 關 SSH 後確認仍活著：
  sleep 20 && ssh ... "ss -tlnp | grep 8791"   # 必須 LISTEN
  ```
- node server 同樣用 pm2（name `universal-translator`）。
- `setsid ... & disown` 在此 VPS 不存活（logind 清場）。只有 pm2（常駐 daemon）可靠。
- 快診：對 `http://localhost:8791/transcribe` POST 測試音 → `curl: (7)` 即死 → pm2 重啟。

## 2. 靜態 HTML/JS 必須 no-cache
- 根因：`server.mjs` 靜態路由無 Cache-Control → 瀏覽器快取舊頁，所有前端修復用戶看不到。
- 修法：靜態回傳加 `Cache-Control: no-cache, no-store, must-revalidate`。
- 部署後請用戶硬刷新一次（Ctrl+Shift+R）。

## 3. Web Speech API 為麥克風模式主要路徑
- Chrome 原生 `SpeechRecognition||webkitSpeechRecognition` 免費零 key、準確率高，勝過 VPS whisper（base 對合成/低品質音回垃圾，且每片 ~30s 延遲）。
- 麥克風模式：`start()` 檢 SR 存在 → 直接 `recognition.start()`（continuous+interimResults+lang=primaryLang），跳過 MediaRecorder。
- 系統音模式：必須伺服器 whisper（getDisplayMedia 擷取 → MediaRecorder → POST /transcribe）；Web Speech 無法擷系統音。
- 伺服器 whisper 為備援（SR 不存在或啟動拋錯時）。
- `primaryLang()` 把首選 chip 映射 BCP-47（zh-TW→zh-TW, en→en-US, ja→ja-JP...），chip 點擊與開始時同步 `recognition.lang`。

## 4. espeak 合成音不是有效 STT 測試
- espeak 機械單調音 → whisper 回垃圾（1,2,1,2...），不是 STT 壞，是辨識不出合成 TTS。
- espeak 回 JSON 只證明「管道通」，不證明真實人聲能辨識。驗證只需確認 8791 LISTEN。

## 5. 前端 /speak、/transcribe fetch 加重試
- 用戶截圖出現 `失敗 : Failed to fetch` 但原文仍顯示 → 偶發網路/Tunnel 閃斷或 pm2 reload 中。
- 修法：`speakWithRetry()` / `transcribeRetry()` 最多重試 2 次、間隔 1s；最終失敗保留原文並清楚標錯。
