---
name: python-pipeline-runtime
description: "Run long-running / async Python pipelines & services (media, automation, agents) under Hermes background processes without the silent failures that bite async I/O. Covers the Edge TTS empty-mp3 background-process trap, the FastAPI/uvicorn fix, Windows .py/.bat spawn, and ffmpeg CJK/concat pitfalls."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [python, runtime, background-process, async, edge-tts, ffmpeg, pipeline]
    related_skills: [hermes-mcp-management, hermes-agent]
---

# Python Pipeline Runtime Pitfalls (under Hermes)

When you build a Python pipeline/agent (esp. media generation, TTS, automation)
and run it via Hermes `terminal(background=true)` or the `process` tool, a few
non-obvious runtime traps will silently corrupt output. This skill captures the
fixes so the next session starts knowing them.

## 1. Edge TTS writes a 0-byte mp3 under a Hermes-managed background process

**Symptom:** `edge-tts` "succeeds" but the `.mp3` file is **0 bytes**. Downstream
ffmpeg then fails with `Failed to find two consecutive MPEG audio frames` /
`Invalid data found when processing input`.

**Root cause:** Hermes background-process management redirects the child's
stdout/stderr into pipes. Edge TTS's streaming write is sensitive to that
captured-stdout environment and produces an empty file when the pipeline is
launched as a child of a background-process-managed server (e.g. a
`python -m http.server` sidecar, or a `subprocess.run(...)` spawned from such a
server). Proven contrast in the same project:
- `python -m http.server` + `asyncio.run(pipeline)` (background) → **0-byte mp3**
- `subprocess.run(cli.py)` spawned from that server (background) → **0-byte mp3**
- `python -c "asyncio.run(pipeline(...))"` in a **foreground** terminal → OK
- **uvicorn/FastAPI** running the pipeline as an async task (background) → **OK (47 KB mp3)**

**Fix (pick one):**
- **Preferred:** expose the pipeline behind **FastAPI + uvicorn** and trigger it
  over HTTP. The async server context lets Edge TTS stream correctly, and it also
  gives you a clean API + auth layer. (This is what worked; see references file.)
- **Or:** run the one-shot triggering command in a **foreground** terminal, not a
  background-process-managed server, when Edge TTS output matters.
- Do NOT rely on a plain `http.server` sidecar + in-process `asyncio.run` for
  TTS-bearing pipelines on Windows under Hermes background processes.

## 1b. Windows/Hermes venv trap: `PYTHONPATH` + PyPI reachability (BIG time sink)

On this host the Hermes agent's **own** venv (`C:/Users/dingj/AppData/Local/
hermes/hermes-agent/venv/Scripts/python.exe`, Python 3.11) is the Python that
has working network access to PyPI (via the Hermes proxy). A freshly created
`python -m venv .venv` for the *project* is NOT where pip installs unless you
are careful — and it has the wrong interpreter / no prebuilt wheels.

**Symptom chain observed (wasted ~6 turns):** `pip install -r requirements.txt`
"completed" but `import fastapi` → `ModuleNotFoundError: pydantic_core`.
Root causes, in order:

1. **Shell inherits `PYTHONPATH=C:/Users/dingj/AppData/Local/hermes/hermes-agent/
   venv/Lib/site-packages`** from the Hermes spawn environment. So a bare
   `pip install` installs into the *Hermes* venv (already satisfied → installs
   nothing) while the project `.venv` stays broken. Clearing `PYTHONPATH` with
   `env -u PYTHONPATH` then broke PyPI name resolution (proxy only works with
   `PYTHONPATH` set), giving `Failed to resolve 'pypi.org'`. So you cannot just
   unset it.
2. **Pinned old versions force source builds on Python 3.14.** A project venv
   created from `python3` (which resolves to system Python 3.14.6) has **no
   wheels** for e.g. `pydantic==2.9.2`, so pip compiles `pydantic_core` from
   source and ships a broken `.pydantic_core` import. Relax pins to
   `pydantic>=2.9`, `fastapi>=0.115`, etc.

**Working recipe (use this, do not improvise):**
- Run the project with the **Hermes 3.11 venv** python directly — it has
  network + prebuilt wheels:
  `HPY="C:/Users/dingj/AppData/Local/hermes/hermes-agent/venv/Scripts/python.exe"`
  and `cd` into the project, then `HPY -m pip install -r requirements.txt`
  (it pulls only the missing packages: `Pillow`, `edge-tts`, etc.).
- Do NOT create a project `.venv` from system `python3` (3.14) — you will get
  source-build hell. If you must isolate, create it from the Hermes 3.11 exe:
  `.../hermes-agent/venv/Scripts/python.exe -m venv .venv`.
- Verify before building: `HPY -c "import PIL, edge_tts, fastapi, uvicorn,
  httpx, dotenv, pydantic, pydantic_core; print('OK', __import__('sys').version)"`.
