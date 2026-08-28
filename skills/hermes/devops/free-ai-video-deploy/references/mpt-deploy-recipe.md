# MPT Free Deploy — Full Verified Command Sequence

Tested on VPS 161.118.248.180 (Oracle ARM, 24G RAM, docker installed, Ollama qwen2.5:3b on :11434).
MPT v1.3.5. Result: 10.6MB MP4 generated (task 7825c426..., state:1), public HTTP live at mpt.esggo.co / mpt-api.esggo.co.

## 1. Clone
```bash
mkdir -p /opt/esggo/apps && cd /opt/esggo/apps
git clone --depth 1 https://github.com/harry0703/MoneyPrinterTurbo.git mpt
cd mpt && cp config.example.toml config.toml
```

## 2. Patch config.toml (python in-place)
```python
import re
p='config.toml'; s=open(p,encoding='utf-8').read()
s=re.sub(r'llm_provider = "moonshot"', 'llm_provider = "ollama"', s)
s=re.sub(r'ollama_base_url = ""', 'ollama_base_url = "http://host.docker.internal:11434/v1"', s)
s=re.sub(r'ollama_model_name = ""', 'ollama_model_name = "qwen2.5:3b"', s)
s=re.sub(r'video_source = "pexels"', 'video_source = "local"', s)
s=re.sub(r'material_directory = ""', 'material_directory = "/MoneyPrinterTurbo/storage/materials"', s)
s=re.sub(r'pexels_api_keys = \[\]', 'pexels_api_keys = ["local-mode-dummy"]', s)
open(p,'w',encoding='utf-8').write(s)
```

## 3. Materials (sudo — docker volume is root-owned)
```bash
sudo mkdir -p storage/materials && sudo chmod 777 storage/materials
ffmpeg -y -f lavfi -i color=c=0x10243f:s=1080x1920:d=5 \
  -vf "drawtext=text='OA-Team clip 1':fontcolor=white:fontsize=80:x=(w-text_w)/2:y=(h-text_h)/2" \
  -pix_fmt yuv420p storage/materials/clip1.mp4
# repeat clip2, clip3
```

## 4. Compose + up
Use templates/docker-compose.esggo.yml (ports 7860/7861, extra_hosts host.docker.internal).
```bash
docker compose -f docker-compose.esggo.yml up -d
sleep 20
docker ps | grep moneyprinter
```

## 5. Generate + poll
```bash
TID=$(curl -s -X POST http://localhost:7861/api/v1/videos -H 'Content-Type: application/json' \
  -d '{"video_subject":"OA-Team 雙蜂戰隊 60 協作生產短影音","video_aspect":"9:16","voice_name":"zh-TW-YunJheNeural","language":"zh"}' \
  | python3 -c 'import sys,json;print(json.load(sys.stdin)["data"]["task_id"])')
# poll loop:
for i in $(seq 1 10); do sleep 15
  curl -s http://localhost:7861/api/v1/tasks/$TID | python3 -c 'import sys,json;d=json.load(sys.stdin)["data"];print(d.get("state"),d.get("progress",0),d.get("error","")[:60])'
done
```

## 6. nginx + DNS (public)
```nginx
server { listen 80; server_name mpt.esggo.co;
  location / { proxy_pass http://127.0.0.1:7860; proxy_set_header Host $host; } }
server { listen 80; server_name mpt-api.esggo.co;
  location / { proxy_pass http://127.0.0.1:7861; proxy_set_header Host $host; } }
```
Cloudflare A records mpt / mpt-api → 161.118.248.180 (grey-cloud). API Token (Zone:DNS:Edit) via curl POST /zones/$ZONE/dns_records.

## Known failure without fix
- Missing `host.docker.internal` → Ollama connection refused, script gen fails.
- Empty `pexels_api_keys` → `ValueError: pexels_api_keys is not set` even in local mode.
- certbot --dns-cloudflare default 10s propagation → TXT challenge fails; use `--dns-cloudflare-propagation-seconds 30`.
