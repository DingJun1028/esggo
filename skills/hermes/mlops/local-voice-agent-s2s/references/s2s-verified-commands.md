# s2s Verified Commands & Project Shape

## Verified local proof (2026-08, Windows + Hermes agent)
```bash
# Create isolated venv (uv = no system site-packages inheritance)
uv venv /tmp/s2s_venv2

# Install with PYTHONPATH cleared (Hermes injects its own venv path → pollution)
env PYTHONPATH="" /tmp/s2s_venv2/Scripts/python.exe -m pip install speech-to-speech
env PYTHONPATH="" /tmp/s2s_venv2/Scripts/python.exe -m pip install pocket-tts

# Launch — flags confirmed for speech-to-speech 0.2.12
env PYTHONPATH="" /tmp/s2s_venv2/Scripts/speech-to-speech.exe \
  --ws_host 0.0.0.0 --ws_port 8765 \
  --stt parakeet-tdt \
  --llm_backend chat-completions \
  --model_name "qwen2.5:3b-instruct-q4_K_M" \
  --responses_api_base_url "http://localhost:11434/v1" \
  --responses_api_api_key "ollama" \
  --tts pocket \
  --enable_live_transcription

# Verify WS up (curl GET returns 404 = expected for WS upgrade)
env PYTHONPATH="" /tmp/s2s_venv2/Scripts/python.exe -c "
import asyncio, websockets
async def t():
    async with websockets.connect('ws://127.0.0.1:8765/v1/realtime') as ws:
        print('WS_OK')
asyncio.run(t())
"
```

## WS endpoint
`ws://127.0.0.1:8765/v1/realtime` — OpenAI Realtime-compatible.

## Matching deploy script shape (VPS, CPU-only, Oracle ARM 2.8G)
```bash
OLLAMA_MODEL=${OLLAMA_MODEL:-gemma4:e2b}
nohup speech-to-speech \
  --ws_host 0.0.0.0 --ws_port 8765 \
  --stt parakeet-tdt \
  --llm_backend chat-completions \
  --model_name "$OLLAMA_MODEL" \
  --responses_api_base_url "http://localhost:11434/v1" \
  --responses_api_api_key "ollama" \
  --tts pocket \
  --enable_live_transcription > /tmp/s2s.log 2>&1 &
```
Do NOT use `--llm_backend transformers` on VPS (double model load → OOM).

## Error → fix quick reference
| Error | Fix |
|-------|-----|
| `circular import / regex partial init` | `env PYTHONPATH=""` (Hermes venv pollution) |
| `HfArgumentParser: unrecognized args --host/--port/serve` | use `--ws_host`/`--ws_port`, no `serve` |
| `CUDA graphs require CUDA device` | `--tts qwen3` needs GPU → use `--tts pocket` |
| `ModuleNotFoundError: pocket_tts` | `pip install pocket-tts` (base omits TTS) |
| `HFValidationError: Repo id 'gemma4:26b'` | transformers wants HF id → use `chat-completions` + Ollama `/v1` |
| Ollama `/v1/chat/completions` timeout | Ollama busy loading large model; wait + retry |
