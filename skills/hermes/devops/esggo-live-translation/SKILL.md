---
name: esggo-live-translation
description: Build/maintain esggo universal-translator Live translation.
---

# esggo-live-translation

Class of work: the **`apps/universal-translator`** app in `DingJun1028/esggo` — a FREE, self-contained
real-time translation service (text layer). Governs building, fixing, verifying it.

## 1. Trigger
User says 即時翻譯 / Live translation / universal-translator / 翻譯 endpoint / WebSocket translate / add translation to esggo.
When asked to "integrate a translation/interpretation SDK" → read §2 FIRST.

## 2. CORE PRINCIPLE — FREE / SELF-HOSTED OVER PAID / PRIVATE (user correction)
**User correction (2026-08-06):** I built a full Akkadu-RTC integration (private npm `@akkadu/akkadu-rtc`,
needs a token from `techforce@akkadu-team.com`) into universal-translator. User pivoted:
> "但我要做出免費版本的 不需要算立 也不需要akkadu"

Embed this:
- When the *obvious* library for a requested feature is **paid / private-npm / approval-gated**,
  **DEFAULT to the free path the repo already supports** — do NOT assume the user will obtain a private token.
  This repo's translator uses `LibreTranslate (self-host) → MyMemory (free, zero key) → origin fallback`, no paid creds.
- If a paid SDK truly seems required, **ask first** or build the free equivalent. Never silently add a private dep.
- Aligns with user's standing pref: 樂見自建自託管取代付費 SaaS.
- The Akkadu integration was BUILT then REMOVED in the same session. Do NOT reintroduce it unless the user
  explicitly asks for paid voice interpretation. See `references/akkadu-vs-free.md`.

## 3. Architecture (v1.3.0 — PURE FREE, Google-gtx PRIMARY, 2026-08-07)
> **User decision 2026-08-07: 「只能使用免費算立進行」** → paid CrewAI/OpenRouter engine REMOVED.
> Engine chain is `Google-gtx(free,zero-key) → LibreTranslate(optional self-host) → MyMemory(free) → origin fallback`.
> Do NOT reintroduce any paid engine unless the user explicitly reverses that decision.

**Why Google-gtx is now PRIMARY (2026-08-07 root-cause fix):** MyMemory's crowd layer returns
GARBAGE for certain phrases (e.g. `你好世界這是一個測試` → `A/n/@/o/O/@//`) and the shared VPS/container
IP gets rate-limited into the noise tier, so `zh-TW→en` and `auto→zh-TW` both failed in practice.
Google's unofficial `translate.googleapis.com/translate_a/single?client=gtx` endpoint is **free, zero-key,
supports `auto` detection AND `zh-TW` natively**, and was stable from this host. Added as engine 0.
MyMemory is demoted to last-resort fallback (its `auto` source is still INVALID — see §14.4 — but gtx
covers auto so the user-visible auto-detect path works).

| File | Role |
|------|------|
| `server.mjs` | HTTP (`/health`, `/translate` single+multi, `/speak` relay) + WebSocket (`/ws`) + static UI (`/` + all `public/*.html`) + SSE (`/stream?room=xxx`). Open CORS. 5T headers inlined into `writeHead`. **Routes every `public/<name>.html`** (see §10.1). Version `1.3.0`. **`/translate` AND `/speak` AND `/ws` ALL broadcast SSE** (shared `doTranslateAndBroadcast()`) → studio(REST)→stream(SSE) relay works. |
| `translate.mjs` | Engine chain (`google-gtx` → optional LibreTranslate → MyMemory → origin fallback), LRU cache, exp-backoff retry, `Promise.all` parallel multi-target. **`normalizeLang()`** maps `zh-TW/zh-Hant→zh-CN`, `auto→en` (for Libre/MyMemory; gtx gets the RAW `from`/`to` because Google supports `auto`+`zh-TW` natively). **`postProcess()`** strips MyMemory garbage (`*`/`[]`) + forces env `GLOSSARY` (`k=v|k2=v2`). `viaMyMemory` appends `&de=<MYMEMORY_EMAIL>` (free quota/quality boost, still zero-key). `viaGoogleGtx` hits `translate.googleapis.com/translate_a/single?client=gtx&sl=&tl=&dt=t&q=` with `User-Agent: Mozilla/5.0`. |
| `public/studio.html` | 收音端 (speaker): manual 🎤 start/stop mic button (no auto-start), language cycle 🔄, multi-target sync cards, theme toggle, toast on mic error, 📖 glossary, 🔳 QR distribution. **Calls `POST /speak`** (NOT `/translate`) so the audience SSE receives subtitles. Sets `currentRoom` on QR-gen and includes it in `/speak`. Fixed 2026-08-07: jQuery `.val()`/`.trigger` bugs + missing `--line`/`--shadow` vars. |
| `public/stream.html` | 觀眾端 (viewer): bottom-center glassmorphic floating bilingual subtitle overlay, collapsible float-layer toggle, room badge, REST-poll fallback if SSE dies. **Connects to `GET /stream?room=xxx`** (SSE). Rewritten 2026-08-07 (was a corrupted binary file on disk — always `write_file` it as plain text, never let it become binary). |
| `public/index.html` | Live UI: left textarea → debounced (400ms) WS send → right textarea shows translation + engine. Auto-falls back to REST `/translate` when WS down. Theme toggle. |
| `.env.example` | `PORT`, `LIBRETRANSLATE_URL/KEY` (optional). No paid vars. |
| `package.json` | Only dep: `ws` (open-source). |

