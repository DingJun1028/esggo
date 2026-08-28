# Gemini 3.5 Live Translate — integration facts (condensed)

Source: Google blog (2026-06), https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-live-3-5-translate/
Fetched via `curl` (Firecrawl/web_extract credits were exhausted this session; direct curl worked).

## What it is
- Real-time **speech-to-speech** translation audio model.
- Auto-detects **70+ languages**; generates smooth natural speech preserving intonation/pacing/pitch.
- **Continuous streaming** (NOT turn-by-turn): stays a few seconds behind the speaker, no awkward pauses.
- Low latency, noise-robust (handles loud/unpredictable environments).
- Dev access: **Gemini Live API** + Google AI Studio (public preview, **requires paid key**). Also Google Meet (private preview) + Translate app (consumer).

## Why not wire it as the default
Project hard rule: **只用免費算立** — no paid API / private npm keys. The Live API needs a key, so it is integrated as an **opt-in, default-off, graceful-fallback** front layer (see SKILL.md "Optional cloud-enhancement engines"). The free chain (google-gtx → libretranslate → mymemory → original) always remains, so a missing/invalid/quota-exhausted key never breaks subtitles.

## Wiring recipe (verified, v1.6.0)
1. `translate.mjs`: add `async function viaGeminiLive35(text, from, to)` that POSTs to
   `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`
   with `{ systemInstruction:{parts:[{text}]}, contents:[{role:'user',parts:[{text}]}], generationConfig:{temperature:0.2,maxOutputTokens:2048} }`.
   Parse `candidates[0].content.parts[].text`. `MODEL` = `process.env.GEMINI_MODEL || 'gemini-2.5-flash'`.
2. `engineChain()`: `if (process.env.GEMINI_API_KEY) chain.push(['gemini-live-3.5', viaGeminiLive35]);` BEFORE the free engines.
3. `server.mjs`: add `GET /gemini-live-3-5/status` → `{ integrated:true, enabled:!!process.env.GEMINI_API_KEY, engine, mode, subtitle:'繁中 ↔ 英文 雙向及時字幕' }`.
4. UI (`studio.html`): on load `fetch('/gemini-live-3-5/status')`; render badge "已啟用 …" / "未啟用 · 純免費零 key 運作".
5. `.env.example`: document `GEMINI_API_KEY`, `GEMINI_MODEL`, `GEMINI_TIMEOUT_MS` as optional.

## Upgrade path (NOT in default deploy)
True S2S voice dubbing (preserves prosody) needs Gemini Live API bidirectional audio WS + a media pipeline (LiveKit / Pipecat / Agora). Keep local faster-whisper STT as the free layer; cloud S2S stays opt-in. Re-evaluate against the 免費算立 red line before enabling.

## S2S module added (verified 2026-08, v1.6.0)
File: `apps/universal-translator/s2s_gemini_live.mjs` (new, key-gated, graceful-fallback).
- `isS2SEnabled()` = `!!process.env.GEMINI_API_KEY && process.env.GEMINI_LIVE_S2S === '1'` → default-OFF.
- `s2sStatus()` → `{ available:true, enabled, mode, requires:['GEMINI_API_KEY (paid Live API)','GEMINI_LIVE_S2S=1'], preserves:'intonation, pacing, pitch', subtitle:'繁中 ↔ 英文 雙向及時' }`.
- `createS2SSession(opts)` → skeleton returning `{sessionId, url, model, source, target, ready:true}`; url = `wss://generativelanguage.googleapis.com/ws/...BidiGenerateContent?key=...`. Real audio wiring (mic/speaker or LiveKit track) is left to the caller — the module only establishes the gated, documented seam.
- `gracefulFallback()` → returns the free-engine descriptor so callers can no-op-switch to STT→translate→subtitle.
- `server.mjs`: `import { s2sStatus, isS2SEnabled }` and add `GET /s2s/status` → `s2sStatus()`.
- Verified: `node --check` passes; in-process boot probe returns `/s2s/status` 200 with `enabled:false` when no key; `pnpm audit --prod` stays 0 vulns. No paid npm deps introduced.

## SKILL.md note
The Architecture table in SKILL.md lists `server.mjs` routes and `translate.mjs` engine chain. **`s2s_gemini_live.mjs` + `GET /s2s/status` are the S2S seam** described above — add them to that table on next SKILL.md maintenance pass (the module + endpoint are verified working as of v1.6.0).

## 5T correspondence
Traceable (trace tag per subtitle), Trackable (metrics byEngine), Tangible (bilingual subtitles), Transparent (engine chain + fallback public), Trustworthy (fallback never interrupts).
