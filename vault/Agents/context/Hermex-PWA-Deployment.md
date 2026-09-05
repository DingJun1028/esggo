---
source_origin: oa-dual-agent-obsidian
co_authors: []
created: 2026-08-31
modified: 2026-08-31
sync: mirror
lifecycle: active
tags: [hermex, pwa, mobile, deployment, vps]
---

# Hermex PWA 部署 · 2026-08-31

> 手機端 hermex.esggo.co 完整落地：PWA 三檔案 + nginx MIME + 永久注入腳本

## 部署成果

| 項目 | 狀態 |
|------|------|
| cloudflared / nginx / hermes-serve | 全 active |
| https://hermex.esggo.co/ | HTTP 200 |
| manifest.webmanifest | HTTP 200 `application/manifest+json` |
| icon-512.png (512x512 #10243f) | HTTP 200 `image/png` |
| sw.js (service worker) | HTTP 200 `application/javascript` |
| iPhone 加到主畫面 | standalone PWA ✅ |

## 根因

`pip install --force-rebuild` 會覆寫 `web_dist/`，導致 `manifest.webmanifest`/`icon-512.png`/`sw.js` 丟失。nginx `try_files` fallback 到 `index.html`，回傳 200 + `text/html`，iOS 無法辨識為 PWA。

## 修復

1. Python 無 PIL 生成純色 `#10243f` PNG (1882 bytes)
2. nginx `mime.types` 補 `application/manifest+json → webmanifest`
3. 建立 `scripts/deploy-hermex-pwa.sh` + `deploy/hermex-pwa/` 防 rebuild 洗掉

## 防丟機制

`scripts/deploy-hermex-pwa.sh` 每次 rebuild 後執行一次即可補回三檔案。

## 相關

- PR #1020 已 merge（Hermex 架構圖 + Karpathy 推理核心 + systemd service）
- 前端 nginx: `/etc/nginx/sites-enabled/hermex.conf` (8795 → hermes-serve 9119)
- PWA 資源: `/opt/hermes-venv/lib/python3.12/site-packages/hermes_cli/web_dist/`