**API surface:**
- `GET /health` → `{status, version, stats}`
- `POST /translate` `{text, from, to}` → `{text, engine, cached, version}` (also broadcasts SSE)
- `POST /translate` `{text, from, targets:[...]}` → `{translations, engines}` (also broadcasts SSE)
- `POST /speak` `{text, from, to|targets[], room?, speaker?}` → `{ok, text, translations, engines, ...}` — **studio relay endpoint**: pushes already-transcribed text to SSE audience with multi-lang translations. `studio.html` calls this (NOT `/translate`) so `stream.html` receives live subtitles.
- `WS /ws` → send `{text, from, to}`, receive `{text, engine, cached, version}` (also broadcasts SSE)
- `GET /stream?room=xxx` → SSE `event: translation` stream. Room-filtered: a client subscribed with `?room=R` only receives payloads where `payload.room===R` (empty room = receive all). `stream.html` connects here.
- `GET /` → Live translation web UI · `/studio` → 收音端 · `/stream.html?room=xxx` → 觀眾端字幕浮層

## 4. PITFALL — `writeHead` then `setHeader` ⇒ `ERR_HTTP_HEADERS_SENT`
Symptom: `Cannot set headers after they are sent to the client` at `ServerResponse.setHeader`.
Cause: `res.writeHead(200,{...})` flushes headers, then `res.setHeader('X-OA-Engine', ...)` throws.
Fix: inline ALL headers into ONE `writeHead`:
```js
res.writeHead(200, {
  'content-type': 'application/json',
  'X-OA-Engine': rec.engine,
  'X-OA-Cached': String(rec.cached),
  'X-OA-Trace': hashOf(rec.text).slice(0, 16),
});
res.end(JSON.stringify(obj));
```
Never `setHeader` after `writeHead`. (Hit + fixed 2026-08-06 when adding 5T headers to both single & multi `/translate`.)

## 5. VERIFICATION
The old spawn-based harness FAILS on this git-bash host: `terminal(background=true)` → `stdin is not a tty`
kills the child `node` before it listens. Use the **in-process import** pattern instead — it ran clean here (2026-08-07).

### 5.1 In-process engine check (VALIDATED, preferred)
Copy a tiny script into `universal-translator/` (Windows ESM needs a relative `./` specifier, NOT `C:/...`):
```js
// _v.mjs  (run: node ./_v.mjs  from inside universal-translator/)
import { translateDetailed, translateToMany, stats } from './translate.mjs';
const r = await translateDetailed('Hello, world', 'en', 'zh');
console.log(r.text, r.engine);              // 你好世界 mymemory
const m = await translateToMany('Thank you', 'en', ['zh','ja','es','fr']);
console.log(JSON.stringify(m.translations));
```
Then `node --check translate.mjs && node --check server.mjs` for syntax. No server, no spawn, no tty issue.
Reusable: `scripts/verify_translate.mjs` (copy into project dir, run `node ./verify_translate.mjs`).

### 5.2 Full HTTP/WS harness (only with a real tty)
If you must hit `/health` `/translate` `/ws` over HTTP, run `node server.mjs` from a **local Windows Terminal**
(not Hermes background terminal) and `open_preview` the URL (see §5b). Don't rely on the spawn harness — it races
and dies on git-bash.

## 5b. SHOWING THE SCREEN when terminal is SSH-wedged
If the user says "我要看畫面" but the Hermes terminal/file backend is stuck on a dead SSH session
(`getsockname failed: Not a socket`), your `terminal` / `read_file` / `write_file` tools ALL fail —
even `hermes config set terminal.backend local` errors because the tool inits SSH before the command.
Note: this severe wedge (observed 2026-08-06) is worse than the basic `unset TERMINAL_SSH_*` fix; it
needs a **full Hermes restart** (close+reopen) so `terminal.backend: local` (written to
`~/.hermes/config.yaml` via a `computer_use`-driven local Windows Terminal) reloads.

