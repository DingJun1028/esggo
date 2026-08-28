# NemoClaw / Brev Research Notes (2026-08-26 session)

## Verified: Brev CLI install on Windows
- Command attempted (user-authorized): `bash -c "$(curl -fsSL https://raw.githubusercontent.com/brevdev/brev-cli/main/bin/install-latest.sh)"`
- Windows native Git-Bash result: `Error: Could not find release for mingw64_nt-10.0-26200 amd64` (EXIT=1) — script detects MSYS platform, no GitHub binary.
- Fix applied: `wsl -d Ubuntu -- bash -c 'curl -fsSL <url> | bash'` → SUCCESS, brev v0.6.334 installed to `/home/dingjun1028/.local/bin/brev`.
- Script safety scan (2323 bytes): no `sudo`, no `rm -rf /`, no `curl|sh` self-recursion, no `/etc/` writes, no credential exfil (reads `GITHUB_TOKEN`/`gh auth token` only to fetch release metadata).
- `brev --version` → `Current Version: v0.6.334`. `brev --help` → instance commands (create/list/shell/etc), `brev login` for cloud.
- NOT done: `brev login` / `brev create` (account/billing — user only authorized CLI install).

## NemoClaw official doc facts (docs.nvidia.com/nemoclaw, latest)
Source pages read: how-it-works, prerequisites, windows-preparation, quickstart, choose-inference-provider.

### Architecture
- NemoClaw = OpenClaw (agent runtime) + OpenShell (gateway: lifecycle, credentials, network policy, inference routing) + versioned blueprints.
- Sandbox image ~2.4 GB compressed. During push, Docker daemon + k3s + OpenShell gateway run alongside export pipeline; buffers decompressed layers in memory → OOM risk <8 GB RAM.

### Prerequisites (hardware)
| Resource | Min | Rec |
| CPU | 4 vCPU | 4+ |
| RAM | 8 GB | 16 GB |
| Disk | 20 GB free | 40 GB free |

### Platform matrix (Tested = documented install path)
| OS | Runtime | Status |
| Linux | Docker | Tested (Ubuntu 24.04 primary, host-level onboarding validation) |
| Windows WSL2 | Docker Desktop (WSL backend) | Tested with limitations |
| macOS | Colima / Docker Desktop | Tested with limitations |
| Native Windows | — | NOT supported (use WSL) |
| ARM/aarch64 | Docker | NOT in Tested matrix (x86_64 primary) — verify before use |

### OpenShell lifecycle
- Installed BY `nemoclaw onboard`. AVOID `openshell self-update`, `npm update -g openshell`, `openshell sandbox create` unless managing OpenShell separately then re-running `nemoclaw onboard`.

### Docker access
- Needs docker group (root-level impact). On Linux, installer can install Docker, prompt sudo, add user to docker group. Grant only to trusted local accounts.

### Self-host inference
- Supports Ollama local, hosted providers, Bedrock adapter, managed vLLM, managed llama.cpp.
- `ollama-proxy` / `managed-llama-cpp` may take over existing Ollama.

### Uninstall
- `nemoclaw uninstall --yes` preserves `sandboxes.json`/`backups`/`rebuild-backups` by default. `--destroy-user-data` clears. `--delete-models` wipes Ollama inventory + HF cache (non-credential). Scoped to one gateway port unless `--all-gateway-ports`.

## Host Files state (from user-pasted reference)
- `~/.nemoclaw/` holds config.json, sandboxes.json, credentials.json (legacy), tokens (ollama-proxy-token, dual-station-vllm-api-key, managed-llama-cpp/api-key — all mode 0600), state/, snapshots/, backups/.
- WARNING: never paste credentials.json / tokens / bot tokens into chat or issues.
- Malformed `sandboxes.json` → copy to `.bad` then remove; rerun `nemoclaw onboard`.

## Garbled user input observed
- `oPEN schell` → OpenShell
- `nvIdia C0-04 草莓扭百多` → no real NVIDIA product; "草莓" = OpenAI "Strawberry" model or Jensen's "AI 5-layer cake / strawberry jam" metaphor; "扭百多" likely mis-transcription of Nemotron/NVIDIA. Clarify before acting.
