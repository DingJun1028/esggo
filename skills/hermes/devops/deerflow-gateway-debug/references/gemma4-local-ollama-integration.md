# Gemma4-Local Ollama Integration — Field Notes (2026-08-25)

## Issue
MoneyPrinterTurbo v1.3.5 UI localized to Traditional Chinese but TTS voice remained English (gTTS mismatch).
Additionally, DeerFlow gateway returned empty responses `{}` when dispatching agent runs.

## Root Cause
1. **TTS Voice Mismatch**: MoneyPrinterTurbo UI i18n does not automatically switch TTS engine voice
   — requires explicit voice configuration per language
2. **DeerFlow Gateway Empty Response**: Gateway container could not reach Ollama host because:
   - `langchain_ollama` package not installed
   - `base_url: http://localhost:11434` resolves to container, not host
   - `host.docker.internal` required for Windows Docker → host mapping
   - `uv pip install --system langchain-ollama` writes to system site-packages (survives restart)

## Fix Applied
```yaml
# config.yaml — added as first model entry (default)
models:
  - name: gemma4-local
    display_name: Gemma 4 (Ollama · Local)
    use: langchain_ollama:ChatOllama
    model: gemma4:latest
    base_url: http://host.docker.internal:11434
    num_predict: 1024
    num_ctx: 16384
    temperature: 0.7
    reasoning: false
    context_window: 131072
    supports_thinking: false
    supports_vision: true
    is_default: true
```

```bash
# Install langchain-ollama (survives restart with --system flag)
docker exec deer-flow-gateway uv pip install --system langchain-ollama
```

## Verification
- `docker exec deer-flow-gateway python -c "from langchain_ollama import ChatOllama; print('OK')"`
- Gateway restart → health check returns `{"status":"healthy"}`
- Ollama models endpoint accessible from gateway container

## API Payload Pattern (DeerFlow 2.5)
```python
requests.post("http://127.0.0.1:2026/api/threads/{thread_id}/runs/wait", 
    json={"input": {"messages": [{"role": "user", "content": "..."}]}}
)
```