Interim working channels (NOT SSH-routed):
- `open_preview` is a **Hermes-GUI tool** → use it to show the UI right now:
  - static: `open_preview url=file:///C:/Project/esggo/apps/universal-translator/public/index.html`
  - live:  `open_preview url=http://localhost:8788/` (works if a server is already running)
- `computer_use` has its own driver → can drive a local Windows Terminal to start `node server.mjs`,
  but cua-driver lacks UIAccess so global hotkeys (Win/Ctrl) and focus-swaps are unreliable; prefer
  `open_preview` for the actual "see it" step.
- **Verified 2026-08-07 (this exact path worked):** when `terminal` was SSH-wedged, `computer_use`
  clicked the embedded terminal input and foreground-typed `cd /c/Project/esggo/apps/universal-translator
  && npm install && node server.mjs &`; then `open_preview(http://localhost:8788/)` showed the **live**
  UI and `open_preview(http://localhost:8788/health)` showed the JSON health doc. In-session display is
  fine — only cross-restart persistence is lost (the embedded terminal kills children on app restart).
  So: prefer `open_preview` over trying to curl from the dead `terminal` tool.

After 2-3 SSH-wedge tool errors, STOP retrying those tools. Tell the user: "請完全關閉並重新開啟
Hermes 桌面應用程式，重啟後我就能啟動服務並秀出即時翻譯畫面。" See `esggo-deploy-push-merge` §0
for the full SSH-wedge recovery (note: that skill is user-owned; if you need to edit it, recommend
`hermes curator adopt esggo-deploy-push-merge`).

## 6. Common tasks
- **Add a language:** at request time via `from`/`to` ISO codes (MyMemory covers most pairs); no code change.
- **Self-host LibreTranslate:** set `LIBRETRANSLATE_URL` in `.env`; engine chain picks it first.
- **Edit UI:** `public/index.html` is pure static, no build step.
- **Deploy:** `bash deploy.sh` + Cloudflare Tunnel (see `esggo-deploy-push-merge` for tunnel pattern).

## 10b. Git-bash / Windows build pitfalls (2026-08-07 verified)
- **`npm install` crashes**: `Cannot read properties of null (reading 'matches')` — npm 11 + git-bash lockfile bug.
  Workaround: if `node_modules/ws` already present (only dep), skip install; or `npm install --no-package-lock`.
- **Windows ESM import**: absolute `C:/x/translate.mjs` fails `ERR_UNSUPPORTED_ESM_URL_SCHEME`. Use `./translate.mjs`
  (run from project dir) or `file:///C:/x/translate.mjs`.
- **CrewAI key 402**: `sk-or-...` CrewAI keys hit OpenRouter `/api/v1/chat/completions`. Returns `402 Insufficient
  credits` when balance is 0 — engine throws, `translate.mjs` gracefully falls back to MyMemory (verified, service
  never breaks). Don't treat a 402 as a code bug; the free path still covers translation.
- **`search_files` regex**: chars like `(` `.` in a pattern break ripgrep parse. Use plain substrings or escape them.
- **`studio.html` JS bugs (fixed)**: `$('#lang').val()` / `.trigger('change')` are jQuery-only (this file has no
  jQuery) → use `.value=`. `recog.onend(...)` is a call, not assignment → use `recog.onend = () => {...}`.

## 7. Language Cycle Swap (中↔英↔日↔西↔法)
**需求**：單擊按鈕即可在 `zh-TW` → `en` → `ja` → `es` → `fr` → `zh-TW` 循環切換。
**實作**（studio.html — plain DOM, NO jQuery）：
```html
<select id="lang">...</select>
<button id="swapLang" title="語言循環切換">🔄</button>
<script>
const LANGUAGES = ['zh-TW','en','ja','es','fr'];
const $ = s => document.querySelector(s);
let recog = null;
function swapLang() {
  const curr = $('#lang').value;
  const idx = LANGUAGES.findIndex(l => l === curr);
  const next = LANGUAGES[(idx+1) % LANGUAGES.length];
  $('#lang').value = next;
  if (recog) recog.lang = next;   // 同步 Web Speech 辨識語言
}
document.querySelector('.badge').onclick = swapLang;
</script>
```
**API 端**：`POST /translate` 同步 `targets: LANGUAGES` → 多語全同步回傳。
> ⚠️ 此檔無 jQuery，`$('#lang').val()` / `.trigger('change')` 會報錯。一律用 `.value=` + 手動同步 `recog.lang`。

