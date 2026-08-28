# AI Station 倉庫技能書

## 專案概述

AI Station 是一個**全自動影音生產線**（FastAPI 7 模組管線），將「寫腳本」到「出片」的 7 道工序自動化：

1. 編排中心（pipeline/app.py）
2. 文本解析（parser.py）
3. 語音合成（tts.py）
4. 視覺生成（visuals.py）
5. 渲染引擎（renderer.py）
6. 雲端儲存（storage.py）
7. 溯源日誌（db.py/metrics.py）

**預設零雲端成本**：edge-tts + ffmpeg + Pillow。雲端金鑰到位即切換至 ElevenLabs / Runway / S3。

## 目錄結構

```
.
├── src/                    # 核心 7 模組
│   ├── app.py              # FastAPI 控制中心 + webhook
│   ├── pipeline.py         # 背景執行緒池 + job 生命週期
│   ├── parser.py           # 文本解析（內建 / OpenAI / DNA）
│   ├── tts.py              # 語音合成（edge-tts / ElevenLabs）
│   ├── visuals.py          # 視覺生成（Pillow / Runway）
│   ├── renderer.py         # ffmpeg 渲染 + 同步字幕
│   ├── storage.py          # 本地 / S3 發布
│   ├── db.py               # SQLite 作業庫 + provenance 鏡像
│   ├── metrics.py          # 指標聚合
│   ├── brand.py            # 壽司博士 Dr. Source 品牌預設
│   └── config.py           # 設定 + feature 旗標
├── tests/                  # pytest 套件
├── web/                    # Web UI
├── n8n/                    # n8n workflow JSON
├── deploy/                 # VPS 部署腳本
└── SKILL.md                # 本文件
```

## 開發命令

### 安裝依賴

```bash
pip install -e .              # 基本安裝
pip install -e ".[dev]"       # 開發依賴
pip install -e ".[s3]"        # S3 支持（可選）
```

### 測試

```bash
pytest tests/ -q
```

### 啟動服務

```bash
ai-station                 # 或 python -m src.app
uvicorn src.app:app --port 8000
```

### Docker

```bash
docker build -t ai-station .
docker run -p 8000:8000 ai-station
```

## 核心 API 端點

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | `/api/health` | 健康檢查 + feature 旗標 |
| GET | `/api/metrics` | 生產線指標 |
| POST | `/api/jobs` | 提交作業 |
| GET | `/api/jobs/{id}` | 作業狀態 |
| GET | `/api/jobs/{id}/video` | 成片檔 |
| POST | `/webhook/n8n` | n8n webhook |

## 配置要點

- 所有雲端整合皆為**可選**：留白即走免費路徑
- `WEBHOOK_SECRET` 啟用後需 `X-AI-Station-Key` header 或 `?key=` query
- `FONT_PATH` 自動解析 Noto CJK / msyh.ttc

## 品牌 DNA 模板

```
【場景】...
【衝突】...
【洞察】...
【方法】...
【反思】...
```

## 部署要點

- 多架構容器映像：`docker.io/dingjunhong1028/aistation:latest`
- VPS 部署：`deploy/deploy.sh USER@HOST domain.com`
- HTTPS：`sudo certbot --nginx -d domain.com`

## 里程碑狀態

| 模組 | 狀態 |
|------|------|
| 7 模組管線 | ✅ 30 測試通過 |
| 品牌預設 | ✅ DNA 模板支援 |
| 安全特性 | ✅ webhook auth + path traversal guard |
| 可觀測性 | ✅ /api/metrics + web UI |
| Docker 部署 | ✅ 多架構映像推送 |
| VPS 部署 | ✅ Oracle Always-Free ARM64 上線驗證 |
| 雲端整合 | 🔒 需 API 金鑰驗證 |