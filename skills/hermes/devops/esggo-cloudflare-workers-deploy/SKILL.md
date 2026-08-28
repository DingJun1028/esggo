---
name: esggo-cloudflare-workers-deploy
description: "Deploy Cloudflare Workers (OmniGateway) for the DingJun1028/esggo repo. Handles wrangler-action version pinning, TypeScript strictness checks, and the auditSink brace-matching pitfall introduced in PR #400. Load when debugging Cloudflare Workers deploy failures or reviewing worker/ directory changes."
tags: ["esggo", "cloudflare", "workers", "wrangler", "deploy"]
version: 1.0.0
author: Hermes Agent (DingJun1028)
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [esggo, cloudflare, workers, wrangler, deploy]
---

# esggo Cloudflare Workers deploy

Deploys the OmniGateway Worker (`worker/`) to Cloudflare Workers via `cloudflare/wrangler-action`.

## Repo layout

- Worker source: `worker/src/index.ts` (309+ lines, full OmniGateway)
- Type config: `worker/tsconfig.json` (ES2022, bundler module resolution)
- Deploy workflow: `.github/workflows/deploy-worker.yml`
- `wrangler.toml` at repo root — `main = "worker/src/index.ts"`

## Secrets required

| Secret | Purpose |
|---|---|
| `CF_API_TOKEN` | Cloudflare API token (Workers edit scope) |
| `CF_ACCOUNT_ID` | Cloudflare account ID |
| `OPENROUTER_API_KEY` | Upstream AI provider key |
| `GROQ_API_KEY` | Upstream AI provider key |
| `GEMINI_API_KEY` | Upstream AI provider key |
| `QWEN3_VL_API_KEY` | Qwen3-VL vision model API key (for deer-flow vision worker) |

## Common failure modes

### TS1005: '}' expected (auditSink brace pitfall)
PR #400 (386cb47) added a defensive `if (ctx && typeof ctx.waitUntil === 'function') {` wrapper in `auditSink()` but forgot the closing `}` before the function's own `}`. The `if` block adds one `{` without a matching `}`, shifting the brace count from balanced (125/125) to unbalanced (126/125).

**Symptom:** `npx tsc --noEmit -p worker/tsconfig.json` exits 2 with `worker/src/index.ts(310,1): error TS1005: '}' expected`. `cloudflare/wrangler-action` aborts on compile error.

**Fix:** Add `  }` to close the `if` block before `function auditSink`'s closing `}`:
```
  }).catch(() => {}));
  }   // ← closes the if-block
}
```

**Verification:** `npx tsc --noEmit -p worker/tsconfig.json` must return exit code 0 with zero errors.

### wrangler-action@v3 tsc not found
`wrangler-action@v3` bundled TypeScript 4.x which could conflict with locally-installed TS 5.x, causing `npm warn exec The following package was not found and will be installed: tsc@2.0.4`.

**Fix:** Pin `cloudflare/wrangler-action@v4` in `deploy-worker.yml` — it uses the repo's own TypeScript installation.

## Deploy workflow

1. Worker source changes land on `main` (or paths `worker/**` / `wrangler.toml` changed)
2. `deploy-worker.yml` triggers automatically
3. Steps: checkout → setup-node@v4 (Node 22) → install wrangler → `tsc --noEmit` → `eslint src/index.ts` → `wrangler deploy --env production`

## Verify order (when making worker changes)

1. `npx tsc --noEmit -p worker/tsconfig.json` — must exit 0
2. `cd worker && npx eslint src/index.ts` — should pass (ESLint ignores worker/ in root config)
3. Push to `main` — triggers the deploy workflow
4. Check `gh run list --workflow deploy-worker.yml --limit 1 --json conclusion,url` for pass/fail

## Deer Flow Vision Worker (Qwen3-VL)

For vision model integration with deer-flow project at `/opt/esggo/deer-flow/`:

### Setup — VPS is Ubuntu 24.04 aarch64 (NOT Windows)
> The deploy target `/opt/esggo/deer-flow` lives on the VPS, which runs Ubuntu.
> Windows-only commands do not exist there. The old step `winget install Ollama.Ollama
> && ollama serve` is wrong for the VPS — `winget` is Windows-only and `ollama serve`
> is foreground-blocking.