## 8. Auto Speech Recognition (自動辨識)
**需求**：打開頁面即自動開始辨識，無需點擊「開始」按鈕。
**實作**（studio.html — plain DOM, 修正版）：
```html
<script>
let recog = null, listening = false;
const LANGUAGES = ['zh-TW','en','ja','es','fr'];
function autoStart() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { $('#status').textContent = '請用 Chrome/Edge 瀏覽器'; return; }
  recog = new SR();
  recog.lang = $('#lang').value;
  recog.continuous = true;
  recog.interimResults = true;
  recog.onresult = e => {
    for (let i=e.resultIndex; i<e.results.length; i++)
      if (e.results[i].isFinal) append(e.results[i][0].transcript.trim());
  };
  recog.onstart = () => { listening = true; $('#status').textContent = '辨識中… ' + LANGUAGES.join('|'); };
  recog.onerror = e => { if (e.error === 'not-allowed') $('#status').textContent = '請授權麥克風權限'; };
  recog.onend = () => { if (listening) setTimeout(() => { try { recog.start(); } catch(_) {} }, 100); }; // 自動重啟
  try { recog.start(); } catch(e) { $('#status').textContent = e.message; }
}
window.onload = autoStart;
</script>
```
> ⚠️ `recog.onend(...)` 是「呼叫」不是「賦值」；必須寫成 `recog.onend = () => {...}`。錯誤寫法會導致辨識結束後不自動重啟。也勿用 `$('#lang').val()`（無 jQuery，改用 `.value`）。

## 9. Free-Layout RWD + No-OCclusion (免遮擾 RWD 版)
**需求**：會議/直播中，字幕不遮擾畫面，支援螢幕旋轉。
**實作**：
1. **自適應字體**：CSS `clamp(0.8rem, 1.6vw, 0.95rem)` 
2. **浮動字幕**：`position:fixed; bottom: 24px; right: 24px;`
3. **半透明背板**：`background: rgba(20,27,41,0.92); backdrop-filter: blur(8px);`
4. **手機適配**：`@media (max-width:480px)` → 左下角
5. **SSE 端**（stream.html）：
```html
<div id="subtitleBox" class="subtitle-box">等待播放中…</div>
<script>
  const es = new EventSource('/stream?src='+src+'&room='+room);
  es.addEventListener('translation', e => {
    const d = JSON.parse(e.data);
    document.getElementById('subtitleBox').innerHTML = 
      (d.translations ? Object.entries(d.translations).map(([c,t])=>`<b>${c}:</b> ${t}`).join('<br>') : d.text);
  });
</script>
```
**目標**：觀眾 `stream.html` → 右下角懸浮字幕，會議中不遮擾畫面。

## 11. VERIFY external ML/CDN deps with `curl` BEFORE trusting them (2026-08-07 lesson)
When a frontend page depends on a remote model/CDN (transformers.js, Whisper, any HF model),
**verify reachability with `curl` first** — a 404 in the model path fails silently in-browser (the user
clicks the button, nothing happens, very hard to debug). Verified recipe:

```bash
# CDN package present?
curl -sI --max-time 20 "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0" | head -1   # → 200 OK
# HF model weights present? (302 = redirect to CDN = exists; 404 = dead path)
curl -sI --max-time 25 "https://huggingface.co/onnx-community/whisper-tiny/resolve/main/onnx/encoder_model_quantized.onnx" | head -1
# follow redirect to confirm real 200 + size:
curl -sIL --max-time 30 "https://huggingface.co/onnx-community/whisper-tiny/resolve/main/onnx/encoder_model_quantized.onnx" | grep -iE "HTTP/|content-length"
```

Gotchas learned:
- `Xenova/*` + `@xenova/transformers@2.x` is DEAD (all `.onnx` paths 404). Use `@huggingface/transformers@3.x` + `onnx-community/*` instead.
- `onnx-community/*` stores weights under an `onnx/` subdir (not repo root).
- `302 Found` from HF `resolve/main/...` is a normal redirect — follow with `-L` to confirm `200` + `content-length`; only `404` means the path is wrong.
- jsDelivr CDN returning `200` does NOT mean the model it points to exists — check the model path separately.
- headless browser CANNOT validate the in-browser WASM load (times out / no audio HW). `curl` is the reliable pre-check; the actual UI run is the user's local job.

### 11.1 Headless `browser_navigate` times out on SSE-long-connection pages
`stream.html` opens a permanent `EventSource` (SSE) — the connection never ends, so the headless browser
treats navigation as "still loading" and `browser_navigate` throws `Operation timed out`. This is NOT a page
bug; it's the test harness. Workarounds that worked this session:
- Verify the **backend** via VPS-localhost node (ref §1 recipe) — confirms the SSE broadcast + payload shape.
- Verify the **frontend code** with `node --check` on the extracted `<script>` (no `test`/`lint`/`typecheck` in
  `package.json`; only `start`/`health` exist, so `--check` is the sole automated gate).
