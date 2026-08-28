---
name: free-ai-video-deploy
description: Deploy MoneyPrinterTurbo free (Ollama+Edge TTS+local).
---

# Free AI Video Deploy (MoneyPrinterTurbo pattern)

Deploy AI short-video generation tools using ONLY free/local compute: local Ollama LLM for script, Edge TTS for voice (no API key), local CC0 materials, ffmpeg inside the container for render. Zero paid API cost.

## When to use
- User pastes MoneyPrinterTurbo (or similar) README and wants it running.
- OA-Team dual-hive (60) needs a video production line (萬能動畫蜂 / 音頻蜂).
- Hard rule in play: "只用免費算立" (no paid APIs, local Ollama CPU inference).
- Any "stand up an AI video generator on a VPS with local models" request.

## Verified recipe (MPT v1.3.5, VPS 161.118.248.180, Oracle ARM 24G)
Full commands in `references/mpt-deploy-recipe.md`. Compose template in `templates/docker-compose.esggo.yml`.

### 1. Clone + config
```bash
git clone --depth 1 https://github.com/harry0703/MoneyPrinterTurbo.git mpt
cd mpt && cp config.example.toml config.toml
```
Edit `config.toml`:
- `llm_provider = "ollama"`
- `ollama_base_url = "http://host.docker.internal:11434/v1"`  ← NOT localhost; container DNS
- `ollama_model_name = "qwen2.5:3b"`  ← must match `ollama list`
- `video_source = "local"`
- `material_directory = "/MoneyPrinterTurbo/storage/materials"`
- `pexels_api_keys = ["local-mode-dummy"]`  ← MPT BUG: local mode validates pexels key non-empty; dummy bypasses, never called
- `subtitle_provider = "edge"`  (Edge TTS, free, no key)

### 2. Docker compose
Use `templates/docker-compose.esggo.yml` (ports 7860→8501 WebUI, 7861→8080 API). CRITICAL: add `extra_hosts: - "host.docker.internal:host-gateway"` to BOTH services so the container reaches host Ollama.

### 3. Materials
```bash
sudo mkdir -p storage/materials && sudo chmod 777 storage/materials
ffmpeg -y -f lavfi -i color=c=0x10243f:s=1080x1920:d=5 -vf "drawtext=text='OA-Team clip':fontcolor=white:fontsize=80:x=(w-text_w)/2:y=(h-text_h)/2" -pix_fmt yuv420p storage/materials/clip1.mp4
```

### 4. Start
```bash
docker compose -f docker-compose.esggo.yml up -d
```

### 5. Generate + poll
```bash
TID=$(curl -s -X POST http://localhost:7861/api/v1/videos -H 'Content-Type: application/json' \
  -d '{"video_subject":"...","video_aspect":"9:16","voice_name":"zh-TW-YunJheNeural","language":"zh"}' \
  | python3 -c 'import sys,json;print(json.load(sys.stdin)["data"]["task_id"])')
# poll /api/v1/tasks/$TID until state:1 (completed)
```

## Pitfalls (all hit and resolved this session)
- **Container cannot reach host Ollama via `localhost`** — Docker isolates networks. Use `host.docker.internal` + `extra_hosts: host.docker.internal:host-gateway`.
- **MPT local mode still requires `pexels_api_keys` non-empty** — even with `video_source="local"`. Dummy value bypasses, never called. Without it: `ValueError: pexels_api_keys is not set`.
- **Ollama timeout if competing model occupies GPU/CPU** (e.g. `gemma4:e4b` ~115% CPU) — 12s timeout → MOCK. Raise to 45s or unload competing model. See `esggo-learning-center-dev-lessons` §9.
- **certbot --dns-cloudflare TXT propagation too fast** — default 10s fails. Retry `--dns-cloudflare-propagation-seconds 30`. See `esggo-learning-center-dev-lessons` §11.
- **Permission denied on `./storage`** — docker volume mounts root; `sudo mkdir -p storage/materials && sudo chmod 777` before ffmpeg.
- **API endpoint `/api/v1/videos` (POST)**, not `/api/v1/video`. State in `data.state` (nested).

## Verification (must pass before claiming done)
- `curl http://localhost:7861/ping` → `pong`
- Generate → poll until `state:1`; `combined_videos` MP4 exists; `file` shows `ISO Media, MP4`.
- Public: `curl -H 'Host: mpt.esggo.co' http://localhost/` → Streamlit; `curl http://mpt-api.esggo.co/ping` → `pong`.

## nginx + DNS (optional)
- `/etc/nginx/sites-available/mpt.esggo.co.conf` proxying :7860 / :7861; `nginx -t && systemctl reload nginx`.
- Cloudflare A records (grey-cloud first). API Token (Zone:DNS:Edit), NOT OAuth. See `esggo-learning-center-dev-lessons` §10.
