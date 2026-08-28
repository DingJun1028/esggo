---
name: hermes-hy-memory-local
description: Hermes Hy-Memory local Ollama setup on Windows, no paid API.
---

# Hermes Hy-Memory · Local Free Setup (Ollama / Windows / CPU)

Zero-cost long-term memory for Hermes: run the LLM + embedder entirely on the
user's machine via Ollama. No OpenAI/DeepSeek key, no per-token bill. Satisfies
the "只用免費算立" constraint.

## When to use
- User asks to install/configure Hermes Hy-Memory (or "long-term memory").
- User explicitly wants FREE / local / no paid API.
- User mentions Ollama, or wants opencode to call a local model.
- `hermes memory status` shows `Provider: hy-memory` but `Status: not available ✗`.

## Architecture
```
Hermes ──provider=hy-memory──> plugin (~/.hermes/plugins/hy-memory)
                                      │ SDK (hy-memory) runs its own HTTP server
                                      │   on 127.0.0.1:19527, with its own venv
                                      ▼
                              Ollama (localhost:11434)
                                ├─ qwen2.5:3b-instruct-q4_K_M  (LLM extractor)
                                └─ nomic-embed-text            (embedder, 768-dim)
```

## Step-by-step (verified on Windows 10/11, 12-core / 16GB RAM, no GPU)

### 1. Install Ollama
```powershell
# winget download is ~1.6 GB and WILL exceed a 300s/600s foreground timeout.
# Run in BACKGROUND (terminal background=true, notify_on_complete=true):
winget install Ollama.Ollama --accept-source-agreements --accept-package-agreements --silent
```
After it finishes, the binary lands at:
`C:\Users\<user>\AppData\Local\Programs\Ollama\ollama.exe`
(Also a UWP shim at `...\Microsoft\WindowsApps\ollama.exe` — prefer the Programs path.)

### 2. Start Ollama server (background, never exits)
```bash
# git-bash `cd /c/Users/.../Ollama` FAILS ("No such file or directory") even
# though the dir exists. Use cmd /c with a Windows path instead:
terminal(background=true): cmd /c "C:\Users\dingj\AppData\Local\Programs\Ollama\ollama.exe serve"
```
Verify: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:11434/` → `200`.

### 3. Pull models
```bash
cmd /c "C:\Users\dingj\AppData\Local\Programs\Ollama\ollama.exe pull nomic-embed-text"
cmd /c "C:\Users\dingj\AppData\Local\Programs\Ollama\ollama.exe pull qwen2.5:3b-instruct-q4_K_M"
```
- `nomic-embed-text` ≈ 274 MB, 768-dim (NOT 1536 — see Pitfalls).
- `qwen2.5:3b-instruct-q4_K_M` ≈ 1.9 GB, runs fine on CPU (15-30 tok/s).

### 4. Install the Hy-Memory package
```bash
pip install "hermes-hy-memory[init]"
```

### 5. Activate the plugin into Hermes
```bash
# Find Hermes' venv python:
ls ~/.hermes/hermes-agent/venv/Scripts/python.exe

# Symlink mode FAILS on Windows with WinError 1314 (privilege).
# Use --copy:
hermes-hy-memory install \
  --hermes-python "C:/Users/dingj/AppData/Local/hermes/hermes-agent/venv/Scripts/python.exe" \
  --copy
