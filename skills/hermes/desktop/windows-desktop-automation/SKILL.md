---
name: windows-desktop-automation
description: |
  Get real work done on the user's Windows machine when only GUI
  automation is available — no terminal/shell tool, execute_code
  blocked, or a read-only terminal. Covers spawning a shell without
  hotkeys, executing commands via computer_use, verifying by artifact
  (log-file relay), and the Windows-specific background-input limits
  of cua-driver. Load whenever you must run commands, install
  software, or verify files on Windows and your execution channels are
  limited to computer_use + file tools.
version: 1.0.0
platforms: [windows]
metadata:
  hermes:
    tags: [windows, computer-use, automation, no-shell, gui, verification]
    category: desktop
    related_skills: [computer-use]
---

# Windows desktop automation (GUI-only execution)

Use when a task needs real execution on the user's Windows machine
(install a repo, run tool checks, copy files, read env vars) but the
session has NO usable shell: no `terminal`, `execute_code` blocked,
`read_terminal` unavailable. Your remaining channels are `computer_use`
(background desktop automation) and file tools (read/write). This skill
is the playbook; the bundled `computer-use` skill has the full
`computer_use` action vocabulary — load both.

## Core discipline: element-cache invalidation

SOM element indices from `capture` are only valid until the NEXT
capture. Worse than an error: an index remembered from an old capture
**silently resolves to a different element** in the new cache —
observed: `right_click(element=36)` aimed at an Explorer file-list
folder actually hit desktop icon `IMG_9353`, no error, and it opened a
context menu for the wrong target.

- Rule: capture → act on THAT capture's indices immediately.
- Never reuse an index from an earlier capture, even one you just saw.
- After any state change (menu open/close, window switch), re-capture
  before the next element action.

## Windows background-input limits (cua-driver) — each with a workaround

| Limit | Observed signal | Workaround |
|---|---|---|
| Explorer (Win11) address bar never becomes editable via background input | click/type/set_value all return ok but breadcrumb stays; typed command goes nowhere | Don't use the address bar to run commands in background mode; spawn a shell via context menu (below) |
| Explorer CONTENT ListItems BELOW the viewport can be clicked directly via `click` (UIA Invoke) — no scroll needed first | click on an off-screen row (bounds y ≥ viewport height, e.g. y=1006 on an 800px capture) returns `Performed UIA Invoke on [N]` and the NEXT capture shows Explorer navigated INTO that folder | Verified 2026-08-04: one `click` on the off-screen `deerflow-staging` folder row (scrolled out of the 211-item list) opened it — driver resolves by AX tree position and ScrollIntoViews. Same pattern as TREE items: don't bother scrolling to reach deep list rows; `click` them directly from the current capture, then re-capture to confirm the folder actually opened |
| Chromium-class surfaces drop background text (Windows Terminal, most Electron apps) | `code:"background_unavailable"`, `escalation.recommended:"foreground"` | Try `delivery_mode="foreground"`; if that fails with the UIAccess error (next row), you cannot type into it — pivot to log-file relay |
| Foreground swap refused at OS level when daemon lacks UIAccess | "Foreground swap … rejected by Windows … SetForegroundWindow silently fails" | NOT the "driver too old" case. A BARE foreground swap (`type`/`key` with delivery_mode=foreground) is refused, BUT the ladder `click` (element) with `bring_to_front=true` + `delivery_mode="foreground"` **CAN succeed** and then unlocks foreground `type` into the same window (verified 2026-08-03 on Windows Terminal: click returned ok:true with `foreground_focus.invoked:true`; subsequent foreground `type` "Typed N char(s) via SendInput" actually landed). So the escalation is: background type refused → try click+bring_to_front+foreground → then foreground type. Only if that click is also refused, pivot to the artifact path |
| Shell hotkeys (Win+R, Win+X, Win+number) don't fire — via PostMessage OR foreground SendInput | key action returns `ok:true` ("✅ Sent r via SendInput on pid N") but no Run dialog / Explorer window ever appears — the WIN modifier is silently dropped | NEVER trust the ok on a win-combo: verify with `list_windows` (no new window = didn't fire). After ONE failed attempt + confirmation, pivot straight to the staged-.bat / log-relay path — don't burn retries on win+e / win+d / win+x / ctrl+esc variants (all fail the same way; 2026-08-04: `key ctrl+esc` via PostMessage on explorer also returned ok with NO Start menu appearing) |
| Hermes desktop app's in-app TERMINAL pane (bottom-left, powershell tabs + "Terminal input" edit) | background `type` → `background_unavailable` (Chrome_WidgetWin_1); foreground `type` reports "Typed N chars via SendInput" but NO artifact appears (text lands in the wrong focused element or is dropped); later foreground attempts hit the UIAccess swap refusal once another window took focus | Don't hand-drive the app's own terminal. It looks like a shell but isn't reliably typeable. Use the workspace's own runner scripts (next section) instead |
| Hermes in-app TERMINAL pane — Enter-stall sub-case (DISTINCT from the row above) | `type` delivers text onto the prompt line correctly (e.g. `PS C:\Users\dingj\...> hermes auth status` appears), but synthesized `key(enter)` / `key(return)` NEVER commits it — no output, no new prompt, the command just sits there. `set_value` on the "Terminal input" AX element fails with "does not implement ValuePattern or RangeValuePattern". Retrying `type`+`enter` (foreground OR background) still won't run it; only `ctrl+c` clears the line. This is NOT the TUI-instance case (a bare `hermes` printed the real v0.19.1 banner, proving a genuine PowerShell, not a Hermes chat TUI), and NOT the background_unavailable case | The embedded terminal's submit handler isn't triggered by synthesized Enter. Treat the pane as read/copy-only. To RUN a LOCAL command: open a standalone window via `key(win)` → type `powershell` → `enter` (but note Win+R/Win hotkeys may not fire — verify with `list_windows`/fresh capture), or use a chat slash command. Never loop `type`+`enter` on this pane. **EXCEPTION FIRST (verified 2026-08-04): open a FRESH tab via the 新增終端機 / New Terminal button (bottom-right of the pane, element-click with `delivery_mode='foreground'`) — the new tab's auto-focused xterm DOES commit `type`+`enter` cleanly (`pwd`, `hermes auth status` both ran; no IME garbage). Only fall back to the standalone-window path when a fresh tab still won't run. Full recipe: `references/hermes-embedded-terminal-new-tab.md`.**

