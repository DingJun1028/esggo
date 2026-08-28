# 萬能即時翻譯 · 一體式懸浮字幕條與自動雙向辨識架構 (v2.0)

## 一、 核心架構亮點 (Verified 2026-08)

### 1. 一體式深色半透明膠囊懸浮條 (Glassmorphism Capsule Bar)
- **視覺規範**：`rgba(22, 27, 34, 0.92)` 搭配 `backdrop-filter: blur(24px) saturate(180%)`，20px 圓角與淡亮邊框線（`rgba(255, 255, 255, 0.14)`），完全不遮擋底層視窗。
- **雙層字幕結構**：
  - **上段**：語音即時擷取文字（白色加粗 Sans-serif，`#ffffff`）
  - **下段**：即時高精準度翻譯文字（台灣國語暖金色，`#ffd875`）

### 2. 全自動雙向語言識別 (Auto Language Detection)
- 自動偵測輸入文字的 CJK 字符與英文單詞比例：
  - 講英文時：上段顯示英文原文，下段自動翻繁中，狀態更新為 `AUTO: 英語 → 繁中`。
  - 講繁中時：上段顯示繁中原文，下段自動翻英文，狀態更新為 `AUTO: 中文 → 英文`。
- 免去手動切換語言方向的繁瑣操作。

### 3. Zoom / YouTube 跨視窗全域置頂 (Always-on-top PiP)
- 雙重畫中畫引擎：
  1. **首選**：`window.documentPictureInPicture.requestWindow({ width: 900, height: 180 })`，建立獨立原生的 Windows 置頂浮窗，透過 `MutationObserver` 雙向同步 DOM 文字。
  2. **備援**：虛擬高解析 Canvas 渲染文字流，透過 `HTMLVideoElement.requestPictureInPicture()` 輸出原生影片畫中畫。
- 效果：即使切換至全螢幕 Zoom 或 YouTube，字幕條依然常駐在最頂層。

### 4. 觀眾端專用同步頁面 (`public/viewer.html`)
- 專用端點：`https://translate.esggo.co/viewer.html?room=live`
- 行動端優化：OLED 純黑背景、自動平滑滾動逐字紀錄、`A- / 標準 / A+ / 特大` 字體即時調整。
- 廣播集線器：透過 WebSocket (`/ws/room/live`) 或 SSE 毫秒級推送。

---

## 二、 踩坑與排錯實戰指南 (Troubleshooting)

### 1. Hermes LLM 自定義 Ollama 端口踩踏 8788 端口
- **現象**：Hermes 對話日誌出現 `NotFoundError [HTTP 404]: {"usage":"POST /translate ... | GET /float ..."}` 隨後觸發 401 錯誤。
- **根因**：Hermes 的 `custom-ollama` 基地網址被誤設為 `http://100.71.82.0:8788`（即時翻譯服務端口），而非 Ollama 預設推論端口 `11434`。
- **修復指令**：
  ```bash
  hermes config set providers.custom-ollama.base_url "http://100.71.82.0:11434/v1"
  ```

### 2. PM2 重複路徑錯誤 (Script Not Found)
- **現象**：`[PM2][ERROR] Script not found: /opt/esggo/apps/universal-translator/apps/universal-translator/server_runner.mjs`。
- **根因**：同時傳入 `--cwd /opt/esggo/apps/universal-translator` 與子目錄路徑 `apps/universal-translator/server_runner.mjs`，導致路徑疊加。
- **正確啟動指令**：
  ```bash
  cd /opt/esggo/apps/universal-translator
  PORT=8788 pm2 start server_runner.mjs --name universal-translator --cwd /opt/esggo/apps/universal-translator
  ```

### 3. Windows PowerShell 多行字串引號逃逸失敗
- **現象**：在 PowerShell 內直接粘貼帶引號的 Bash/Node 代碼時報 `無法載入模組 'charset=utf-8'`。
- **防禦模式**：在倉庫維護獨立檔案（如 `server_runner.mjs`），透過 `git push` 後在 VPS 上執行，避免經由 SSH 命令行內聯字串傳遞複雜 JavaScript 代碼。
