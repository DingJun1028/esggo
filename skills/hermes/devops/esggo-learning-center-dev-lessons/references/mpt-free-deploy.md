# MoneyPrinterTurbo v1.3.5 免費部署（Docker + Ollama + Edge TTS）

適用：VPS Docker 部署 MPT 作為 OA-Team 影音生產線，硬規「只用免費算立」。

## 關鍵 config.toml 片段
```toml
llm_provider = "ollama"
ollama_base_url = "http://host.docker.internal:11434/v1"
ollama_model_name = "qwen2.5:3b"
video_source = "pexels"
pexels_api_keys = ["<用戶免費key>"]
edge_tts_timeout = 120
# local 備用: material_directory = "/MoneyPrinterTurbo/storage/materials"
```

## docker-compose.esggo.yml 差異（vs release）
- ports: `127.0.0.1:7860:8501` (WebUI), `127.0.0.1:7861:8080` (API)
- 每個 service 加 `extra_hosts: ["host.docker.internal:host-gateway"]`

## 六大坑
1. 容器連宿主 Ollama 需 `host.docker.internal` + extra_hosts（容器內 localhost ≠ 宿主）
2. `video_source=pixabay` 是 bug（仍呼叫 pexels）→ 用 `pexels` + pexels key
3. Edge TTS 預設 30s 逾時長腳本 → 設 `edge_tts_timeout=120`
4. voice_name 格式 `zh-TW-YunJheNeural`（不需 -Female/-Male 後綴）
5. nginx 全域 `return 301 https` 會讓無 443 塊的新子域名報「不安全」→ 該域名也要 certbot + 443 塊
6. certbot DNS-01 傳播 10s 太短 → 加 `--dns-cloudflare-propagation-seconds 30`

## 驗收命令
```bash
curl -s -m15 "https://mpt.esggo.co/" | grep -o '<title>Streamlit</title>'
curl -s -m15 "https://mpt-api.esggo.co/ping"   # "pong"
RESP=$(curl -s -X POST https://mpt-api.esggo.co/api/v1/videos -H 'Content-Type: application/json' \
  -d '{"video_subject":"測試","video_aspect":"9:16","voice_name":"zh-TW-YunJheNeural","language":"zh"}')
TID=$(echo "$RESP" | python3 -c 'import sys,json;print(json.load(sys.stdin)["data"]["task_id"])')
# 輪詢 /api/v1/tasks/$TID 直到 state:1
```
