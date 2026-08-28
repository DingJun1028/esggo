# 萬能即時翻譯 v2.1/v2.2 核心升級與實戰避坑指南

## 1. 舊版 float.html 視訊相機索取陷阱
- 舊版 `float.html` 內含 WebCam 索取，會導致瀏覽器彈出 `無法開啟影像: Permission denied`。
- **修復**：徹底移除 WebCam 視訊鏡頭索取，轉為純音訊與雙層字幕渲染。

## 2. 雙軌全協議推播集線器 (Dual-Stream Broadcast Hub)
- 後端（`server_runner.mjs`）必須同時支援並廣播至 **SSE (`/stream?room=...`)** 與 **WebSocket (`/ws/room/...`)**，防止單一協議中斷或錯開。

## 3. 語音擷取與雙階漸進翻譯精準度 (Two-Stage Progressive Translation)
- **Stage 1（即時預覽）**：講者說話時 100ms 內即時渲染。
- **Stage 2（整句語意潤飾）**：停頓 > 400ms 時自動調用上下文模型進行整句語意校正與去贅字重組。
- **ESG/商務術語庫對齊**：
  - `ecosystem` ➔ `生態系`
  - `stakeholders` ➔ `利害關係人`
  - `initiatives` ➔ `專案倡議 / 策略行動`
  - `customized / custom` ➔ `客製化`
  - `sustainability` ➔ `永續發展`

## 4. 1:1 像素級極簡半透明膠囊懸浮條
- 底色 `rgba(22, 27, 34, 0.94)` + `backdrop-filter: blur(28px)`。
- 上段純白加粗現代 Sans-serif（原音，`#ffffff`）、下段高清晰度繁中（翻譯，`#f0f6fc`）。
- 頂部工具列：⚙️ 設定、🔴 即時共享（紅呼吸燈）、⏸/⏹ 播控、`英語 ⇆ 中文（台灣國語）` 自動雙向切換、🔊 語音、📌 置頂、— 最小化、⛶ 畫中畫 (PiP)、✕ 關閉。

## 5. 預設配置與品牌
- `☑️ 系統音 (Zoom/YouTube)` 預設打勾、`☑️ 自動偵測語言` 預設打勾、預設英語轉繁中。
- 觀眾端純淨無按鈕介面，手機掃碼即時同步。
- 零外鏈 QR Code 內嵌繪製。
- 預設調用 Google Chrome 開啟。
- 墾趣旅遊專屬分支為 `ftg`（嚴禁「聖趣」）。