```
Expected: `✓ Copied plugin → C:\Users\dingj\.hermes\plugins\hy-memory`

### 6. Write `~/.hermes/.env`
See `templates/hy-memory-env.txt`. Key lines:
```
HY_MEMORY_USER_ID=dingj
HY_MEMORY_AGENT_ID=hermes
HY_MEMORY_MODE=pro                 # NEVER lite (see Pitfalls)
MEMORY_LLM_PROVIDER=openai         # SDK thinks it's OpenAI; we point BASE_URL at Ollama
MEMORY_LLM_MODEL=qwen2.5:3b-instruct-q4_K_M
MEMORY_LLM_API_KEY=ollama-local-not-verified   # Ollama ignores it
MEMORY_LLM_BASE_URL=http://localhost:11434/v1
MEMORY_EMBEDDER_PROVIDER=openai
MEMORY_EMBEDDER_MODEL=nomic-embed-text
MEMORY_EMBEDDER_API_KEY=ollama-local-not-verified
MEMORY_EMBEDDER_BASE_URL=http://localhost:11434/v1
MEMORY_EMBEDDING_DIMS=768          # MUST match nomic-embed-text
HY_MEMORY_WRITE_TURN_WINDOW=2      # lower than default 5 to avoid CPU backlog
```

### 7. Enable provider + verify
```bash
hermes config set memory.provider hy-memory
hermes-hy-memory doctor      # expect: All checks passed.
hermes memory status         # expect: Plugin: installed ✓ / Status: available ✓
```
If `memory status` still shows `Missing: HY_MEMORY_USER_ID` even though `.env`
exists, the variable isn't in the shell env — `export HY_MEMORY_USER_ID=dingj`
(or restart Hermes so it reads `.env` at boot). `doctor` reads `.env` directly,
so it may pass while `memory status` (Hermes process) still shows missing.

### 8. (Optional) Wire Ollama into opencode
See `templates/opencode-ollama-provider.json`. Add an `ollama` provider using
`@ai-sdk/openai-compatible` with `baseURL: http://localhost:11434/v1`, set
`"model": "ollama/qwen2.5:3b-instruct-q4_K_M"`. Verify:
```bash
opencode models ollama        # expect: ollama/qwen2.5:3b-instruct-q4_K_M
```

## Pitfalls (learned the hard way)
1. **git-bash `cd` to Ollama dir fails** — "No such file or directory" though it
   exists. Always launch Ollama via `cmd /c "C:\Windows\Path\ollama.exe ..."`.
2. **winget foreground timeout** — the 1.6 GB download blows past 300/600s. Use
   `terminal(background=true)`.
3. **Symlink activation fails** — `hermes-hy-memory install` (no flag) errors with
   `WinError 1314 用戶端沒有這項特殊權限`. Fix: `--copy`.
4. **SDK venv creation can fail** — `hy-memory` tries `python -m venv
   ~/.hy-memory/.venv` and may error. If `doctor` shows `✗ venv`, just create it
   manually: `python -m venv C:\Users\<user>\.hy-memory\.venv`, then re-run doctor.
5. **`lite` mode is a trap** — lite only embeds, never extracts; memories land in
   `l1_raw` which `list`/`search` filter out → written but NEVER recalled.
   Always use `pro` (or `ultra`).
6. **Embedding dims mismatch** — `nomic-embed-text` is **768**, not OpenAI's 1536.
   Set `MEMORY_EMBEDDING_DIMS=768` or recall/search silently breaks.
7. **`.env` not auto-loaded by running Hermes** — `hermes memory status` reads
   process env, not the file. Export vars or restart Hermes.
8. **Ollama endpoint is `/v1`** — OpenAI-compatible base URL is
   `http://localhost:11434/v1` (not `:11434` root).

## Verification
After setup, run `scripts/verify-hy-memory.ps1` — it checks JSON validity,
provider presence, default model, Ollama server reachability (model listed),
and that `opencode models ollama` resolves. All 5 must pass.

## Support files in this skill
- `templates/hy-memory-env.txt` — ready-to-use `~/.hermes/.env` (edit USER_ID).
- `templates/opencode-ollama-provider.json` — paste into opencode `provider` block.
- `scripts/verify-hy-memory.ps1` — 5-check ad-hoc verification (run after changes).

## Real evidence from this session
- `hermes-hy-memory doctor` → `All checks passed.`
- `hermes-hy-memory add "..."` → memory stored as `l2_fact`.
- `hermes-hy-memory search "ESGGO 專案"` → score 0.731 hit.
- `opencode models ollama` → `ollama/qwen2.5:3b-instruct-q4_K_M`.
- Cost: ¥0 (pure local CPU).
