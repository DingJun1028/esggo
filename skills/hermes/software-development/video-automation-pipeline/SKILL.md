---
name: video-automation-pipeline
description: Build provider-pluggable, automated video production pipelines (script -> TTS -> visuals -> ffmpeg render -> publish) for YouTube / Shorts / content factories. Covers the FastAPI control-center layout (7-module IDEA.md mapper), always-produce-a-video fallback, Windows ffmpeg ken-burns pitfalls, n8n/Docker/Remotion/GitHub Actions integration, and wrapping the pipeline as an MCP server for agent invocation.
version: 1.0.0
author: Hermes Agent
license: MIT
---

# Video Automation Pipeline

## When to use
- User wants an end-to-end "generate a video from a script" system.
- YouTube / Shorts bulk production, content factories, n8n/orchestration-driven rendering.
- Wrapping a media pipeline as an MCP tool so an agent (Hermes, Claude Desktop, etc.) can trigger it.
- The user hands you a "full automatic video production line" architecture (LLM brain + TTS + visuals + render + storage + logging) and wants it built as runnable code.

## Architecture pattern: provider-pluggable layers
Map each stage to an adapter interface with a LOCAL/FREE default and a CLOUD swap:

| Layer | Local/free default | Cloud swap |
| --- | --- | --- |
| 1. Orchestration | Python asyncio runner + n8n webhook stub | n8n Docker |
| 2. LLM (script→scenes) | local rule-based splitter | OpenAI GPT-4o |
| 3. TTS | Edge TTS (free, real zh-TW voice) | ElevenLabs |
| 4. Visuals | Pillow generated branded bg | Runway / Midjourney proxy |
| 5. Render | ffmpeg (H.264/AAC) | Remotion (node) |
| 6. Storage | local workspace dir | AWS S3 |
| 7. Logging DB | local JSONL ("5T" audit) | NCBDB |

Keep a central `config` with `X_provider` switches + `.env`. **Default everything
to free so the pipeline runs with zero API keys**; flip a provider by setting one
env var. This lets you deliver a working MVP immediately and switch to paid
services later by pasting keys.

## FastAPI control-center realization (proven runnable layout)
A concrete, working MVP that maps IDEA.md's 7 modules to files. Built and
verified this session (edge-tts produced real zh-TW speech; final MP4 had
video+audio streams via ffprobe):

- `src/config.py` — central `X_provider` switches + `.env` load.
  `feature_summary()` reports which layer is live (free vs cloud) so the UI shows it.
- `src/db.py` — module 7: SQLite jobs table (uuid/status/progress/payload/result)
  + optional NCBDB mirror over HTTP (best-effort, never breaks the pipeline).
- `src/parser.py` — module 2: free rule-based sentence splitter → shots
  (index/narration/visual_prompt/caption/theme); optional OpenAI swap.
- `src/tts.py` — module 3: edge-tts default; ElevenLabs swap; **silent-audio
  fallback** so a real MP4 is always produced if the TTS endpoint is unreachable.
  **Return `(path, boundaries, silent)`** where `boundaries` are word-level
  timings captured via `edge_tts.Communicate(..., boundary="WordBoundary")`
  (default is SentenceBoundary → no word data). See
  `references/edge-tts-word-synced-captions.md`.
- `src/visuals.py` — module 4: Pillow gradient + progress pill; Runway swap.
  `render_shot_media(shot, idx, total, png_path, mp4_path)` returns
  `(media_path, is_video)` — gradient still by default, Runway B-roll clip when
  `RUNWAY_API_KEY` is set (see `references/runway-broll-async.md`). The renderer
  branches on `is_video`: stills get ken-burns, Runway clips get trim+pad+fade
  then the same synced `drawtext` captions.
- `src/renderer.py` — module 5: per-shot ffmpeg ken-burns (zoompan+trim+fade)
  paired to audio duration, then `concat` filter into one MP4. This is also
  where **synced captions** are burned: append a `drawtext` chain built from
  the TTS word boundaries (see `references/edge-tts-word-synced-captions.md`).
  Do NOT also draw a static caption on the background frame — pick the burned
  synced subtitle and keep the frame clean (a progress pill is fine). See
  `references/ffmpeg-ken-burns-render.md` for the exact ken-burns filter.
