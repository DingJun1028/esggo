# Voice Configuration & Verification

## Setup Commands

```bash
# 1. Check current config
hermes config get tts.provider
hermes config get stt.provider
hermes config get wake_word.enabled
hermes config get wake_word.phrase

# 2. Set TTS to free Edge TTS (Male Taiwan Mandarin voice)
hermes config set tts.provider edge
hermes config set tts.edge.voice zh-TW-YunJheNeural
hermes config set tts.edge.rate "+30%"    # 30% faster

# 3. Set STT to local free whisper (installed in Hermes venv)
hermes config set stt.enabled true
hermes config set stt.provider local
hermes config set stt.local.model base
hermes config set stt.local.language 繁體中文

# 4. Auto-TTS + Wake Word
hermes config set voice.auto_tts true
hermes config set voice.response_delay 0.3
hermes config set wake_word.enabled true
hermes config set wake_word.phrase "嗨馬修"

# 5. Oracle ARM S2S Voice Integration
hermes config set voice.s2s_backend oracle-arm
hermes config set voice.s2s_endpoint http://161.118.248.180:8765
```

## Verification Commands

```bash
# Test Edge TTS generation time (should be ~2s)
time edge-tts --voice "zh-TW-YunJheNeural" --rate "+30%" \
  --text "嗨馬修，語音功能已啟動" --write-media test.mp3

# Verify faster-whisper installed in Hermes venv
/c/Users/dingj/AppData/Local/hermes/hermes-agent/venv/Scripts/python.exe -c "import faster_whisper; print('OK')"

# Verify Oracle ARM s2s-voice service health
ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 \
  "curl -s http://localhost:8765/v1/usage"

# Verify ARM instance keepalive (should show recent heartbeats)
ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 \
  "tail -3 /var/log/keepalive-heartbeat.log"
```

## Voice Commands

| Command | Description |
|---------|-------------|
| `/voice on` | Voice-to-voice mode (STT → LLM → TTS) |
| `/voice tts` | Always voice responses |
| `/voice off` | Text-only mode |

## Voice Architecture

```
User speech → "嗨馬修" wake word → edge-tts capture
    → STT (faster-whisper local) → LLM (Hermes Agent / qwen2.5:3b on Oracle ARM)
    → TTS (Edge TTS on desktop) → voice response
```

## Oracle ARM Services (Always-Free)

| Service | Port | Purpose |
|---------|------|---------|
| s2s-voice | 8765 | Speech-to-speech pipeline (online) |
| stt-whisper | PM2 | Speech-to-text processing (online) |
| omniagent-gateway | 9090 | Agent orchestration (online) |
| oa-swarm | various | 30-agent swarm coordination (online) |

## Pricing Verification

All voice services use **FREE tiers only**:
- Edge TTS: No API key, zero cost
- faster-whisper: Local/on-device, zero cost
- Oracle ARM: Always-Free A1.Flex (4OCPU/24G, 36h uptime)
- Keepalive: CPU burst pattern, within free tier limits
