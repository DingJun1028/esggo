# Hermes Cron & Terminal — Exact Error Transcripts & Fix Commands

## 1. Terminal SSH backend failure
**Error (terminal tool):**
```
SSH connection failed: getsockname failed: Not a socket
Read from remote host 161.118.248.180: Unknown error
```

**Misdiagnosis (DO NOT repeat this):**
```
hermes config set terminal.ssh_key "$HOME\.ssh\esggo_original"
# → ⚠ 'terminal.ssh_key' is not a recognized config key — it was saved anyway, but Hermes may not read it.
```
`terminal.ssh_key` is NOT a valid key. The terminal section only has: `backend`, `cwd`, `timeout`.

**Correct fix:**
```powershell
hermes config set terminal.backend local
# then RESTART Hermes (exit+relaunch, or /restart in gateway)
```
Then reach remote via local SSH client (independent of Hermes backend):
```bash
ssh esggo-vps "uptime && uname -a"
```

**Verified result (2026-08-06):**
```
VPS SSH OK
Linux esggo-vps 6.17.0-1019-oracle ... aarch64 GNU/Linux
```

---

## 2. Cron `opencode-zen` provider auth error
**Symptom:** cron job `last_status: error`, message `provider authentication error`.
**Config shows:** `provider: opencode-zen`, model `stepfun/step-3.7-flash:free`.

**Pitfall:** `cronjob update` silently ignores `model`/`provider` → returns `No updates provided`.

**Fix:** remove + recreate with empty model/provider (inherits session `opencode` provider).
```
cronjob action=remove job_id=<id>
cronjob action=create name=<name> schedule=<cron> prompt=<prompt> deliver=<target>
```

---

## 3. `no_agent` script cron `subprocess.run encoding` bug
**Error:**
```
Script execution failed: subprocess.run() got multiple values for keyword argument 'encoding'
```
This is identical across ALL script-type cron jobs (different scripts) → framework bug, not script bug.
**Confirmed:** reading `health-report.py` shows its `subprocess.run` calls only use `capture_output=True, timeout=30`; never `encoding`.

**Fix:** convert to agent mode (remove `script` field, rewrite logic into `prompt`).
Verified: `telegram-vps-bridge` → `last_status=ok`, `execution_success=true`.

---

## 4. `agents-cli` does NOT exist (false assumption — record to avoid repeating)
Prior sessions assumed a tool `agents-cli` installable via:
```
pip install git+https://github.com/DingJun1028/esggo@v1.0.0   # ❌ v1.0.0 tag does NOT exist
pip install git+https://github.com/DingJun1028/esggo@v1.0.0   # ❌ 'repository not found' (NousResearch/esggo-agents-cli)
```

**Facts (verified 2026-08-06 via `git ls-remote --tags` and repo clone):**
- `DingJun1028/esggo` valid tags: `OmniJules`, `v1.5.0`, `v2.1.0`. NO `v1.0.0`.
- `DingJun1028/esggo@v2.1.0` `pyproject.toml`: package name `esggo-python`, build-backend `setuptools.backends._legacy:_Backend` (broken on modern setuptools), **no `agents-cli` console_scripts entry**.
- `cli/` dir contains only `omni.mjs`. `skills/` contains only `oa`.
- **Conclusion:** `agents-cli` is not an installable package anywhere referenced. OA-Team 30-swarm "start" must be done via Hermes native `delegate_task` (spawn subagents) or via the existing `omni.mjs` / swarm skills — not a phantom CLI.

**Also note:** `DingJun1028/esggo` is an externally-managed Python env (PEP 668) on the VPS — `pip install` without venv fails with `externally-managed-environment`. Use `python3 -m venv` or `pipx`.
