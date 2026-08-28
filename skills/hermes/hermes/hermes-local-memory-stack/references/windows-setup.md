# Windows Setup — Exact Transcripts & Templates

## 1. .env template (`~/.hermes/.env`)
```
# ===== HY-Memory 配置（本地 Ollama CPU 路徑 · 免費算立）=====
HY_MEMORY_USER_ID=dingj
HY_MEMORY_AGENT_ID=hermes
HY_MEMORY_MODE=pro
HY_MEMORY_WRITE_TURN_WINDOW=2
HY_MEMORY_PREFETCH_MAX_CHARS=2000
HY_MEMORY_SYNC_WORKERS=2
HY_MEMORY_SHUTDOWN_GRACE_SEC=15
HY_MEMORY_LOG_LEVEL=INFO

# 記憶抽取 LLM（本地 Ollama，OpenAI 兼容端點欺騙 SDK）
MEMORY_LLM_PROVIDER=openai
MEMORY_LLM_MODEL=qwen2.5:3b-instruct-q4_K_M
MEMORY_LLM_API_KEY=ollama-local-not-verified
MEMORY_LLM_BASE_URL=http://localhost:11434/v1

# Embedder（本地 Ollama nomic-embed-text，768 維）
MEMORY_EMBEDDER_PROVIDER=openai
MEMORY_EMBEDDER_MODEL=nomic-embed-text
MEMORY_EMBEDDER_API_KEY=ollama-local-not-verified
MEMORY_EMBEDDING_DIMS=768
MEMORY_VECTOR_STORE=chroma
```

## 2. System User env (PowerShell) — REQUIRED (Hermes won't read .env)
```powershell
[Environment]::SetEnvironmentVariable('HY_MEMORY_USER_ID','dingj','User')
[Environment]::SetEnvironmentVariable('HY_MEMORY_AGENT_ID','hermes','User')
[Environment]::SetEnvironmentVariable('HY_MEMORY_MODE','pro','User')
[Environment]::SetEnvironmentVariable('MEMORY_LLM_BASE_URL','http://localhost:11434/v1','User')
[Environment]::SetEnvironmentVariable('MEMORY_LLM_MODEL','qwen2.5:3b-instruct-q4_K_M','User')
[Environment]::SetEnvironmentVariable('MEMORY_LLM_API_KEY','ollama-local-not-verified','User')
[Environment]::SetEnvironmentVariable('MEMORY_EMBEDDER_MODEL','nomic-embed-text','User')
[Environment]::SetEnvironmentVariable('MEMORY_EMBEDDER_API_KEY','ollama-local-not-verified','User')
[Environment]::SetEnvironmentVariable('MEMORY_EMBEDDING_DIMS','768','User')
[Environment]::SetEnvironmentVariable('MEMORY_VECTOR_STORE','chroma','User')
```

## 3. opencode.json ollama provider snippet
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
}
```
And set top-level `"model": "ollama/qwen2.5:3b-instruct-q4_K_M"`.

## 4. Commands that failed (do NOT repeat)
| Attempted | Error | Fix |
|-----------|-------|-----|
| `cd /c/Users/... && ./ollama.exe serve` (git-bash) | `cd: ... No such file or directory` | `cmd /c "C:\Users\...\ollama.exe serve"` |
| `hermes-hy-memory install` (no flag) | `WinError 1314 用戶端沒有這項特殊權限` | add `--copy` |
| `hermes memory status` after only `.env` written | `Missing: HY_MEMORY_USER_ID` | also set system User env vars |
| first `doctor` | venv create subprocess non-zero | `python -m venv C:\Users\<u>\.hy-memory\.venv` then re-run |
| `ollama pull` in foreground | exit 124 at ~70% (1.9GB) | background + notify_on_complete |
| `HY_MEMORY_MODE=lite` | memories written but never recalled | use `pro` |

## 5. Verification (all passed this session)
```
hermes memory status   → Provider: hy-memory / Plugin: installed ✓ / Status: available ✓
hermes-hy-memory doctor → All checks passed
hermes-hy-memory add "..." → l2_fact layer
hermes-hy-memory search "..." → score hit
opencode models ollama → ollama/qwen2.5:3b-instruct-q4_K_M
```
