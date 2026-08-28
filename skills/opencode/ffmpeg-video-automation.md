---
name: ffmpeg-video-automation
description: Build local/offline video production pipelines with ffmpeg + Python: script -> TTS -> visuals -> render burned subtitles -> YouTube-ready MP4. Covers Windows pitfalls (drawtext colon bug, concat audio drop, in-place edit) and the asyncio subprocess wrapper pattern.
---

# FFmpeg Video Automation

Build "code-as-video" production lines that turn a text script into a YouTube-upload-ready
MP4 **without** heavy cloud dependencies. The canonical local stack:

- **Orchestration**: a Python `asyncio` module that chains stages
- **LLM**: parse a script into structured scenes (local rule-based default is fine)
- **TTS**: `edge-tts` for free, real neural voices (zh-TW etc.); ElevenLabs optional
- **Visuals**: `Pillow` to generate branded background images (no GPU)
- **Render**: `ffmpeg` — H.264 + AAC, `yuv420p`, `-movflags +faststart`, 1920x1080/30
- **Storage/log**: local files + JSONL (S3/NCBDB as pluggable adapters)

## Minimal working pipeline shape

```
script -> LLM(scenes) -> TTS(mp3 per scene) -> Visual(png per scene)
       -> render(clip per scene: image+audio+subtitles)
       -> concat -> mux bg music -> final.mp4
```

Wrap every ffmpeg call in an asyncio subprocess helper (see `scripts/run_ffmpeg.py`):

```python
async def _run(cmd, cwd=None):
    proc = await asyncio.create_subprocess_exec(
        *cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE, cwd=cwd)
    out, err = await proc.communicate()
    if proc.returncode != 0:
        raise RuntimeError(f"ffmpeg failed ({proc.returncode}):\n{err.decode(errors='ignore')[-1800:]}")
```

## CRITICAL Windows / ffmpeg pitfalls (learned the hard way)

These are the traps that break a pipeline on Windows specifically:

