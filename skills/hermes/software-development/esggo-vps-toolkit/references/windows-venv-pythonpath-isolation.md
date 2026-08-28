# Windows / Hermes PYTHONPATH pollution fix

When installing or running Python packages on this Windows host under Hermes, a new venv
silently inherits the Hermes agent venv via the `PYTHONPATH` env var. This causes
`regex` circular-import errors, `huggingface_hub outside environment` conflicts, and
`ModuleNotFoundError` for packages you just installed into the new venv.

## Symptom
- `pip install X` into a fresh venv, then `import X` → `ModuleNotFoundError`.
- Or: `import regex` → `ImportError: cannot import name '_regex' from partially initialized module 'regex' (... hermes-agent\venv\...)'`.
- `sys.path[1]` contains `C:\Users\dingj\AppData\Local\hermes\hermes-agent\venv\Lib\site-packages`.

## Root cause
Hermes desktop App injects:
```
PYTHONPATH=C:\Users\dingj\AppData\Local\hermes\hermes-agent;C:\Users\dingj\AppData\Local\hermes\hermes-agent\venv\Lib\site-packages
```
Every Python process (even an isolated `uv venv`) prepends these, so it resolves hermes
packages BEFORE its own venv site-packages.

## Fix (every pip / run command)
Prefix with `env PYTHONPATH=""` (git-bash) or `PYTHONPATH=` (PowerShell):
```bash
env PYTHONPATH="" /c/tmp/s2s_venv2/Scripts/python.exe -m pip install speech-to-speech
env PYTHONPATH="" /c/tmp/s2s_venv2/Scripts/speech-to-speech.exe --ws_host 127.0.0.1 --ws_port 8765 ...
```
Confirm clean:
```bash
env PYTHONPATH="" /c/tmp/s2s_venv2/Scripts/python.exe -c "import sys; print(any('hermes' in p for p in sys.path[1:]))"
# must print False
```

## Create the venv
`uv venv` is preferred (does not inherit system site-packages). Avoid `python3 -m venv` if
the `python3` on PATH is the hermes one — but even so, the `env PYTHONPATH=""` prefix at
install/run time is what actually isolates.

## Verified working example (speech-to-speech, 2026-08-10)
```bash
uv venv C:/tmp/s2s_venv2
env PYTHONPATH="" C:/tmp/s2s_venv2/Scripts/python.exe -m pip install speech-to-speech
env PYTHONPATH="" C:/tmp/s2s_venv2/Scripts/python.exe -m pip install pocket-tts
env PYTHONPATH="" C:/tmp/s2s_venv2/Scripts/speech-to-speech.exe --ws_host 127.0.0.1 --ws_port 8765 \
  --stt parakeet-tdt --llm_backend chat-completions --model_name "qwen2.5:3b-instruct-q4_K_M" \
  --responses_api_base_url "http://localhost:11434/v1" --responses_api_api_key "ollama" \
  --tts pocket --enable_live_transcription
```
WS verify: `websockets.connect('ws://127.0.0.1:8765/v1/realtime')` → `WS_CONNECT_OK`.
