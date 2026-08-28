---
name: hermes-windows-wsl-sandbox-ops
description: Use when operating dingj's Windows/WSL/VPS.
---

# Hermes Windows/WSL Sandbox Operations (dingj setup)

Operating pattern for this user's environment, derived from repeated sessions. The Hermes
agent runs in a **Docker sandbox** that is deliberately isolated from the user's host
credentials and VPS access. Knowing these boundaries prevents fake-completion and wasted turns.

## Hard sandbox boundaries (verified, not guesses)

- **`~/.ssh` is NOT mounted** in the sandbox. Any `ssh`/`scp`/`rsync` to the Oracle VPS
  (`ubuntu@161.118.248.180`) or any remote host will fail or hang. Do NOT claim to deploy
  to VPS — generate the command for the user to run on their host.
- **`C:\Users\dingj\secret-vault\` is NOT mounted** (first-principle secret vault,
  `ENV20230818.env` at chmod 600). Do NOT write credentials, API keys, or tokens into any
  file via the sandbox. Generate a local PowerShell/editor instruction for the user.
- The sandbox CAN read/write the user's project repos (e.g. `C:\Project\esggo`) and can
  run `wsl -d Ubuntu -- <cmd>` because WSL is a local process bridge, not a remote host.

## Pattern: generate command cards, don't fake execution

For any task requiring SSH / SCP / secret-vault write / paid-cloud login, the agent's job is:
1. Do everything verifiable locally (write the deployment files, audit install scripts,
   run local-only tests, merge via `gh` CLI which IS authenticated in sandbox).
2. Produce a precise, copy-pasteable command card (PowerShell for host, bash for VPS/WSL).
3. State explicitly: "I cannot execute this — sandbox has no .ssh / no secret-vault mount."

This is NOT a failure — it is the correct division of labor. The user expects honest
boundary reporting, not fabricated SSH success.

## Verified technique: curl|bash installs under MSYS

`bash -c "$(curl -fsSL https://.../install.sh)"` FAILS when run in the default Git-Bash /
MSYS shell on this Windows host: the script detects `mingw64_nt-10.0-*` and finds no
platform binary (or nested `$(...)` gets mangled by double bash -c quoting).

**Fix (proven with Brev CLI v0.6.334):**
```bash
# Run INSIDE WSL Ubuntu, single-layer pipe, no nested bash -c
wsl -d Ubuntu -- bash -c 'curl -fsSL <url> | bash'
```
- Pre-audit the script first: `curl -fsSL <url> -o /tmp/x.sh` then `grep -nE 'sudo |rm -rf /|curl .*\| *sh|chmod 777|base64|eval ' /tmp/x.sh` — only pipe-execute after confirming no dangerous patterns.
- NVIDIA NemoClaw's `https://www.nvidia.com/nemoclaw.sh` audited clean (Apache-2.0, ref-pinned
  bootstrap, no sudo/rm-rf/chmod777). It requires Docker daemon UP in WSL — see pitfall below.

## Pitfall: Docker WSL integration is a GUI step the agent cannot do

Docker Desktop is installed on the host and the Windows daemon comes UP, but **WSL2
integration is OFF by default** — `wsl -d Ubuntu -- docker info` hangs/times out because the
docker binary isn't exposed into the distro. This blocks NemoClaw / any containerized install
inside WSL.
- The fix is a **GUI action** in Docker Desktop: Settings → Resources → WSL Integration →
  tick "Ubuntu" → Apply & Restart. The agent cannot click this; it must ask the user.
- Before attempting containerized installs in WSL, verify: `wsl -d Ubuntu -- docker --version`
  (times out if integration off — don't loop on it; report the GUI step).

## What the agent CAN do locally (no boundary issue)

- `gh` CLI (authenticated) — PR create/merge, checks. Used to merge ftg+proxy work.
- `wsl -d Ubuntu -- <cmd>` for non-SSH local work (install CLI tools, run python, grep).
- Write deployment/proxy/config files into the repo; verify them with local servers/tests.
- Audit remote install scripts by downloading (not executing) them.

## User autonomy signals (operating style)

This user authorizes aggressive autonomous execution ("繼續", "由你決定", "123授權進行",
"你代", "全部由你最佳實踐提出反問在自說自話自我解答"). Honor it for LOCAL/REPO/GH actions,
but never let autonomy override the sandbox boundaries above — autonomy does not grant SSH
or secret-vault access. When blocked by a boundary, still proceed with everything else and
hand back a command card.
