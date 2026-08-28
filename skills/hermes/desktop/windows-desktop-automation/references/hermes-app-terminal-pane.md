# Session reproduction: run & verify a local FastAPI pipeline GUI-only (2026-08-01)

Goal: ensure `uvicorn app:app` runs on `127.0.0.1:8082` in
`C:\Project\esggo-learning-center\hlpf-poc-pipeline`, POST
`/api/jobs`, list `out/`. Session had NO shell (`terminal` absent,
`execute_code` blocked, `read_terminal` refused). Channels:
`computer_use` + browser (probe only) + MCP file server sandboxed to
`C:\Project\esggo-learning-center`.

## The trap: the Hermes desktop app's in-app TERMINAL pane

The app's bottom-left TERMINAL tab (powershell tabs 1-4, a "Terminal
input" edit element, and a `新增終端機` new-terminal button) LOOKS like
the perfect target. It is not reliably driveable:

1. Background `type` → `code:"background_unavailable"` on window class
   `Chrome_WidgetWin_1` (Electron), escalation recommends foreground.
2. Foreground `type` → returns "✅ Typed 109 char(s) on pid 31272 via
   SendInput" — but NO artifact appears. The keystrokes land on
   whatever element has DOM focus, which is NOT necessarily the
   terminal input: the click that "focused" it was `effect:
   unverifiable`, and the terminal output pane is a canvas the AX tree
   doesn't expose as text.
3. Probe test to prove delivery: typed
   `echo HLPF_TERM_OK > ...\term_probe.txt` → file never appeared.
   THE ONLY RELIABLE PROOF OF DELIVERY IS A FILE ON DISK.