1. Install Ollama on VPS (Linux):
   ```bash
   curl -fsSL https://ollama.com/install.sh | sh
   sudo systemctl enable --now ollama   # NOT `ollama serve` (foreground, blocks the SSH session)
   ollama pull qwen3-vl:2b
   ```
   - `ollama serve` is a foreground-blocking process — never run it bare in an SSH
     session or it hangs the shell. Use the systemd service (preferred) or
     `nohup ollama serve >/var/log/ollama.log 2>&1 &`.
   - On a local Windows dev box the original `winget install Ollama.Ollama` form is
     fine — but that is NOT the deploy target.
2. Create worker files: `wrangler.toml`, `src/index.ts`, `src/utils/vision.ts`, `src/utils/oab.ts`, `src/types/index.ts`
3. Deploy: `cd /opt/esggo/deer-flow && npx wrangler deploy`
   - Requires `CF_API_TOKEN` + `CF_ACCOUNT_ID` in the VPS environment (`wrangler login`
     or exported env). These are GitHub repo **secrets** whose *values* are NOT
     retrievable via `gh secret` — if the token is not already on the VPS, deploy via
     `.github/workflows/deploy-worker.yml` (push-triggered) instead.

### Edge → VPS reachability pitfall
A Cloudflare Worker runs on Cloudflare's edge and CANNOT reach `localhost:11434` on the
VPS. Set `QWEN3_VL_API_URL` in `wrangler.toml [vars]` to the VPS's reachable address
(public IP `http://161.118.248.180:11434` behind firewall/tunnel, or a secure tunnel) —
never `http://localhost:11434`.

### Vision Endpoint
- `POST /api/v1/vision` — accepts `image_url` or `base64` image data
- Returns JSON: `{description, tags, confidence}`
- Integrates with OAB EventBus for OA-Team 30 swarm communication
- 5T tags on all events for traceability

### Key Files Reference
See `references/deer-flow-vision-worker.md` for full architecture and setup details.

## Subagent completion verification (critical)

When a delegation batch finishes with `status=completed` but the final API call returns `HTTP 429`, treat the result as **unverified**, not as success. The 429 blocks the completion-check response; the subagent may have succeeded, failed, or done nothing.

**Do not claim files exist or deployment succeeded until one of these is confirmed:**
- Direct `read_terminal`/SSH output showing files at `/opt/esggo/deer-flow/`
- `wrangler deploy` stdout showing worker URL
- Successful `curl` against the deployed `/api/v1/vision` endpoint

**Embedded-terminal gotcha (validated 2026-08-04):** The Hermes right-sidebar "TERMINAL" pane is a *display* of a prior/embedded shell — it does NOT accept `computer_use` typed input, and `read_terminal` returns the **chat buffer**, not a shell prompt. Two concrete failure modes observed this session:
1. Typing into the SOM "Terminal input" element and pressing Enter produces no effect — a marker file written via `echo X > C:\Project\esggo\__marker.txt` never appeared (verified via the MCP file server).
2. `read_terminal` returns chat/assistant text, giving false confidence that a shell is live.

**Do NOT retry the embedded terminal path.** Reliable recovery (validated): launch a REAL local shell (`Win+R` → `powershell` → Enter) and drive it with `computer_use` `type` + `delivery_mode:"foreground"`; verify execution by writing a marker file and reading it back via `mcp__my_server__read_text_file` before trusting any output. Full reproduction: `references/recovering-local-shell.md`. If even a real local shell can't be driven (foreground swap rejected), ask the user to run the git commands directly.

Git merge-all-to-main recipe for this repo: `references/esggo-git-merge-deploy.md`.

**Subagent log location:** Live transcripts are on the **Windows host** under `C:\Users\dingj\AppData\Local\hermes\cache\delegation\live\deleg_<id>\task-0.log`. They are not on the VPS; do not `ssh` to read them.

**Post-429 recovery pattern (validated 2026-08-02):** When the final API call 429s, the subagent's work product is still on disk. Read the live transcript file directly with `mcp__my_server__read_file` (or `type` in PowerShell) to verify what was actually created. Do not re-dispatch a second subagent to "check" the first one — that just burns another 20 minutes and another API call.

## wrangler.toml notes

- `compatibility_date = "2024-01-01"` — set this to the CURRENT date when bumping, not a hardcoded old date
- `[vars]` section: `ENVIRONMENT`, `SMART_ROUTER_VERSION` — non-secret config
- `observability.enabled = true` — logpush is account-level, not per-worker
- For deer-flow vision worker: add `QWEN3_VL_API_URL` and `QWEN3_VL_API_KEY` vars