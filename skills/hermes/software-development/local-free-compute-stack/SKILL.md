---
name: local-free-compute-stack
description: >-
  Set up Ollama + Hy-Memory + opencode on Windows, free.
triggers:
  - hy-memory install
  - hermes memory provider
  - ollama local llm
  - local free compute
  - 只用免費算立
  - opencode ollama provider
  - hermes-hy-memory doctor
---

# Local Free-Compute Stack (Ollama + Hy-Memory + opencode)

Class-level patterns for running a **fully local, zero-cost** AI memory +
inference stack on Windows, aligned with the user's "只用免費算立" (free-compute-
only) rule — no paid LLM/Embedder API keys.

---

## 1. Architecture

```
[Hermes Agent]
  └─ memory.provider = hy-memory
        └─ Hy-Memory SDK (mode=pro)
              ├─ LLM extract:  http://localhost:11434/v1  (qwen2.5:3b-instruct-q4_K_M)
              └─ Embedder:     http://localhost:11434/v1  (nomic-embed-text, 768d)
[opencode]
  └─ provider.ollama = http://localhost:11434/v1
        └─ model: ollama/qwen2.5:3b-instruct-q4_K_M
[Ollama Server]
  └─ :11434  (daemon + Startup lnk for autostart)
```

---

## 2. Install (verified 2026-08-08, Windows 11, 12-core / 16.8GB RAM)

### 2.1 Ollama
- Install via winget (download is ~1.6GB; run in **background** terminal, it
  can exceed 300s foreground timeout):
  ```powershell
  winget install Ollama.Ollama --accept-source-agreements --accept-package-agreements --silent
  ```
- Binary lands at `C:\Users\<user>\AppData\Local\Programs\Ollama\ollama.exe`.
  Git-Bash `cd` to that path FAILS ("No such file or directory") — always invoke
  with `cmd /c "C:\Users\dingj\AppData\Local\Programs\Ollama\ollama.exe <args>"`.
- Start server (background terminal, never `&` in git-bash):
  ```powershell
  cmd /c "C:\Users\dingj\AppData\Local\Programs\Ollama\ollama.exe serve"
  ```
- Verify: `curl -s -o /dev/null -w "%{http_code}" http://localhost:11434/` → `200`.