4. After another window takes foreground, next foreground `type` →
   UIAccess foreground-lock rejection ("Foreground swap to target HWND
   ... was rejected by Windows ... daemon is not at UIAccess
   integrity"). Do not burn retries.
5. `capture(mode='vision', question='transcribe terminal text')` —
   the auxiliary vision model describes the whole window and NEVER
   reads the terminal lines. Vision OCR is not a verification channel
   for terminal content.

Conclusion: hand-driving commands through the Hermes app's own
terminal is a dead end in GUI-only sessions. Treat it as a launch pad
at best, or skip it entirely.

## The pattern that would have worked: workspace runner scripts

Before typing anything, LIST the project directory. This repo shipped
exactly the artifacts needed:

- `go.bat` — one-shot: kill stale `:8082` via netstat/taskkill →
  `pip install -r requirements.txt` → `start ... uvicorn
  app:app --host 127.0.0.1 --port 8082 > uvicorn5.log 2>&1` → wait 10s →
  curl health/beats/jobs into `health_probe.json`/`beats_probe.json`/
  `jobs_probe.json` with HTTP codes into `probe.txt` → `dir /s /b out`
  appended. Everything readable via MCP file tools.
- `hlpf_runner.py` — docstring: "executed by Hermes cron (no_agent) on
  the local Windows host"; chdirs to project root; appends every step
  to `cron_run_output.txt`; starts uvicorn with stdout/stderr to
  `uvicorn5.log`/`uvicorn5.err`, pid to `uvicorn5.pid`; curls into
  `health5.json`/`beats5.json`/`jobs5.json`; lists `out/` as JSON. This
  is the INTENDED execution path — a cron-designated runner writing an
  MCP-readable log.
- `run_poc.bat`, `probe.ps1`, `verify_hlpf.bat` — earlier generations
  of the same idea (uvicorn.log / step7_probes.txt / probe_status.txt).

Signs a file is the intended runner: docstring says "executed by
Hermes cron (no_agent) on the local Windows host" or "one-shot run";
chdirs into the project root; appends step-by-step logs. Launch it via
cron (or a real shell) and read its output — never hand-type the same
sequence.

## Pipeline layout facts (hlpf-poc-pipeline, v0.3.0)

- `job_result.json` is a PHANTOM filename — NO executor in this pipeline
  writes it (verified by full-tree search 2026-08-02). Real artifacts:
  - `go.bat` → `install.log`, `probe.txt`, `health_probe.json`,
    `beats_probe.json`, `jobs_probe.json`, `uvicorn5.log`
  - `hlpf_runner.py` → `cron_run_output.txt`, `health5.json`,
    `beats5.json`, `jobs5.json`, `uvicorn5.log/err/pid`
  - `runner.py` → `runner_stdout.log`, `runner_stderr.log`
  - `app.py` → `out/<project>/<title>/` (png/mp3/mp4)
- Absence of `install.log` after a claimed go.bat run = the batch never
  actually executed (its FIRST line writes install.log). Don't trust
  "I ran it" — check for the first artifact the script writes.
- `out/` missing = the CURRENT app.py was never successfully imported
  (src/config.py mkdirs out/ at import). `out/` existing is itself an
  import-success signal — but only for the code state that ran.
- `app.py` imports `from src.config import settings` and
  `from src.visual import render_beat_poster` — the package lives in
  `src/` NEXT TO app.py (NOT a src-layout pip install).
- `src/config.py`: pydantic-settings `Settings`; default
  `out_root = Path(__file__).resolve().parent.parent / "out"`, created
  at import (`settings.out_root.mkdir(parents=True, exist_ok=True)`).
- Endpoints observed: `/api/health`, `/api/beats`, `/api/jobs` (POST).
- Input data: `beats.json` at the PROJECT root (parent of
  hlpf-poc-pipeline), fed to `render_beat_poster`.
- `.env` at project root holds credentials — never echo values; probe
  presence only. Template: `.env.example` (BROLL_PROVIDER, RUNWAY_API_KEY,
  HEYGEN_API_KEY, HEYGEN_AVATAR_ID, HEYGEN_VOICE_ID).
- `src/broll.py` (added 2026-08-02): B-roll provider adapter. `generate_broll(beat=, poster_png=, audio_mp3=, out_dir=)` returns a per-beat clip mp4. Provider chosen by `settings.broll_provider`:
  - `poster` (DEFAULT, no key): loop poster PNG over the TTS audio → static clip.
  - `runway`: `POST https://api.dev.runwayml.com/v1/image_to_video`, header `Authorization: Bearer $RUNWAY_API_KEY` + `X-Runway-Version: 2024-11-06`; body `{model, promptText, promptImage(data: URI of poster), ratio:"1280:720", duration:10}`; poll `GET /v1/tasks/{id}` until SUCCEEDED; download output; mux with TTS audio via ffmpeg.
  - `heygen`: `POST https://api.heygen.com/v3/videos`, header `x-api-key`; body `{type:"avatar", avatar_id, script, voice_id, aspect_ratio:"16:9", output_format:"mp4"}`; poll `GET https://api.heygen.com/v1/video_status/{id}`; download; mux.
  - **Fail-safe**: ANY real-provider error (missing key / API / network) falls back to the poster clip, so the job never hard-fails. Because clip mux always re-encodes to 1920x1080 libx264/yuv420p + aac, the final concat spec (h264,1920,1080,aac,48000) is preserved regardless of provider. Both real adapters delete the raw download after mux (`unlink(missing_ok=True)`).
- `app.py` v0.3.0 job flow (post B-roll refactor): render poster + edge-tts per beat → `clips = [generate_broll(...) for beat]` → `_assemble_mp4(clips=...)` does a plain concat to `final.mp4` (no per-clip image loop anymore). `_assemble_mp4` cleans `_broll_*.mp4` and `_concat.txt` in `finally`.
- `run_hlpf.bat` (added 2026-08-02): one-command runner — kill :8082 → pip install → start uvicorn (/min) → poll /api/health (30s) → POST /api/jobs (300s) → auto-ffprobe final.mp4 and assert `h264,1920,1080` + `aac,48000` → prints [VERIFIED] or [MISMATCH]; exit 0/1/2. Replaces manual 2-window flow.
- History: run 1 → jobs POST 500; run 3 → 200 OK; run 4 → older MVP
  build ("Pipeline execution hook is not installed in this MVP
  build"). Correlate uvicorn*.log mtimes with app.py mtime before
  trusting a log as evidence of the CURRENT code state.

## Verification sequence for this class of task

1. Probe `http://127.0.0.1:8082/api/health` via browser → if
   ERR_CONNECTION_REFUSED, server is down (don't trust stale pid files;
   confirm no process via `list_apps`/`list_windows`).
2. Check for runner scripts (go.bat / *runner*.py) BEFORE hand-driving.
3. Read uvicorn5.log / uvicorn5.err for the exact import/runtime error.
4. If the job response indicates failure or `out/` is missing → report
   the exact failure detail and STOP per the task contract.

## 2026-08-01: artifact-name map & "never launched" diagnostic

Which file each executor writes — do NOT hunt for `job_result.json`;
NO executor produces it (a user asking for it means the pipeline never
ran, not that the file is hiding):

| Executor | Artifacts it writes |
|---|---|
| `hlpf_runner.py` (cron-designed, no_agent) | `cron_run_output.txt`, `uvicorn5.log`/`.err`/`.pid`, `health5.json`, `beats5.json`, `jobs5.json` |
| `runner.py` (spawns `go.bat` via `cmd.exe /c`) | `runner_stdout.log`, `runner_stderr.log` |
| `app.py` v0.3.0 real renderer | `out/<project>/<title>/{C01..C04}.png/.mp3`, `final.mp4` |

"v0.3.0 never launched" signature (verified 2026-08-01): ALL of
`uvicorn5.log` / `health5.json` / `cron_run_output.txt` / `out\` missing,
`uvicorn4.log` empty, and 8082 ERR_CONNECTION_REFUSED. Because
`src/config.py` mkdirs `out\` at import time, the absence of `out\`
ALONE proves the new renderer never imported. Old `uvicorn3.log` /
`jobs3.json` may still show a 200 from the MVP build ("Pipeline
execution hook is not installed in this MVP build") — do not mistake
stale MVP evidence for the new build having run.

Manual run path when cron/terminal are SSH-bound (they execute in the
SSH backend's Linux env, never on the local Windows host): `cd
C:\Project\esggo-learning-center\hlpf-poc-pipeline` then `.\go.bat`,
then verify via health5.json / jobs5.json / the out\ tree through MCP
file tools.

## 2026-08-02: "never executed" — install.log is go.bat's FIRST artifact

`go.bat`'s first line is `echo === kill old :8082 === > install.log
2>&1`. So **absence of `install.log` is the strongest "bat never ran"
signal** — stronger than probe.txt absence (probe.txt is written
mid-script after pip+uvicorn). Verified 2026-08-02: user pasted the
command into chat and said 繼續/代理我完成, but install.log /
probe.txt / health_probe.json / jobs_probe.json were ALL absent and
the tree was byte-identical → the bat never executed in any shell,
full stop. Don't hunt further; hand the user ONE concrete action
(double-click go.bat in Explorer, or verify the PS prompt path is the
pipeline dir then `.\go.bat`) and require `=== ALL DONE ===` at the
end. The `job_result.json` hunt recurred (2026-08-02) — answer once
with the artifact map, don't re-search the tree.

Channel-state ladder when user grants autonomous execution (代理我完成 /
下一步): (1) re-probe MCP directory tree FIRST — cheapest and most
reliable; detects whether the user actually ran the step elsewhere;
(2) browser_navigate the localhost port (ERR_CONNECTION_REFUSED =
service down); (3) only then computer_use. Note cua-driver can be dead
("session has ended", list_apps empty) while MCP file tools still work
fine — MCP file server is independent of cua-driver, keep using it.