**Validated local-Hermes-CLI facts (2026-08-04):** `hermes` IS on PATH locally — a bare `hermes` printed `Hermes Agent v0.19.1 (2026.7.30) · upstream a991dfc2` + `41 tools · 173 skills · 3 MCP servers`, so NEVER prepend the venv path (`%LOCALAPPDATA%\hermes\hermes-agent\venv\Scripts\hermes.exe`) — it isn't needed. Checking auth state: `hermes auth status` errors `the following arguments are required: provider`; the correct command is **`hermes auth list`**, which lists all provider credentials (validated output: `#1 GITHUB_TOKEN  api_key env:GITHUB_TOKEN`). A chat slash equivalent is `/auth list`.

**CWD / `pwd` fallback (when the pane won't execute):** the PowerShell prompt line itself (e.g. `PS C:\Users\dingj>`) is legible in a plain `mode='som'` capture's automatic vision analysis even though you can't run `pwd`. Read the CWD from that prompt string rather than declaring `pwd` unobtainable — it's the same value `pwd` would print. |
| CASCADIA (Windows Terminal): background `type` into an already-open WT is refused, but background `key` hotkeys DO land | `type` → `background_unavailable` + `escalation.recommended:"foreground"` on `CASCADIA_HOSTING_WINDOW_CLASS`; `key` (e.g. ctrl+l) → `ok:true` "Pressed ctrl+l on pid N via PostMessage (Win32 target)" (2026-08-03) | ctrl-combos (non-Win) fire via PostMessage background — ctrl+l/ctrl+c/Home etc. work on the WT window identified by `list_windows` pid+window_id. For free TEXT, the working ladder (verified 2026-08-03) is: background `type` refused → `click` element with `bring_to_front=true` + `delivery_mode="foreground"` (returned ok, foreground_focus.invoked:true) → then foreground `type` "Typed N char(s) via SendInput" actually lands and Enter executes. Before committing real commands, prove the channel with a harmless `echo CHANNEL_OK` + Enter + capture(verify it echoes) — IME can still corrupt a stray leading char (`git` → `Lgit`) even after the focus ladder works |
| Auxiliary vision model cannot reliably read terminal text from captures | capture(question="transcribe the terminal lines") keeps describing the whole window, not the text | BUT a plain `mode='som'` capture WITHOUT a question DID return legible terminal text in the automatic vision analysis (2026-08-03: read the PowerShell prompt `PS C:\Users\dingj>` and the `fatal: not a git repository` error lines directly from the analysis field). So an unprompted som capture is a free, legit first read of a terminal's visible text; a question-prompted capture is worse. Still confirm from the artifact file for anything you act on |
| Pixel coordinates skew in multi-monitor / DPI-scaled setups | click at [901,720] lands at physical (1103,881); desktop SOM element bounds can EXCEED the capture dims (icons at x=1802 on a 1567px-wide capture); the taskbar / Start button is NOT in the AX tree at all (capture(app='screen') shows only desktop icons) | Use element-index clicks; treat raw coordinates as last resort — you cannot pixel-click the Start button / taskbar into existence; don't attempt it, use the spawn recipes instead |
| Chinese IME (Traditional-Chinese, e.g. ASUS Smart Input) corrupts typed text | foreground `type` reports "Typed N chars via SendInput" but the real text lands as `esggolearningcenter` (backslash+hyphen eaten), `-r` → `r`, `--host` → `-host`, trailing `---` garbage | NEVER hand-type commands containing `\` or `-` on this machine. Stage a `.bat`/`.py` via file tools, then execute the SHORTEST possible command (`.\go.bat`), or use `set_value` on a Win32 Edit surface (Run dialog, Explorer address bar) which bypasses keyboard events entirely |

## Spawning a shell without hotkeys (verified recipe)

Windows 11 (Traditional-Chinese UI observed, same labels exist in EN):

1. `list_windows` → find an open Explorer window (`explorer.exe`).
2. `capture(app='explorer')` → file list contains folder rows as
   `ListItem` elements.
3. `right_click(element=<folder row>)` — from the SAME capture.
4. `capture(app='explorer')` again → the context-menu popup appears as
   `MenuItem` elements (popups ARE capturable this way).
5. Click 「在終端機中開啟」 / "Open in Terminal" (on the DEFAULT menu
   for folders — no "Show more options" needed) → a NEW
   `WindowsTerminal.exe` window opens, activated by the shell.

Caveat: the new terminal is a Chromium surface — background `type`
into it will be refused, and foreground may be UIAccess-blocked. So
treat the spawned shell as the *launch pad* for commands that write
artifacts you can read back, not as something you can type into from
background mode. If the user is at the machine, hand them one paste.

## Running a staged .bat without any shell (verified 2026-08-01)

When NOTHING can spawn a shell (hotkeys dead, foreground swap refused
without UIAccess, in-app terminal undriveable), a staged .bat can
still be executed purely through Explorer GUI clicks:

0. If the real target script sits inside an MCP-allowed dir, READ it
   with file tools FIRST and confirm what it does before running
   anything (esggo-hub `install.ps1` reviewed this way 2026-08-01:
   file copies + config merge only — no network, no elevation, no
   destructive ops). A 30-second read beats an unexpected side effect.
1. Write the wrapper .bat into an MCP-visible dir (e.g.
   `C:\Project\...\staging\go.bat`) that runs the real script with
   `> install.log 2>&1` + `echo EXITCODE=%ERRORLEVEL% >> install.log`
   + `pause` so the console stays open as a live artifact.
2. Open Explorer WITHOUT hotkeys: `capture(app='explorer.exe')` the
   desktop, `double_click` a desktop icon (資源回收筒 / Recycle Bin
   worked) → a real File Explorer window opens.
3. Navigate folder-by-folder using ONLY element clicks, each from a
   FRESH capture:
   - TREE items respond to `click` via UIA `SelectionItem.Select` —
     this works EVEN on offscreen items whose bounds are [0,0,0,0]
     (e.g. items scrolled out of the nav pane). The driver resolves
     the element by AX tree position, not coordinates. Selecting
     `OS (C:)` jumped straight to C:\ root.
   - CONTENT ListItems (folders/files) respond to `double_click`
     (PostMessage) — opens the folder / launches the file. Verified
     all the way down: C:\ → Project → esggo-learning-center →
     esggo-hub-staging.
   - Explorer's address bar is a trap: `set_value` + Enter does NOT
     commit navigation (value sets but Enter is ignored). Skip it.
4. `double_click` the .bat row in the final folder → cmd runs it.
5. `wait` 10-15s, then READ the log file back with file tools.
   EXITCODE=0 in the log = success.
6. The `pause` leaves a console window open — harmless; mention it to
   the user so they can close it.

This path needs NO shell, NO hotkeys, NO typing, NO IME — pure
PostMessage mouse + UIA Select. Confirm each hop with a fresh capture.

### Make the staged script ONE self-contained run (verified 2026-08-02)
The full pipeline — env probe → git branch → file edits → diff → commit →
push → `gh pr create` → log — ran from a single `.bat` double-click. Design
for that: the cua-driver session can die RIGHT AFTER the first GUI batch
(see session-expiry section: `capture`/`list_windows` dead, `wait` and
`list_apps` still alive, NOT revivable in-session). Anything requiring a
second GUI batch after the first is effectively un-runnable — put the WHOLE
job in script #1 (including push/PR/verification), or expect a manual
handoff. Round-2 fix scripts staged for later use are fine — just never
plan a two-batch autonomous sequence.

### Same-name files with hidden extensions look identical in Explorer
With "hide extensions for known types" on, `omnicore-fix.ps1` and
`omnicore-fix.bat` BOTH render as rows labelled `omnicore-fix` — clicking
the wrong one opens the script in Notepad instead of running it (harmless,
but stalls the run). Disambiguate before double-clicking:
- **Status-bar byte count**: click the row once, then read the status bar —
  `已選取 1 個項目 238 個位元組` (238 B = the .bat wrapper; a 12 KB+ script
  is the .ps1). Count, don't guess.
- Or double-click and observe: Notepad window = .ps1 (close it, run the
  other), console window = .bat.
- If you have file tools on the target dir, `get_file_info`/`list_directory`
  confirms sizes first — cheapest check of all.

### Editing files OUTSIDE the file-tool sandbox (staged idempotent script, verified 2026-08-02)
When the files to edit live OUTSIDE what your file tools can reach (MCP
sandbox = `C:\Project\esggo-learning-center` only, target =
`C:\Project\esggo-omniauto\src\renderer.py`), you can still do the whole
edit + verify autonomously: write ONE self-sufficient PowerShell script
into the ALLOWED dir, run it via the Explorer double-click .bat path, and
read its log back with file tools. Do NOT try to hand-drive an editor.

Script shape that worked (omniskill pattern for out-of-sandbox edits):
1. `$ErrorActionPreference = 'Continue'`; log path = `Join-Path $PSScriptRoot '<name>.log'` (lands in the allowed dir → readable).
2. Existence check on EVERY target first; on miss, list `Get-ChildItem 'C:\Project' -Directory` into the log (helps find the real path) and `exit 1` with a FATAL line.
3. BACKUP before modifying: `Copy-Item $f "$f.bak-$(Get-Date -Format 'yyyyMMdd-HHmmss')"` — cheap insurance, log the backup names.
4. Edit with `[System.IO.File]::ReadAllText` + `-replace` + `WriteAllText`. **Encoding pitfall: PS 5.1 `Set-Content -Encoding utf8` writes a UTF-8 BOM — corrupts Python sources. Use `$enc = New-Object System.Text.UTF8Encoding($false)` and `[System.IO.File]::WriteAllText($path, $text, $enc)`.** Read with `[System.Text.Encoding]::UTF8` (ReadAllText tolerates BOM).
5. VERIFY in the same run: `Select-String` the changed lines into the log plus counts (`$n = (Select-String -Path $f -Pattern '...').Count`). End with a `RESULT: ...` summary line and `EXITCODE=0`.
6. **`changed: False` in the log does NOT mean the patch failed.** The `-replace` comparison `$c2 -ne $c` is idempotent — if the file already has the target content (user applied it manually earlier), changed=False with the verify block showing the target values IS success. Read the verify block, not the flag.
7. After success, move the staged .ps1/.bat/.log into the workspace's `tmp/` (or delete) so you don't dirty the git status of the allowed dir you staged in.
8. If the user pasted the script text into chat (Hermes saves to `C:\Users\dingj\AppData\Local\hermes\pastes\paste_*.txt`), diff your staged script against those pastes before running — the user may be handing you the exact expected content; mismatch = rethink.

## Verify by artifact, not by screen-reading (log-file relay)

The pattern that makes GUI-only execution verifiable:

1. Write PowerShell scripts with `write_file` into a directory your
   file tools CAN reach (e.g., an MCP-sandboxed workspace) — the
   destination directory (e.g. `C:\Users\dingj\...`) may be
   off-limits to MCP; stage scripts in the allowed tree.
2. Every script logs to a file in that same visible directory:
   `$ErrorActionPreference='Continue'`; append each step's stdout.
3. Execute via the spawned shell (or ask the user to paste one
   command line that runs everything and prints the logs).
4. READ the log files back with your file tools. Real stdout/stderr,
   no screen-reading, no guessing.

Never report success without reading the artifact — if the log doesn't
exist, the command didn't run.

## Prefer the workspace's own runner scripts over hand-typing

Before typing commands by hand into any shell, look for scripts the
project already ships for exactly this purpose. A repo with a
one-shot `go.bat` / `run.bat` / `runner.py` that (a) kills stale
processes on the port, (b) starts the server with output redirected
to a numbered log (`uvicorn5.log`, `uvicorn5.err`, `uvicorn5.pid`),
(c) curls the endpoints into `health5.json` / `jobs5.json`, and (d)
lists the output tree into a `probe.txt` — run THAT, then read the
files. It encodes the project owner's own verification sequence, is
deterministic, and produces artifacts your file tools can read
verbatim. Observed with `hlpf-poc-pipeline`: a cron-designated
`hlpf_runner.py` writing everything to `cron_run_output.txt`
(readable via MCP) was the intended execution path; typing the same
commands into the Hermes app's terminal pane produced nothing.

Signs a file is the intended runner: docstring says "executed by
Hermes cron (no_agent) on the local Windows host" or "one-shot run";
it chdirs into the project root; it appends step-by-step logs. If
such a file exists, launching it (cron trigger, or a real shell) and
reading its output beats GUI typing every time.

## Beyond computer_use: browser-local probing + Hermes API server

`computer_use` is not the only channel on a Windows host. Two others
were verified on this machine — use them BEFORE fighting cua-driver.

### browser tool runs local CDP mode and can reach 127.0.0.1
`web_extract` is cloud-side (Firecrawl): localhost URLs fail with
"URL must have a valid top-level domain". But `browser_navigate` /
`browser_console` drive a local Chromium (`stealth_features: ["local"]`)
and CAN hit the user's own services. Verified: probing
`http://127.0.0.1:8082` returned ERR_CONNECTION_REFUSED (server down),
and `http://127.0.0.1:8642/v1/capabilities` returned the Hermes API
server's real JSON. Use `browser_navigate` to probe localhost ports (the one reliably direct channel); `browser_console` `fetch()` for HTTP calls only sometimes works — see the two caveats below; use ABSOLUTE URLs; relative paths fail with "Failed to parse URL from ...". This needs NO cua-driver and NO desktop session, so it survives driver expiry.

**Caveat (verified 2026-08-01 cron run):** `browser_console` `fetch()`
to localhost services can fail wholesale ("Failed to fetch") while
`browser_navigate` to the same URL succeeds (server responds) — the
tool's fetch path is proxied, navigation is direct. That session:
fetch→`https://api.github.com` = 200, fetch→`127.0.0.1:8642` /
`:61285` / `:9222` = all "Failed to fetch", but only
fetch→`127.0.0.1:9223/json/*` = 200. So: navigation is the RELIABLE
localhost probe; a fetch that must carry an `Authorization` header to
a localhost service has NO working path through the browser tool
(navigation can't set headers). Don't assume "browser can reach
localhost" means "browser can call authenticated localhost APIs".

**Caveat — desktop chat session matrix (verified 2026-08-01, vs the
cron run above):** in a desktop-app chat session the localhost
connectivity is NARROWER than in the cron run. Empirically:
`browser_navigate` → `http://127.0.0.1:8642/v1/capabilities` = direct
GET, works, real JSON returned; `browser_console` `fetch()` to
`127.0.0.1:8642` AND to `127.0.0.1:9223` = BOTH "Failed to fetch"
(proxied — even the 9223/json path that worked in the cron run fails
here); `new WebSocket('ws://127.0.0.1:9223/devtools/browser/<id>')` =
connection refused (`wserr`); `browser_navigate file:///...` =
`net::ERR_BLOCKED_BY_ADMINISTRATOR` (tool-level file block) — **in
desktop chat sessions only**. In CLI sessions the SAME call WORKS:
verified 2026-08-02 reading the user's chat-paste files
(`file:///C:/Users/dingj/AppData/Local/hermes/pastes/paste_N_<ts>.txt`)
to diff pasted script text against what you staged — a handy
out-of-sandbox file read channel when file tools are sandboxed; and a
"same-origin fetch from the page you navigated to on 8642" does NOT
help — the console's fetch is proxied regardless of page origin.
Practical rules for desktop chat sessions: navigation GET is the ONLY
reliable localhost channel (probe ports, read /health-style GETs);
there is NO header-capable path (so the API-server agent-spawn channel
is unreachable from the browser even with the key — you need the user
or a local-shell session); file:// reads are impossible; and
`browser_console` expressions MUST be single-line — any embedded
newline throws `SyntaxError: Unexpected end of input` (the eval
harness truncates at the first line). Per-session variance is real:
probe the matrix fresh instead of trusting a remembered CDP/fetch path.

### Hermes API server = an execution channel (needs its key)
The Hermes desktop app runs an OpenAI-compatible API server
(`gateway.api_server` in config.yaml, default port 8642). Endpoints:
`GET /v1/capabilities`, `POST /v1/chat/completions`, `POST
/v1/responses`. A request there spawns a Hermes agent session on the
LOCAL host — its terminal tool runs where Hermes itself runs
(Windows), unlike this session's SSH-bound terminal. This is the most
promising "run a command on Windows" path when cua-driver is down:
no GUI, no typing, no IME, verifiable by reading artifact files back.
Blocker in practice: every endpoint requires
`Authorization: Bearer <key>` where key = `gateway.api_server.key`
from `~/.hermes/config.yaml` (or the desktop app's API-server
settings panel). Documented defaults (`change-me-local-dev`,
`your-secret-key`) and obvious guesses are ALL rejected — do not burn
retries guessing; read the config or ask the user for the key.
Key location verified on this machine (2026-08-01): the value lives in
`C:\Users\dingj\AppData\Local\hermes\.env` as `API_SERVER_KEY=...`
(also surfaces in session history). NEVER write the key VALUE into
skills or memory — only the location. And even WITH the key, the
channel is dead unless you have an HTTP path that can reach localhost
WITH headers — see the fetch/navigation caveat above (browser tool
could not in the 2026-08-01 cron run).

### cua-driver session expiry (distinct failure mode)
Beyond the UIAccess rows above, the driver session can DIE mid-task:
"session 'hermes-XXXX' has ended; Call start_session with this id to
revive it". Telling symptom: `capture` / `list_windows` fail (each error still cites the OLD dead session id, e.g. "session 'hermes-b64eed480edd' has ended") while `list_apps` may succeed but return an EMPTY list (count 0) — driver process alive, session gone. No capture variant (som / vision / app=screen) revives it. Recovery ladder: (1) wait a few seconds and retry; (2) if it
persists, the desktop app needs a restart to revive the driver; (3)
or pivot to the browser-probe / API-server channels above instead of
burning retries. Recurred 2026-08-01 mid-run (`session
'hermes-4a7424fef7f0' has ended`) and could NOT be revived by waiting
or retrying — a desktop-app restart is the only real fix; plan
artifact-relay so work can land manually if the driver dies.

### 9223 CDP port is the browser tool's own Chrome, NOT the desktop app
`http://127.0.0.1:9223/json/version` shows Chrome/148 with a spoofed
Macintosh UA and `/json/list` exposes one `about:blank` page target.
Attaching via its `webSocketDebuggerUrl` and `Runtime.evaluate` works,
but the page has NO preload bridge (no hermes/ipc/electron window
keys), no localStorage, and its own `fetch` to `127.0.0.1:8642` also
fails. Conclusion: this is the browser tool's local Chromium (or an
isolated shell), not the Hermes desktop app's UI — don't expect IPC /
terminal access there. Wasted-effort trap confirmed. NOTE (2026-08-01
desktop session): the WebSocket attach itself is session-dependent —
in the cron run `Runtime.evaluate` via the 9223 websocket worked, but
in a desktop chat session `new WebSocket('ws://127.0.0.1:9223/...')`
was refused (`wserr`) and even
`fetch('http://127.0.0.1:9223/json/version')` failed. Probe before
building on it; and even when it attaches, it cannot read local files
or spawn processes (see
`references/desktop-session-localhost-matrix.md`).

## Pitfalls

- ESC on a context menu can misfire (observed: opened the file's
  Properties dialog instead of closing the menu). After ESC, capture
  to confirm state before continuing.
- Right-clicking a desktop icon from a stale cache opens the wrong
  item's menu — see element-cache discipline above.
- Explorer windows opened as side effects of stray keystrokes (a
  typed command landing in the file list navigates to Quick Access)
  will appear in `list_windows`; don't confuse them with your target.
- Desktop may be OneDrive-redirected (`C:\Users\dingj\OneDrive\Desktop`)
  while `C:\Users\dingj` is the real profile root — check paths in
  Properties dialogs / breadcrumbs rather than assuming.
- Env-var checks (e.g. ATLASCLOUD_API_KEY) need a shell: `if ($env:NAME) { "SET" } else { "NOT SET" }` — never print the value.
- `set_value` (UIA ValuePattern) IS an IME-safe input channel and DOES bypass keyboard events — but it only works on controls that expose a ValuePattern (Win32 Edit, Run dialog, Explorer address bar). It does NOT work on xterm.js-style terminals (Hermes app's in-app terminal, VS Code integrated terminal): they need real keydown events, so a set_value on their hidden input produces no execution. Don't burn retries there.
- SSH background-input limits (observed 2026-08-04): attempts to run
commands on remote hosts via SSH-backed terminal tools consistently
fail with the same socket error:

**Symptoms:**
- Error: "SSH connection failed: getsockname failed: Not a socket
  Read from remote host 161.118.248.180: Unknown error"
- Terminal tool returns "Failed to execute command: SSH connection failed"
- No retry or recovery mechanism apparent within the session

**Root causes:**
- SSH backend probe reports "SSH connection failed: getsockname failed: Not a socket"
- Terminal tool refuses all background commands when SSH connection is unstable
- No obvious workaround for SSH backend failure in current session

**Alternative approaches:**
1. **Use my-server create_directory for local paths** - Only works within allowed directories (`C:\Project\esggo-learning-center`, `C:\Project\esggo`)
2. **Use browser tool for web-based directory management** - Navigate to GitHub or other web interfaces
3. **Manual directory creation via computer_use** - Use Windows Explorer GUI automation
4. **File tools for alternative paths** - Use write_file with relative paths when possible

**Best practices for automation with SSH limitations:**
- Always verify SSH connection status before attempting remote operations
- Have fallback mechanisms (GUI automation, web interfaces, local file operations)
- When using my-server, ensure paths are within allowed directories
- Document persistent connection issues for future troubleshooting
- Consider SSH backend stability as a critical infrastructure dependency

**Observed SSH tool behavior:**
- Fails immediately on connection attempt without retry
- Returns detailed error message about socket connection
- No recovery mechanism apparent within current session
- Requires user intervention or system restart to resolve
- Cron `no_agent` scripts execute in the **terminal-backend environment, not the local Windows desktop**. Observed: a cron job scheduled for 1m ran and was removed (once-job lifecycle), but its output file (`cron_run_output.txt`) never appeared at the `C:\...` path the script wrote to — cron runs where the SSH backend runs (Linux), where `C:\` is a literal relative dir and the `open()` fails. Cron is NOT a local-Windows execution channel unless you've verified the scheduler's host. Verify by having the script write a marker file and reading it back with file tools. **Agent-mode cron jobs (no_agent=False) fail the same way**: a job with `workdir=C:\...` + terminal/file toolsets returned `execution_success: false` and produced no artifacts — the job's terminal tool inherits the session's SSH backend, so `cmd /c go.bat` never touches the Windows host. Also: no_agent `script` paths MUST be bare filenames under `~/.hermes/scripts/` — absolute paths are rejected ("Script path must be relative to ~/.hermes/scripts/") and `../` traversal is explicitly blocked ("Script path escapes the scripts directory via traversal"). A runner.py staged in the workspace cannot be referenced by cron; it must be copied into the scripts dir first.
- Win+R / Win+X shell hotkeys don't fire via PostMessage (input-queue level); the Hermes app's own TERMINAL pane is a log viewer, not a typeable shell — confirmed again this session. Stage `go.bat` and execute it via the shortest possible typed command (`.\\go.bat`) or a real shell, then read the log files back.
- The in-app terminal pane can be OCCUPIED by a second Hermes instance: typing `hermes` in the pane starts a full Hermes chat TUI (❯ prompt) that is a working agent, not a shell — commands typed there go to that agent as chat messages, and its own terminal/execute_code tools inherit the SAME broken SSH backend, so it cannot help run local commands either. It also freezes the pane at the TUI until `/exit` or Ctrl+C. When the user needs to run commands: have them open a NEW terminal tab (the pane's ＋ button) or `Win+R` → `powershell`, and BEFORE declaring the handoff successful, confirm the pane actually shows a `PS C:\Users\dingj>` prompt — not a `❯` chat prompt. Give the user the exact expected output line (e.g. `hermes config get terminal.ssh_host` must echo the value) so they can self-check.
- User repeatedly replies 繼續/下一步 without executing the physical step (pastes commands into chat instead of the terminal, sits in the TUI, typos IPs). After 1-2 failed probes, STOP re-probing the same dead channels and use `clarify` with concrete one-action choices; keep the fallback instruction to a single zero-friction path (new tab / Win+R) with an expected-output line.
- When handed a git/gh command sequence to run on a Windows terminal, the terminal's cwd is often the HOME dir, not the repo — every command then fails identically with `fatal: not a git repository (or any of the parent directories): .git` (observed 2026-08-03: all four of `git pull / git branch -D / git push --delete / gh pr close` failed this way from `PS C:\Users\dingj>`). Check the prompt first: take a plain `mode='som'` capture of the WT window — the automatic vision analysis shows the visible prompt/error lines for free. The fix is a `cd <repo>` first (which itself requires typing — so either hand the user the full sequence INCLUDING the `cd`, or stage a .bat). A pasted sequence without the `cd` is guaranteed to fail; never report it as "ran fine".
- **PowerShell's `bash` resolves to the WSL launcher, NOT Git Bash — bash scripts fail with a WSL error unless you call the absolute Git Bash path** (observed 2026-08-04): running `bash ./scripts/docker.sh init` from PowerShell hit `<3>WSL (10 - Relay) ERROR: CreateProcessCommon:818: execvpe(/bin/bash) failed: No such file or directory`. Root cause: `C:\Windows\System32\bash.exe` (WSL relay) precedes Git Bash in PATH, and the WSL distro has no `/bin/bash`. Fix: call Git Bash by absolute path — `$gitBash = 'C:\Program Files\Git\bin\bash.exe'; & $gitBash .\scripts\docker.sh init`. This is exactly what repos' `run-with-git-bash.cmd` wrappers do (`where git` → sibling `..\bin\bash.exe`). Also note: an upstream script may WARN (not fail) when a dependency daemon is down — `docker.sh init` printed "Detected local sandbox mode" + "Docker does not appear to be installed, or the Docker daemon is not reachable" but still exited 0. Diagnose the warning, don't treat exit 0 as full success.
- **Foreground-delivery coordinates are SCREEN coordinates, background coordinates are window-relative — never reuse the same [x,y] across modes** (observed 2026-08-04): a `double_click(coordinate=[1243,474], delivery_mode='foreground')` was delivered to screen (1720,698) — a completely different location (the driver converted/interpreted the background-mode window-relative pair as screen coords). A foreground click on the wrong target is worse than a missed one. Use element indices for foreground actions; if you must use coordinates, re-read them from a fresh capture in the SAME mode you'll deliver in.
- **MCP `search_files` silently returns "No matches found" for files >~100 KB** (observed 2026-08-04): grepping `config.yaml` (246 KB) and `config.example.yaml` for `deepseek`/`models:` both returned zero matches although the content was present. Do not conclude "content missing" from a search miss on a large file — verify via `read_file` or have the staging script itself check with `[System.IO.File]::ReadAllText(...).Contains(...)` and log the result.
- **User's typed folder name may not match the on-disk name — verify in Explorer BEFORE hardcoding it into a staged script** (observed 2026-08-04): user asked for `C:\Project\esgo-deerflow` (one g), but the real folder in `C:\Project` was `esggo-deerflow` (two gs, already existed and empty). The first staged .ps1 targeted the wrong path; the Explorer listing caught the mismatch and the script was re-staged against the real name. When the target dir is OUTSIDE the MCP sandbox you cannot confirm the name via file tools — the Explorer ListItem labels are the ground truth. If the .ps1 can't verify its target, have it log `Get-ChildItem 'C:\Project' -Directory` on miss (the existing out-of-sandbox pattern already does this).
- **PowerShell single-quoted `Log` strings do NOT interpolate `$()`** (observed 2026-08-04): `Log 'REPO_EXISTS=$(Test-Path (Join-Path $target ''Makefile''))'` printed the literal text `REPO_EXISTS=$(Test-Path ...)` into the log instead of evaluating it. Use double quotes or compute the value into a variable first (`$v = Test-Path ...; Log "REPO_EXISTS=$v"`). Every other line in that script (double-quoted or bare) evaluated fine — only the single-quoted one came out raw.
- **`git clone` of a large repo can sit at `Cloning into '.'...` for minutes with no log progress** (observed 2026-08-04): DeerFlow (~2169 files) logged nothing between `GIT Cloning into '.'...` and the checkout phase ~2.5 minutes later; the progress bar rows (`Updating files: N%`) only appear at the very end in one burst. Don't declare the clone hung — check the target folder's contents via Explorer instead (folder rows appearing = progress), and keep `wait` long (30-90s chunks). The `pause` in the .bat keeps the console alive so the script finishes writing its final `EXITCODE=0` line.
- **Leftover uncommitted text on the prompt line concatenates with your typed command** (observed 2026-08-04): a `gh run view ...` typed earlier but never Entered sat on the `PS C:\Project\esggo>` line; a foreground `type` of `hermes mcp test my-server ...` appended to it, and Enter executed the merged garbage (`gh: accepts at most 1 arg(s), received 4`) — my real command never ran. Before typing into ANY shell via computer_use, capture first and verify the input line is EMPTY (a trailing partial command is visible in the vision analysis; a `^U` prefix on the echoed line is the same artifact). If the line isn't clean, send `ctrl+u` (clear line) then capture-verify BEFORE typing. Even after clearing, an IME stray can still prepend `^U`/`^H` — the `echo CHANNEL_OK` + capture discipline (see CASCADIA row) remains mandatory before real commands.
- **A captured "Windows Terminal" window may BE the Hermes CLI TUI, not a shell — typing into it self-injects into your own session** (observed 2026-08-04): after Win+R → a `WindowsTerminal.exe` window with two tabs labeled "Windows PowerShell" appeared; `capture(app='WindowsTerminal')` returned SOM elements and a foreground `type` of the user's gh command reported "Typed 58 char(s) via SendInput" — BUT the vision analysis revealed the window's content was actually the Hermes CLI TUI itself: `$Hermes` status blocks ("preparing computer_use..."), agent Reasoning blocks, model/token status bar (`$deepseek-v4-flash-free 72.3K/200K`), and an input line `$> msg=interrupt ./queue ./bg ./steer Ctrl+C cancel`. The typed command was consumed as a Hermes **steer/user message** — the TUI echoed "Redirected current turn: 'gh run rerun ...'" — my own command text got routed back into the agent's context as if the user had typed it. Discriminator BEFORE typing: read the vision analysis for a real prompt (`PS C:\Users\...>`) vs Hermes TUI markers (agent reasoning text, model/token status bar, `$>` / `msg=` input line). If it's the TUI, close that tab or open a fresh terminal window — never hand-type into it; keystrokes become agent input, not shell input. Distinct from the desktop app's in-app terminal pane row: this is the CLI TUI inside a real Windows Terminal window, it's a working agent that self-injects its input.

### Verify services/containers via a GUI app's OWN window (no shell, no typing)

When what you need to verify is a background service whose status lives in a GUI
app's window (Docker Desktop containers, a tray-daemon status panel), you don't
need a terminal — wake the app's main window and read its AX tree.

- Tray apps may report "No on-screen window found" to `focus_app` even while the
  process runs (Docker Desktop does). On the desktop, `double_click` the app's
  **shortcut icon** → its main window opens, and `capture` then returns full content.
- `capture(app='Docker Desktop', mode='som')` exposed the whole containers grid as
  AX rows: name, image, **port mappings** (`127.0.0.1:2026:2026 (TCP)`), CPU %,
  uptime. `click` a compose-stack row's **expand** control reveals sub-containers
  (gateway / frontend / redis / nginx). `Engine running` + non-zero CPU + no
  `Exit`/`Restarting` labels = the stack is up and stable. Verified 2026-08-04 for
  DeerFlow (`deer-flow-dev`, nginx on 127.0.0.1:2026) — a reliable container-state
  verdict with no shell, no typing, no IME.

### Localhost `ERR_EMPTY_RESPONSE` ≠ `ERR_CONNECTION_REFUSED` (browser probe)

Probing `http://127.0.0.1:<port>` via `browser_navigate`:
- `ERR_CONNECTION_REFUSED` = no listener (service down / not bound).
- `ERR_EMPTY_RESPONSE` = a socket was accepted but zero bytes returned — the server
  is up enough to accept yet not serving (still initialising, or closed early).
  Observed 2026-08-04 hammering `127.0.0.1:2026` right after the nginx container
  started. Treat a fresh `ERR_EMPTY_RESPONSE` as "re-check", not "down"; only
  `ERR_CONNECTION_REFUSED` is a firm down signal. Bare-navigation localhost GET
  stays the one reliable browser channel in a desktop chat session.

### Driving the user's LOCAL Chrome natively to verify a localhost URL (verified 2026-08-04)

When you must *see* a localhost page in the user's real Chrome (the browser_navigate
probe says `ERR_EMPTY_RESPONSE` = re-check, containers are up, and you need visual
proof the UI actually serves), drive that Chrome via `computer_use` native UI:

- **Typed-browser rung is unavailable in Hermes standard mode** — attaching the
  user's existing Chrome fails closed: `cua_browser_state` → `browser_requires_setup`
  ("no owned DevTools endpoint"); `cua_browser_prepare(profile_mode='existing_profile')`
  → `browser_consent_required` ("requires a certified trusted-consent provider",
  `protected_consent_collector: null`, `legacy_approval_enabled: false`). Use NATIVE
  Chrome UI (AX + SendInput) — no DevTools needed.
- **Background click on the omnibox does NOT focus it** — a following `type` lands
  in whichever page element actually holds focus (observed: the URL went into the
  TwinMind sidebar input; the omnibox never changed and Enter navigated nothing).
  Don't click-then-type into Chrome.
- **Working sequence (every action `delivery_mode:'foreground'`)**: `key ctrl+l`
  (omnibox focus + select-all — bypasses the click-focus failure) → `type <url>` →
  `key enter` → `wait` 6-8s → capture. Chrome text input is foreground-only:
  background `type` is refused (`background_unavailable`, `Chrome_WidgetWin_1`).
- Foreground ops can leave Chrome **minimized** (capture bounds ≈ -32000, "no
  on-screen window matched") — recover with `focus_app(app='chrome')` + re-capture.
- After a heavy page load Chrome's UIA provider can STALL: `get_window_state timed
  out after 4s (UIA provider unresponsive … Chrome_WidgetWin_1)`, then bare
  `capture failed:`. Wait a few seconds, retry with different args (`max_elements`),
  or capture a DIFFERENT app (Docker Desktop) — don't repeat the identical call.
- **Google Translate popup = HTTP-200 evidence**: a translate offer after a
  localhost navigation means the server returned real non-Chinese HTML; a
  connection-failure page renders in the OS language and never triggers translate.
  Solid "service is serving" proof even when a screenshot can't be captured. Dismiss
  the popup (its close button) before a full-page capture.

Full session reproduction (exact refusal codes, error strings, capture recovery):
`references/local-chrome-navigation.md`.

### cua-driver session expiry mid-task (observed 2026-08-02)

The driver session can die mid-task while `wait` and `list_apps` still succeed — `capture` and `list_windows` fail with the OLD dead session id. Symptom: `capture(app='explorer')` returns only 5 elements (TitleBar + 4 window buttons, all at negative coordinates like [-31976,-31997]) — the Explorer content pane is gone. Recovery: (1) wait a few seconds and retry `capture`; (2) if it persists, the desktop app needs a restart to revive the driver; (3) pivot to the browser-probe / API-server channels instead of burning retries. Do NOT double-click files in Explorer when capture returns only the TitleBar — the click will land on the desktop shell, not the file list.

### double_click on .bat succeeds but log is never produced (observed 2026-08-02)

When a staged `.bat` is double-clicked in Explorer, `computer_use` returns `ok:true` — but the log file may never appear at the expected path. Observed root causes: (1) the .bat's `powershell -ExecutionPolicy Bypass` invocation may fail silently if the .ps1 path contains spaces or the working directory is wrong; (2) the .bat's `cd /d "%~dp0"` may resolve to a different directory than expected if the .bat was moved after creation; (3) the PowerShell script may exit before the log write completes (race condition with `wait` too short). Mitigation: (a) verify the .bat's first line `cd /d "%~dp0"` points to the correct directory by checking `list_directory` on that path before running; (b) use `wait` ≥ 15s after double_click; (c) if the log is absent after wait, re-capture the Explorer window to confirm the .bat row still exists (it may have been consumed by the shell execution); (d) as a fallback, navigate to the .bat's parent directory in Explorer, confirm the file is there, and try again with a longer wait. NEVER report success without reading the log artifact.

### focus_app does NOT give keyboard focus to Explorer (observed 2026-08-02)

`focus_app(app='explorer.exe', raise_window=true)` raises the window to the visible front (z-order) but the foreground-lock denies keyboard focus — `type` commands land in the wrong window or are silently dropped. The daemon is not at UIAccess integrity, so `SetForegroundWindow` is subject to the foreground-lock and the swap silently fails. After `focus_app`, always verify with `capture` that the target window's content is visible before attempting `type`. If `capture` returns only the TitleBar (5 elements, all at negative coords), the window is raised but not focused — do NOT attempt to type into it. Use the staged .bat / log-relay path instead of trying to drive Explorer's address bar or file list via keyboard.

### cua-driver session expiry mid-task (observed 2026-08-02)

The driver session can die mid-task while `wait` and `list_apps` still succeed — `capture` and `list_windows` fail with the OLD dead session id. Symptom: `capture(app='explorer')` returns only 5 elements (TitleBar + 4 window buttons, all at negative coordinates like [-31976,-31997]) — the Explorer content pane is gone. Recovery: (1) wait a few seconds and retry `capture`; (2) if it persists, the desktop app needs a restart to revive the driver; (3) pivot to the browser-probe / API-server channels instead of burning retries. Do NOT double-click files in Explorer when capture returns only the TitleBar — the click will land on the desktop shell, not the file list.

### double_click on .bat succeeds but log is never produced (observed 2026-08-02)

When a staged `.bat` is double-clicked in Explorer, `computer_use` returns `ok:true` — but the log file may never appear at the expected path. Observed root causes: (1) the .bat's `powershell -ExecutionPolicy Bypass` invocation may fail silently if the .ps1 path contains spaces or the working directory is wrong; (2) the .bat's `cd /d "%~dp0"` may resolve to a different directory than expected if the .bat was moved after creation; (3) the PowerShell script may exit before the log write completes (race condition with `wait` too short). Mitigation: (a) verify the .bat's first line `cd /d "%~dp0"` points to the correct directory by checking `list_directory` on that path before running; (b) use `wait` ≥ 15s after double_click; (c) if the log is absent after wait, re-capture the Explorer window to confirm the .bat row still exists (it may have been consumed by the shell execution); (d) as a fallback, navigate to the .bat's parent directory in Explorer, confirm the file is there, and try again with a longer wait. NEVER report success without reading the log artifact.

### focus_app does NOT give keyboard focus to Explorer (observed 2026-08-02)

`focus_app(app='explorer.exe', raise_window=true)` raises the window to the visible front (z-order) but the foreground-lock denies keyboard focus — `type` commands land in the wrong window or are silently dropped. The daemon is not at UIAccess integrity, so `SetForegroundWindow` is subject to the foreground-lock and the swap silently fails. After `focus_app`, always verify with `capture` that the target window's content is visible before attempting `type`. If `capture` returns only the TitleBar (5 elements, all at negative coords), the window is raised but not focused — do NOT attempt to type into it. Use the staged .bat / log-relay path instead of trying to drive Explorer's address bar or file list via keyboard.

## Reference

- `references/tencent-cloud-tokenhub-provider.md` — Tencent Cloud TokenHub provider setup for DeepSeek V4 Pro and other models (API base URL, key creation, Custom endpoint configuration, restart procedure).
- `references/windows-background-input.md` — full session reproduction:
  no-shell install task, exact error strings, staged two-phase
  PowerShell scripts, and the one-line command handed to the user.
- `references/hermes-app-terminal-pane.md` — session reproduction for
  running/verifying a local FastAPI service GUI-only: why the Hermes
  app's in-app terminal pane is undriveable, the workspace-runner-script
  pattern (`go.bat` / `hlpf_runner.py` / `runner.py` writing MCP-readable
  logs), the hlpf-poc-pipeline layout (src/ package, out/ as
  import-success signal, endpoints), the executor→artifact name map
  (`job_result.json` is NOT produced by any executor), and the "v0.3.0
  never launched" diagnostic (missing uvicorn5.*/health5.json/out\ =
  new renderer never imported).
- `references/ime-corruption-and-execution-channels.md` — IME corruption
  mapping for `computer_use type` on this machine (backslash/hyphen
  eaten), why `set_value` is the IME-safe channel (Win32 Edit yes,
  xterm.js no), and why cron `no_agent` scripts execute in the SSH
  terminal-backend environment rather than the local Windows desktop.
- `references/hermes-api-server-and-browser-probing.md` — the API-server
  execution channel (port 8642, endpoints, key location, exact 401
  response), browser tool's local CDP mode for probing 127.0.0.1,
  cua-driver session-expiry reproduction, and exact cron script-path
  error strings (bare filename only, traversal blocked).
- `references/desktop-session-localhost-matrix.md` — desktop chat
  session's verified localhost connectivity matrix (navigation GET =
  only reliable channel; fetch/WS/file:// all blocked), the
  single-line browser_console requirement, and the channel-exhaustion
  decision record (SSH-unlock case: when every autonomous channel is
  dead, the unlock is a physical user action — hand off one path).
- `references/git-gh-verification-on-windows.md` — driving a real
  git/gh sequence on the local Windows Terminal when the SSH backend is
  down: vision reads can contradict the GitHub API (trust the API),
  web_extract caches by URL (append `?cb=` to force a fresh fetch),
  `--comment` on an already-closed PR is dropped (use `gh issue comment`),\n  and cwd-is-HOME causes the `fatal: not a git repository` cascade.\n- `references/deerflow-local-docker-deploy.md` — DeerFlow local Docker deploy\n  + verify GUI-only (2026-08-04): staged `.ps1`/`.bat` log-relay sequence,\n  Git-Bash-absolute-path call for `docker.sh`, Docker-engine "engine init takes\n  minutes & compose may auto-start" gotcha, and the Docker-Desktop-window AX-tree\n  method that reads container status with no shell.
- `references/embedded-terminal-enter-stall.md` — embedded Hermes terminal:
  text-typeable but synthesized Enter never commits (distinct from the
  background_unavailable and TUI-takeover failures), verified 2026-08-04.
- `references/hermes-embedded-terminal-new-tab.md` — the WORKING counter-case
  (verified 2026-08-04): clicking 新增終端機 / New Terminal opens a tab whose xterm
  commits `type`+`enter` cleanly; element-click discipline, cwd resets to HOME,
  and when to stop (Hermes moved to another virtual desktop → hand off to user).
- `references/deerflow-llm-hookup.md` — connecting DeerFlow's LLM to the Hermes
  Nous subscription: `hermes proxy start` (default 127.0.0.1:8645/v1, key placeholder
  `unused-proxy-attaches-real-creds`), the DeerFlow `api_base` ≠ `base_url` gotcha
  (`apply_model.py` writes the wrong key — edit config.yaml directly), gateway restart,
  and the nginx fullchain.pem crash-loop pitfall.