# 即時萬能語音翻譯 (translate.esggo.co)

純前端即時語音翻譯 Web App，部署於 `https://translate.esggo.co/`。

## 技術

- **Google Web Speech API**（`SpeechRecognition` 語音辨識 + `SpeechSynthesis` 語音合成）
  — Chrome / Edge 內建，免費、免金鑰，符合「純免費算力、零付費 API」鐵律。
- **MyMemory** 免費翻譯端點（`api.mymemory.translated.net`）— 無金鑰，限額 500 字/次。
- 純靜態前端 + 極簡 Node 靜態伺服器（`server.mjs`，僅用內建模組）。

## 功能

- 雙向中英、日、韓即時語音辨識 + 翻譯
- 一體式深色膠囊 UI：上段原文、下段翻譯
- 翻譯結果自動朗讀（目標為中文時）
- 來源語支援「自動偵測」

## 本地驗證

```bash
cd apps/translate
node server.mjs
# 開瀏覽器 http://localhost:8789  → 授權麥克風 → 開始聆聽
```

## 部署

靜態檔（index.html / app.js）可由任何靜態主機或 nginx 託管於 `translate.esggo.co`。

## 注意

- Web Speech 辨識需 Chrome / Edge 且 HTTPS 環境；Firefox 不支援 `SpeechRecognition`。
- MyMemory 為免費層，高流量請自備快取或自託 LibreTranslate。

## 分支

本目錄位於 esggo 倉庫 `translate` 分支，與 `apps/universal-translator`（aistation 設施）獨立。
