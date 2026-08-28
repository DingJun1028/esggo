# Canonical VPS + agents-cli Notes (CORRECTED 2026-08-07)

## Canonical VPS IP
- Use OCI console public IP as source of truth.
- Current canonical IP: `161.118.248.180`
- Hostname: `esggo-vps`
- User: `ubuntu`
- Deploy path: `/opt/esggo`
- `ssh-keygen -y -f $HOME/.ssh/esggo_original` (NOT `~`) to recover the public key from the private.

## ⚠ agents-cli / `swarm start` is a PHANTOM — do not install or invoke it
Verified 2026-08-07 by real SSH to VPS + `git ls-remote` + clone:
- `DingJun1028/esggo@v2.1.0` → package `esggo-python`, NO `agents-cli` entrypoint, NO `swarm`.
- `DingJun1028/agents-cli` → clone of Google's `google-agents-cli` (identical README). Root has NO
  `package.json`, so `npm install git+https://github.com/DingJun1028/agents-cli.git` FAILS with
  `ENOENT: .../package.json`. Google's CLI exposes only `setup/scaffold/eval/deploy/publish` — NO `swarm`.
- The prior note claiming "npm publishes agents-cli up to 0.1.3" and "npm install --prefix ~/.local ...
  DingJun1028/agents-cli.git" works is FALSE. Do NOT use it.
- `agents-cli swarm start --agents=30` does NOT exist in any source. Never fabricate one.

## Correct swarm primitives
- Hermes `delegate_task` — up to 10 parallel subagents/batch; extend to 30 across batches.
- Custom orchestrator script + systemd for VPS-resident 30 workers (no prebuilt tool).

## SSH backend self-lock (critical)
- `terminal.backend=ssh` set LIVE locks the agent's own `terminal` tool (recovery cmd also fails
  pre-restart: `getsockname failed`). Keep `backend=local`; drive VPS via `ssh esggo-vps "..."`.
  The 6 ssh keys are read only after a full Hermes restart — see SKILL.md §2.

## Common SSH Typo
- Error: `Could not resolve hostname <IP>ssh`
- Cause: user typed `ssh ubuntu@161.118.248.180ssh` without spacing.
- Fix: use exactly `ssh ubuntu@161.118.248.180` or `ssh esggo-vps` from config.
