# OmniLive 萬能即時轉譯雙語字幕播放器 (apps/omnilive)

Sibling app to `universal-translator` in `DingJun1028/esggo`. Same FREE / self-hosted
principle (zero paid creds). Adds a **real local STT** path (`apps/stt` faster-whisper),
**VAD speaker segmentation**, **room password protection**, and a **one-click `start.mjs`**
that boots STT + the player together. Built 2026-08-16 from a [OmniLive] PRD (Zoom meeting
bilingual subtitles).

## 1. Architecture (v1.0.0)
| File | Role |
|------|------|
| `server.mjs` | HTTP (`/health`, `/config`, `/api/transcribe`, `/api/speak`, `/api/room`) + SSE (`/stream?room=`) + static UI. Zero deps. 5T `X-OA-Trace` header. |
| `start.mjs` | One-click launcher: if `OMNILIVE_AUTOSTART_STT!=false` and `apps/stt` not up, spawn venv python `apps/stt/server.py` (faster-whisper), wait `/health`, then spawn `server.mjs`. STT down ⇒ OmniLive still starts (caption mode works). |
| `lib/stt.mjs` | `transcribe()` → POST audio bytes to `apps/stt:8791/transcribe`; `vadSegments()` energy VAD on WAV PCM. |
| `lib/translate.mjs` | Same free engine chain as UT (`google-gtx → mymemory → origin`), `mock` seam via `OMNILIVE_TRANSLATE_MOCK=1` or `{mock:true}`. |
| `lib/subtitle.mjs` | `BilingualSubtitle` struct + `SubtitleStore` (TTL window, empty-filter). |
| `lib/audio-source.mjs` | 4 source modes: `mic` / `system-display` / `device` / `caption`. |
| `public/index.html` | Player: getDisplayMedia audio capture, SSE subtitles, font/lang-order/bg toggles, **swap (S key)**, share panel + QR (`qrcode.min.js` reused from `apps/universal-translator/public/`), room password prompt, speaker label. |
| `scripts/e2e-voice.mjs` | Real-voice E2E: edge-tts synth EN/ZH MP3 → faster-whisper → bilingual. `npm run e2e:voice`. |