- Verify **visuals** by asking the user to open `https://translate.esggo.co/stream.html` locally — the agent cannot.
- Do NOT repeat `browser_navigate` to `stream.html` expecting a snapshot; it will keep timing out.
- `browser_console` top-level `return` throws `Illegal return statement` — use an expression statement instead
  (e.g. wrap in `({...})` or just end with the value).

### 10.1 靜態路由必須涵蓋所有 public/*.html
`server.mjs` 原本只把 `/` → `index.html`；`/studio.html` `/stream.html` `/broadcaster.html`
`/receiver.html` 在外部全部回 **404**（檔案確實在 `public/`）。這是實際部署事故：
`curl https://translate.esggo.co/studio.html` → 404，但 `/` 是 200。
修法：顯式路由每個 `public/<name>.html`（或對 `fs.existsSync(PUBLIC_DIR + urlPath)` 成立的
`*.html` 直接服務）。驗證用 `scripts/verify_routes.mjs`（檢 `/` `/studio.html` `/stream.html`
`/broadcaster.html` `/receiver.html` `/health` + POST /translate）。

### 10.2 未定義的 CSS 變數會靜默消失
`studio.html` / `stream.html` 舊版引用了 `var(--line)` 與 `var(--shadow)`，但 `:root` 裡**從未宣告**
→ 邊框/陰影完全不可見。任何用到的 CSS 變數都必須在 `:root` 宣告（含
`html[data-theme="light"]` 覆寫層）。本次重寫已補齊 `--line` / `--shadow` / `--radius` / `--gap`。

### 10.3 VPS 磁碟 100% 會擋住 scp 部署
症狀：`bash deploy.sh` 步驟 2 的 `scp` 報 `write remote ... Failure`，`df -h /` 顯示 `Use% 100%`
（本次是 16 個 docker image 層，總計 ~18GB）。已驗證恢復流程：
1. `docker images -q | wc -l` 看數量；`docker ps -a --filter ancestor=<image_id> --format '{{.Names}}'`
   空白=無 container 依賴、可刪。
2. **背景**執行 `ssh ... "docker rmi <unused_id>"`（滿碟 I/O 慢，前景 `terminal` 會逾時；
   用 `terminal(background=true)` + `process(wait)`）。一次回收 1.6GB 即足。
3. 重跑 `bash deploy.sh`，scp 通過。
絕不刪除有 running/exited container 的 image（會讓線上服務起不來）。

### 10.4 推送前先確認遠端是否已含你的改動（並行 agent 競態）
`DingJun1028/esggo` 常有多個 agent 同時寫入。本機 commit 後 `git push` 若回 `Everything up-to-date`，
不代表推送成功——可能是**別的 agent 已經把你相同的內容推上去了**（不同 commit hash，例如本會話的
`8c808a8de` 已含我的 IUX 改動，我的 `1dbdba6e9` 變成重複孤兒 commit）。
正確確認流程：
1. `git show origin/main:<file> | grep '<你加的標記字串>'` —— 若命中，遠端已含，無需推。
2. 若本機有重複 commit：用 `git reset --soft origin/main` 把 `main` 指回遠端（**保留 working tree 髒檔**，
   不要用 `reset --hard`），重複 commit 自然變 dangling，不污染歷史。
3. 只有當 `origin/main` 確實**不含**你的改動時才 `git push`（首次推設 `--set-upstream origin main`）。
切勿 blanket `git add .` 推送——工作樹常混有別 agent 的未提交修改（pnpm-lock、src/ 等），只 `git add` 你碰過的檔。

Condensed paid-vs-free decision note: `references/akkadu-vs-free.md`.
Reusable in-process verification: `scripts/verify_translate.mjs` (engine check) · `scripts/verify_routes.mjs` (all static routes + POST /translate) · `scripts/verify_quality.mjs` (postProcess + multi-target + cache-hit, §14).
Do NOT use `scripts/verify_server.mjs` — the spawn-based harness dies on git-bash (`stdin is not a tty`).

