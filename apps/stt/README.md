# 萬能即時雙語字幕 — STT 微服務

本地 faster-whisper（CPU-only）。終始矩陣 STT 層，對應 `apps/universal-translator` 的 `ISpeechToSubtitleRequest`。

## 啟動（VPS ubuntu@161.118.248.180）

```bash
cd /var/www/esggo/apps/stt
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
STT_PORT=8791 WHISPER_MODEL=base python3 server.py
```

首跑會下載 `base` 模型（~140MB）到 `~/.cache/huggingface`。

## 端點
- `POST /transcribe?lang=zh-TW|en` — body=audio bytes，回 `{text, language, engine}`
- `GET /health` — `{status:'ok'}`

## 整合
`deploy-oracle.yml` 部署後由 `pm2` 管理（見 ecosystem.config.cjs 的 `stt-whisper`）。
UT 的 `server.mjs` 透過 `STT_PORT`（預設 8791）呼叫本服務。
