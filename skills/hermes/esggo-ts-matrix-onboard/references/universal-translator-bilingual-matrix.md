# Universal Translator 雙向終始矩陣 · 實證案例

> 對應 `esggo-ts-matrix-onboard` 的 Domain Example。2026-08 實際落地，型別守門 0 error。

## 架構正名（用戶指定）
**萬能即時翻譯 全域全端全量全面 雙向同步 TypeScript 繁中英碼 終始矩陣架構**

## 雙向語域收斂（關鍵約束）
用戶明確收窄：「只做繁中↔英文雙向（語音轉字幕 + 文字互譯）」。去 ja/ko/es/fr/de。
- canonical `shared/types.ts`: `LanguageCode = 'auto' | 'zh' | 'zh-CN' | 'zh-TW' | 'zh-Hant' | 'en'`
- `BilingualPair = 'zh-TW-en' | 'en-zh-TW'`
- `ISpeechToSubtitleResult`: `{ text, detected: 'zh-TW'|'en', translation, target: 'zh-TW'|'en', engine, cached, trace }`

## 七大交付項（全執行）
1. `translate.mjs` 引擎鏈: Ollama 自託管(qwen2.5:3b) 置鏈首 → google-gtx → libretranslate → mymemory → 原文兜底。5T 標記 `X-OA-Engine`。
2. `translate_ollama.mjs`: 零付費 key，語境感知翻譯（prompt: "professional real-time interpreter... output ONLY translated text"）。
3. `stt_service.py`: faster-whisper `small` + SileroVAD (`vad_filter=true`, `min_silence_duration_ms=1000`) 濾靜音降幻覺。
4. `stt_client.mjs`: 語音→雙語字幕編排，回 `ISpeechToSubtitleResult`。
5. `server.mjs`: `/speech-to-subtitle` (語音轉雙語)、`/speak`、`/translate`、`/stream`(SSE)、`/ws`、`/studio`、`/stream` UI。
6. 前端 `studio.html` + `stream.html`: 收音端雙語即時顯示；觀眾端 SSE 雙語浮層（鎖 zh-TW↔en）。
7. 型別守門 `npx tsc -p tsconfig.ut.json --noEmit` = 0 error。

## 實測證據（活體）
- `/speech-to-subtitle` (mock STT zh-TW) → `detected:zh-TW, target:en, translation:"We must achieve carbon neutrality by 2030..."`
- `/speak` → SSE `event:translation` 廣播 `translations:{en:...}` + `room:r1` + `engine:ollama:qwen2.5`
- 型別守門 `TSC exit=0`
- fallback: Ollama 未即時響應時自動回落 `google-gtx`（不中斷，證明優雅回落正常）

## 常見 strict 錯誤與修法（本輪實踩）
- `URLSearchParams.get('lang')` 回 `string|null` 傳入 `speechToSubtitle(audio, langHint: string|undefined)` → TS2345。
  修: `const rawLang = q.get('lang'); const langHint = rawLang === 'zh-TW' || rawLang === 'en' ? rawLang : '';`
- `Record<string,string>[s]` 隱式 any (TS7053) → 函式內 `/** @type {Record<string, string>} */ const map = {...}`。
- `translate_ollama.mjs` langName map 含非雙向鍵 → 收斂為 `zh/zh-tw/zh-hant/zh-cn/zh-hans/en` 僅 6 項。

## 部署阻斷（環境問題，非技能範圍，僅記錄不捕獲為規則）
GitHub Actions `Deploy to VPS` 失敗 `Permission denied (publickey)`：CI 用 `~/.ssh/deploy_key`（來自 Secret `DEPLOY_KEY`）登 VPS，但 VPS `authorized_keys` 不含本地任何私鑰 → 憑證不匹配。修法：生新 ed25519 key 對、公鑰加 VPS authorized_keys、私鑰更新 GitHub Secret `DEPLOY_KEY`。
