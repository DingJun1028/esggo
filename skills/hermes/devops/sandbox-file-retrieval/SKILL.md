---
name: sandbox-file-retrieval
description: Retrieve Windows-host pastes the Docker sandbox can't see.
tags: [docker, sandbox, windows, file-retrieval, github-api, paste-buffer]
triggers:
  - "paste_1 / paste_2 / paste_N / AppData\\Local\\hermes\\pastes"
  - "docker sandbox can't read AppData / Windows path not found / No such file"
  - "computer_use Windows Terminal Permission denied / Cua Driver refuses"
  - "git clone times out (124) but repo is reachable"
  - "user gave me a GitHub URL instead of pasting the file"
---

# Sandbox file retrieval

## Situation
The agent's `terminal` backend is a **Docker sandbox**. It mounts only:
- `C:\Users\<user>\OneDrive\...` (the user's OneDrive)
- `secret-vault` (if configured)

It does **NOT** mount `C:\Users\<user>\AppData`, `C:\ProgramData`,
`C:\Project`, or other Windows-local paths. So `read_file` / `ls` / `find` on
those paths fail with "No such file or directory" even though they exist on the
user's machine.

The user frequently delivers content by pasting a file into the Hermes paste
buffer, which lands at:
`C:\Users\<user>\AppData\Local\hermes\pastes\paste_N_HHMMSS.txt`
These are invisible to the sandbox.

## What does NOT work (do not retry)
- **computer_use on the Windows Terminal running Hermes is HARD-BLOCKED.**
  Capturing or clicking that window triggers:
  `Permission denied: Cua Driver refuses operations that target its own
  authorization process`
  This is cua-driver self-protection of its own authorization process. Every
  retry is refused. Do NOT loop on computer_use against Windows Terminal —
  switch to a different retrieval path below.
- **`git clone` / `git fetch` from GitHub often times out (exit 124)** in this
  environment even though the repo is reachable. Small requests
  (`git ls-remote`, `curl api.github.com`) succeed.

## Verified retrieval paths (priority order)
1. **Ask the user to paste the text into the chat.** Most reliable. When the
   user "pastes a file" via the OS paste buffer, only the *filename* reaches
   the agent — the *content* does not. Ask them to open the file and paste its
   contents as a chat message instead.
2. **Ask the user to copy the file into the OneDrive mount from a Windows
   Terminal / PowerShell prompt** (runs on the host, sees AppData):
   ```
   copy "C:\Users\<user>\AppData\Local\hermes\pastes\paste_N_HHMMSS.txt" "C:\Users\<user>\OneDrive\Documents\Default Project\"
   ```
   Then the sandbox `read_file` can read it directly.
3. **If the user supplies a GitHub URL instead of a paste**, do NOT `git clone`
   (times out). Use the GitHub API (see `references/github_slow_network.md`):
   - Confirm reachability: `git ls-remote <url>` (small, succeeds)
   - List the tree: `curl -s "https://api.github.com/repos/<owner>/<repo>/git/trees/<branch>?recursive=0"`
   - Read files: `curl -s "https://raw.githubusercontent.com/<owner>/<repo>/<branch>/<path>"`
   - Or `git clone --filter=blob:none --no-checkout` + `git sparse-checkout set
     <paths>` to pull only needed files (avoids full-tree timeout).
4. **Last resort**: switch the terminal backend to the Windows host
   (`hermes config set terminal.backend local` + restart) — a user-authorized,
   session-resetting operation; prefer paths 1–3.

## Pitfalls
- `os.path.isabs("C:\\Users\\x")` is **False** on Linux/docker. When porting
  Windows-authored path helpers that must also run in the Linux sandbox, detect
  Windows drive letters explicitly. See `references/cross_platform_path.md`.
- When porting one project's logic into another (e.g. MoneyPrinterTurbo →
  aistation), do NOT import the donor's private packages (`app.*`, `loguru`,
  `moviepy`, `litellm`). Extract only the self-contained pure-logic functions
  and rewrite them to match the target project's style (free-local first,
  frozen dataclasses, structured logging via the target's `config.log`).
- `web_extract` on a GitHub HTML URL (`https://github.com/<owner>/<repo>`)
  returns HTTP 404 (Crawl4AI cannot render it). Use the `raw.` or `api.` hosts.

## References
- `references/github_slow_network.md` — exact commands for API-based repo retrieval
- `references/cross_platform_path.md` — the Windows-drive-letter path pitfall + fix
