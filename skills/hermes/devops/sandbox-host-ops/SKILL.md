---
name: sandbox-host-ops
description: Sandbox can't touch host repo; emit script, verify output.
version: 1.0.0
author: hermes
license: MIT
metadata:
  hermes:
    tags: [sandbox, host-bridge, git, windows-terminal, verify-output, esggo]
    related_skills: [verify-done-claims, esggo-best-practice-execution, hermes-tooling-install]
---

# Sandbox ↔ Host Operations Bridge

## When to Use
- The user asks you to run `git` / `gh` / `hermes` / a project CLI against a repo that lives on the **host machine** (`C:\...` on Windows, `/Users/...` on macOS), but your `terminal` tool is a **Docker/Linux sandbox** with no mount to the host.
- Symptom: `ls /mnt/c/Project/esggo` → `No such file or directory`, or `command -v hermes` → `NOTFOUND`, or the host CLI family the user names (e.g. `esggo-cli`, `omni-cli`, `core-cli`, `junaikey-cli`, `hermes-cli`) does not exist in the sandbox AND is not confirmed on the host.
- The user invokes autonomous modes ("最佳實踐覺 esggo", "GOD_MODE", "萬能分身 自主授權") — these authorize *executing the workflow*, not *fabricating results*. Still verify with real output.

## Detection (do this first, cheaply)
```bash
ls -d /mnt/c 2>/dev/null && echo "WSL_MOUNT_PRESENT" || echo "ISOLATED_SANDBOX"
command -v git hermes gh 2>/dev/null   # if empty, sandbox lacks even these
```
If `/mnt/c` is absent, the sandbox is isolated — **do not claim you can `cd` into the host repo**.

## Reliable Channel (VERIFIED pattern — use this)
The proven loop (worked in the 2026-08-15 esggo session):
1. Emit a **precise, copy-paste-ready** script for the user's **host terminal** (PowerShell on Windows, not bash).
2. Ask the user to run it and **paste the output back**.
3. **Verify with real tools** before declaring success:
   - PR existence: `gh pr view <n>` (or call it for them if a token is available) — never trust a "created" claim without the URL/number.
   - Remote state: `git remote show origin`, `git ls-remote`.
   - Live endpoint: `curl -sI https://...` for deployed services.
4. Never fabricate terminal output. If the user hasn't pasted it, say so explicitly and wait.

### Why this is the channel (not GUI driving)
`computer_use` *can* bring the host Windows Terminal to the foreground and type into it, but:
- **Background `type` is dropped** for `CASCADIA_HOSTING_WINDOW_CLASS` (Windows Terminal) — driver returns `background_unavailable`, escalate to `foreground`.
- Even in **foreground** mode, the `Enter`/return key delivery is `unverifiable` and frequently does **not** execute the buffered command — especially if a prior multi-line block (e.g. an unclosed `if/else`) is sitting in the input buffer waiting for a closing `}`.
- ⇒ GUI terminal driving ended **unresolved** in this session. Do NOT present it as a working method. Use it only to *bring the window forward / inspect state*; for actual execution, fall back to the emit-and-paste-back loop above.

## Pitfalls
- **Don't assume a host CLI exists just because the user named it.** "Omni-CLI" (esggo-cli/omni-cli/core-cli/junaikey-cli/hermes-cli) was invoked as if real but was absent in both sandbox and (unconfirmed) host. Verify with `where`/`command -v` before building a flow around it. If the user says "make it exist", treat that as *authorization to create it* — but a CLI you create in the sandbox still can't reach the host repo, so the bridge loop still applies.
- **Don't type into a polluted terminal.** If the host terminal shows a half-finished heredoc/`if` block, send `Ctrl+C` (foreground) first, confirm a clean `PS C:\Users\...>` prompt, then proceed.
- **Untracked debug artifacts**: exclude them from commits (`git add -u` stages only tracked files). e.g. `wd_out.txt` / `wd_trace.txt`.
- **Never commit/push directly to `main`** — open a feature branch, PR instead.

## References
- `references/esggo-git-flow.md` — known-good PowerShell script for the esggo "omni-12 contract sync" task: feature branch + conventional commit + `gh pr create` with 5T body. Reproduce with modifications.