API surface (vs UT): OmniLive's transcribe returns `{source, target, from, to, engine, trace}`
(not UT's `{text,...}`). The `/api/speak` body is `{text, room, from, to}` and honors the
request's `from/to` (caption mode language pair can differ from the server default).

## 2. Room password protection (SHA-256, no plaintext at rest)
- `POST /api/room` accepts `{password}`; server stores ONLY `crypto.createHash('sha256').update(password).digest('hex')`.
- `/stream?room=R&pwd=P` → `roomCheckPwd()`: if room has a hash and `P` mismatches → 401.
  `P` may be the **plaintext** OR the **hash** (viewer link carries the hash, never plaintext).
- Open rooms (first `/stream` on an unknown room) are auto-created with empty `pwdHash` — so
  caster can stream before formally creating a share room. **Gotcha:** if `/stream` 404s unknown
  rooms, the SSE broadcast test (which uses a never-created room string) breaks — auto-create instead.

## 3. VAD speaker segmentation (lib/stt.mjs)
`vadSegments(wav)` parses 16-bit PCM WAV RIFF header, RMS per 20ms frame, marks speech; silence
gap > `silenceGapMs` (600) ⇒ alternate speaker A/B. Non-WAV (webm/ogg/mp3) → single segment A
(can't decode without ffmpeg). `transcribe(..., {vad:true})` attaches `segments` (whisper text to
longest segment, others empty as turn markers). Player shows `A` / `B`. Note: heuristic,
not speaker-ID — same person pausing >600ms gets mis-tagged B.

## 4. VALIDATED Node 24 / Windows testing patterns (this session — real evidence)
These fixed actual test failures; embed them.

### 4.1 `EventSource` is NOT global on Node 24 → use fetch-streaming SSE reader
`node --test` has no browser `EventSource`. Write `test/sse-helper.mjs`:
```js
import { TextDecoder } from 'node:util';
export async function readSSEOnce(url, predicate, ms = 8000) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  try {
    const res = await fetch(url, { signal: ac.signal });
    if (!res.body) return null;
    const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let idx;
      while ((idx = buf.indexOf('\n\n')) >= 0) {
        const raw = buf.slice(0, idx); buf = buf.slice(idx + 2);
        const ev = {}; let data = '';
        for (const line of raw.split('\n')) {
          if (line.startsWith('event:')) ev.event = line.slice(6).trim();
          else if (line.startsWith('data:')) data += line.slice(5).trim();
        }
        try { ev.data = data ? JSON.parse(data) : null; } catch {}
        if (predicate(ev)) { clearTimeout(t); await reader.cancel(); return ev.data; }
      }
    }
  } catch { /* aborted/timeout */ } finally {
    clearTimeout(t);
    try { await reader.cancel(); } catch {}
    try { if (typeof res.body?.destroy === 'function') res.body.destroy(); } catch {}
  }
  return null;
}
```
**Critical:** the reader MUST `reader.cancel()` + `res.body.destroy()` + `AbortController` on match/timeout,
otherwise the open SSE socket keeps the event loop alive and the script hangs (foreground timeout).

### 4.2 `spawn('server.mjs')` ⇒ `spawn EFTYPE` on Windows
`spawn('server.mjs', [...])` throws `Error: spawn EFTYPE` (wrong file type) on Windows. Always pass
`[process.execPath, 'server.mjs']`:
```js
const s = spawn(process.execPath, ['server.mjs'], { cwd, env: {...process.env, ...env} });
```

### 4.3 Don't call `process.exit()` after `child.kill('SIGKILL')` on Node 24 / Windows
It triggers a UV assertion crash (`Assertion failed: ...`) and a non-zero exit that looks like a real failure.
Set `process.exitCode = 1` and just `return`/`setTimeout(()=>{},50)`; let the event loop drain. `startServer`
kill with `'SIGKILL'` is fine, just don't `process.exit` afterwards.

### 4.4 E2E stdout swallowed by `2>&1 | tee` under non-interactive shell
The harness prints only `stdin is not a tty` and swallows script output. Write results to a JSON file
(`e2e-result.json`) via `fs.writeFileSync`, then `read_file` it. Don't rely on captured stdout for pass/fail.

### 4.5 Real-voice fixture generation (edge-tts, not pyttsx3)
- `pyttsx3` SAPI5 fails in a Python venv on this host (`import pythoncom` → `ModuleNotFoundError: No module named 'pywin32'`). Use `edge-tts` (pure Python, `pip install edge-tts`) instead — `edge_tts.Communicate(text, voice).save(out)`.
- edge-tts hits `speech.platform.bing.com` with intermittent DNS (`ClientConnectorDNSError`). Wrap in a retry loop (3-5 tries, 3s backoff).
- Corruption guard: a failed synth leaves a 0-byte mp3; a later run's `fs.statSync(f).size < 1000` guard must re-synth, else the transcribe step gets silence and `source` is empty. Fix corrupt 0-byte fixtures before re-running.
- Store fixtures at a STABLE path (e.g. `$LOCALAPPDATA/Temp/en.mp3`) so re-runs reuse them; don't `mkdtemp` per run (the synth call re-fails).
- Voices: `en-US-AriaNeural`, `zh-TW-HsiaoChenNeural`.

### 4.6 faster-whisper (apps/stt) setup
`cd apps/stt && python -m venv .venv && .venv/Scripts/python -m pip install -r requirements.txt edge-tts`.
First run downloads `WHISPER_MODEL` (default `tiny`, ~75MB) to HF cache. CPU-only, zero key.
Health: `GET /health` → `{status:'ok', model, device}`. The OmniLive E2E spawns it on :8791.

## 5. Verified end-to-end (real voice)
`npm run e2e:voice` → EXIT=0. EN speech → "Hello, this is a live meeting test..." → 繁中
"您好，這是全即時雙語字幕的即時會議測試。"; ZH speech → "歡迎參加線上會議,這是即時雙語字幕測試"
→ EN "Welcome to the online meeting, this is an instant bilingual subtitle test". Each with 5T `trace`,
broadcast over `/stream?room=voice`.

## 6. Test counts
`node --test test/*.test.mjs` → 18/18 (incl. room-password 401/200, VAD A/B交替, SSE sync, STT_UNAVAILABLE).
`npm run verify` → 12 checks. `tsc -p tsconfig.omnilive.json` → clean (app-scoped tsconfig, root excludes apps/*).
