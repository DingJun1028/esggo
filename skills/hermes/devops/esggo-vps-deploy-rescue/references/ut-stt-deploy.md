# UT STT Service Deployment (faster-whisper on 8791)

## Root cause (found 2026-08-10)
universal-translator UI showed `轉錄錯誤: HTTP 502`. Investigation:
- `apps/universal-translator/server.mjs` line ~237: `fetch('http://127.0.0.1:${STT_PORT||8791}/transcribe')`
- `stt_client.mjs` line 13: `STT_URL = http://127.0.0.1:8791/transcribe`
- **Repo had NO STT service** — no `apps/stt`, no docker-compose whisper, no 8791 listener on VPS.
- UT service itself was online (health 200, v1.3.0) but every speech call failed because the upstream whisper microservice never existed.

User constraint: **"只用免費算立"** → no cloud STT API. Local CPU faster-whisper is the compliant choice.

## Files added (commit 1f621ece3)
- `apps/stt/server.py` — FastAPI wrapper around faster-whisper, POST `/transcribe?lang=zh-TW|en` (body=audio bytes), GET `/health`
- `apps/stt/requirements.txt` — fastapi, uvicorn[standard], faster-whisper
- `apps/stt/README.md` — deploy instructions
- `ecosystem.config.cjs` — added `stt-whisper` service (interpreter `python3`, env `STT_PORT=8791 WHISPER_MODEL=base WHISPER_DEVICE=cpu WHISPER_COMPUTE=int8`) + added `STT_PORT: '8791'` to UT env
- `apps/universal-translator/stt_client.mjs` — clearer error: `502/503/ECONNREFUSED` → `STT_UNAVAILABLE:本地 faster-whisper (8791) 未啟動`

## VPS deployment steps (run AFTER SSH is reachable)
```bash
ssh ubuntu@161.118.248.180
cd /var/www/esggo/apps/stt
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt        # first run downloads base model (~140MB) to ~/.cache/huggingface
# verify
STT_PORT=8791 WHISPER_MODEL=base python3 server.py &
curl -s http://127.0.0.1:8791/health   # expect {"status":"ok"}
# then let pm2 manage it:
cd /var/www/esggo && pm2 start ecosystem.config.cjs --update-env
pm2 ls   # expect universal-translator + stt-whisper both online
```

## Caveat
faster-whisper `base` on 1 OCPU ARM (VM.Standard.A1.Flex) is SLOW — expect 20-60s latency per ~10s audio clip. Not truly "real-time" but free & offline. If user later accepts a cloud key, swap `STT_URL` to a hosted endpoint; the UT contract stays the same.

## Verification
- `python -m py_compile apps/stt/server.py` ✅ (syntax)
- `node --check apps/universal-translator/stt_client.mjs` ✅
- `node --check ecosystem.config.cjs` ✅
- Runtime (UT actually transcribing) NOT yet verified — blocked on VPS SSH recovery after SOFTRESET.