- `src/storage.py` — module 6: local `./storage` default; S3 swap (upload + return URL).
- `src/pipeline.py` — module 1: `enqueue(script,title)` runs parse→TTS→visuals→
  render→publish synchronously and writes job state at each stage.
- `src/app.py` — FastAPI hub: `POST /api/jobs` (enqueue), `GET /api/jobs`,
  `GET /api/jobs/{id}`, `GET /api/jobs/{id}/video`, `GET /api/health`,
  static dashboard at `/`.
- `web/index.html` — dark control-center dashboard (submit script, live job
  monitor, inline `<video>` player).
- `run.py` — `uvicorn src.app:app`.

**Resilience pattern (always produce a video):** every network-dependent stage
has a free fallback; TTS falls back to a `ffmpeg anullsrc` silent track sized to
`len(text)/8` sec. This guarantees the render step never dies on a missing audio file.

**Synchronous `enqueue` inside the POST handler is fine** for this size — running
the pipeline inside the request worked because the uvicorn/async context lets
edge-tts stream correctly (see `python-pipeline-runtime` §1). For long queues,
offload to a `BackgroundTasks`/worker.

## Windows / ffmpeg pitfalls (critical — see references/ffmpeg-windows-pitfalls.md)
- `ass=` / `drawtext=` filters treat `:` as an option separator, so `C:/...`
  font/image paths break parsing. Use a **bare filename + `cwd=`** to the asset dir.
- ASS colour format is `&HAABBGGRR` (alpha,B,G,R); the ffmpeg `color=c=` filter
  wants `0xRRGGBB`. Mixing them up ⇒ "Cannot find color".
- concat demuxer **drops audio** if segments have mismatched stream counts —
  give generated intro/outro a silent `aac` track (`anullsrc`) before concat.
- ffmpeg cannot edit in-place (input == output path). Render to a temp file, then
  `tmp.replace(out)` (NOTE: `a.replace(b)` renames **a → b**, the easy-to-swamp direction).
- `amix` with `duration=first` cleanly muxes voice + looped bg music.
- Prefer **ASS subtitles** over `drawtext` for complex CJK styling (outline,
  multi-line positioning). BUT plain karaoke captions are simpler with
  `drawtext` driven by edge-tts **WordBoundary** timings — no `.ass` file
  needed (see `references/edge-tts-word-synced-captions.md`). Either way the
  `C:/...` font path colon must be escaped as `C\:/...` inside the filter.

## Integration patterns
- **n8n**: `docker-compose.yml` with `extra_hosts: host.docker.internal:host-gateway`;
  n8n Webhook(POST /render) → HTTP Request → `http://host.docker.internal:8080`.
  Keep the Python pipeline OUTSIDE the container as the webhook server.
  **Dedicated webhook endpoint pattern (built this session):** add a compact
  `POST /webhook/n8n` route that accepts `{title, script}` (or a `text` alias)
  and returns a small, n8n-friendly JSON shape — `{job_id, status, title,
  video_url, shots, error}` — instead of the full job record. n8n's HTTP Request
  node can then drop it straight into a Schedule Trigger → HTTP Request → IF →
  notify chain without field-mapping pain. A ready `n8n/workflow.json` lives in
  the repo: Schedule Trigger (cron, daily 09:00) → HTTP Request (POST the
  webhook) → IF on `status` → Discord/Slack/Telegram notify on success or alert
  on failure. Import via Workflows → Import from File; point the HTTP Request URL
  at `http://<AI_STATION_HOST>:8000/webhook/n8n`. For a self-hosted VPS, run AI
  Station in Docker and have n8n call that container — matches IDEA.md "n8n on VPS".
  **PITFALL:** the webhook handler used `json.loads(...)` — make sure `import json`
  is present at the top of `app.py`. A missing import compiles fine but raises
  `NameError: name 'json' is not defined` at request time; an ad-hoc
  `TestClient` POST catches it instantly (see Verification tip below).