1. **`drawtext` with `text=` containing CJK or a Windows path BREAKS parsing.**
   The `:` in `C:/...` and in punctuation is read as an ffmpeg option separator.
   → **Use ASS subtitles instead of `drawtext`.** Write a `.ass` file and pass
   `-vf "ass=filename.ass"`. ASS natively handles CJK, outline, box, positioning,
   and timing per line. Always reference the `.ass` by **bare filename** and run
   ffmpeg with `cwd=<dir containing the .ass>` (the `ass=` filter still chokes on
   a `C:/...` absolute path even inside quotes). See `references/ass-subtitles.md`.

   1b. **`drawtext` CAN work for CJK if you escape correctly — but ASS stays safer
   for multi-line/long captions.** The breakage in #1 is the unescaped colon in
   Windows font paths and bare `C:/...`. A working `drawtext` pattern escapes the
   font colon (`C\\:/Windows/Fonts/msyh.ttc`) and escapes caption text
   (`: , % ' \` → `\: \, \% \' \\`). See `references/edge-tts-word-boundaries.md`
   for the full karaoke recipe: obtain word timings from edge-tts via
   `boundary="WordBoundary"` (the DEFAULT gives NO word chunks — only
   `SentenceBoundary`), then burn per-word `drawtext` with
   `enable='between(t,<start>,<end>)'` so each word appears only while spoken.
   Use ASS when captions wrap to multiple lines or need rich styling; use the
   drawtext recipe for simple single-line word-synced captions.

2. **`concat` demuxer drops the audio track if clips have mismatched stream counts.**
   e.g. scene clips have `video+audio` but a generated intro/outro has only `video`
   → the concat silently emits video-only. → Give intro/outro a **silent audio track**
   (generate with `anullsrc=r=24000:cl=mono`, mux with `-c:a aac`) so every segment
   has video+audio. See `references/concat-audio-drop.md`.

3. **ffmpeg cannot edit a file in place.** `ffmpeg -i in.mp4 ... -i anullsrc -o in.mp4`
   errors with "Output ... same as Input ... exiting". → Always render to a **temp file
   then `Path(out).replace(tmp)`** — and note `Path.replace(target)` RENAMES self TO
   target, so the correct call is `tmp.replace(out)` (tmp becomes out), NOT `out.replace(tmp)`.

4. **ffprobe `-show_entries stream=...` omits `codec_type` unless you ask for it.**
   A probe that filters `s.get("codec_type")=="video"` returns nothing if you didn't
   request `codec_type`. → Always include `codec_type` in the `-show_entries` list, or
   pick the stream by codec_name + position. See `scripts/probe_video.py`.

5. **ASS colour format is `&HAABBGGRR` (alpha,blue,green,red); ffmpeg `color=c=` wants `0xRRGGBB`.**
   Build both from the same RGB tuple with two different helpers.

6. **Edge TTS writes a 0-byte mp3 (and ffmpeg then dies with "Failed to find two
   consecutive MPEG audio frames") when the pipeline is invoked from a stdlib
   `http.server` that is itself a background-managed process.** Proven: the *same*
   pipeline + `edge-tts` works perfectly when called from a foreground terminal or
   from a FastAPI/uvicorn async task, but produces empty mp3s when spawned via
   `http.server.BaseHTTPRequestHandler.do_POST` -> `asyncio.run(pipeline)` OR via
   `subprocess.run(cli)` under a Hermes/background-owned http.server. The async
   context (uvicorn) is fine; the sync-threaded http.server at the top of the
   call tree corrupts the Edge TTS stream. → **Do NOT expose the pipeline through
   `http.server`.** Serve it via **FastAPI + uvicorn** (async, identical call
   path, Edge TTS stays healthy) and let n8n/Docker call that endpoint. Keep
   `http.server` only for a local dev smoke test you run in the foreground.
   Also: any webhook handler must `json.loads(self.rfile.read(n).decode("utf-8"))`
   explicitly — default bytes decode via latin-1 mangles CJK scripts. See
   `references/webhook-fastapi-trigger.md`.

## YouTube-readiness checklist

- Container MP4, video `libx264` `yuv420p`, audio `aac` (`-b:a 192k`), `-movflags +faststart`
- 16:9 = 1920x1080, 9:16 Shorts = 1080x1920, fps 30
- Burned subtitles (ASS) so they survive re-encoding on upload
- Verify with `ffprobe -v error -show_entries format=duration:stream=codec_name,codec_type,width,height`

## Verifying without a full run

Use `scripts/probe_video.py <file.mp4>` for a fast codec/duration check, and
`scripts/run_ffmpeg.py` only documents the wrapper (import it in your pipeline).
For end-to-end checks, a tiny HTTP server (stdlib `http.server`) POSTing to the
pipeline's webhook handler proves the orchestration path without needing Docker/n8n.

## When cloud is wanted (pluggable, not required)

Keep free/local defaults and make cloud a `provider` switch in config:
- TTS: `edge-tts` (default) ↔ `elevenlabs`
- Visuals: `Pillow` (default) ↔ `runway` / `midjourney`
- Storage: `local` ↔ `s3`  ;  DB: `local jsonl` ↔ `ncbdb`
- Render: `ffmpeg` (default) ↔ `remotion` (Node project, best for motion graphics)

### Remotion as the optional render engine (Windows gotchas)
Remotion is a Node app (`cd remotion && npm install`), not Docker. Wire it as a
`RENDER_ENGINE=remotion` switch; the ffmpeg engine stays default. Gotchas:
- **`@rspack/binding-win32-x64-msvc` missing after `npm install`** (Remotion 4.x
  native binding). Symptom: `Cannot find module '@rspack/binding-win32-x64-msvc'`.
  Fix: `npm install @rspack/binding-win64-x64-msvc` (note: install the exact
  platform binary package; `npm install` alone skipped the optional native dep).
- **Chrome Headless Shell auto-downloads (~113 MB) on first `npx remotion render`.**
  Expect a one-time long first run.
- **`<Img>` cannot load absolute `file://` paths** — Chrome refuses
  "Not allowed to load local resource". Symptom: "Could not load image with
  source file:///...". Fix: copy scene PNGs into `remotion/public/scenes/` and
  use `staticFile("scenes/xxx.png")` inside the component. The Python adapter
  must copy each `s.image_path` -> `public/scenes/<name>` and pass the relative
  path as the prop. See `references/remotion-windows.md`.

## References

- `references/edge-tts-word-boundaries.md` — edge-tts `boundary="WordBoundary"` gotcha + karaoke `drawtext` caption recipe + soft SRT + CI ffmpeg install note
- `references/ass-subtitles.md` — ASS file template + CJK font + timing recipe
- `references/concat-audio-drop.md` — silent-audio intro/outro fix recipe
- `references/github-token-push.md` — push when SSH denied + `gh auth setup-git` fails (x-access-token URL)
- `references/webhook-fastapi-trigger.md` — why `http.server` breaks Edge TTS; use FastAPI/uvicorn + n8n HTTP Request → `/api/render`; UTF-8 decode fix
- `references/remotion-windows.md` — Remotion on Windows: rspack binding, Chrome download, staticFile for local images
- `scripts/probe_video.py` — ffprobe wrapper
- `scripts/run_ffmpeg.py` — asyncio ffmpeg wrapper (import, don't run)
