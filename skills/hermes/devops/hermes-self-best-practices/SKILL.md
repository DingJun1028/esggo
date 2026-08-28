---
name: hermes-self-best-practices
description: "Audit and harden Hermes config: model drift, cron re-pin."
version: 1.0.0
author: DingJun1028 / OA-Team
license: MIT
platforms: [linux, macos, windows]
---

# Hermes Self Best-Practices (體檢 & 優化)

Run this pass whenever the user says "最佳實踐優化 hermes 自身" / "harden hermes" / "audit hermes config". It is a fixed ordered procedure — do not reorder the verification steps.

## Invariant (never violate)
- **NEVER hand-edit `config.yaml`.** Always use `hermes config set <section.key> <value>`. A stray indent corrupts the file and breaks the live gateway.
- Secrets stay in `.env`; settings in `config.yaml`.

## Phase 0 — Load the hub skill first
Load `hermes-agent` skill (it is the source of truth for paths/commands). Also load `hermes-model-resolution` when any model/provider string looks wrong.

## Phase 1 — Diagnose (read-only)
```bash
hermes --version
hermes status                      # API keys, auth providers, model
hermes config show                 # full current config snapshot
hermes config check                # missing sections / version drift
hermes cron list                   # find fail-closed jobs
```
Capture: model.default, model.provider, delegation.{model,provider}, terminal.cwd, timezone, compression, security, memory.

## Phase 2 — Audit against these known gaps (checklist)
| Check | Bad value → Good value |
|-------|------------------------|
| Shell cwd valid on host OS | `terminal.cwd: /opt/esggo` (Linux VPS path on Windows) → a real local path, e.g. `/c/Users/<user>/OneDrive/Documents/Default Project` |
| model.default matches active session | stale `deepseek/deepseek-v4-flash-free` → `tencent/hy3:free` (or current) |
| delegation.provider matches main | orphan `opencode-zen` → `nous` |
| delegation.model valid under that provider | `deepseek-v4-flash-free` is ONLY valid under `opencode-zen`; under `nous` it 404s → set to the same as model.default |
| timezone set for user | `(server-local)` → `Asia/Taipei` |
| subagent autonomy | `subagent_auto_approve: false` → `true` (if user prefers no re-confirmation) |
| proactive compression | `compression.proactive_prune_tokens: 0` → `8192` (trims huge tool output before context overflow) |
| model alias | none → `model.aliases.fav = <current model>` for `/model fav` |

## Phase 3 — Apply (via hermes config set)
```bash
hermes config set model.default tencent/hy3:free
hermes config set model.provider nous
hermes config set delegation.provider nous
hermes config set delegation.model tencent/hy3:free
hermes config set terminal.cwd "/c/Users/dingj/OneDrive/Documents/Default Project"
hermes config set timezone "Asia/Taipei"
hermes config set delegation.subagent_auto_approve true
hermes config set compression.proactive_prune_tokens 8192
hermes config set model.aliases.fav tencent/hy3:free
```

## Phase 4 — Re-pin fail-closed cron jobs (CRITICAL)
When `model.default` changes, `hermes config set` warns: unpinned cron jobs stored an old `model_snapshot` and will **fail closed** on next run. They show `error: RuntimeError: Skipped to prevent unintended spend: global inference config drifted...` in `hermes cron list`.

The `cronjob` tool's `update` action does NOT expose provider/model (it errors "No updates provided"). Use the **`hermes cron edit`** CLI instead:
```bash
for id in <job_id_1> <job_id_2> ...; do
  hermes cron edit "$id" --model "tencent/hy3:free" --provider "nous"
done
```
Note: `hermes cron edit --model` requires the agent's own CLI (the cronjob tool cannot set it).

## Phase 5 — Verify
```bash
hermes config check
hermes config get terminal.cwd          # must be valid local path
hermes config get delegation.model      # must be valid under delegation.provider
hermes cron list                         # no more "Skipped to prevent unintended spend"
```
Functional test of the shell bug fix: `hermes chat -q "echo OK; pwd"` and confirm NO `cd: /opt/esggo: No such file or directory`.

## Pitfalls (learned the hard way)
- `hermes fallback add` REQUIRES an interactive terminal — cannot be piped/non-interactive. Leave it for the user to run locally.
- `doctor` does a live network health check and can hang 180s+ — don't rely on it for config verification; use `config check` + `config get`.
- `deepseek-v4-flash-free` exists ONLY under `opencode-zen`. Under `nous`/`model.default` it 404s.
- Never loop the `cronjob` tool's `update` for model/provider — it has no such params. Switch to `hermes cron edit`.
- On Windows, `terminal` runs Git-Bash (POSIX). Use MSYS paths like `/c/Users/...`, not `C:\...` for `terminal.cwd`.

## Verification evidence rule
Report only what real tool output returned. If `doctor` hangs, say so and fall back to `config check`.