- **GitHub Actions**: `setup-python` + `apt-get install ffmpeg fonts-noto-cjk`;
 map repo Secrets → env; output via `upload-artifact`. Push secrets with
 `gh secret set NAME -b VALUE` (the `-b` flag, not `--body-file -`).
 CI hardening (learned the hard way): the workflow step `pip install -r
 requirements.txt` **fails the whole run if that file is missing** — commit a
 real `requirements.txt` (pipeline deps + `fastapi`/`python-multipart`/`uvicorn[standard]`
 for the web UI). Add an early **import health-check** step so a broken
 import fails fast *before* the slow render:
 `python -c "import sys; sys.path.insert(0,'.'); import src.pipeline; print('imports OK')"`.
 Before pushing, grep the workflow for every file it references
 (`requirements.txt`, `examples/*.txt`) and confirm each exists in the repo.
 **The `secrets` context is ILLEGAL inside `with:` and `if:` at job-step
 scope is fine but `with:` is not** — a `docker/build-push-action` step that
 reads `secrets.DOCKERHUB_USERNAME` inside `with:` fails validation with
 "Unrecognized named-value: 'secrets'". Fix: map it to a **job-level `env:`**
 (`env: { DOCKERHUB_USERNAME: ${{ secrets.DOCKERHUB_USERNAME }} }`) and
 reference `${{ env.DOCKERHUB_USERNAME }}` in both `if:` and `with:`.
- **`gh repo create` gotchas**: `--main` is NOT a valid flag (use current
 branch; CI defaults to it). `--description` AFTER a positional flag can be
 misparsed — set description with `gh repo edit OWNER/REPO --description "..."`
 (NOT just `REPO` — the edit command needs `[HOST/]OWNER/REPO` format or it
 errors "expected the [HOST/]OWNER/REPO format"). `gh workflow run build.yml`
 triggers a dispatch; watch with `gh run watch <run-id>` (needs the id, not
 just the URL).
- **Remotion**: keep as an *alternative* render layer (RENDER_ENGINE=remotion);
  Python still muxes TTS + music with ffmpeg (best of both worlds).
  Windows gotchas (see `references/remotion-windows.md`): `npm install
  typescript@5.4.0` is an ETARGET (use `^5.4.0`); first `npx remotion render`
  needs `@rspack/binding-win32-x64-msvc` (`npm i` it) + auto-downloads ~113 MB
  Chrome Headless Shell; `<Img src="file://...">` is REJECTED by Chrome, so copy
  scene PNGs into `remotion/public/scenes/` and wrap with `staticFile()`; pin
  `remotion`/`@remotion/cli` to an EXACT patched version (e.g. `4.0.499`) to clear
  Dependabot critical (RCE / arbitrary file write) alerts — a `^4.0.0` caret range
  leaves the alert stuck even when safe.

