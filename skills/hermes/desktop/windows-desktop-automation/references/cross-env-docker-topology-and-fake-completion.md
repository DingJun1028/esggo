# Cross-environment execution topology & log-relay fake-completion proof

Condensed from the 2026-08-22 session (esggo / Windows host + Hermes docker backend).

## 1. Hermes terminal runs in a docker backend, not on Windows

The `terminal` tool executes inside a Linux docker container. Its mount map is
PARTIAL:

- VISIBLE: `/c/Users/dingj/` (so `write_file`/`read_file` against
  `C:\Users\dingj\…` resolve, and `python3` there can read/write that tree).
- NOT MOUNTED: `/c/Users/dingj/.ssh/` and `/c/Project/`.
  → `ls /c/Users/dingj/.ssh` → "No such file or directory"
  → `cd /c/Project/esggo` → "cannot change to that directory"
  even though both exist on the real Windows host.

Consequences:
- The `hermes` CLI and Windows-only tools are absent in docker (`command -v hermes` → absent). `hermes doctor --fix`, `git push` against a Windows-only repo, and SSH with a Windows private key can ONLY run on the Windows side (via `computer_use` or the user).
- Docker DOES have `ssh`/`curl` and can reach the VPS (`161.118.248.180:22` reachable), but cannot read the Windows key (`/c/Users/dingj/.ssh` unmounted) → SSH-from-docker is impossible for key auth.
- When `terminal` and `computer_use` disagree about what exists, suspect the mount map before assuming a tool is broken.

## 2. Log-file relay is the definitive fake-completion detector

Pattern: write a script via `write_file` to `/c/Users/dingj/<name>.ps1` (docker-writable,
Windows-readable), have the script pipe output to `<name>.log` via `Tee-Object`, run it on
Windows, then `read_file` the log from docker.

Decisive case this session: two scripts (`ssh_check.ps1`, `doctor_fix.ps1`) were staged and the
Windows side was driven via foreground `type`+`return`. After the attempts, `read_file` of BOTH
`.log` files returned FILE_NOT_FOUND. That absence is **definitive proof the commands never
executed on Windows** — not a transient failure, not a silent success. The foreground returns
had reported "Typed N char(s)…" but the keystrokes were swallowed (see #3), so no log was ever
produced.

Rule (the user's iron guard): for any task that must run on Windows via computer_use, the
existence of its output artifact in the docker-mounted dir is the ONLY acceptable completion
evidence. No artifact = not done, regardless of what vision seemed to show.

## 3. Windows Terminal control-bar trap during active computer_use

While a `computer_use` action is in flight, the bottom line of a Windows Terminal capture may
read `$> msg=interrupt ./queue /bg /steer · Ctrl+C cancel`. That is the **Hermes CLI TUI's own
input bar**, NOT a PowerShell prompt. Any `type`+`return` aimed there is swallowed and
re-routed as an agent steer/user message — it never reaches PowerShell.

Discriminator: real PS prompts look like `PS C:\Users\dingj>`; the TUI bar is `$> msg=interrupt
…` and is paired with `$Hermes` status blocks + a model/token status bar in the vision analysis.
Never assume the bottom capture line is the prompt while computer_use is mid-session. A stray
`type` can also silently re-title a PowerShell tab to the typed string — another tell that the
input was dropped.

## 4. Recommended robust path (when foreground typing is unreliable)

Stage the whole job as a self-contained `.ps1` that writes a `.log`, then execute it on Windows
via the most reliable channel available (fresh PowerShell tab via the pane's ＋ button, or a
double-click in Explorer per the parent skill's staged-.bat recipe), and verify by reading the
`.log` back from docker. Do NOT declare success until the artifact exists.
