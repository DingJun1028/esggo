---
name: hermes-terminal-backend-recovery
description: Fix Hermes terminal cwd locks on Windows.
---

# Hermes Terminal Backend Recovery

> Class-level skill for recovering from terminal backend failures on Windows.

---

## When to Use
- All `terminal` calls fail with `cd: C:\c\Users\dingj: No such file or directory`
- Terminal backend stuck on invalid cwd after workspace switch
- `git` / `gh` / `pnpm` via terminal all fail with same path error

---

## 1. Quick Diagnosis

```bash
pwd && ls -la
```

If output shows `cd: C:\c\Users\dingj: No such file or directory`, the terminal backend cwd is locked.

### 1.1 Variant: cwd corrupted by a bad textual substitution (seen 2026-08-23, cron)
Signature on the FIRST terminal call of a session (an embedded literal `"` is the tell):

```
bash: line 3: cd: "C:\Users\dingj\iCloudDrive\Projects\esggo"ocuments/Default Project: No such file or directory
exit_code: 126
```

`/c/Users/dingj/OneDrive/D` + `ocuments/Default Project` had its prefix string-replaced by a quoted
iCloud path, so the session cwd is a spliced non-path. Two traps:

- **`exit_code: 126` plus the runner hint "the file was found but is not executable — chmod +x it" is
  a RED HERRING.** Nothing is wrong with the script; the harness's own `cd` into the session cwd
  failed before the interpreter ever ran. Do not `chmod`, do not re-invoke via `bash`.
- The fault is **persistent, not transient** — it comes from stored config, so every new session
  (including every cron turn) hits it on its first command until fixed on the host.

### 1.2 workdir MUST be the MSYS form — a drive-letter value is appended RELATIVELY
The documented override silently fails when the cwd is already broken. Passing
`workdir: 'C:/Users/dingj'` returned:

```
cwd: /c/Users/dingj/OneDrive/Documents/Default Project/C:/Users/dingj
python3: can't open file '/c/Users/dingj/OneDrive/Documents/Default Project/C:/Users/dingj/C:/Users/dingj/AppData/...'
```

The drive-letter form is not recognised as absolute at this layer, so it is joined onto the broken
cwd — and the argument path is then prefixed a second time. Use the MSYS form, belt-and-braces the
`cd`, and **read the returned `cwd` field to confirm the override landed**:

```bash
# workdir: /c/Users/dingj
cd /c/Users/dingj && pwd && python3 AppData/Local/hermes/scripts/<script>.py
```

Prefer a **relative** script path after the `cd`; an absolute `C:/...` argument gets prefixed too.

**The `workdir` parameter is MANDATORY — an in-command `cd` alone does NOT recover (verified
2026-08-23, cron).** Running `cd /c/Users/dingj && pwd && python3 ...` with **no** `workdir` still
died with the identical spliced-path error and `exit_code: 126`. Reason: the harness performs its own
`cd` into the broken session cwd at **`line 3`**, i.e. *before* your command body executes, so a `cd`
you write inside the command never runs. Only the `workdir` override changes the directory the
harness itself enters. Keep the in-command `cd` as belt-and-braces, but never rely on it alone.

Confirmed working 2026-08-23 (cron, OA_VPS keepalive): `workdir: /c/Users/dingj` +
`cd /c/Users/dingj && pwd && python3 AppData/Local/hermes/scripts/<script>.py` → `EXIT=0`.
**Nuance on "read the returned `cwd`":** the field is present only when the override *deviates* from
the session cwd — the FAILING drive-letter attempt returned `cwd: .../C:/Users/dingj`, while the
SUCCESSFUL MSYS attempt returned **no `cwd` field at all**. So absence of `cwd` is not a failure
signal; verify with an explicit `pwd` in the command instead of looking for the field.

### 1.3 Under cron you cannot fix the config, only work around it
- `execute_code` is refused in cron (no user to approve), so the §2.2 bypass is unavailable —
  the §1.2 workdir override is the ONLY recovery available to a cron turn.
- `hermes` is **not on PATH** in the sandbox shell (`command not found`), and only
  `AppData/Local/hermes/scripts/` is mounted — `config.yaml` is absent, so the cwd value cannot even
  be read, let alone corrected, from the sandbox. Report it for a host-side fix (§2.1) instead of
  retrying.

---

## 2. Recovery Steps

### 2.1 Preferred: Switch backend
```bash
hermes config set terminal.backend local
# Fully restart Hermes
```

### 2.2 Workaround: execute_code bypass
```python
import subprocess, shutil
git = shutil.which('git')
gh = shutil.which('gh')
print(git, gh)

# Use git -C to specify repo path directly
subprocess.run(['git', '-C', r'C:\Project\esggo', 'status', '--short'], capture_output=True, text=True)
```

### 2.3 Fix cwd directly
```bash
cd /c/Project/esggo
```

---

## 3. Prevention

- Avoid switching to non-existent directories in Hermes terminal
- If cwd lock occurs, prefer solution 2.1 (backend switch) over repeated retries

---

## 4. Related Skills
- `esggo-aistation-deployment` — AI Station VPS deploy (user-owned)
- `windows-hermes-tooling` — Windows Hermes SSH/cron pitfalls
- `esggo-next-build-recovery` — Next.js build recovery

---

## 5. References
- `references/windows-terminal-cwd-lock.md` — session-specific error transcript and reproduction