## 12. Real-time SUBTITLE product features (2026-08-07 — Akkadu-inspired, FREE)
User goal (verbatim intent): 語音（真人現場麥克風 或 電腦播放聲音）→ 即時轉文字稿 → 多語翻譯 → **像影片字幕那樣精確呈現**.
Three features shipped `e7bbdf904`, all FREE:
1. **Glossary** (studio.html): 📖 詞彙表 textarea, `原文=譯文` per line, frontend `applyGlossary()` post-translation.
2. **QR distribution** (studio.html): 🔳 產生觀眾端 QR → `stream.html?src=studio&room=xxx`; CDN `qrcodejs` with raw-URL fallback.
3. **Rolling caption** (stream.html): keep last 6 caps, `.cap.fresh` highlight + `.cap.old` fade.
4. **Dual-language translucent popup overlay** (`3075f28c3`): user ask "彈出式半透明字幕 + 繁中英文一次雙語同屏".
   Bottom-center glassmorphic layer (`background:rgba(8,12,20,.55)` + `backdrop-filter:blur`), each caption shows
   `.zh` (white, large) + `.en` (accent, smaller) together. Only takes `zh-TW` + `en` from the SSE payload
   (studio already sends all 5 langs via `targets:LANGUAGES`; viewer selects 2). Code in `references/sse-subtitle-features.md` §2b.
Full code + the SSE-broadcast fix: `references/sse-subtitle-features.md`.
**CRITICAL SSE bug fixed same session** (see ref §1): `/stream` was being served as the HTML page by the
static-route block, so audience never got subtitles. Fix: handle SSE inside the main callback BEFORE the
static block and `return`. Verify via VPS-localhost SSE test (ref §1) — outside direct-connect to `:8788`
is firewall-blocked; use `https://translate.esggo.co` in browser or `127.0.0.1:8788` from the VPS.

## 13. Feature-research pattern: "研究分析 X 如何做到"
When the user asks to study how a product (e.g. Akkadu.ai) achieves something, Firecrawl/web_extract
may be rate-limited (Payment Required). Do NOT fabricate. Instead: (a) state the block honestly, then
(b) produce the comparison from **public-domain knowledge** clearly labeled as such, and (c) map their
approach onto our FREE equivalent and list what we can borrow. The user accepted this and had us
implement the borrowable parts (§12). The written comparison goes in `ESGGO萬能系統-善向永續.md` (§15.9).

## 14. Quality-boost round (2026-08-07, `c3173c6a0`) — capture the working moves AND the dead end
User ask: "大幅提升產品品質：擷取文字加速、翻譯品質、精準度提升". Executed under the standing FREE-only rule.

### 14.1 What worked (reusable)
- **A — capture speed/accuracy (studio.html, 電腦聲音 mode):**
  - Whisper `onnx-community/whisper-tiny` → **`onnx-community/whisper-base`** (q8). ~2–3× accuracy, still runs locally free. Load note: base is ~70–90MB vs tiny ~30MB.
  - Segment interval `4000ms` → **`2000ms`** (text appears ~2× faster). Raise the "too short" skip from `8000` → `4000` samples so 2s chunks still submit.
  - ASR options that cut hallucination: `condition_on_previous_text:false` (no cross-segment drift), `no_speech_threshold:0.6` (drop non-speech), `temperature:0.0` (greedy, stable).
- **C — precision (translate.mjs):** added `postProcess()` applied to every MyMemory result:
  - strip `*` and `[...]` garbage, collapse `/\s{2,}/`, add space after CJK punctuation before Latin (`([，。！？；、])([a-zA-Z0-9])` → `$1 $2`), then force `GLOSSARY` term replacement.
  - `GLOSSARY` env = `"k=v|k2=v2"` (pipe-separated; `parseGlossaryEnv()` at module load). `applyGlossary()` does global `split(k).join(v)` (cross-language consistent terms).
  - `viaMyMemory` now appends `&de=${MYMEMORY_EMAIL}` when `MYMEMORY_EMAIL` is set — MyMemory's official free quota/quality boost (still zero-key).
- Verify with the in-process harness (§5.1): `node --input-type=module -e 'import {translateDetailed} from "./translate.mjs"; ...'` confirmed `The meeting starts now → 會議現在開始`, multi-target, and cache hit.

### 14.2 What FAILED — do NOT retry blindly (honest record)
- **B — self-hosted LibreTranslate for better fluency:** attempted on VPS `161.118.248.180` (disk had 145G free, 3.2G RAM free — resources were fine).
  - `docker run libretranslate/libretranslate:latest` → worker crashes with `IndexError: list index out of range` at boot; then on retry the container `Up` + port `127.0.0.1:5000` listens but every HTTP request returns `curl: (52) Empty reply` / `(56) Connection reset`.
  - Root cause: **model download (HuggingFace pull) is blocked/slow on this VPS** — gunicorn boots but workers never finish loading, so it accepts connections then resets. `LT_LOAD_ONLY` vs default both failed identically.
  - Public LibreTranslate instances (`translate.argosopentech.com`, `libretranslate.de`, `translate.fortytwo-network.io`) all return `000` (unreachable) from the VPS.
  - **Conclusion:** LibreTranslate self-host is NOT viable in this environment. The free-quality ceiling is MyMemory + `postProcess`. If the user later allows self-hosted models / extra compute, re-attempt — but do NOT burn a session re-discovering this; check HF reachability first with `curl -sI --max-time 15 https://huggingface.co` before pulling the image.
