---
name: esggo-local-repo-ops
description: Sandbox git/gh on esggo works; use git -C to avoid cd typos.
---

# esggo-local-repo-ops

## When to use
User asks to commit / open PR / merge in the esggo repo but cannot reliably type in their own terminal (repeated `cd`→`d` typos, pasting instruction text into PowerShell, cua-driver Enter unreliable). You need to verify a PR's real state.

## KEY FACT (verified 2026-08-23)
The Hermes **sandbox terminal (Windows MSYS) CAN run git and gh directly against `C:/Project/esggo`**. Do NOT fall back to (a) asking the user to paste commands, or (b) curl-only verification. The earlier belief that "sandbox git is isolated / fails" was caused by the WRONG path format (MSYS `/c/Project/esggo` → "cannot change to"), not by real isolation.

### Path format
- ✅ `C:/Project/esggo` (forward-slash native Windows path) — works with git/gh/node.
- ❌ `/c/Project/esggo` (MSYS-style) — fails: "cannot change to" / "not found".

### Anti-typo trick (user types `cd` as `d` repeatedly)
Use `git -C C:/Project/esggo <subcommand>` so you NEVER type `cd`:
```
git -C C:/Project/esggo add apps/omnilive/server.mjs
git -C C:/Project/esggo commit -m "fix(omnilive): ..."
git -C C:/Project/esggo checkout -b fix/xxx origin/main
git -C C:/Project/esggo push -u origin fix/xxx
gh -R DingJun1028/esggo pr create --head fix/xxx --title "..." --body "..."
```

## PR workflow (one concern per PR)
1. `git fetch origin`
2. `git checkout -b <type>/<slug> origin/main`  (base on LATEST origin/main, NOT local main — local main may have stray commits)
3. `git add <specific files>`  (NEVER `git add -A` — a prior session's `git add -A` on main created stray commits)
4. `git commit -m "type(scope): conventional message"`
5. `git push -u origin <branch>`
6. `gh -R DingJun1028/esggo pr create --head <branch> --title "..." --body "..."`
7. **Verify with REST, not gh output alone**.

### Cherry-pick across branches
If a commit already sits on local `main` but you need it on a fresh branch: `git checkout <sha> -- <files>` then commit. A bare `git cherry-pick <merge-sha>` fails with "is a merge but no -m option".

## Cleanup local main after all merged
```
git checkout main
git reset --hard origin/main   # safe: all real changes already via PRs/merged
```
Resolves "diverged" state. Untracked user scripts (e.g. `*.ps1`) are preserved.

## PITFALL: read_file shows `***` for secrets (desensitization)
Hermes **display layer redacts** any string containing `key`/`token`/`secret` as `***` in `read_file` / `patch` tool output. This is NOT the real file content.
- Symptom: you patch `geminiApiKey: *** → CFG.geminiApiKey`, tool reports success, but re-reading shows `***` again → you falsely think the patch didn't apply.
- Reality: the file already has `CFG.geminiApiKey`; `***` is just the display mask.
- Verify with Python (bypasses display redaction):
  ```python
  p="C:/Project/esggo/apps/omnilive/server.mjs"
  print(repr(open(p,encoding="utf-8").read().splitlines()[130]))
  ```
- Or run `node --check` + actual runtime; if it works, the content is correct.

## PITFALL: .bat double-click from Hermes-written files
Writing a `.bat` via `write_file` then telling the user to double-click it failed (`'sh' is not recognized` — cmd misparsed LF/BOM). Prefer running git directly from the sandbox terminal. Don't route around terminal difficulty with .bat files.

## PITFALL: patch on partially-read files
If you read a file with `read_file` using `offset`/`limit` (paginated), a later `patch` may report `success` but the fuzzy match can be misleading (you'll get a warning "Re-read the whole file before overwriting"). For precise edits on source you only read partially, use `execute_code` with Python `open().read().replace(old, new)` and assert `old in content` first.

## See also
- `verify-done-claims` — general "verify self-reported done via curl + API" patterns.
- `windows-terminal-cua-enter-limitation` — cua-driver Enter unreliable; prefer sandbox terminal git over driving the user's terminal.
