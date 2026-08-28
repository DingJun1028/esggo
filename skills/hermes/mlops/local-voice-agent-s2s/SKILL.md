---
name: local-voice-agent-s2s
description: Debug/run speech-to-speech voice agents CPU-only.
---

# Local Voice Agent (speech-to-speech)

Build and run a real-time voice agent (VAD → STT → LLM → TTS) fully on CPU/local,
no paid APIs. Verified on Windows + Hermes desktop agent with `speech-to-speech` 0.2.12.

## When to use
- User wants a speech-to-speech / realtime voice agent (e.g. integrate into a translator platform).
- Debugging `speech-to-speech` startup errors (circular import, invalid flag, CUDA required, module missing).
- Deploying voice agent to a CPU-only VPS (Oracle ARM free tier, no GPU).

## CRITICAL: Hermes venv PYTHONPATH pollution
The Hermes desktop app injects `PYTHONPATH` pointing at its own venv. Any Python you spawn
inherits it, so isolated venvs pre-load Hermes packages → circular import (`regex` partial init)
or "outside environment" pip conflicts.
**Always run with `env PYTHONPATH=""`** when creating AND using an isolated venv:
```bash
env PYTHONPATH="" /path/to/venv/Scripts/python.exe -m pip install ...
env PYTHONPATH="" /path/to/venv/Scripts/speech-to-speech.exe --ws_host ...
```

## Setup (verified)
```bash
uv venv /tmp/s2s_venv2
env PYTHONPATH="" /tmp/s2s_venv2/Scripts/python.exe -m pip install speech-to-speech
env PYTHONPATH="" /tmp/s2s_venv2/Scripts/python.exe -m pip install pocket-tts
```

## Launch (verified flags for 0.2.12)
```bash
env PYTHONPATH="" /tmp/s2s_venv2/Scripts/speech-to-speech.exe \
  --ws_host 0.0.0.0 --ws_port 8765 \
  --stt parakeet-tdt \
  --llm_backend chat-completions \
  --model_name "qwen2.5:3b-instruct-q4_K_M" \
  --responses_api_base_url "http://localhost:11434/v1" \
  --responses_api_api_key "ollama" \
  --tts pocket \
  --enable_live_transcription
```
- Endpoint: `ws://127.0.0.1:8765/v1/realtime` (OpenAI Realtime-compatible). `curl GET` returns 404 — expected (WS upgrade). Verify with `websockets.connect()`.
- First load SLOW on CPU (~2-3 min).

## TTS / LLM backend matrix (0.2.12)
| Option | Result | Note |
|--------|--------|------|
| `--tts qwen3` | FAIL | needs CUDA |
| `--tts kokoro` | FAIL | numpy conflict on install |
| `--tts pocket` | ✅ CPU | needs `pip install pocket-tts` |
| `--llm_backend transformers --model_name "gemma4:26b"` | FAIL | HF rejects Ollama tag |
| `--llm_backend chat-completions --responses_api_base_url http://localhost:11434/v1` | ✅ | local Ollama `/v1` |

## Pitfalls (hit & resolved)
- `speech-to-speech serve --host/--port` → rejected. Use `--ws_host`/`--ws_port`, NO `serve`.
- Circular import `regex` → Hermes `PYTHONPATH`. Fix = `env PYTHONPATH=""`.
- `ModuleNotFoundError: pocket_tts` → base omits TTS; `pip install pocket-tts` separately.
- `HFValidationError: Repo id 'gemma4:26b'` → transformers wants HF id, not Ollama tag. Use `chat-completions`.
- Ollama `/v1/chat/completions` timeout → Ollama busy loading; wait + retry.

## References
- `references/s2s-verified-commands.md` — full copy-paste command transcript, WS verification, VPS deploy shape, error→fix table.