- Practical note: `docker rm -f libretranslate` then removed the compose dir afterward to free the port. VPS `:8788` (universal-translator) was untouched and kept serving.

### 14.3 Decision record
The user did not answer a scope picker in time; I proceeded with the maximal FREE scope (A+B+C) and substituted B with the MyMemory-email + postProcess approach when LibreTranslate failed. Documented in `ESGGO萬能系統-善向永續.md` §15.9.1.

### 14.4 MyMemory `auto` source language is INVALID — do NOT use it
**New pitfall (2026-08-07, this round):** I tried to improve precision via auto source-language detection and set `from:'auto'` in `studio.html` (`fetch` body) and `viaMyMemory` (`langpair=auto|zh-TW`). Both failed:
- Raw API: `{"responseData":{"translatedText":"'AUTO' IS AN INVALID SOURCE LANGUAGE . EXAMPLE: LANGPAIR=EN|IT ..."}}` → `responseStatus != 200` → engine throws → falls through to `fallback-origin` (returns the ORIGINAL untranslated text). Worse than passing the real language.
- Reverted to passing `$('#lang').value` (the concrete ISO code the mic/Whisper already knows).
**Lesson:** MyMemory needs an explicit 2-letter/RFC3066 source code (`en`, `zh-TW`, `ja`...). There is no auto-detect. Source language MUST come from the capture layer (Web Speech `recog.lang` / Whisper `language` param), never guessed as `auto`. Keep `translate.mjs`'s `viaMyMemory` as `${from}|${to}` with a concrete `from`.

### 14.5 Wiring env vars without dotenv (zero-dependency `.env` loader)
`MYMEMORY_EMAIL`, `GLOSSARY`, `LIBRETRANSLATE_URL`, `TRANSLATE_TIMEOUT_MS` only take effect if `server.mjs` reads them. The repo's `package.json` has only `ws` — **no dotenv**. Add this at the top of `server.mjs` (after imports, before `PORT`/`APP_VERSION`):
```js
// 讀取 .env（零依賴實作，優先於 process.env 已存在值）
try {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
      const i = line.indexOf('=');
      if (i > 0) { const k = line.slice(0, i).trim(), v = line.slice(i + 1).trim(); if (k && process.env[k] === undefined) process.env[k] = v; }
    }
  }
} catch { /* 忽略 .env 讀取錯誤，維持預設 */ }
```
Then on the VPS: `cd /opt/esggo/apps/universal-translator && printf 'MYMEMORY_EMAIL=esggo.translate@esggo.co\nTRANSLATE_TIMEOUT_MS=8000\n' > .env`, `pm2 restart universal-translator --update-env`. Verify with a live `curl -X POST .../translate` — `engine:"mymemory"` + correct text confirms the email path is live (quota/quality boost, still zero-key).
> Note: `process.env[k] === undefined` guard means a shell-exported var wins over `.env` — safe for CI overrides.
> Do NOT add `dotenv` to `package.json` — keep the dependency surface at just `ws`.

### 14.6 Google-gtx PRIMARY engine + real-time relay fix (2026-08-07, v1.3.0)
**Symptom reported by user:** "加強萬能即時翻譯". Investigation found two real defects breaking the voice scenario:
1. **`zh-TW→en` returned garbage** (`A/n/@/o/O/@//`) and **`auto→zh-TW` returned the original untranslated** (fell to `fallback-origin`). Root cause: MyMemory crowd layer is noisy for some phrases AND the shared host IP is rate-limited into the noise tier. Verified with raw `curl`: `langpair=zh-TW|en` → untranslated; `langpair=zh-CN|en` → correct; the SAME phrase via Google gtx → correct.
2. **studio→stream relay was dead**: `server.mjs`'s `/translate` handler returned JSON but did NOT broadcast SSE, and only the WS handler broadcast — but `studio.html` used REST `/translate`, so `stream.html` (SSE) never got subtitles.

**Fixes applied & verified:**
- Added `viaGoogleGtx()` as engine 0 (free, zero-key, `client=gtx`, supports `auto`+`zh-TW`). It receives the RAW `from`/`to` (Google native), while Libre/MyMemory go through `normalizeLang()`.
- Added `doTranslateAndBroadcast()` shared by `/translate`, `/speak`, `/ws` — all three now `broadcastTranslation()` to SSE clients.
- Added `POST /speak` (studio relay: already-transcribed text → SSE audience with multi-lang). `studio.html` now POSTs `/speak` with `room`.
- SSE `/stream` parses `?room=`; `broadcastTranslation` skips clients whose `room` ≠ `payload.room` (empty room = receive all).