### 2.2 Models (pull in background — qwen2.5 3b is ~1.9GB)
```powershell
cmd /c "C:\Users\dingj\AppData\Local\Programs\Ollama\ollama.exe pull nomic-embed-text"
cmd /c "C:\Users\dingj\AppData\Local\Programs\Ollama\ollama.exe pull qwen2.5:3b-instruct-q4_K_M"
```
- Embedder dim is **768** for `nomic-embed-text` — must set `MEMORY_EMBEDDING_DIMS=768`
  (NOT 1536, which is OpenAI's).
- Verify embedder: `curl -s http://localhost:11434/api/embeddings -d "{\"model\":\"nomic-embed-text\",\"prompt\":\"test\"}"` → returns `"embedding":[...]`.

### 2.3 Hy-Memory
```bash
pip install "hermes-hy-memory[init]"
# Activate into Hermes — use --copy on Windows (symlink fails WinError 1314)
hermes-hy-memory install --hermes-python "C:/Users/dingj/AppData/Local/hermes/hermes-agent/venv/Scripts/python.exe" --copy
```
- Pitfall: `install` with default symlink fails with
  `WinError 1314 用戶端沒有這項特殊權限` when creating
  `~/.hermes/plugins/hy-memory`. Use `--copy` (or `init` which copies).
- Pitfall: `hermes-hy-memory doctor` may fail creating
  `~/.hy-memory/.venv` (`python -m venv` returns non-zero inside Hermes venv).
  **Fix:** pre-create it manually `python -m venv C:\Users\dingj\.hy-memory\.venv`
  then re-run `doctor` → "All checks passed".

### 2.4 opencode provider
Edit `~/.config/opencode/opencode.json`:
```json
"ollama": {
  "npm": "@ai-sdk/openai-compatible",
  "name": "Ollama (Local)",
  "options": { "baseURL": "http://localhost:11434/v1" },
  "models": {
    "qwen2.5:3b-instruct-q4_K_M": {
      "name": "Qwen2.5 3B Instruct (Local, Free)",
      "limit": { "context": 32768, "output": 8192 }
    }
  }
},
"model": "ollama/qwen2.5:3b-instruct-q4_K_M",
```
Verify: `opencode models ollama` → prints `ollama/qwen2.5:3b-instruct-q4_K_M`.

---

## 3. Configuration

### 3.1 Hy-Memory `.env` (`~/.hermes/.env`)
```
HY_MEMORY_USER_ID=dingj
HY_MEMORY_AGENT_ID=hermes
HY_MEMORY_MODE=pro
HY_MEMORY_WRITE_TURN_WINDOW=2
MEMORY_LLM_PROVIDER=openai
MEMORY_LLM_MODEL=qwen2.5:3b-instruct-q4_K_M
MEMORY_LLM_API_KEY=ollama-local-not-verified   # Ollama ignores it
MEMORY_LLM_BASE_URL=http://localhost:11434/v1
MEMORY_EMBEDDER_PROVIDER=openai
MEMORY_EMBEDDER_MODEL=nomic-embed-text
MEMORY_EMBEDDER_API_KEY=ollama-local-not-verified
MEMORY_EMBEDDING_DIMS=768
MEMORY_VECTOR_STORE=chroma
```

### 3.2 CRITICAL: Hermes does NOT auto-load `.env`
`hermes memory status` showed `Status: not available ✗ / Missing: HY_MEMORY_USER_ID`
even though `.env` existed. Fix: write the vars into **system User environment**
so they survive Hermes restart (`.env` alone is not reliably sourced):
```powershell
[Environment]::SetEnvironmentVariable('HY_MEMORY_USER_ID','dingj','User')
# ... repeat for each var above
```
After this, `hermes-hy-memory doctor` → "All checks passed" even with shell vars
cleared.

### 3.3 Persistence
- Ollama autostart: `Ollama.lnk` in
  `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\`.
- Manual launcher: `C:\Users\dingj\AppData\Local\Programs\Ollama\ollama-launch.bat`
  (checks :11434, starts serve if down).

---

## 4. Verification (run before claiming success)

```bash
hermes memory status        # → Provider: hy-memory / Plugin: installed ✓ / Status: available ✓
hermes-hy-memory doctor     # → All checks passed
hermes-hy-memory add "test memory"   # → l2_fact layer extracted
hermes-hy-memory search "test"       # → score hit
opencode models ollama      # → ollama/qwen2.5:3b-instruct-q4_K_M
```

---

## 5. Port Detection — Ollama vs. Hermes Gateway Proxy

### Problem
Two ports both respond on `localhost` — `11434` (Ollama direct) and `11435` (Hermes internal proxy/gateway).
Both return `200` and JSON model lists, but they may have **different model visibility**:

| Port | Service Type | Model API | Notes |
|---|---|---|---|
| `11434` | Ollama daemon | `/api/tags` (native), `/v1/models` (OpenAI-compat) | Full model list incl. custom Modelfile models |
| `11435` | Hermes gateway/proxy | `/v1/models` only | May **cache/filter** model list; custom models registered on 11434 are NOT visible here |

### Diagnosis pattern (run both checks)
```bash
# 1. Check native Ollama format (only real Ollama responds)
curl -s http://localhost:11434/api/tags | jq '.models[].name'

# 2. Check OpenAI-format on suspect port (could be proxy)
curl -s http://localhost:11435/v1/models | jq '.data[].id'

# 3. Diff the model lists
diff <(curl -s http://localhost:11434/api/tags | jq -r '.models[].name' | sort) \
     <(curl -s http://localhost:11435/v1/models | jq -r '.data[].id' | sort)
# → If 11435 lacks your custom model (e.g. "qwen2.5:3b-hermes"), it's a proxy —
#   use base_url = http://localhost:11434/v1 instead of :11435
```

### Fix
- Point `providers.custom-ollama.base_url` at `http://localhost:11434/v1` (the actual Ollama),
  **not** `11435` (Hermes proxy that may stale-cache the list).
- If you *must* use the proxy port, you cannot pull new models there — they must be
  pulled on the backing Ollama instance first, then the proxy needs a restart to pick them up.

### Custom models with extended context
```bash
# Create a model with num_ctx baked in (Ollama Modelfile)
cat > /tmp/modelfile << 'EOF'
FROM qwen2.5:3b
PARAMETER num_ctx 65536
EOF
ollama create qwen2.5:3b-hermes --file /tmp/modelfile
# → Use model name 'qwen2.5:3b-hermes' in Hermes config; ollama show confirms 'num_ctx 65536'
```

## 6. Pitfalls (do NOT repeat)

- **Never use `lite` mode** for Hy-Memory under Hermes: it only embeds, never
  extracts, so memories stick at `L1_RAW` and `list`/`search` filter them out →
  written but never recalled (prefetch always empty). Use `pro` or `ultra`.
- **No paid keys**: the "free-compute-only" rule forbids OpenAI/DeepSeek API
  keys. Local Ollama satisfies it. If a guide shows `MEMORY_LLM_API_KEY=sk-...`,
  replace with a dummy string — Ollama does not verify it.
- **Embedding dims must match**: `nomic-embed-text` = 768, not 1536.
- **Windows path gotcha**: git-bash `cd` into `AppData\Local\Programs\Ollama`
  fails; always `cmd /c "<full-path>\ollama.exe"`.
- **Symlink blocked**: use `hermes-hy-memory install --copy`, not default.
- **`.env` not auto-sourced by Hermes**: set system User env vars too.
- **Ollama model pull is slow**: run in background terminal, not foreground
  (exceeds 600s cap on large models).
