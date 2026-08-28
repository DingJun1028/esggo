# universal-translator: verified "no subtitles" root causes — reproduction & fix log

Condensed from the 2026-08-08 debugging session. Two NEW root causes were proven (beyond the
original "STT died" / "browser cache" pair) using actual browser-tool reproduction, not guesswork.

## Cause #3 - Cloudflare Tunnel blocks absolute-URL fetch (Failed to fetch)
- **Symptom**: page types/shows source text, but subtitle shows `翻譯失敗：Failed to fetch（原文已顯示）`.
- **Reproduction (browser tools)**:
  1. `browser_navigate https://translate.esggo.co/studio`
  2. `browser_type` into the manual-input box: `會議現在開始`
  3. `browser_click` 推播字幕 button
  4. `browser_console`: `document.querySelector('#transcript').innerText`
     -> showed `▸ 會議現在開始` + `翻譯失敗：Failed to fetch（原文已顯示）`
  5. In console, test both URL forms:
     - `fetch('/speak',{method:'POST',headers:{'Content-Type':'application/json'},body:...})` -> OK (returns JSON)
     - `fetch('https://translate.esggo.co/speak',{method:'POST',...})` -> fails (Command failed)
- **Root cause**: `API = location.origin+'/translate'`; `API.replace('/translate','/speak')` => absolute URL.
  Same-origin fetch with the absolute domain is intermittently rejected by the Cloudflare Tunnel.
- **Fix**: change every frontend fetch to RELATIVE path (`/speak`, `/transcribe`, `/translate`,
  `/stream`). Keep `API=location.origin+'/translate'` ONLY for QR/copy-link absolute URLs.
- **Verify after fix**: repeat steps 2-4 -> `#transcript` shows `英文…` + `繁中…` bilingual.
- **Gotcha**: `typeof API` in console returns `undefined` even when defined - module-scoped `const`
  is invisible at global scope; do not conclude `API` is broken from that.

## Cause #4 - system-audio (Zoom) mode: stopping video track kills audio track
- **Symptom**: "系統音收音中 · 第N輪" runs but no subtitles; debug panel "尚無記錄".
- **Root cause**: `startSys()` called `s.getVideoTracks().forEach(t=>t.stop())`. In Chrome, stopping
  the display **video** track invalidates the paired display **audio** track -> MediaRecorder gets
  ZERO bytes -> `rec.onstop` hits `if(!chunks.length) return` and never dbgs/transcribes.
- **Fix**: do NOT stop the video track. Keep the original display stream alive. Build an audio-only
  `MediaStream` for the recorder: `const audioOnly = new MediaStream(stream.getAudioTracks());`
  then `rec = new MediaRecorder(audioOnly, {mimeType})`.
- **Add dbg** in `rec.onstop` (first line, before the empty-return):
  `dbg('rec.onstop chunks='+chunks.length+' bytes='+chunks.reduce((a,c)=>a+c.size,0))` and
  `dbg('POST /transcribe bytes='+buf.byteLength)` so empty-capture is visible.
- **Verify after fix**: debug panel shows `rec.onstop chunks=N bytes=M` then `transcribe HTTP=200 …`.

## Cause #5 - `Unexpected token '<'` (frontend received HTML instead of JSON)
- **Symptom**: toast `轉錄錯誤：Unexpected token '<'…` or `SyntaxError: Unexpected token '<'…`.
- **Root cause**: an old build called `await r.json()` directly on the `/transcribe` (or `/translate`)
  fetch. When the response body is HTML (e.g. a transient Cloudflare error page, a stale cached page,
  or any non-JSON body), `r.json()` throws `Unexpected token '<'` and the raw message bubbles to the
  user as an ugly error. Verified the server and Cloudflare themselves ALWAYS return JSON for
  `/translate` and `/transcribe` (tested empty audio, fake 200KB webm, real espeak wav — all JSON;
  Cloudflare did NOT block the binary POST). So the HTML was a client-side stale-cache / transient
  condition caught by an un-hardened `r.json()`.
- **Fix**: frontend fetch helpers read `const txt = await r.text()` FIRST, then `JSON.parse(txt)` inside
  a try; on parse failure throw a friendly `服務回傳非預期格式（網路/逾時），請重試` instead of the
  raw `<` SyntaxError. Applied to `transcribeRetry`/`translateRetry` (overlay) and `speakWithRetry`
  (studio).
- **Hard-refresh lesson**: because HTML is served `no-cache`, a fix shows up only after the user
  hard-refreshes (Ctrl+Shift+R) the overlay/studio page. When the user reports an error that a
  committed fix should already cover, FIRST tell them to hard-refresh before assuming the fix failed.

## STT real-voice verified working (do NOT assume STT is broken)
- VPS direct test: `espeak-ng -v en-us 'hello this is a test of speech recognition' -w /tmp/es.wav`
  then `curl -X POST http://127.0.0.1:8791/transcribe?lang=en --data-binary @/tmp/es.wav`
  -> `{"text":"Hello, this is a test on speech recognition.",...}` (accurate).
- Also: sine wave wav -> `{"text":"","language":"en"}` (empty, correct for non-speech).
- So faster-whisper base/cpu IS functional for real voice. If user reports "no transcription", suspect
  capture (cause #4) or a stale frontend (cause #5 / hard-refresh), NOT the STT service itself —
  unless `ss -tlnp | grep 8791` shows it dead (then `pm2 restart stt`).

## Other fixes landed same session
- Mic mode: primary path = Web Speech API (`webkitSpeechRecognition`, free zero-key, lang follows
  selected chip via `recognition.lang`). Server whisper is fallback. `recognition.onend` restarts
  while `running` (continuous).
- `favicon.ico` -> 204 (silences the only console-404 that was ours). All other red console lines are
  Chrome-extension errors (`chrome-extension://…`), NOT studio/overlay code.
- overlay.html REWRITTEN as a single integrated Akkadu-style capture+display overlay (system-audio
  priority + mic Web-Speech fallback + live volume meter + a diagnostic panel that flags missing
  audio track / zero level, plus a "重新選擇來源" retry button). This is the user-preferred one-page
  UX; studio.html is now the optional control/audience-management page.

## Commit hashes (esggo main)
- relative-path fetch fix: 80d651ff3
- system-audio audio-only + dbg: 1fb9adeed
- favicon 204: e6e7fb36e
- overlay one-page rewrite (Akkadu-style, diag panel): c88e747ee / ec300796 (merge)
- frontend r.text()+JSON.parse guard (kills `Unexpected token '<'`): 39b8729d0

## KISS/DRY note
favicon route is a single `if` returning 204 - consistent with the existing 404 dispatch style.
