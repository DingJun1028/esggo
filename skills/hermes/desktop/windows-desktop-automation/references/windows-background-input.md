# Session reproduction: GUI-only Windows install (2026-07-31)

Goal: install `Alisa0808/vox-director` (a Claude-Code-style skill repo)
to `C:\Users\dingj\vox-director`, check tools (git/ffmpeg/ffprobe/python/pip),
register it under `.claude\skills\`, verify ATLASCLOUD_API_KEY presence.
Session had NO shell: `terminal` absent, `execute_code` blocked,
`read_terminal` refused ("only available in the Hermes desktop app").
Channels that worked: `computer_use` (background) + MCP file server
sandboxed to `C:\Project\esggo-learning-center`.

## Exact failure signals (all real, in order)

1. `computer_use(key='win+r')` — no Run dialog. Shell hotkeys are
   input-queue level; PostMessage key events can't trigger them.
2. Explorer address bar attempts (window at z-index 4, NOT active):
   - `click(element=99)` → ok; bar stayed breadcrumb.
   - `type(text=...)` 97 chars → sent, no visible change.
   - `set_value(value=...)` → "Set AXValue on [99] (UIA ValuePattern)."
     ok — STILL breadcrumb. Background input never converts the Win11
     address bar to edit mode.
   - Root cause: background PostMessage clicks don't ACTIVATE windows;
     Explorer's AutoSuggestBox needs real activation.
3. `computer_use(type, delivery_mode='foreground')` on Windows Terminal:
   "Foreground swap to target HWND 0x1203aa was rejected by Windows
   (actual foreground is HWND 0x830c18). This daemon is not at UIAccess
   integrity, so SetForegroundWindow is subject to the foreground-lock
   and the swap silently fails. … the calling app must already be
   foreground for delivery_mode:'foreground' to be safe."
4. Pixel right-click `coordinate=[1450,400]` on desktop → "Posted click
   to pid 10780", no context menu. Pixel mapping unreliable
   (capture-relative vs physical screen; earlier click at [901,720]
   landed at physical (1103,881)).
5. **Silent stale-cache hit**: after a fresh `capture(app='screen')`,
   `right_click(element=36)` was intended for the Explorer folder row —
   but element 36 in the NEW cache was desktop icon `IMG_9353`. The
   click opened IMG_9353's context menu with no error. Element indices
   resolve against the latest capture, period.
6. ESC on IMG_9353's context menu → opened "IMG_9353 - 內容" Properties
   dialog (misfire). Fixed by clicking 取消 (Cancel) via UIA Invoke.

## The sequence that worked

1. `list_windows` → Explorer window `[Jun] 房屋租補 - 檔案總管` present.
2. `capture(app='explorer', mode='som')` → file list with folder rows
   as ListItem elements (e.g. `1140920_038279_OLDEGXN001` @ (313,390)).
3. `right_click(element=<folder row>)` (same capture!) →
   `capture(app='explorer')` → popup menu captured as MenuItems:
   開啟 / 共用 / 壓縮至... / **在終端機中開啟 (Open in Terminal)** /
   顯示其他選項. Open in Terminal is on the DEFAULT menu for folders.
4. `click(element=<在終端機中開啟>)` → UIA Invoke → NEW
   `WindowsTerminal.exe` window ("Windows PowerShell") in list_windows.
5. Background `type` into the terminal → refused:
   "Background delivery is not available for target window class
   'Chrome_WidgetWin_1' on this event kind (text_input)." Foreground →
   UIAccess rejection. Shell up but undrivable by the daemon.

## The log-file relay pattern (the durable fix)

Stage scripts where the file tools can see them; log to the same tree;
read the logs back. Concrete two-phase staging:

```powershell
# vox-setup-1.ps1  — tool existence check
$ErrorActionPreference = 'Continue'
$log = 'C:\Project\esggo-learning-center\.hermes\vox-setup-1.log'
"=== PART 1: TOOLS === $(Get-Date)" | Out-File $log -Encoding utf8
foreach ($t in 'git','ffmpeg','ffprobe','python','pip') {
  $c = Get-Command $t -ErrorAction SilentlyContinue
  if ($c) { "OK  $t -> $($c.Source) $($c.Version)"  | Out-File $log -Append }
  else    { "MISS $t"                              | Out-File $log -Append }
}
```

```powershell
# vox-setup-2.ps1  — clone + verify + register
$dest = 'C:\Users\dingj\vox-director'
$log  = 'C:\Project\esggo-learning-center\.hermes\vox-setup-2.log'
New-Item -ItemType Directory -Force -Path $dest | Out-Null
git clone --depth 1 https://github.com/Alisa0808/vox-director.git $dest 2>&1 | Out-File $log -Append
foreach ($p in 'SKILL.md','SKILL.zh.md','AGENTS.md','scripts','references','examples') {
  Test-Path (Join-Path $dest $p) | Out-File $log -Append
}
# Claude Code registration (if missing):
$cc = 'C:\Users\dingj\.claude\skills\vox-director'
if (-not (Test-Path $cc)) { Copy-Item -Recurse $dest $cc; "COPIED to $cc" | Out-File $log -Append }
```

One-liner to hand the user (or paste into the spawned shell):

```powershell
powershell -ExecutionPolicy Bypass -File C:\Project\esggo-learning-center\.hermes\vox-setup-1.ps1; powershell -ExecutionPolicy Bypass -File C:\Project\esggo-learning-center\.hermes\vox-setup-2.ps1; Get-Content C:\Project\esggo-learning-center\.hermes\vox-setup-1.log; Get-Content C:\Project\esggo-learning-center\.hermes\vox-setup-2.log
```

Env-var presence check (never print the value):
`if ($env:ATLASCLOUD_API_KEY) { 'SET' } else { 'NOT SET' }`

## Machine facts learned along the way

- Desktop is OneDrive-redirected: `C:\Users\dingj\OneDrive\Desktop`.
- Win11 Traditional-Chinese UI; context menu labels: 在終端機中開啟.
- A stray 97-char "type" into a non-active Explorer file list created a
  new "常用 (Quick Access)" Explorer window — typed text can navigate,
  not just vanish.
- `capture(app='screen')` returns the Program Manager (desktop icons,
  primary monitor only in multi-monitor setups).