**gtx endpoint (reusable):**
```
https://translate.googleapis.com/translate_a/single?client=gtx&sl=<src>&tl=<tgt>&dt=t&q=<urlencoded text>
# parse: (json[0]||[]).map(x=>x[0]).join('')   // dt=t returns array of [seg,translit,...]
```
`sl=auto` works (Google detects); `sl=zh-TW` works (no normalize needed). Zero key, zero cost —符合「只用免費」硬約束. TOS is grey-area (unofficial endpoint) but no paid/private creds.

### 14.7 VERIFICATION that actually worked this session (override §5 — Python subprocess, NOT Hermes background)
**Critical:** `terminal(background=true)` AND the `&`/nohup/disown wrappers ALL fail to keep `node server.mjs` alive on this git-bash host — the child dies with `stdin is not a tty` / SIGHUP, every server process shows `exit_code:1` and never binds `:8788`. The in-process `node ./_v.mjs` import (§5.1) tests the ENGINE but NOT the HTTP/SSE/relay wiring. To verify the FULL chain (health + translate + /speak→SSE), use **`execute_code` with `subprocess.Popen`** — Python's Popen keeps node alive across the test window:

```python
import subprocess, time, json, urllib.request, os, threading
os.chdir(r"C:\Project\esggo\apps\universal-translator")
env = dict(os.environ, PORT="8788")
proc = subprocess.Popen(["node","server.mjs"], env=env,
                        stdout=open(r"C:\Users\dingj\ut_run.log","w"), stderr=subprocess.STDOUT)
time.sleep(3)
# POST /translate
body=json.dumps({"text":"你好世界這是一個測試","from":"zh-TW","to":"en"}).encode()
req=urllib.request.Request("http://localhost:8788/translate",data=body,headers={"Content-Type":"application/json"})
print(json.loads(urllib.request.urlopen(req,timeout=15).read()))   # -> hello world this is a test / google-gtx
# SSE relay: listen in a thread, then POST /speak
received=[]
def listen():
    import http.client
    c=http.client.HTTPConnection("localhost",8788,timeout=10); c.request("GET","/stream?room=testroom")
    r=c.getresponse(); buf=b""
    for _ in range(40):
        line=r.fp.readline()
        if line.startswith(b"data:"):
            try: received.append(json.loads(line[5:].strip()))
            except: pass
t=threading.Thread(target=listen,daemon=True); t.start(); time.sleep(1)
urllib.request.urlopen(urllib.request.Request("http://localhost:8788/speak",
    data=json.dumps({"text":"歡迎參會","from":"zh-TW","targets":["zh-TW","en","ja"],"room":"testroom"}).encode(),
    headers={"Content-Type":"application/json"}),timeout=15).read()
time.sleep(2); print("SSE received:",len(received))   # -> 1 (room-matched)
proc.terminate(); proc.wait(timeout=5)
```
This recipe was the ONLY one that produced real end-to-end evidence this session (engine + relay + room filter all green). Save it as `scripts/verify_full_chain.py` for reuse.

**Also learned:** a STALE node process (pid 37476) from an earlier session was squatting on `:8788`, so repeated `curl` hit the OLD engine and looked like the fix "didn't work". Before testing, free the port: `netstat -ano | grep 8788 | grep LISTEN` → `C:\Windows\System32\taskkill.exe /PID <pid> /F` (git-bash `kill`/`pkill` do NOT affect Windows PIDs). Always confirm no listener before starting a fresh server.

## 15. OmniLive Beautiful Edition Overlay (v2.0 — 2026-08-25)

A previously-praised glassmorphism overlay UI was deployed to both `apps/omnilive/public/overlay.html` and `apps/universal-translator/public/overlay.html`. Accessible at:

```
https://live.esggo.co/overlay.html
https://translate.esggo.co/overlay.html
```

**Design**: 1:1 pixel-perfect glassmorphism with deep stone-ink glass capsule background, breathing red LED status badge, dual bilingual text layer (white bold English + warm gold Traditional Chinese), QR code sharing, diagnostic panel, and keyboard shortcuts (Space=record, B=subtitles, T=toolbar, D=diagnostics).
**Verification**: `curl -sf https://live.esggo.co/overlay.html` returns the Beautiful Edition HTML.
**Full design tokens + brand guidelines**: see `references/omnilive-beautiful-edition.md`.

