---
name: "nvidia-agent-stack"
description: "NemoClaw/Brev on WSL2/Linux. Trigger: nemoclaw, brev."
license: "Apache-2.0"
---

# NVIDIA Agent Stack: NemoClaw / Brev / OpenShell

## Critical Distinction (the #1 confusion — get this right first)
- **NemoClaw** = NVIDIA open-source agent sandbox stack (OpenClaw runtime + OpenShell gateway + Docker/WSL). **Self-hostable** on your own Linux or Windows-WSL2 machine. Does NOT require Brev.
- **Brev** = NVIDIA cloud GPU VM hosting platform (brev.nvidia.com). The `brev` CLI creates GPU instances on Brev's cloud. **NOT self-hosted** — it's their infrastructure, may incur cost.
- **OpenShell** = the gateway component INSIDE NemoClaw. Installed automatically by `nemoclaw onboard`. **Do NOT install/upgrade OpenShell separately** (`openshell self-update`, `npm update -g openshell` corrupt the NemoClaw-managed state — see Pitfalls).

When user asks "can I self-host VPS with Nemo" → answer is **NemoClaw** (not Brev). When user pastes a `brevdev/brev-cli` install script → that installs Brev CLI (cloud path), a different product from NemoClaw.

## Verified: Install Brev CLI on Windows (Git-Bash fails → use WSL)
The one-liner `bash -c "$(curl -fsSL https://raw.githubusercontent.com/brevdev/brev-cli/main/bin/install-latest.sh)"` **fails on Windows native Git-Bash/MSYS** with:
`Error: Could not find release for mingw64_nt-10.0-XXXXXX amd64` — the script detects the MSYS platform string and GitHub has no binary for it.

**Fix (verified 2026-08-26, brev v0.6.334 installed to /home/dingjun1028/.local/bin/brev):**
```bash
# Run INSIDE WSL Ubuntu, SINGLE-LAYER pipe. Do NOT nest bash -c "$(...)" —
# the Windows shell expands $() before WSL sees it and breaks the script's
# internal quoting (you get "syntax error near unexpected token `('").
wsl -d Ubuntu -- bash -c 'curl -fsSL https://raw.githubusercontent.com/brevdev/brev-cli/main/bin/install-latest.sh >/tmp/b.sh && bash /tmp/b.sh'
# Then in WSL:
export PATH="${HOME}/.local/bin:${PATH}"
brev --version   # v0.6.334
```
Prereq: WSL2 + a registered Ubuntu distro (`wsl -d Ubuntu` must work; if Stopped, `wsl -d Ubuntu -e echo ok` wakes it). The script itself is safe (see Safe remote-script pattern).

## Safe remote-script pattern (apply to ANY curl|bash install)
Even when the user explicitly authorizes `bash -c "$(curl ...)"`, do this first:
1. Download only: `curl -fsSL <url> -o /tmp/script.sh` (or `$LOCALAPPDATA/Temp/script.sh` on Windows).
2. Scan: `grep -nE "sudo |curl .*\| *sh|rm -rf /|chmod 777|base64|eval |/etc/|apt-get|brew " script.sh`
3. Only execute after confirming no exfiltration / no destructive writes. (The Brev script: only fetches GitHub release metadata via API, no sudo, no rm -rf, no outbound credential send — safe.)
4. Prefer running Linux-only tooling inside WSL, not Windows Git-Bash.

## Hermes skill-install safety (observed 2026-08-26)
`hermes skills install` runs a security scan. Some NVIDIA skills were **BLOCKED** and `--force` did NOT override:
- `NVIDIA/skills/skills/rag-blueprint` → BLOCKED (1 CRITICAL exfiltration, traversal, privilege_escalation).
- `NVIDIA/skills/skills/nemo-retriever` → BLOCKED (11 findings: dns_exfil, git_clone, sudo_usage, unpinned_pip_install).
- `NVIDIA/skills/skills/nemo-relay-install` → CAUTION (allowed but warned).
Safe installs: `nemoclaw-user-guide`, `nemo-relay-plugin-build`, `nemo-relay-*` (most), `chinese-code-review`. Treat BLOCKED as "do not install" — never bypass.

## Documented (official docs.nvidia.com/nemoclaw, NOT executed this session — verify before relying)
- **NemoClaw self-host prerequisites**: 4 vCPU / 8 GB RAM (16 rec) / 20 GB free (40 rec). Sandbox image ~2.4 GB compressed; <8 GB RAM can trigger OOM killer during image push → add ≥8 GB swap.
- **Platform support**: Linux+Docker = Tested (Ubuntu 24.04 primary). Windows WSL2+Docker Desktop = Tested with limitations. **Native Windows NOT supported** (use WSL). macOS Colima/Docker = Tested with limitations. **ARM/aarch64 NOT in the Tested matrix** (x86_64 is primary) — verify before committing an ARM VPS (e.g. Oracle aarch64).
- **Install flow**: `curl -fsSL https://www.nvidia.com/nemoclaw.sh | bash` → installs `nemoclaw` CLI → auto-runs `nemoclaw onboard` → onboard installs OpenShell + OpenClaw sandbox. Do NOT pre-install OpenShell.
- **Credential risk**: NemoClaw stores provider tokens / `ollama-proxy-token` / `dual-station-vllm-api-key` / `managed-llama-cpp/api-key` under `~/.nemoclaw/` (mode 0600). Never paste these into chat or git.
- **Ollama conflict**: NemoClaw's `ollama-proxy` / `managed-llama-cpp` can take over an existing Ollama. If the host already runs Ollama (local inference, TencentDB bridge, s2s-voice), plan for the takeover before installing.
- **Uninstall**: `nemoclaw uninstall --yes` preserves user data (sandboxes.json, backups) by default; `--destroy-user-data` clears. Don't manually delete `sandboxes.json` (host forgets sandboxes).

## Pitfalls
- Don't confuse "self-host VPS + Nemo" with Brev (cloud). Different products.
- Don't run `curl|bash` blindly on Windows Git-Bash for Linux-only tools — use the WSL single-layer-pipe fix.
- Don't manually install/update OpenShell — `nemoclaw onboard` owns it.
- ARM VPS (Oracle aarch64) self-host feasibility is UNVERIFIED — run a readiness check before full install.
- VPS disk/swap: full root fs (81%+) or system swap (99%) breaks image push — clean / add swap first.

## User input note (garbled pinyin / voice-to-text)
User input around NVIDIA terms may be phonetically garbled. Observed: `oPEN schell`→OpenShell, `nvIdia`→NVIDIA, `草莓扭百多`→unresolved (likely OpenAI "Strawberry" or NVIDIA "Nemotron" mis-transcription — NOT a real NVIDIA product). When input looks off, search to disambiguate + ask for clarification; do not assume or fabricate a product.

## References
- `references/nemoclaw-research.md` — condensed official doc facts + Brev install transcript from 2026-08-26.
