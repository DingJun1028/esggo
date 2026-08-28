# Universal Translator v2.4 系統音專用旗艦版架構與最佳實踐

## 1. 電腦系統音訊 (Zoom / 影片) 專用捕捉架構
- **麥克風 vs. 系統音分離**：當用戶要求「純系統音 / 拿掉麥克風」時，移除所有 `getUserMedia({audio: true})` 相關調用，將主入口收斂為單一 `getDisplayMedia` 系統音訊擷取。
- **音訊軌道保活關鍵坑 (Chrome Gotcha)**：
  - 在 `getDisplayMedia` 取得串流後，**嚴禁呼叫 `videoTrack.stop()`**！Chrome 在視訊軌道停止時會連帶使音訊軌道失效。
  - 正確做法：保持原始 display stream 存活，從 `stream.getAudioTracks()` 構建純音訊 `MediaStream` 傳遞給 `AudioContext` 與 `MediaRecorder`。
  - 音訊設定參數：`audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }`，保留高保真會議人聲。

## 2. 1:1 極簡深黑石墨毛玻璃膠囊外掛美學 (Graphite Glass Capsule)
- **外觀尺寸**：橫向緊湊膠囊條，`width: 95%`, `max-width: 980px`, `border-radius: 20px`。
- **毛玻璃材質**：`background: rgba(18, 22, 30, 0.95)`, `backdrop-filter: blur(28px) saturate(180%)`, 1px 亮邊 `rgba(255, 255, 255, 0.13)`。
- **頂部工具列組件**：
  - 左側：🔴 **`即時共享`** 紅色呼吸燈膠囊按鈕 + 實時動態跳動綠色 EQ 音頻波形（Web Audio API 頻率分析）。
  - 中間：`英語 (系統音) ⇆ 中文（台灣國語）` 自動雙向語向膠囊。
  - 右側：📋 **`複製`**（一鍵複製當前中英字幕）、💾 **`匯出`**（一鍵下載完整會議紀要 `.txt`）、⛶ **`置頂`**（Document PiP / Canvas 跨視窗覆蓋在 Zoom 最上方）。
- **雙層雙語字體排版**：
  - **上段（原音擷取字幕）**：純白加粗字體 `#ffffff`, `17px`, `font-weight: 700`, `line-height: 1.45`, 現代幾何 Sans-serif。
  - **下段（繁中翻譯字幕）**：高對比清晰繁中 `#f1f5f9`, `19px`, `font-weight: 600`, `line-height: 1.5`, PingFang TC / Microsoft JhengHei。

## 3. 雙階漸進式高精翻譯與多領域術語庫
- **雙階流程**：
  - 階梯 1（即時暫態）：120ms 詞流即時回饋，保證流暢不卡頓。
  - 階梯 2（整句語意重構）：句子結束時自動進行上下文語意潤飾與標點修正。
- **三大專業術語庫對齊**：
  - ESG 永續：`net zero` ➔ `淨零排放`, `carbon footprint` ➔ `碳足跡`, `scope 1/2/3` ➔ `範疇一/二/三`, `sustainability` ➔ `永續發展`。
  - 科技架構：`multi-agent` ➔ `多智能體`, `generative ai` ➔ `生成式 AI`, `framework` ➔ `架構框架`, `pipeline` ➔ `管線流程`, `roadmap` ➔ `發展藍圖`。
  - 商業投資：`stakeholders` ➔ `利害關係人`, `due diligence` ➔ `盡職調查`, `initiatives` ➔ `專案倡議 / 策略行動`, `customized` ➔ `客製化`。

## 4. 本機離線單檔與部署模式 (Offline Single-File Delivery)
- 當線上伺服器或 Cloudflare Tunnel 遭遇邊緣快取或路由問題時，將純前端邏輯打包為獨立單檔：`C:\Users\dingj\Desktop\萬能即時翻譯.html`。
- 直接使用 Google Chrome 開啟，零後端相依，100% 穩定秒開。
