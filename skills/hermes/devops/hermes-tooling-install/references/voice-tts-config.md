# Voice & TTS Config Reference

## Free setup — no API keys required

### config.yaml additions (`~/.hermes/config.yaml`)

```yaml
tts:
  provider: edge                  # Edge TTS — built-in, free, on-device
  edge:
    voice: zh-TW-HsiaoYuNeural    # Mandarin female voice

stt:
  enabled: true
  provider: local               # faster-whisper — on-device
  local:
    model: base                  # tiny/base/small/medium/large-v3

voice:
  auto_tts: true                 # auto-voice every response

wake_word:
  enabled: true
  phrase: "嗨馬修"               # any phrase; local hotword listener
```

### Install faster-whisper (STT)

```bash
# Into the Hermes venv
cd ~/.hermes/hermes-agent/venv
python -m pip install faster-whisper
```

### Verify

```bash
# TTS
python -c "import edge_tts; print('TTS OK')"

# STT
python -c "from faster_whisper import WhisperModel; print('STT OK')"
```

### Known pitfalls

1. **`hermes config set stt.provider local`** — produces a warning ("not a recognized config key"). Set via YAML edit or use `--force` flag.
2. **Edge TTS on Windows** — needs PowerShell at `C:\Windows\System32\WindowsPowerShell\v1.0\powershell`.
3. **Wake word config** — must be in `config.yaml` directly. The `/voice` toggle in some Hermes versions writes to `cli-config.yaml` (which the reader doesn't see), causing the setting to silently vanish on restart.
4. **`voice.auto_tts` vs `/voice tts`** — `auto_tts: true` voices every response; `/voice tts` is a runtime toggle for the current session only.