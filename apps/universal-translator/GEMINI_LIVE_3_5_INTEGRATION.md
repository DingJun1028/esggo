# Gemini 3.5 Live Translate 技術整合（萬能即時翻譯）

> 來源技術：Google 於 2026-06 發布 **Gemini 3.5 Live Translate** —— 一款即時 speech-to-speech（語音對語音）翻譯音訊模型。
> 官方部落格：https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-live-3-5-translate/

## 技術要點（取自官方部落格）
- 即時 speech-to-speech 翻譯，自動偵測 70+ 語言
- 連續流式（非逐句等待），落後講者僅數秒，保留語調/節奏/音高
- 低延遲、抗噪，適合會議/課堂/直播同傳
- 開發者經 Gemini Live API + Google AI Studio（公開預覽）取用
- 合作開發平台：LiveKit、Agora、Pipecat、Fishjam、Vision Agents

## 本產品如何整合（v1.6.0）
本產品是 **繁中 ↔ 英文 雙向及時字幕**（STT + 翻譯 + SSE 雙語浮層），遵循「只用免費算立」原則。

Gemini 3.5 Live Translate 的 **Live API 需付費 key**，故採 **AI Station 同款「可選雲端增強 + 優雅回落」模式**：

1. 預設關閉：未設 `GEMINI_API_KEY` 時，完全不進入雲端，純免費零 key 運作。
2. 設了 key：Gemini 引擎排在最前端，取用其最新翻譯品質。
3. 失敗回落：key 無效/逾時/限流 → 自動回落 google-gtx 免費鏈，字幕不中斷。

### 程式碼落點
- `translate.mjs`：新增 `viaGeminiLive35()` 引擎，呼叫官方 REST
  `generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent`
- `translate.mjs` `engineChain()`：僅當 `process.env.GEMINI_API_KEY` 存在時，將 Gemini 推入最前端
- `server.mjs`：新增 `GET /gemini-live-3-5/status` 端點，回報啟用狀態
- `public/studio.html`：新增 Gemini 狀態徽章（已啟用 / 純免費零 key）

### 啟用方式
```bash
# .env（gitignored，勿提交真實 key）
GEMINI_API_KEY=你的_Gemini_API_金鑰
GEMINI_MODEL=gemini-2.5-flash   # 可改為 3.5 Live 正式模型名
```
重啟 `node server.mjs` 即生效。

## 升級路徑：真正的 speech-to-speech 同傳
目前整合的是 Gemini 的「文字翻譯增強層」。若要實現官方 **語音對語音即時同傳**（含保留語調的 TTS），進階路徑：
1. 經 Gemini Live API 的雙向音訊串流（WebSocket）
2. 搭配 LiveKit / Pipecat 處理即時媒體管線
3. 本地 STT（faster-whisper）維持免費層，雲端 S2S 作為可選增強

此路徑需評估付費成本與「免費算立」紅線，故列為可選進階，不在預設部署內。

## 5T 對應
- Traceable：每句字幕帶 trace；引擎來源標註
- Trackable：metrics 端點記錄 byEngine
- Tangible：雙語字幕即時可見
- Transparent：引擎鏈與 fallback 順序公開
- Trustworthy：fallback 不中斷，寫入即定版

---

## 語音對語音同傳升級路徑 (Speech-to-Speech)

檔案：`s2s_gemini_live.mjs`（可選模組，key-gated + 優雅回落）

- 啟用條件：`GEMINI_API_KEY`（付費 Live API）+ `GEMINI_LIVE_S2S=1`
- 未啟用時：完全不載入，流量走免費 STT → 翻譯 → 雙語字幕 管線
- 啟用時：經 Gemini Live API BIDI WebSocket 做即時 S2S 同傳（保留語調/節奏），失敗自動回落免費鏈
- 狀態端點：`GET /s2s/status`（回報 enabled / available / 所需變數）
- 實際音訊媒體層（麥克風/揚聲器或 LiveKit track）需搭配 Pipecat/LiveKit/Agora 等即時媒體框架，參考 Gemini Cookbook "Live API dubbing / simultaneous translation" 範例
- 遵循「免費算立」紅線：不引入付費私鑰 npm；僅用 Node 內建 WebSocket + 環境變數金鑰

---

## 跨句脈絡記憶 (Context Awareness) — v1.7.0

檔案：`context_buffer.mjs` + `translate.mjs` (translateDetailed 第四參 ctxHint) + `server.mjs` (doTranslateAndBroadcast / /translate 雙分支)

### 解決的痛點
即時字幕原本「逐句孤立翻譯」，導致代詞指代（他/她/它）、時態（昨天/今天）、話題連貫斷裂。脈絡模組維護每個 room 的近期 (原文→譯文) 滑動視窗。

### 行為
- 每句翻譯後記錄 {src, tgt, from, to} 至 room 緩衝（上限 12 句, TTL 10 分鐘, 純記憶體 LRU, 零依賴）
- SSE 廣播 payload 附帶 `context`（最近 3 句前文），供觀眾端 UI 顯示「前文」
- `GEMINI_API_KEY` 啟用時：前文作為 system-instruction 注入 Gemini 引擎，提升代詞/時態連貫
- 免費鏈（google-gtx 等）：`context` 仍隨 payload 提供，但不影響輸譯輸出（誠實降級）
- 端點：`GET /context/status`、`POST /context/reset?room=xxx`
- 開關：`CONTEXT_AWARE=1`（預設開啟）
