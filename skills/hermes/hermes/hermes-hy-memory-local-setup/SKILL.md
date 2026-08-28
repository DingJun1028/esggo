---
name: hermes-hy-memory-local-setup
description: Set up Hy-Memory with local Ollama for free compute.
---

# Hermes × Hy-Memory — Local / Free Compute Setup

## When to use
- User wants long-term memory for Hermes but insists on free/local compute (no paid LLM/Embedder API)
- User pastes a Hy-Memory install guide and says "install" / "繼續"
- Setting `memory.provider = hy-memory` on a machine without GPU

## Principles
- NEVER use `lite` mode for Hermes: memory written to L1_RAW but `list`/`search` filter it out → written but never recalled (prefetch always empty). Use `pro` (default) or `ultra`.
- Local Ollama satisfies the "free compute only" rule — no API keys, no cost.

## Install Sequence (Windows)
1. `pip install "hermes-hy-memory[init]"` — the `[init]` extra pulls questionary (wizard dep)
2. Install Ollama: `winget install Ollama.Ollama --accept-source-agreements --accept-package-agreements --silent` (downloads ~1.6GB setup, can take 10+ min)
3. Start Ollama server in BACKGROUND: `cmd /c "C:\Users\<user>\AppData\Local\Programs\Ollama\ollama.exe serve"`
   - GOTCHA: git-bash `cd /c/Users/.../Ollama && ./ollama.exe` fails with "No such file or directory" — use `cmd /c` with Windows path
4. Pull models:
   - `ollama pull nomic-embed-text` (768-dim embedder, ~274MB)
   - `ollama pull qwen2.5:3b-instruct-q4_K_M` (LLM extractor, ~1.9GB; CPU-only OK on 12-core/16GB)
5. Activate plugin into Hermes venv:
   `hermes-hy-memory install --hermes-python "C:\Users\<user>\AppData\Local\hermes\hermes-agent\venv\Scripts\python.exe" --copy`
   - USE `--copy` NOT default symlink: default fails with `WinError 1314` (client lacks privilege to create symlink) on Windows
6. Set provider: `hermes config set memory.provider hy-memory`
7. Write `~/.hermes/.env` with local endpoints (template below)
8. If `doctor` shows `[2/4] venv missing`: manually create it —
   `python -m venv C:\Users\<user>\.hy-memory\.venv` (SDK's `ensure_venv` sometimes fails to create it; manual creation fixes it)

## ~/.hermes/.env Template (local Ollama)
```
HY_MEMORY_USER_ID=<user>
HY_MEMORY_AGENT_ID=hermes
HY_MEMORY_MODE=pro
HY_MEMORY_WRITE_TURN_WINDOW=2
HY_MEMORY_PREFETCH_MAX_CHARS=2000
HY_MEMORY_SYNC_WORKERS=2
HY_MEMORY_SHUTDOWN_GRACE_SEC=15
HY_MEMORY_LOG_LEVEL=INFO

MEMORY_LLM_PROVIDER=openai
MEMORY_LLM_MODEL=qwen2.5:3b-instruct-q4_K_M
MEMORY_LLM_API_KEY=ollama-local-not-verified
MEMORY_LLM_BASE_URL=http://localhost:11434/v1

MEMORY_EMBEDDER_PROVIDER=openai
MEMORY_EMBEDDER_MODEL=nomic-embed-text
MEMORY_EMBEDDER_API_KEY=ollama-local-not-verified
MEMORY_EMBEDDER_BASE_URL=http://localhost:11434/v1
MEMORY_EMBEDDING_DIMS=768
```
CRITICAL: `MEMORY_EMBEDDING_DIMS` MUST match the embedder. nomic-embed-text = 768. (OpenAI text-embedding-3-small = 1536.) Mismatch breaks the vector store. The fake `API_KEY` is never validated by Ollama.

## Verify
- `hermes memory status` → expect `Plugin: installed ✓` / `Status: available ✓`
- `hermes-hy-memory doctor` → `All checks passed` (4/4: env, home, server, client+list probe)
- `hermes-hy-memory add "test memory"` then `hermes-hy-memory list --limit 5` → should show `layer=l2_fact` entries (proved LLM extraction worked)
- `hermes-hy-memory search "query"` → returns scored results

## Pitfalls
- `hermes memory status` reads `.env` only when the Hermes process starts with those vars. If it reports `Missing: HY_MEMORY_USER_ID`, either restart Hermes OR `export HY_MEMORY_USER_ID=...` in the current shell — doctor/add/list will then work even before restart.
- Ollama `serve` MUST be running before `add` (extractor calls the LLM). `curl -s -o /dev/null -w "%{http_code}" http://localhost:11434/` → `200` confirms up.
- First model load on CPU is slow (~5-15s); lower `HY_MEMORY_WRITE_TURN_WINDOW` to 2 to avoid write backlog.
- `hermes-hy-memory install` compares venv plugin version vs latest and upgrades if different; `--copy` replicates instead of symlinks (use for network-mounted or permission-restricted setups).