## Edge TTS under a background process
DANGER: when the Python pipeline is invoked from a **threaded `http.server`
(`BaseHTTPRequestHandler`) launched as a Hermes background process**, Edge TTS
writes a **0-byte empty `scene_01.mp3`** (ffmpeg then fails "Failed to find two
consecutive MPEG audio frames"). The SAME pipeline runs fine when: launched
in-process under **uvicorn/FastAPI** (async), or run from a foreground terminal
(`python -c asyncio.run(...)` / `python scripts/run_pipeline_cli.py`).
Workaround that shipped: drive the pipeline through the **FastAPI `/api/render`
endpoint (uvicorn)** — n8n's HTTP Request node calls that, not the http.server
webhook. The `scripts/webhook_trigger.py serve` http.server stays only as an
offline fallback (its UTF-8 stdin decode must use `.decode("utf-8")` or Chinese
scripts raise UnicodeDecodeError). The isolated `scripts/run_pipeline_cli.py`
subprocess trick did NOT fix the empty-mp3 (root cause is the http.server
thread/loop context, not stdout capture).

## n8n trigger-chain verification (no Docker needed)
Docker daemon was down and `npx n8n` hit network ECONNRESET, so the n8n *app*
could not be installed. Verify the trigger chain by emulating n8n's HTTP Request
node against the already-running FastAPI server:
```bash
python -m uvicorn web.app:app --host 127.0.0.1 --port 8088
TOKEN=$(python -c "...")  # read generated APP_TOKEN from server stdout
curl -H "Authorization: Bearer $TOKEN" -X POST http://127.0.0.1:8088/api/render \
  --form "script=分鏡一。||分鏡二。" --form "title=t" --form "aspect=16:9"
```
Point `n8n/workflow.json`'s HTTP Request node at
`http://host.docker.internal:8088/api/render` with an `Authorization: Bearer
{{ $env.APP_TOKEN }}` header.

## "最佳實踐" security intent
When the user says "最佳實踐" after a Dependabot critical alert surfaces, they
mean: *actually remediate* (upgrade/pin to the patched version, confirm `npm
audit` = 0 vulns, commit+push so GitHub re-scans) — do NOT dismiss the alert.
Check the real state first: `gh api repos/<me>/<repo>/dependabot/alerts --jq
'.[] | select(.security_advisory.severity=="critical") | {state, title}'`.

## GitHub push that actually works (HTTPS + gh token)
SSH was unconfigured; `git -c http.extraheader="Authorization: Bearer $(gh auth
token)" push` gave `invalid credentials` (git basic auth rejects the OAuth
`Bearer`). Working method: `gh auth setup-git` once, then plain `git push origin
main` uses the gh credential helper. (Earlier `x-access-token:` basic-auth push
worked but left a token in `git config` if the remote wasn't reset — prefer
`gh auth setup-git`.)
- **Secret wiring**: keep a `scripts/set_secrets.py` that writes the same values to BOTH local `.env` (gitignored) and GitHub repo Secrets via `gh secret set NAME -b VALUE`. Add a `delete` subcommand that scrubs BOTH ends — and use `gh api -X DELETE` for the GitHub side, because `gh secret delete -y` does not exist and silently no-ops (see `github-secrets` skill). Run a placeholder pre-flight (fake key set → verify → delete) to prove the path live without ever touching a real key. When a user authorizes you as "secret manager" and says "自行查看", `gh secret list` is write-only + the repo may simply have no secrets, so state plainly there is nothing to read and ask them to paste values.
- **MCP**: wrap `run_pipeline` as a stdio MCP server. Register via a **`.bat`
  launcher** (see `hermes-mcp-management` skill — Windows has command/args
  list gotchas that the `.bat` pattern avoids).
- **GitHub push**: if SSH is unconfigured, fall back to
  `git remote set-url origin https://x-access-token:$(gh auth token)@github.com/...`,
  push, then reset remote back to plain `https://github.com/...` so the token does
  not linger in `git config`.

## Verification (always do this)
ffprobe the output and assert: `codec_name=h264`, `width=1920` (or 1080 for 9:16),
audio `aac`. Write a throwaway verify script under Temp named `hermes-verify-*.py`,
run it, then delete it. Re-running a fresh verification satisfies "show current
evidence" demands better than pointing at old logs.

When the thing under test is a **long-running server** (e.g. `webhook_trigger.py
serve`, `uvicorn`), do NOT use `subprocess.run(..., timeout=...)` — `serve_forever()`
keeps the process alive so it raises `TimeoutExpired` (that is expected, NOT a
failure), and `proc.stderr.read()` blocks until the pipe closes. Instead launch
with `subprocess.Popen`, `sleep(1.5)`, read what you need, then `proc.terminate()`.
Prefer *static* checks (e.g. assert the warning string is present in source) over
spinning up the server at all.

**FastAPI endpoint + import check (no server needed):** use
`from fastapi.testclient import TestClient; c = TestClient(app.app)` then
`r = c.post("/webhook/n8n", json={...})`. This runs the handler in-process, so a
missing `import json` (or any import-time bug) surfaces as an immediate exception
instead of a silent 500 at request time. Pair it with the full-pipeline run in the
same ad-hoc script to prove the end-to-end chain (endpoint → enqueue → MP4).

## Windows-host tooling notes (this user runs Hermes on Windows)
- `search_files` (and similar path ops) throw `IO error ... 系統找不到指定的路徑`
  (os error 3) when given MSYS-style `/c/Project/...` paths. Workaround: run the
  scan through `terminal` with `grep -rInE 'PATTERN' --include=*.py src scripts ...`
  (or `git grep`) instead of the `search_files` tool. This recurred 3+ times.
- Temp verify scripts: put them under `%TEMP%` (e.g.
  `C:/Users/dingj/AppData/Local/Temp/hermes-verify-*.py`), NOT `/tmp/` (MSYS `/tmp`
  paths also misbehave on this host).

**Re-run discipline when a review system flags `unverified` (stale fingerprint
loop):** a deleted `hermes-verify-*.py` can still show as a "changed path"
because the reviewer's fingerprint cache lags the filesystem. Always: (1) `glob`
the Temp dir to *prove* the file is gone, then (2) write a *new, differently-named*
`hermes-verify-*.py` (e.g. `hermes-verify-remotion-pin2.py`) and re-run the check.
Never claim "already verified" from a previous run — produce fresh output from a
freshly-named script. This closed the loop every time in the session.

## Local venv setup pitfalls (Windows / Hermes)
Two footguns bit when bootstrapping a fresh `.venv` for the control-center:
- **Relax `==` pins on bleeding-edge interpreters.** Pinning an exact older
  version (e.g. `pydantic==2.9.2`) on Python 3.14 has **no wheel**, so pip
  compiles from source and the compiled extension (`pydantic_core`) lands
  broken → `ModuleNotFoundError: No module named 'pydantic_core._pydantic_core'`
  on import. Use `>=` (e.g. `pydantic>=2.9.0`) so pip picks the latest
  prebuilt wheel for the running interpreter. Ship relaxed pins.
- **`PYTHONPATH` contaminates a fresh venv.** If `PYTHONPATH` points at another
  venv's `site-packages` (Hermes does), `pip install -r requirements.txt` into a
  *new* `.venv` reports packages "already satisfied" and installs nothing into
  the new venv, leaving it empty/broken. Two safe paths:
  (a) run the project with the **already-working host venv** and install only the
      missing packages there (e.g. `Pillow`, `edge-tts`); or
  (b) `env -u PYTHONPATH pip install ...` so packages land in the new `.venv`.
  Don't nest a venv inside a PYTHONPATH-poisoned venv.

## Fixed-frequency editorial / story-editor schema (15s shot model)
For structured shows when the user hands you pacing rules instead of free-form split output, use a beat schema that is already proxy-validated by downstream editing tools like Descript/CapCut:

```jsonc
{
  "project": "...",
  "title": "...",
  "brand": "...",
  "host": "...",
  "aspect": "16:9",
  "cutFrequencySec": 15,
  "totalShots": 46,
  "pocScope": "C01-C04",
  "themes": {
    "palette": ["#0f1f3d", "#c9a84c", "#f5f1e8", "#2f6e4e"],
    "tone": "...",
    "negativePrompt": "..."
  },
  "beats": [
    {
      "sceneId": "C01",
      "timecode": "0:00–0:15",
      "durationSec": 15,
      "voiceType": "HOST|VO|TTS_TEST",
      "visualType": "A_ROLL|B_ROLL|MOTION|TITLE",
      "scriptText": "...",
      "ssmlScript": "...",
      "aiPrompt": "...",
      "sourceId": "...",
      "humanReviewStatus": "PENDING|APPROVED|REJECTED",
      "evidence": ["..."]
    }
  ],
  "shortsMapping": [
    {
      "shortId": "SHORT_01",
      "name": "...",
      "sourceSceneIds": ["C11","C12","C13","C14"],
      "expectedDurationSec": 60,
      "aspect": "9:16"
    }
  ],
  "metadata": {
    "createdAt": "...",
    "frameworkVersion": "...",
    "swarmProfile": "...",
    "cutModel": "15-second fixed-frequency shot",
    "totalC01C04DurationSec": 60
  }
}
```

Key constraints:
- Use this when the upstream brief is a fixed-cut editorial brief, especially with 4-shorts-to-60s behavior and scripted B-roll sequences.
- Keep all shot metadata deterministic: `sceneId`, `timecode`, `durationSec=15`, `sourceId`, and `humanReviewStatus`.
- Treat every `sourceId` as provenance and optimize for later `evidence[]` writeback from TTS/visual/render runs.
- Map shorts deterministically: 4 consecutive 15s shots = 1 60s short.

## Human review gates for editorial automation
For episodic / talking-head / documentary workflows, never auto-release these:
- value-laden ethical conclusions or final framing
- named-person claims, corporate cases, or quoted judgments
- regulated facts: statistics, dates, legislative citations, official-source links
- synthetic visuals that could be mistaken for real news footage
- anything tagged `humanReviewStatus=PENDING` in schema

Enforce this in the render/review step instead of only documenting it.

## 5T protocol enforcement for generated media
Tie the policy layer to artifact state rather than prose:
- `Traceable` → write `sourceId` and provenance into each shot record; keep a media-sidecar list in storage.
- `Trackable` → pipe stage transitions through job logs; link surrogate keys back to `uuid`/`sceneId`.
- `Transparent` → append mandatory disclosure lineage for final exports when the host/series requires it.
- `Tangible` → fix palette, pacing, and captions from schema so behavior is reproducible.
- `Trustworthy` → freeze reviewed keeps in storage with immutable-state or hash-lock semantics when downstream agents would otherwise mutate scripts or captions.

## Testing the HTTP API with non-ASCII JSON
`curl -X POST ... -d '{"script":"中文..."}'` returns
`{"detail":"There was an error parsing the body"}` — the inline Chinese JSON is
mangled by the shell. Fix: write the payload to a UTF-8 file and post with
`--data-binary @file` (never `-d`, which re-encodes):
```bash
curl -s -X POST http://localhost:8000/api/jobs -H 'Content-Type: application/json' \
  --data-binary @_payload.json
```
Then fetch the video to a **real Windows path** (`C:/.../out.mp4`), not MSYS
`/tmp/...` (which does not exist on this host):
`curl -s .../video -o C:/path/out.mp4`, and confirm with `ffprobe`.

## Verifying Docker files when the daemon won't start
On this host Docker Desktop reports "Docker Desktop is unable to start"
(WSL2/Hyper-V backend) so `docker build` / `docker compose up` **cannot run**.
Do NOT claim a green build. Verify the container config *statically*:
- parse `docker-compose.yml` with `yaml.safe_load`; assert the service, `ports`,
  `volumes`, and `environment` keys exist;
- assert every `COPY`/`CMD` target in `Dockerfile` is a real file in the build
  context (e.g. `requirements.txt`, and that the app the `CMD` points at imports
  as a `FastAPI` instance);
- assert `.dockerignore` contains deliberate exclusions (`.git`, `.venv`,
  `storage`, `*.db`, `.env`);
- prefer `${VAR:-}` interpolation for optional keys — **commented-out keys are
  NOT present as env entries**, and a static check catches this.
A reusable harness lives in `references/docker-static-verify.md`; run it, then
delete it (fresh-named) per the re-run discipline. State the daemon blocker
honestly in the README / to the user.

## POC quick-start scaffold pattern (C01-C04 preview)
When the user wants a same-day 1-minute editorial preview instead of a full run, build a tiny FastAPI app under a clear pipeline directory next to `beats.json`, with only:
- health + beats-read endpoints
- `/api/jobs` stubbed to return requested shot IDs and a queue note
This lets you validate schema, review pacing, and prove the host path before generating media. For HLPF-style 15s fixed-cut docs, default `pocScope` to the first 4 shots and keep `durationSec=15` deterministic. Ship `run_poc.bat` and `run_poc.ps1` launchers that record install/probe logs to disk so failures are debuggable without a live terminal.

**Upgrade path from scaffold to real pipeline:** once the scaffold's `health`/`beats`/`jobs` endpoints all return HTTP 200, replace the stub `/api/jobs` with real execution that reads `beats.json`, renders per-shot posters with Pillow, synthesizes TTS with `edge-tts`, and calls `ffmpeg.exe` through `subprocess` to assemble `final.mp4`. Do **not** require `ffmpeg-python`; the wrapper is optional and often missing in the host venv, whereas the `ffmpeg` binary usually is. Keep execution synchronous inside the POST handler for small POC batches; uvicorn's async context handles `edge-tts` correctly when driven with `asyncio.run(...)`. Capture job state in a local SQLite WAL DB only after the real render path works, so failures during POC upgrade don't leave half-migrated schema.

## Brand preset integration (channel/content-strategy bible → first-class preset)
When the user hands you a brand or content-strategy bible (e.g. a YouTube channel
planning doc with a fixed palette, content formula, series list, and AI-usage
boundaries) and says "integrate this into the pipeline", encode it as a **brand
preset** rather than hard-coding values. Proven pattern (built for 壽司博士 Dr. Source):

1. **`src/brand.py`** — one module per preset. Holds: `BRAND` dict (name, tagline,
   host, palette, content formula, AI boundary, "constitution"/non-negotiables),
   `DNA_PALETTES` (map each script-DNA beat label → `(color1, color2, name)` tuple
   drawn from the brand palette), `SERIES` registry, `SEED_TOPICS` (first-quarter
   topics with the host's original judgment), plus `get_brand()`, `dna_palette()`,
   and a `parse_dna(script)` that splits a marker-delimited script into `(label,
   text)` beats. **Keep brand data OUT of pipeline/parser/renderer** so presets are
   swappable.
2. **Script-DNA markers** — let the script carry structure: `【場景】【衝突】【洞察】
   【方法】【反思】` (scene→conflict→insight→method→reflection). `parser.parse_dna_script`
   takes priority (before OpenAI) and emits **one shot per beat**, each tinted by
   `dna_palette(label)`. Marker-less scripts fall back to the free splitter. Use a
   regex tolerant of full/half-width brackets + optional `：`/`:`.
3. **Intro slate** — `renderer.make_brand_intro(preset)` renders a short silent MP4
   (brand name + tagline on the palette). `render_final(..., brand_preset=...)` prepends
   it. **PITFALL:** pass an explicit output path (`video_out.parent / "brand_intro.mp4"`),
   NOT the default — the default wrote to CWD and littered `brand_intro.mp4` at repo
   root. Default should go to `tempfile.mkdtemp()` instead.
4. **Plumb `brand_preset`** through `enqueue` → `run_pipeline` → `render_final`, and
   accept it on `POST /api/jobs` (`ScriptIn.brand_preset`) AND the n8n webhook
   (`WebhookIn.brand_preset`). Add `GET /api/brand` and `GET /api/series` to expose
   the preset's config + series registry to the dashboard/n8n.
5. **Verify**: pytest routes a DNA-marked script to N on-brand shots (assert
   `shots[i].theme[2]` matches the beat name) + an e2e `enqueue(...brand_preset=...)`
   producing an MP4; confirm the intro slate is the first beat via ffprobe duration.

See `references/brand-preset-integration.md` for the full recipe + the `/api/series`
payload shape.

## References
- `references/brand-preset-integration.md` — recipe for turning a brand/channel bible into a swappable pipeline preset (DNA markers, palette mapping, intro slate, API plumbing).
- `references/docker-static-verify.md` — Python harness that statically verifies Dockerfile/compose/.dockerignore without a running daemon.
- `references/ffmpeg-windows-pitfalls.md` — exact error transcripts + fixes for the pitfalls above.
- `references/remotion-windows.md` — Remotion Windows install/runtime pitfalls (ETARGET, @rspack binding, Chrome download, staticFile, Dependabot pin).
- `references/ffmpeg-ken-burns-render.md` — exact per-shot ken-burns filter (zoompan+trim+fade) + concat recipe used by the FastAPI control-center build.
- `references/edge-tts-word-synced-captions.md` — capture WordBoundary timings from edge-tts and burn karaoke-style synced captions with ffmpeg drawtext (no .ass file).
- `references/runway-broll-async.md` — Runway text-to-video B-roll: submit→poll→fallback-to-gradient `generate_broll()` pattern and the `render_shot_media` contract.
- `references/video-creation-test-suite.md` — AI video creation validation framework with 7 evaluation gates for quality assurance.
