---
name: windows-terminal-cua-enter-limitation
description: cua-driver Enter 在 Windows Terminal 不可靠；且 Hermes 顯示層會把 key 欄位遮成 *** 誤判 patch 失敗。沙箱終端其實能直接跑 git/gh 開 PR，優先自跑。
---

# Windows Terminal cua-driver Enter Limitation

## Critical finding (verified 30+ rounds, 2026-08-22)
cua-driver CANNOT reliably execute commands in Windows Terminal:
- `type`+`keys:return` → string appears but Enter does NOT trigger (unverifiable, no output).
- `key return`/`SendInput` → string sends fully but Enter still no-op.
- `Ctrl+C` works; `Ctrl+T` mis-sends as literal `^T` (WT new-tab = `Ctrl+Shift+T`).
- Fresh clean tab does NOT fix Enter.

Root cause: GUI input layer cannot confirm Enter to PowerShell. Environment limitation, not command error. Fall back to user-paste after 2–3 attempts.

## Sandbox (CORRECTED 2026-08-23 — prior note was wrong)
- terminal backend is git-bash (MSYS); `C:\Project\esggo` IS reachable via `C:/Project/esggo` (NOT `/c/Project`, NOT `/mnt/c`).
- **Agent CAN run git directly** from the sandbox terminal: `git -C "C:/Project/esggo" status/add/commit/checkout/push` all work, and `gh -R DingJun1028/esggo pr create ...` works because the host GitHub CLI token is shared with the sandbox (same machine, MSYS). This session proved it: 3 PRs (880/881/882) were authored end-to-end from the sandbox with ZERO user paste.
- **Only fall back to user-paste if sandbox git/gh actually errors** (e.g. auth, network). Do NOT assume paste is required.
- Use `workdir:/tmp` + `git -C "C:/Project/..."` to avoid corrupted MSYS HOME init (exit 126).

## Hermes display-layer redaction (CRITICAL gotcha)
- `read_file` / `patch` result echo MASK sensitive-looking strings: e.g. `geminiApiKey: CFG.geminiApiKey` is displayed as `geminiApiKey: ***` because `key` triggers redaction. This makes a successful edit LOOK like it failed.
- `patch` reports `success:true` but `read_file` still shows `***` → do NOT trust it as "edit failed". Verify the REAL on-disk content with Python, not read_file:
  ```python
  from hermes_tools import execute_code  # or write a temp .py and run
  lines = open("C:/Project/esggo/apps/omnilive/server.mjs", encoding="utf-8").read().splitlines()
  for i,l in enumerate(lines[126:134], start=127): print(i, repr(l))
  ```
  `repr()` shows the true value (e.g. `'    geminiApiKey: CFG.ge...ey,'`). If `patch` says success AND Python repr confirms the real value, the edit is good.
- Also: when `patch` says success but the file was only partially read (pagination), re-read the WHOLE file before trusting — fuzzy match may have matched elsewhere.

## .bat double-click anti-pattern
- `write_file` produced `.bat` files that FAIL when double-clicked: cmd parses with wrong line/encoding → errors like `'sh' is not recognized`, `'apps' is not recognized`. The `chcp 65001` + `cd /d` wrapper does NOT reliably survive `write_file`'s CRLF/BOM handling.
- Do NOT hand the user a `.bat` to double-click. Prefer: run the git/gh commands yourself from the sandbox terminal (see Sandbox above), OR give one-line `git -C` commands for the user to paste into an already-open PowerShell.
1. Prepare ONE line with `;` separators, OR list one-per-line for user to paste + Enter each.
2. Do NOT include explanatory prose in the paste block (user may paste prose → error).
3. User pastes in host PowerShell; confirm prompt shows correct dir (`PS C:\Project\esggo>`, not `C:\Users\dingj>`).
4. User pastes output back.
5. Verify with GitHub REST API, not gh return:
   `curl -sS -m 25 "https://api.github.com/repos/OWNER/REPO/pulls/N"` → state/head.ref/body.

## Anti-patterns
- Looping cua Enter — fall back after 2–3 tries.
- Multi-line block pasted as one chunk without newlines → PowerShell merges into first cmd's args.
- Path typo `Pr7oject` vs `Project`.
- `gh pr create` with unquoted `cd` prefix → `unknown arguments ["cd" ...]`; use `;` or separate `cd`.
- Use `workdir:/tmp` + `git -C "C:/Project/..."` to avoid corrupted MSYS HOME init (exit 126).
