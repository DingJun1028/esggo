# Zoom / YouTube 一體式懸浮雙語字幕外掛與觀眾即時廣播架構 (2026-08 實戰總結)

## 1. 核心視覺與雙層排版規格 (Dual-Tier Caption Specification)
- **整體造型**：極簡深黑石墨半透明膠囊橫條 (`rgba(22, 27, 34, 0.92)` 搭配 `backdrop-filter: blur(24px)`)，圓角 18px ~ 20px，淡亮半透明邊框。
- **上段（語音即時擷取原文）**：
  - 白色加粗文字 (`#ffffff`, font-size: 17px, font-weight: 700, line-height: 1.45)。
  - 呈現英文 Zoom 會議或演講原音即時語音識別串流。
- **下段（即時繁體中文翻譯）**：
  - 暖金高對比文字 (`#ffd875`, font-size: 19px~20px, font-weight: 600, line-height: 1.5)。
  - 呈現台灣國語慣用詞彙之即時翻譯字幕。

## 2. 跨視窗全域置頂懸浮 (Always-On-Top PiP Engine)
為了讓網頁端字幕能夠像 Zoom 原生外掛一樣浮在 **Zoom 客戶端、全螢幕 YouTube 影片與 Windows 桌面程式** 之上：
- **方案 A (首選)**：`window.documentPictureInPicture.requestWindow({ width: 900, height: 180 })`，直接將 DOM 元素放入原生 Always-On-Top 視窗，並使用 `MutationObserver` 同步雙語文字。
- **方案 B (相容回落)**：使用虛擬 Canvas (`pipCanvas`) 即時繪製上段白字 + 下段金字，並將串流賦予隱藏 `<video>` 元素執行 `video.requestPictureInPicture()`。

## 3. Zoom / 系統聲音捕獲 (System Audio Capture)
- 透過 `navigator.mediaDevices.getDisplayMedia({ video: true, audio: { echoCancellation: false, noiseSuppression: false } })` 擷取 Zoom / 分頁音訊。
- 務必提醒用戶在分享對話框中勾選 **「分享系統音訊 (Share Audio)」**。
- `SpeechRecognition` 必須具備 `onend` 與 `onerror` 的 200ms 自動重連守護，防止因講者停頓導致「錄製錯誤」中斷。

## 4. 主持人端 ⇄ 觀眾端 WebSocket 廣播集線器 (Room Broadcast Hub)
- **後端端點**：
  - `WS /ws/room/{room_id}`：雙向 WebSocket 廣播。
  - `POST /api/broadcast`：HTTP 回落廣播。
  - `GET /api/room/{room_id}/latest`：輪詢回落。
- **觀眾端頁面**：`/viewer.html?room=live`，手機響應式排版，頂部即時同步大字號卡片，下方自動滾動會議歷史逐字稿。
- **QR Code 生成**：主持人懸浮條內建「即時共享」抽屜，一鍵渲染觀眾端 QR 碼與複製連結。

## 5. Windows Python 依賴編譯避坑 (No C++ Build Tools Required)
- **陷阱**：在 Windows 上安裝 `aiohttp` 時，若無 MSVC C++ 14.0 編譯環境會觸發 `Building wheel for aiohttp failed`。
- **最佳實踐**：後端使用純 Python 庫 (`fastapi`, `uvicorn`, `websockets`, `requests`) 或 Node.js 原生 ES Module (`server.mjs`)，完全免編譯，秒裝秒啟動。
