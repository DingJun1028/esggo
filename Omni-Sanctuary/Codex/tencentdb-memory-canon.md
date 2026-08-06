# TencentDB Agent Memory 集成聖典 (M1 Canon)

> **「萬能蜂群共享記憶之聖櫃；三十靈魂，一記憶海。」**

TencentDB Agent Memory（上游 `TencentCloud/TencentDB-Agent-Memory`）為 OA-Team 雙蜂群（蜂王 OA-LOCAL + 蜂后 OA-VPS）提供**共享長期記憶後端**：MemoryCore（記憶核心 + Gateway API）、MemoryHub（Panel 管理 UI + Knowledge 知識服務）、Proxy（上游 LLM 轉發）。

## 五大支柱映射

| 支柱 | 精神 | M1 實踐 |
|------|------|---------|
| 簡單性 | 一鍵拉起 | `start-all.sh` 自動依序啟 core→hub→proxy |
| 快速性 | 共享記憶 | 蜂群經 `https://memory.esggo.co/gateway/` 讀寫記憶 |
| 正確性 | 5T 協議 | Gateway 寫入即 Hash Lock，admin key 持久化 |
| 永續性 | 自動熵減 | Docker volume 持久化 + 定期 prune |
| 安全性 | 不裸開端口 | Cloudflare Tunnel 終止 TLS，origin 走 :80 |

## 架構拓撲

```
OA-Team 蜂群 (VPS 內: esggo-core/omniagent-gateway/omni-blueprint-hub)
        │  https://memory.esggo.co/gateway/
        ▼
Cloudflare Tunnel (esggo-tunnel) ── TLS 終止 ──► VPS nginx :80
        │                                      ├─ /gateway/ → 127.0.0.1:8420 (MemoryCore)
        │                                      └─ /         → 127.0.0.1:8125 (Panel)
        ▼
Docker: tdai-memory-core (8420) + tdai-memory-hub (8125/8424) + tdai-proxy (8096)
```

## 部署工庫（最佳實踐清單）

1. **程式碼集成**：`apps/tencentdb-memory/` 複製上游 `deploy/global-images/` 全套腳本 + `.env.example`
2. **密鑰注入**：VPS 端 `sed` 從 `.env.example` 產生 `.env`（Groq `openai/gpt-oss-20b`），**不進 git**
3. **CRLF 陷阱**：上游 `.env.example` 含 Windows CRLF，VPS bash `source` 會報 `$'\r': command not found` → 必須 `sed -i 's/\r$//' .env`
4. **執行權限**：`git reset --hard` 後腳本可能掉 `+x` → `chmod +x start-*.sh _lib.sh`
5. **VPS 權限**：`/opt/esggo` 巢狀子目錄若曾由 root 寫入，ubuntu 會 `Permission denied` → `sudo chown -R ubuntu:ubuntu /opt/esggo`
6. **鏡像拉取慢**：`start-all.sh` 拉三個大鏡像，終端易超時 → 用 `nohup bash start-all.sh &` 背景跑，再輪詢 `docker ps`
7. **暴露方式**：不裸開 8125/8420/8096。建 `memory.esggo.co` nginx(:80) + cloudflared tunnel ingress + `cloudflared tunnel route dns <id> memory.esggo.co`（tunnel 自身憑證建 CNAME，不需外部 API token）

## 驗證標準

- Panel: `curl -s -o /dev/null -w "%{http_code}" https://memory.esggo.co/` → `200`
- Gateway: `curl https://memory.esggo.co/gateway/health` → `{"status":"ok",...}`
- 容器: `docker ps` 三件套皆 `healthy`

## 狀態

- 程式碼集成 ✅ 推送 (`de3cafb87`)
- VPS 實例 ✅ 三件套 healthy + 公網 tunnel 驗證通過
- admin key 持久化於 `/opt/esggo/apps/tencentdb-memory/.admin-key`

---
*Hash Lock 已啟用 | 見證：OA-Team 30 萬能蜂群 | M1 完整集成*
