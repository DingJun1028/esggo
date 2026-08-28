# OA-Team 30 Swarm Role Assignment for AI Station

## Overview
This document maps the 30-agent swarm roles (from `soul.md` Chapter 9) to AI Station project responsibilities. The 7-module production line (IDEA architecture) is executed by agents 07–30.

## 30-Agent Role Mapping (soul.md §9.2)

| # | Agent | Project Role | Responsibility |
|---|-------|--------------|----------------|
| 07 | 萬能編碼蜂 | 管線架構師 | FastAPI + 背景執行緒池，REST API 設計 (`src/app.py`, `src/pipeline.py`) |
| 08 | 萬能算法蜂 | LLM 腦設計 | 文字解析 + 壽司博士 DNA 標記 (`src/parser.py`) |
| 10 | 萬能數據蜂 | 資料管道 | SQLite + 指標系統 (`src/db.py`, `src/metrics.py`) |
| 11 | 萬能測試蜂 | E2E 測試 | 28 測試案例（含 ffmpeg 渲染、webhook 認證） |
| 12 | 萬能設計蜂 | 品牌 UI | 品牌漸層 + slate 設計 (`src/brand.py`, `src/visuals.py`) |
| 13 | 萬能圖像蜂 | 視覺生成 | Pillow 品牌漸層自動套色 (`src/visuals.py`) |
| 14 | 萬能動畫蜂 | 動態效果 | 逐字字幕 + 動畫特效 (`src/renderer.py`) |
| 15 | 萬能文案蜂 | 腳本 DNA | 【場景】【衝突】【洞察】【方法】【反思】標記 (`src/parser.py`) |
| 16 | 萬能音頻蜂 | 語音合成 | edge-tts + ElevenLabs 整合 (`src/tts.py`) |
| 17 | 萬能市場蜂 | 發布策略 | n8n 排程 + 社群分發 |
| 18 | 萬能社群蜂 | 用戶互動 | webhook 回傳 + 用戶回饋收集 (`src/app.py` webhook) |
| 19 | 萬能增長蜂 | 增長優化 | 生產效率優化 + 批次處理 |
| 20 | 萬能運營蜂 | 專案管理 | docker-compose + CI/CD (`deploy/`, `.github/workflows/`) |
| 22 | 萬能探路蜂 | 部署探索 | VPS + nginx + HTTPS 部署 (`deploy/deploy.sh`, `deploy/nginx/`) |
| 23 | 萬能外交蜂 | 合作關係 | AWS / Runway / ElevenLabs 金鑰協調 |
| 27 | 萬能安全蜂 | 安全防護 | Webhook 認證 + 路徑穿越防護 (`src/app.py` webhook, `src/storage.py`) |
| 28 | 萬能維護蜂 | 系統維護 | 容器映像維護 + 故障排除 |
| 29 | 萬能支援蜂 | 技術支援 | 日誌系統 + 錯誤處理 (`src/config.py` logging) |
| 30 | 萬能質控蜂 | 品質保障 | 品牌一致性驗證 + 28 測試通過 |

> Agents 01-06 (Strategy), 09 (Architecture), 21 (Business Analysis), 24-26 (Research/Field/Tracking) provide cross-cutting support but are not directly assigned to the 7-module pipeline.

## 7-Module Production Line (soul.md §9.3, §9.5)

| # | Module | IDEA Stage | Default (Free) | Cloud Enhanced | Agent |
|---|--------|------------|----------------|----------------|-------|
| 1 | 編排中心 | Input (I) | FastAPI + 背景執行緒池 | — | 07 |
| 2 | 文字解析 | I → D | 內建句法解析 + DNA 標記 | OpenAI GPT-4o | 08, 15 |
| 3 | 語音合成 | D | edge-tts（多語、免費） | ElevenLabs | 16 |
| 4 | 視覺生成 | D | Pillow 品牌漸層 | Runway B-roll | 13, 14 |
| 5 | 渲染引擎 | E | ffmpeg + 同步字幕 | — | 11 |
| 6 | 雲端儲存 | E → A | 本地 /storage | S3 | 22, 23 |
| 7 | 溯源 / 作業庫 | A | SQLite + 指標 | NoCodeBackend | 10 |

**優雅回落機制**: All cloud integrations are OPTIONAL — any key failure auto-falls back to free path without breaking production.

## Brand Presets (soul.md §9.4) — 5T Correspondence

| Brand Element | 5T Principle | Implementation |
|---------------|--------------|----------------|
| 視覺識別 | Tangible | 深藍 #10243f → 暖金 #c9a24b → 米白 #f3ede1 → 綠 #3c6e47 |
| 片頭台詞 | Traceable | 自動產生「大家好，我是壽司博士……」 |
| 腳本 DNA | Trackable | 【場景】【衝突】【洞察】【方法】【反思】標記 |
| AI 邊界 | Transparent | 思想、經驗、價值判斷來自人；AI 負責研究/初稿/視覺/剪輯/分發 |
| 禁用視覺 | Trustworthy | 藍紫霓虹、機器人大腦、漂浮數據封禁 |

Implemented in: `src/brand.py` (gradient, colors, intro text, banned visual checks).

## Security & Reliability (soul.md §9.6) — 5T Verification

| Check | Implementation | 5T |
|-------|----------------|-----|
| Webhook 認證 | `WEBHOOK_SECRET` + `hmac.compare_digest` | Trustworthy ✅ |
| 路徑穿越防護 | `resolve()` → confirm within `/storage` | Trustworthy ✅ |
| 背景作業失敗處理 | Write `failed` + error log, never stuck | Trackable ✅ |
| 雲端優雅回落 | Runway/OpenAI fail → auto free path | Transparent ✅ |
| 結構化日誌 | Key stages + traceback via `config.log` | Traceable ✅ |

## Deployment Status (soul.md §9.7)

| Item | Status | Agent |
|------|--------|-------|
| Code | GitHub `DingJun1028/aistation` (main, CI green) | 07, 20 |
| Container | `docker.io/dingjunhong1028/aistation:latest` (multi-arch) | 20 |
| Tests | 28 passed (incl. real ffmpeg E2E) | 11, 30 |
| Local run | `pip install -e . && ai-station` | 07 |
| Docker run | `docker run -p 8000:8000 dingjunhong1028/aistation:latest` | 20 |

## Proposal Priorities (soul.md §9.8)

| Priority | Item | Blockers | Agents |
|----------|------|----------|--------|
| P0 | 試營運 3 支樣片 | None | 15, 12, 16 |
| P0 | VPS 部署 + 網域 | VPS/Domain | 22, 20 |
| P1 | n8n 排程上線 | None | 17, 19 |
| P1 | ElevenLabs 語音 | API Key | 16, 23 |
| P2 | Runway B-roll 實測 | API Key | 13, 23 |
| P2 | S3 發布 + 指標盤 | API Key | 22, 10 |

## Verification Commands (from aistation skill)

```bash
# Full test suite (hermes venv)
/c/Users/dingj/AppData/Local/hermes/hermes-agent/venv/Scripts/python -m pytest -q

# Video verification suite
node scripts/video-creation-test-suite.mjs scripts/test-video-example.json
cat test-reports/evaluation-report.json

# Deploy to VPS
./deploy/deploy.sh ubuntu@161.118.248.180 aistation.esggo.co
```

## Related Files

- `soul.md` Chapter 9 — Full integration specification
- `src/brand.py` — Brand presets implementation
- `deploy/deploy.sh` — VPS bootstrap script
- `deploy/nginx/aistation.esggo.co.conf` — Nginx reverse proxy config