- If `requirements.txt` pins exact old versions, loosen them — Python 3.14 has
  no wheels and will silently produce broken compiled extensions.

This is environment setup, not a tool defect — captured here as the *fix
sequence* so the next session does not re-burn the turns.

## 2. Windows: a `.py` file cannot be a process `command`

Whether it's an MCP server (see `hermes-mcp-management`) or any background
service, spawning `"C:/.../server.py"` directly errors with
`[WinError 193] %1 不是有效的 Win32 應用程式`. Use a real executable:
- `command: "C:/.../venv/Scripts/python.exe"` with the script as `args`, **or**
- a `.bat` launcher that calls `python.exe script.py` (and leave `args` unset).

For MCP specifically, the `.bat` + unset-args pattern is the reliable one — see
`hermes-mcp-management` ("Windows: command must be an executable…").

## 3. ffmpeg CJK + Windows subtitling (condensed)

- **Use ASS subtitles, not the `drawtext` filter**, for CJK text. `drawtext` with
  Chinese punctuation/colons throws; ASS handles it and supports styling.
- **Windows `C:` colon trap:** ffmpeg `-vf "ass=C:/path/sub.ass"` treats the
  colon in `C:` as a `key:value` option separator. Fix: `cd` into the video
  directory and pass a **bare filename** (`ass=sub.ass`), or escape the path.
- **ASS color format ≠ ffmpeg color format:** ASS uses `&HAABBGGRR` (e.g.
  `&H00FFFF&`); ffmpeg `color=c=` uses `0xRRGGBB`. Convert with a helper.
- **concat demuxer drops the audio track** when stream counts differ between
  clips (e.g. a silent brand clip + a narrated scene). Fix: give every clip a
  matching silent `aac` audio track so concat keeps audio.
- **`Path.replace(dst, src)` direction:** `tmp.replace(out)` renames `tmp` TO
  `out`. The common bug `out.replace(tmp)` wipes `out`. Remember: first arg is
  the NEW name.

## 4. Verification habit for these pipelines

After building a render/trigger path, actually **exercise it end-to-end** and
inspect the artifact, don't trust the return code:
- `ffprobe -v error -show_entries stream=codec_type,width,height -of csv=p=0 file.mp4`
  → confirm `video` AND `audio` streams exist (catches the empty-mp3 / dropped-audio class).
- Check the TTS `.mp3` byte size is non-zero before rendering.
- For a webhook/trigger chain, simulate the caller (curl with the same JSON +
  auth header) rather than assuming the server path works.

## 5. Hermes `verify` tool fingerprint-lag loop (verification discipline)

When you finish a change and the harness repeatedly flags the same paths as
`unverified` — listing a Temp verification script (e.g. `hermes-verify-*.py`)
that you already deleted — that is a **stale fingerprint**, not a real
unverified file. The harness caches the change signature and replays it after
the file is gone.

**Correct response (do NOT argue with the ghost):**
1. Confirm the disk is actually empty: `glob.glob(temp + "hermes-verify-*")`
   via terminal/`execute_code` → if it prints `[]`, the flagged paths are
   fingerprints, not files.
2. Re-run the verification under a **fresh Temp filename** (e.g.
   `hermes-verify-<topic>-v2.py` or `-bp.py`) so the new run produces fresh
   evidence, then delete that script too.
3. Report the fresh result. Do not re-justify the previously-deleted script.

This loop burned many cycles in one session: every "matched watch pattern"
notification from an already-killed background process is the same class of
**buffer replay**, not new input — ignore it; only act on live tool output.

**Why this matters for pipelines:** the verification step (§4) is mandatory,
and these pipelines live or die on the empty-mp3 / dropped-audio traps above.
The verify-loop discipline keeps you from either (a) shipping unverified
changes or (b) thrashing on phantom flags.

## See Also
- `github-secrets` — `gh secret delete` has no `-y`/`--yes` flag in recent gh;
  non-interactive deletes must use `gh api -X DELETE
  /repos/{repo}/actions/secrets/{name}`. Also: GitHub secret VALUES are
  write-only (cannot be read back) — a "secret manager" told to "自行查看"
  cannot retrieve them; cloud-key wiring only proceeds when the user pastes
  real keys in chat.
- `hermes-mcp-management` — Windows `.bat` launcher + `hermes config set` args
  pitfalls (same spawn class of problem, MCP-specific).
- `references/edge-tts-background-empty-mp3.md` — full reproduction + the
  FastAPI/uvicorn fix recipe used to verify the fix.
