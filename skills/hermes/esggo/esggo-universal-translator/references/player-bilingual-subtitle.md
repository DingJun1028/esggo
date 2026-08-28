# player.html — 雙語字幕撥放器 (一做三員一體 RWD)

Standalone media-player subtitle tool (no Zoom needed): load a local video/audio
file (or paste a URL) → play → capture the audio track → MediaRecorder →
POST `/speech-to-subtitle` (STT + translate in one call) → bilingual captions.

## Layout (RWD)
- **Desktop landscape (≥768px):** video fills the stage; captions overlay the
  lower third (`.overlay` mode) — `position:absolute; bottom:0` over the `<video>`.
- **Phone portrait (<768px):** captions render in a split-below block (`.split`
  mode) so they never cover the small video; flex column: `[video][#caption]`.
- Toggle is CSS `@media (max-width:767px)`; JS only flips a `data-mode` attr for
  the source-language picker. No JS layout branching needed.

## Bilingual caption rendering (reuse from overlay.html)
```
#capSrc  → original (srcLang) text, highlighted
#capTrs  → one <span class="pair"> per target lang from `translations` map
```
`translations` is the object returned by `/speech-to-subtitle`:
`{ text:"…", translations:{ "en":"…", "zh-TW":"…" } }`.

## Key endpoint
`POST /speech-to-subtitle?lang=auto` — raw `application/octet-stream` audio body
→ returns JSON `{text, translations}`. (Same engine chain as `/translate`:
google-gtx → libretranslate → mymemory → original; STT via faster-whisper on
`:8791`.) This is the ONE call the player makes per recorded chunk — simpler than
separate `/transcribe` + `/translate`.

## Capture recipe (browser)
```js
const stream = video.captureStream ? video.captureStream() : null;
const mr = new MediaRecorder(stream.getAudioTracks().length ? stream : new MediaStream(),
                             {mimeType:'audio/webm'});
mr.ondataavailable = async (e) => {
  const buf = await e.data.arrayBuffer();
  const r = await fetch('/speech-to-subtitle?lang=auto',
    {method:'POST', headers:{'Content-Type':'application/octet-stream'}, body:buf});
  const {text, translations} = await r.json();
  showCaption(text, translations);   // #capSrc + #capTrs
};
mr.start(4000);   // 4s chunks
```
Fallback: if `captureStream()` unsupported, record via `getUserMedia` mic OR let
the user paste a transcript. Player must not hard-crash if audio capture fails —
show a toast and keep the player usable.

## Arrow-handler gotcha (verified)
Inline `<script type="module">` handlers MUST use block bodies:
`el.addEventListener('change',()=>{ x = y; });` — NOT `()=>x=y;` (node --check
throws `Unexpected token ')'` under ESM; browsers accept both).

## Deploy + smoke (the ONLY reliable verification here)
```bash
git commit -am "feat: player.html 雙語字幕撥放器" && git push origin main
ssh -i ~/.ssh/ci_deploy_key ubuntu@161.118.248.180 \
  'cd /var/www/esggo/apps/universal-translator && git pull origin main && pm2 reload universal-translator'
sleep 3
ssh -i ~/.ssh/ci_deploy_key ubuntu@161.118.248.180 \
  'curl -sf -m5 http://127.0.0.1:8788/player -o /dev/null && echo PLAYER_OK; \
   curl -sf -m5 http://127.0.0.1:8788/player.html -o /dev/null && echo HTML_OK; \
   curl -sf -m5 http://127.0.0.1:8788/health -o /dev/null && echo HEALTH_OK'
# verified live 2026-08-12: all three OK; translate.esggo.co/player serves 200
```
Local `node server.mjs &` dies in the sandbox (EADDRINUSE / silent exit) — do NOT
use it to prove the route. Use the VPS curl above.
