---
name: hermes-local-memory-stack
description: Hy-Memory + local Ollama for Hermes (Windows free-compute).
---

# Hermes Local Memory Stack (Ollama + Hy-Memory + opencode)

## When to use
- User wants Hermes long-term memory via hy-memory with **FREE local compute** (no paid LLM/Embedder keys).
- Trigger phrases: "只用免費算立" / "本地 Ollama" / "hy-memory install" / "ollama launch hermes".
- Also when wiring opencode to a local model instead of a remote provider.

## Architecture
```
[Hermes Agent]
  └─ memory.provider = hy-memory
        └─ Hy-Memory SDK (pro mode)
              ├─ LLM extract:  http://localhost:11434/v1  (qwen2.5:3b-instruct-q4_K_M)
              └─ Embedder:     http://localhost:11434/v1  (nomic-embed-text, 768d)
[opencode]
  └─ provider.ollama = http://localhost:11434/v1
        └─ model: ollama/qwen2.5:3b-instruct-q4_K_M
[Ollama Server]  └─ :11434 (daemon + startup shortcut)
```
Cost: **$0** — pure local CPU inference, no external API calls.

## Steps (validated order)
1. **Install Ollama** (Windows): `winget install Ollama.Ollama --accept-source-agreements --accept-package-agreements --silent` — takes ~10 min (1.6 GB download). Background it.
2. **Start server**: `cmd /c "C:\Users\<user>\AppData\Local\Programs\Ollama\ollama.exe serve"` (run in background; it listens on :11434). Verify `curl http://localhost:11434/` → 200.
3. **Pull models**: `ollama pull nomic-embed-text` then `ollama pull qwen2.5:3b-instruct-q4_K_M` (1.9 GB, background it — foreground times out at 600s around 70%).
4. **Install plugin**: `pip install "hermes-hy-memory[init]"` (the `[init]` extra pulls questionary for the wizard).
5. **Activate into Hermes** — MUST use `--copy` on Windows:
   `hermes-hy-memory install --hermes-python "C:\Users\<user>\AppData\Local\hermes\hermes-agent\venv\Scripts\python.exe" --copy`
   (symlink fails with WinError 1314; `--copy` duplicates the plugin dir into `~/.hermes/plugins/hy-memory`.)
6. **Write `~/.hermes/.env`** with Ollama endpoints (see references).
7. **ALSO set the same vars as SYSTEM User environment variables** (see gotchas — Hermes does NOT auto-load `.env`).
8. `hermes config set memory.provider hy-memory`
9. **Verify**: `hermes-hy-memory doctor` → `All checks passed`. Then `hermes-hy-memory add "test"` → `hermes-hy-memory search "test"` (score hit confirms recall).

## opencode wiring
Edit `~/.config/opencode/opencode.json`: add an `ollama` provider (npm `@ai-sdk/openai-compatible`, baseURL `http://localhost:11434/v1`) and set `"model": "ollama/qwen2.5:3b-instruct-q4_K_M"`. Verify with `opencode models ollama` → lists the local model. Full JSON snippet in references.

## Windows gotchas (CRITICAL — each caused a real failure this session)
- **Symlink fails**: `hermes-hy-memory install` (no flag) → `WinError 1314 用戶端沒有這項特殊權限`. Always pass `--copy`.
- **git-bash `cd` to Windows paths fails**: `cd /c/Users/... && ./ollama.exe serve` errors with "No such file or directory". Use `cmd /c "C:\full\path\ollama.exe serve"` instead.
- **`.env` NOT auto-loaded by Hermes**: `hermes memory status` shows `Missing: HY_MEMORY_USER_ID` even though `~/.hermes/.env` exists. Fix: write vars to **system User** env via PowerShell `[Environment]::SetEnvironmentVariable('KEY','VAL','User')`. After that, even with shell vars cleared, `doctor` still reads them.
- **Hy-Memory venv creation fails**: first `doctor` run may error creating `~/.hy-memory/.venv` (subprocess `python -m venv` returns non-zero when launched from Hermes venv). Fix: manually `python -m venv C:\Users\<user>\.hy-memory\.venv` (succeeds), then re-run `doctor` → passes.
- **lite mode is a trap**: `HY_MEMORY_MODE=lite` writes memories but they NEVER recall (SDK filters out L1_RAW layer; prefetch stays empty). Use `pro` (default) or `ultra`.
- **Embedding dims mismatch**: `nomic-embed-text` is **768d**, but guide examples show `1536` (OpenAI). MUST set `MEMORY_EMBEDDING_DIMS=768` or writes/recall break.
- **Fake API key for Ollama**: set `MEMORY_LLM_API_KEY=ollama-local-not-verified` and `MEMORY_EMBEDDER_API_KEY=ollama-local-not-verified` — Ollama does not validate keys; the OpenAI-compatible shape is only to satisfy the SDK.
- **Long downloads time out**: `ollama pull` of the 1.9 GB LLM exceeds the 600s foreground cap. Run it backgrounded with `notify_on_complete=true`; do other work (e.g. write `.env`, activate plugin) while it downloads.

## Verification loop (run after setup)
```
hermes memory status      # → Provider: hy-memory / Plugin: installed ✓ / Status: available ✓
hermes-hy-memory doctor   # → All checks passed
hermes-hy-memory add "用戶 dingj 測試記憶"
hermes-hy-memory search "測試記憶"   # → score hit, layer=l2_fact
opencode models ollama    # → ollama/qwen2.5:3b-instruct-q4_K_M
```

## Persistence
- Startup shortcut `Ollama.lnk` already in `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\` after winget install → Ollama auto-starts on boot.
- Optional helper `ollama-launch.bat` that skips if :11434 already responds.

## References
- `references/windows-setup.md` — exact command transcripts, `.env` template, opencode.json snippet, and error messages observed.
