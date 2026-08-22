# 即時萬能語音翻譯 (translate.esggo.co)

純前端即時語音翻譯 Web App，部署於 `https://translate.esggo.co/`。
一體化漂浮式 RWD 極簡影音字幕撥放面板。

## 技術

- **Google Web Speech API**（`SpeechRecognition` 語音辨識 + `SpeechSynthesis` 語音合成）
  — Chrome / Edge 內建，免費、免金鑰，符合「純免費算力、零付費 API」鐵律。
- **MyMemory** 免費翻譯端點（`api.mymemory.translated.net`）— 無金鑰。
- 純靜態前端 + 極簡 Node 靜態伺服器（`server.mjs`，僅用內建模組）。

## 功能

- **僅英文 ⇄ 繁中** 語音翻譯。
- **自動雙向偵測**：無手動下拉。以 CJK 字元判讀——聽到中文自動翻英文，聽到英文自動翻繁中。
- **雙語字幕**：單一漂浮面板內上段顯原文、下段顯翻譯，標示來源/目標語。
- **一體化漂浮 RWD 極簡面板**：深色玻璃擬態、字級 `clamp()` 自適應、可「浮貼」拖曳至影音上方。
- **即時同步分享字幕**：點「分享字幕」開啟房間；同源多標籤頁經 `BroadcastChannel` 即時同步；
  另支援可選 `?ws=wss://...` 跨裝置 WebSocket 房間（未提供則自動降級）。網址帶 `?room=xxxx` 即同一房。
- 翻譯結果自動朗讀（目標語音隨結果切換 zh-TW / en）。

## 本地驗證

```bash
cd apps/translate
node server.mjs
# 開 http://localhost:8789 → 授權麥克風 → 開始
# 說中文 → 出英文；說英文 → 出繁中
# 另開一個標籤頁同名網址 → 點「分享字幕」→ 雙方即時同步
```

## 部署

靜態檔（index.html / app.js）由靜態主機或 nginx 託管於 `translate.esggo.co`（HTTPS 必要）。

## 注意

- Web Speech 辨識需 Chrome / Edge 且 HTTPS；Firefox 不支援 `SpeechRecognition`。
- MyMemory 為免費層，高流量請自備快取或自託 LibreTranslate。
- WebSocket 分享為選用；若部署端無 ws 服務，僅同源 BroadcastChannel 同步生效。

## 分支

本目錄位於 esggo 倉庫 `translate` 分支，與 `apps/universal-translator`（aistation 設施）獨立。
