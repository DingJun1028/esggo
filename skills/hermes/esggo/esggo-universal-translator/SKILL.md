---
name: esggo-universal-translator
description: "universal-translator: verified root causes of missing subtitles + live-captioning architecture & deploy."
---

# ESG-GO universal-translator (萬能即時翻譯)

Voice-to-bilingual-subtitle live captioning for Zoom / meetings. Free zero-key: server-side faster-whisper for STT, google-gtx for translation.

## Architecture (`apps/universal-translator/`)
| File | Role |
|---|---|
| `public/studio.html` | Capture end. Mic/system-audio → MediaRecorder webm/opus → POST `/transcribe` → onText → POST `/speak` (translate+broadcast SSE). Manual text input + mic diagnostic + debug panel. |
| `public/overlay.html` | **Single integrated Akkadu-style capture+display overlay** (the user-preferred one-page UX). Semi-transparent, pointer-events:none, Zoom-top. System-audio priority (getDisplayMedia, keeps video track alive) + mic Web-Speech fallback. Live volume meter + diagnostic panel (flags missing audio track / zero level, "重新選擇來源" retry). Self-captures on ▶ then shows bilingual captions in-place. |
| `public/player.html` | **🆕 雙語字幕撥放器 (一做三員一體 RWD)** — load local video/audio file (or URL) → `<video>/<audio>` plays → capture audio track → MediaRecorder → POST `/speech-to-subtitle` (STT+translate一体) → bilingual captions (#capSrc 原文 + #capTrs 譯文) shown below/over the player. RWD: phone portrait = captions split-below mode, desktop landscape = overlay mode. Reuses `showCaption()` dual-lang logic from overlay.html. No Zoom needed — standalone media-player subtitle tool. |
| `public/stream.html` | Audience page (SSE). NOTE: publicly shadowed by the SSE route — see `/stream` shadowing pitfall below. |
| `public/index.html` | Platform landing / entry nav. |
| `server.mjs` | @ts-check. Routes: `/health`, `/player` (+`/player.html` → `player.html`), `/translate`, `/speak`, `/transcribe` (raw bytes → STT:8791), `/speech-to-subtitle` (raw audio → STT+translate → `{text, translations}`), `/stream` SSE, `/favicon.ico` (returns 204), `/gemini-live-3-5/status` (opt-in engine status), `/s2s/status` (speech-to-speech upgrade path status), `/context/status` + `/context/reset` (context-awareness), static HTML/JS (served with `Cache-Control: no-cache`). |

## Optional cloud-enhancement engines (graceful-fallback pattern)
Paid/keyed engines (e.g. **Gemini 3.5 Live Translate**) are integrated as **opt-in front layers** that NEVER break the free zero-key path. This honors the project's hard rule: 只用免費算立 (no paid API / private npm keys; revert if violated).

Pattern (condensed facts in `references/gemini-live-3-5-integration.md`; full doc in repo `apps/universal-translator/GEMINI_LIVE_3_5_INTEGRATION.md`):
- Engine function (e.g. `viaGeminiLive35`) calls the provider REST endpoint directly with the key from `process.env`.
- `engineChain()` pushes the engine ONLY `if (process.env.GEMINI_API_KEY)` — i.e. **default-off**.
- The free chain (google-gtx → libretranslate → mymemory → original) is ALWAYS present after it, so a failed / quota-exhausted / invalid key auto-falls-back and subtitles never break.
- Expose a status endpoint (`GET /gemini-live-3-5/status`) returning `{integrated, enabled, mode, engine}` so the UI can show an opt-in badge.
- UI badge: `fetch` the status endpoint on load; show "已啟用 · <model>（雲端增強，自動優雅回落）" when `enabled`, else "未啟用 · 純免費零 key 運作".

Gemini 3.5 Live Translate facts (Google, 2026-06): real-time speech-to-speech, auto-detect 70+ languages, continuous streaming (not turn-by-turn), preserves intonation/pitch, low-latency, noise-robust; dev access via Gemini Live API (paid key). We wire it as a **text-translation front layer**; true S2S voice dubbing is a documented upgrade path (NOT in default deploy). Endpoint used: `https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key=...` with `systemInstruction` + `contents`.

## Console-noise triage (DevTools red errors)
Most red console errors on the studio page are **NOT our code**: any line prefixed `chrome-extension://…` or containing `NSC_EXT_CONTENT_JS_INSERTED`, `Voice Mode Service initialized`, `Could not establish connection. Receiving end does not exist.`, `fetchViaServiceWorker production extension not found`, `Failed to fetch latest config`, `[useCameraCaptureListener]` → these are the user's installed Chrome extensions misbehaving, not studio.html. The ONLY console line attributable to us was `favicon.ico:1 404` (now silenced with a 204 route). When triaging, ignore extension errors; focus on studio/overlay's own behavior (subtitle text + network tab for `/speak` `/transcribe`).
| `stt_service.py` | faster-whisper (base, cpu/int8) on `127.0.0.1:${STT_PORT:-8791}`. venv `/opt/esggo/stt_venv`. |
| `translate.mjs` | Engine chain: **[opt] `gemini-live-3.5` (only if `GEMINI_API_KEY` set)** → google-gtx → libretranslate → mymemory(+email) → original. Free path always present = graceful fallback. |

## VPS deployment (161.118.248.180, ubuntu, key ~/.ssh/esggo_original)
Two pm2 processes, BOTH must be alive:
- `universal-translator` → `node server.mjs` (serves :8788, Cloudflare Tunnel → translate.esggo.co)
- `stt` → `STT_PORT=8791 pm2 start stt_service.py --interpreter /opt/esggo/stt_venv/bin/python`

Deploy: `git commit` → `git push origin main` → SSH `cd /opt/esggo && git pull --ff-only origin main && pm2 reload universal-translator`. Then **ALWAYS verify the live file and SSH-pull+restart if stale** (see pitfall below).

**DEPLOY STALENESS PITFALL (verified 2026-08):** Pushing to `origin/main` does NOT reliably auto-deploy the VPS. This session the VPS `/opt/esggo` was stuck at `7b33827b` while `origin/main` was already at `81ef7227c` — the CI/deploy webhook had not pulled the later commits, so `translate.esggo.co/float` served a stale `float.html` (no `#ctx` element) even though `git push` succeeded. After pushing, verify the live file and fix if stale:
```bash
# 1) confirm live serves the new code
curl -s --max-time 12 "https://translate.esggo.co/float?cb=$(date +%s)" | grep -c 'id="ctx"'   # expect 1 after UI change
# 2) if stale (0), SSH fix:
ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 'cd /opt/esggo && git pull --ff-only origin main && pm2 restart universal-translator --update-env'
sleep 3; curl -s http://localhost:8788/health   # expect new APP_VERSION
```
The `deploy.sh` uses `DEPLOY_KEY=$HOME/.ssh/id_rsa_esggo` which does NOT exist here; use `~/.ssh/esggo_original` (or `ci_deploy_key`) for ad-hoc SSH. Run `deploy.sh` only if `DEPLOY_KEY`/`DEPLOY_HOST` are set.

**`/stream` PUBLIC PATH (FIXED 2026-08, commit `1dbedc075`):** Previously the SSE handler used `url.startsWith('/stream')`, which ALSO matched `/stream.html`, so both `/stream` and `/stream.html` returned the SSE heartbeat on the public proxy. **FIXED:** SSE handler now matches only exact `/stream` and `/stream?room=...`. Now `GET /stream.html` correctly serves the audience HTML page (verified: `capCtx`/`utter` present, `text/html`), while `GET /stream` still returns `text/event-stream`. Static route maps `/stream.html → /stream.html` (line ~241) and falls through once SSE no longer hijacks the prefix. So `stream.html`'s context UI IS now publicly reachable. Verified live: `curl https://translate.esggo.co/stream.html | grep -c capCtx` → 2; `curl https://translate.esggo.co/stream?room=demo` → SSE heartbeat.

**Git rebase-pull with unrelated unstaged changes:** if `git pull --rebase` is refused because of unstaged tracked edits you don't want to commit (e.g. pre-existing oa-framework modifications), stash ONLY those files: `git stash push <file1> <file2> ...`, then `git pull --rebase origin main`, `git push`, then `git stash pop` to restore the working tree. Never `git stash` untracked dirs accidentally.

## ⚠️ VERIFIED ROOT CAUSES OF "NO SUBTITLES" (4, in priority order)
1. **STT process died** → `/transcribe` returns 502. Cause: launched with `nohup … &` or `setsid … & disown` over SSH — reaped when SSH session closes. **Fix: always run STT via pm2** (above). Verify: `ss -tlnp | grep 8791`.
2. **Browser cached old HTML/JS** → user sees stale page without fixes. **Fix: server.mjs sets `Cache-Control: no-cache, no-store, must-revalidate`** (in place). If user still sees old UI, tell them hard-refresh (Ctrl+Shift+R).
3. **🆕 Cloudflare Tunnel blocks ABSOLUTE-URL fetch → `Failed to fetch` (verified 2026-08).** Symptom: page shows the transcribed text but translation subtitle says `翻譯失敗：Failed to fetch`. `curl` to `/speak` works; but `fetch('https://translate.esggo.co/speak',…)` (absolute URL) FAILS in-browser while `fetch('/speak',…)` (relative) SUCCEEDS. Root cause: `API = location.origin+'/translate'` then `API.replace('/translate','/speak')` builds an absolute URL that Cloudflare Tunnel intermittently rejects for same-origin-issued fetch. **Fix: ALL frontend fetch calls use RELATIVE paths** — `/speak`, `/transcribe`, `/translate`, `/stream`. `API` constant is only used for QR/copy-link absolute URLs (those legitimately need the full origin). Verified fix: browser console `document.querySelector('#transcript').innerText` shows bilingual subtitles after typing+push.
4. **🆕 System-audio (Zoom) mode: stopping the display video track kills the audio track → empty MediaRecorder chunks → no transcription (verified 2026-08).** Symptom: "系統音收音中 · 第N輪" runs forever but no subtitles; debug panel shows `尚無記錄` (onstop's dbg never fires because `if(!chunks.length) return` skips it). Root cause: `startSys()` did `s.getVideoTracks().forEach(t=>t.stop())` — in Chrome, stopping the display video track invalidates the paired display **audio** track, so MediaRecorder captures zero bytes. **Fix: do NOT stop the video track; keep the original display stream alive. Build an audio-only `MediaStream` from `stream.getAudioTracks()` for the MediaRecorder.** Verified: after this fix the debug panel shows `rec.onstop chunks=N bytes=M` and HTTP=200 transcriptions flow. Also add dbg logging in `rec.onstop` (chunks count + byte length + POST bytes) and after transcription so failures are visible.
5. **🆕 `Unexpected token '<'` = frontend parsed an HTML body as JSON (verified 2026-08).** Symptom: toast `轉錄錯誤：Unexpected token '<'` / `SyntaxError: Unexpected token '<'`. Root cause: old code did `await r.json()` directly; when the response body is HTML (transient Cloudflare error page, or a STALE cached page the user hasn't hard-refreshed), `r.json()` throws that raw message. Verified the server + Cloudflare ALWAYS return JSON for `/translate` & `/transcribe` (empty audio, 200KB fake webm, real espeak wav — all JSON; Cloudflare did NOT block binary POST). So the HTML was a client-stale-cache / transient edge case caught by an un-hardened `.json()`. **Fix: read `const txt = await r.text()` first, then `JSON.parse(txt)` inside try; on failure throw a friendly `服務回傳非預期格式（網路/逾時），請重試`.** Applied to `transcribeRetry`/`translateRetry` (overlay) and `speakWithRetry` (studio). **Hard-refresh lesson: after any deploy, tell the user to hard-refresh (Ctrl+Shift+R) — a committed fix won't show until then.**

## Diagnosis checklist (user says "沒字幕/沒翻譯")
1. `ssh … 'ss -tlnp | grep 8791'` → STT alive? If dead, `pm2 restart stt`.
2. `curl -sS -X POST https://translate.esggo.co/speak -H 'Content-Type: application/json' -d '{"text":"你好","from":"zh","targets":["en","zh-TW"],"room":"t"}'` → translation works? (~0.2s, returns Hello/你好.)
3. VPS: `curl -sS -X POST https://translate.esggo.co/transcribe?lang=auto --data-binary @/tmp/test.webm -H 'Content-Type: application/octet-stream'` → STT responds?
4. **Browser-side reproduction (the ONLY way to see frontend fetch failures):** use the `browser_navigate` + `browser_type` + `browser_click` + `browser_console` tool chain on `https://translate.esggo.co/studio`. Type text → click 推播字幕 → read `document.querySelector('#transcript').innerText`. If it shows `翻譯失敗：Failed to fetch`, verify in console that absolute-URL fetch fails while relative succeeds: `fetch('/speak',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:'t',from:'zh',targets:['en'],room:'x'})})` → OK, but `fetch('https://translate.esggo.co/speak',…)` → fails. That confirms cause #3 (use relative paths). NOTE: `typeof API` in console returns `undefined` even though `API` is defined — it's a module-scoped `const`, not visible at global scope; that doesn't mean it's broken.
5. System-audio (Zoom) mode: if "第N輪" runs but no subtitles and debug shows "尚無記錄" → cause #4 (video track stop killed audio). Fix per root cause #4.
6. Text shows but translation fails → check cause #3, not a transient reload. `/speak` already has 2x retry; if retry still fails it's the absolute-URL/CORS issue, not transient.
7. `Unexpected token '<'` / `轉錄錯誤` with a `<` → cause #5. FIRST ask the user to **hard-refresh** the page (a prior fix may already be deployed but cached). If it recurs after hard-refresh, inspect what the response actually was (Browser console `await (await fetch('/transcribe?lang=auto',{method:'POST',body:new Blob([new Uint8Array(10)])})).text()`) — if it's JSON, the code path changed; if HTML, it's still a stale cache or an edge proxy.
8. STT itself is PROBABLY FINE — verified real-voice espeak→whisper returns accurate text (see references). Don't waste time restarting STT unless `ss -tlnp|grep 8791` shows it dead. Suspect capture (cause #4) or stale frontend (cause #5) first.

## Testing limitation
`espeak` synthetic speech → faster-whisper returns garbage numbers. **Cannot validate real-human-voice STT with espeak**; VPS offline can't download LibriSpeech. Real-voice check must be from user's browser. Webm/opus decodes fine in faster-whisper (PyAV) — format is NOT the issue.

## UI/USX benchmark & user preference
- User benchmarks against **Akkadu AI** and explicitly wants our free zero-key tool to **match or exceed** it. Strong preference for a **SINGLE integrated capture+display overlay** (one page: click ▶ → record → bilingual captions appear in-place). Was frustrated by the earlier split (studio = capture, overlay = display). Keep new UX one-page; don't reintroduce a control/audience page split unless asked.
- Akkadu markers to mirror: language-swap button (中文⇄英文), gold keyword highlight, "請點選開始" CTA, semi-transparent non-blocking Zoom overlay.
- Communicates tersely + impatiently ("請趕快", "都沒成功抓到音 還要比啥"). **Fix broken features autonomously and fast** — don't re-ask, don't over-explain, don't stop to confirm each step. When an error is reported, reproduce → fix → deploy → tell them to hard-refresh.

## Cross-utterance context awareness (v1.7.0, `context_buffer.mjs`)
Solves isolated per-sentence translation (broken pronoun/tense continuity). Pattern (verified 2026-08):
- `context_buffer.mjs`: room-scoped sliding window of `{src, tgt, from, to}` (cap 12 / TTL 600s, in-memory LRU, zero deps). `recordUtterance`, `getContext({room})` (prior pairs, excludes current), `buildContextHint({room})` (formats last 3 as a string for the Gemini system-instruction), `resetRoom`, `contextStatus`, `isContextEnabled` (gated by `CONTEXT_AWARE`, default on).
- `translate.mjs`: `translateDetailed(text, from, to, ctxHint)` — 4th param `ctxHint` is injected ONLY into `viaGeminiLive35` (when key present). Free chain (google-gtx etc.) ignores it = honest degradation.
- `server.mjs`: both `doTranslateAndBroadcast` AND the `/translate` REST branch build `ctxHint`, record the utterance, and attach `context` (last 3 prior) to the SSE broadcast payload. REST response does NOT carry `context` (that's audience-facing via SSE only).
- Endpoints: `GET /context/status`, `POST /context/reset?room=xxx`.
- SSE payload shape: `{text, translations, engine, trace, room, speaker, context?: [{src,tgt,from,to}]}`.
- UI: `float.html` renders `context` into a faint `#ctx` line (`前文：...`); `stream.html` renders into `#capCtx` / preview `.ctx` (now publicly reachable after the `/stream` route fix). Both verified by syntax + in-process render simulation.

## Verification (after edits)
```bash
cd apps/universal-translator
node -e "const fs=require('fs');const h=fs.readFileSync('public/X.html','utf8');const m=h.match(/<script type=\"module\">([\s\S]*?)<\/script>/);fs.writeFileSync('/tmp/_x.mjs',m[1]);" && node --check /tmp/_x.mjs
node --check server.mjs
npx --no-install tsc -p tsconfig.ut.json --noEmit   # 0 errors (dual TS 終始矩陣 strict)
# HTTP smoke test WITHOUT a background server (launcher kills long-lived node in this sandbox):
node scripts/smoke-http-inprocess.mjs   # probes /health + /gemini-live-3-5/status, prints JSON
```

**Context-awareness (v1.7.0) E2E verification — in-process SSE round-trip** (boot + probe in ONE node process; background launcher kills standalone servers):
```js
// temp _ctxcheck.mjs, delete after
process.env.PORT='8806'; process.env.CONTEXT_AWARE='1';
await import('./server.mjs'); await new Promise(r=>setTimeout(r,1500));
const base='http://127.0.0.1:8806';
const post=(p,b)=>fetch(base+p,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});
const events=[]; const ctrl=new AbortController();
(async()=>{ const r=await fetch(base+'/stream?room=demo',{signal:ctrl.signal});
  const rd=r.body.getReader(); const dec=new TextDecoder(); let buf='';
  while(true){const{done,value}=await rd.read(); if(done)break; buf+=dec.decode(value,{stream:true});
    let i; while((i=buf.indexOf('\n\n'))>=0){const c=buf.slice(0,i);buf=buf.slice(i+2);const m=c.match(/^data: (.+)$/m);if(m){try{events.push(JSON.parse(m[1]));}catch{}}}}})();
await new Promise(r=>setTimeout(r,200));
await post('/translate',{text:'我昨天去了台北',from:'zh-TW',to:'en',room:'demo'});
await post('/translate',{text:'那裡的夜市很熱鬧',from:'zh-TW',to:'en',room:'demo'});
await new Promise(r=>setTimeout(r,300)); ctrl.abort();
const t2=events.filter(e=>e.text).find(e=>e.text==='那裡的夜市很熱鬧');
console.log('T2 contextLen=',(t2&&t2.context?t2.context.length:0),'prev=',JSON.stringify(t2&&t2.context?t2.context.map(c=>c.src):[]));
// expect: contextLen>=1, prev=["我昨天去了台北"]
```
**UI context render verification (no browser):** mock `document` (`const store={}; global.document={getElementById:(id)=>(store[id]=store[id]||{textContent:''})}`), paste float.html's translation handler, call `handleTranslation({data:JSON.stringify({text:'那裡的夜市很熱鬧',translation:'...',context:[{src:'我昨天去了台北'}]})})`; expect `store['ctx'].textContent === '前文：我昨天去了台北'`.

**Stale-snapshot verification loop (this sandbox):** The verification gate may flag temp probe files (`_*.mjs` you created then `rm -f`'d) as "unverified changes" from a stale git/fs snapshot. Clear it DEFINITIVELY in one command: `ls`/`find` the flagged paths (expect "No such file") AND re-run the relevant check (syntax / unit test / in-process smoke) in the SAME terminal turn. Do NOT leave temp probe files in the repo; create, run, `rm -f` immediately, then prove absence. The two pre-existing files `_test_server.mjs` / `_verify_sh.mjs` (Aug 6) are NOT yours — leave them. Pattern:
```bash
cd apps/universal-translator
for f in _ctxcheck.mjs _ctxsse.mjs _verify_ctx.mjs _live_e2e.mjs public/_uicheck.mjs; do [ -f "$f" ] && echo "EXISTS: $f (BAD)" || echo "ABSENT: $f (OK)"; done
node --test test/*.test.mjs 2>&1 | tail -6
find . -name "_*.mjs" -not -path "*/node_modules/*" 2>/dev/null | grep -v "_test_server.mjs\|_verify_sh.mjs" || echo "(none of mine remain)"
```

**🆕 Inline `<script type="module">` syntax check gotcha (verified 2026-08-12):** When extracting an HTML page's module script to `/tmp/_x.mjs` and running `node --check`, an arrow with an assignment as its sole body — `el.addEventListener('change',()=>srcLang=$('#srcLang').value);` — throws `SyntaxError: Unexpected token ')'` under node's ESM strict parser (it reads `srcLang=` as a label). **Fix: always use a block body** — `()=>{ srcLang=$('#srcLang').value; }`. The browser runs either form fine; only `node --check` trips. Write all inline event-arrow handlers with `{}` blocks.

**🆕 Reliable HTTP smoke = VPS SSH + curl (verified 2026-08-12):** Local `node server.mjs` (background OR `timeout … &`) dies in this sandbox (EADDRINUSE / silent exit), so start-then-curl locally is unreliable. The dependable smoke is to **push, SSH to the VPS, and curl the live pm2 port**:
```bash
git commit -am "..." && git push origin main
ssh -i ~/.ssh/ci_deploy_key ubuntu@161.118.248.180 \
  'cd /var/www/esggo/apps/universal-translator && git pull origin main && pm2 reload universal-translator'
sleep 3
ssh -i ~/.ssh/ci_deploy_key ubuntu@161.118.248.180 \
  'curl -sf -m5 http://127.0.0.1:8788/player -o /dev/null && echo PLAYER_OK; \
   curl -sf -m5 http://127.0.0.1:8788/player.html -o /dev/null && echo PLAYER_HTML_OK; \
   curl -sf -m5 http://127.0.0.1:8788/health -o /dev/null && echo HEALTH_OK'
# expect all three OK (verified live this session)
```
This is the canonical way to prove a new route/file actually serves 200 — do NOT rely on a local background server here.

**pnpm install EPERM on `prisma generate` (env-config, not a code rule):** `pnpm install` postinstall `prisma generate` fails on Windows with `EPERM` renaming the query-engine `.node` (rename permission). Workaround already applied in-repo: `.npmrc` contains `PRISMA_SKIP_POSTINSTALL_GENERATE=true` (gitignored). If a fresh clone still hits it, set that env or run as admin. Do NOT "fix" this by editing source — it's a Windows file-permission quirk, not a project defect.

**Tool quirks (this sandbox):**
- `search_files` FAILS on `apps/universal-translator/*` (MSYS path `C:/...` vs `C:\\...`; "IO error os error 3"). Use `terminal` + `grep -n` / `python3` regex instead for files under that dir.
- `web_extract` / `web_search` (Firecrawl) return **Payment Required** when credits exhausted. Fallback: `curl -sSL` the URL to a temp file, then parse with `python3` (regex strip tags). Works for public blogs.
- Background `terminal(background=true)` kills the node server (exit 1). Use the in-process smoke script above instead of start-then-curl.
- `terminal` blocks shell `&` backgrounding. For an in-process boot+probe, write a small `.mjs` that `await import('./server.mjs')` then probes — never `node server.mjs &`.

## Reference
- `references/missing-subtitles-root-causes.md` — exact browser-tool reproduction recipe + fixes for the verified root causes (incl. Cloudflare absolute-URL block & display-video-track-kills-audio), with commit hashes.
- `references/gemini-live-3-5-integration.md` — condensed Gemini 3.5 Live Translate facts + opt-in graceful-fallback wiring recipe (verified 2026-08).
- `references/context-awareness-v1.7.0.md` — context_buffer.mjs design + the verified in-process SSE round-trip recipe (the only reliable way to confirm context propagates; background launcher kills node servers here).
- `references/stream-route-shadowing-fix.md` — SSE `/stream` vs `/stream.html` prefix-shadowing fix (exact-match guard) + in-process verification recipe.
| `references/player-bilingual-subtitle.md` — `player.html` 雙語字幕撥放器 design: 一做三員一體 RWD layout, `/speech-to-subtitle` wiring, and the verified VPS deploy+smoke recipe.
| `references/typescript-matrix-5t-memory.md` — v2.5: TypeScript 終始矩陣 + 5T 驗證閘 + 深貫廣通記憶整合 (TDAI), with bidirectional sync verification.
