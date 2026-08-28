# TencentDB Agent Memory — VPS 整合現狀 (2026-08-13 實證)

來源：`oa-shared-memory` 技能（user-owned，無法直接 patch）。此筆記補在 esggo-vps-ops 下，因 VPS 運維相關且本 sessions 實測。

## 部署狀態（已驗證）
- 三容器 healthy：`tdai-memory-core` / `tdai-memory-hub` / `tdai-proxy`
- 對外 `memory.esggo.co` → HTTP 200
- 部署路徑：`/opt/esggo/apps/tencentdb-memory/`，admin key 在 `.admin-key`（39 bytes）
- 配置：`/opt/esggo/apps/tencentdb-memory/.memory-core-config/tdai-gateway.yaml`

## 認證與 health（可用）
```
GET http://127.0.0.1:8420/health
x-tdai-service-id: default
Authorization: Bearer <TDAI_GATEWAY_API_KEY>   # 從 .admin-key 讀
→ {"status":"ok","version":"0.2.0","upstream":"http://localhost:11434/v1",...}
```
認證鏈運作正常（缺 service_id 會回 `missing service_id`）。

## 寫入端點（未知 — 2026-08-13 全 404）
以下路徑在 `8420` 與 `8424` 都回 `Not found`：
- `POST /v3/default/memory`
- `POST /v1/default/memory`
- `POST /default/memory`
- `POST /v3/default/memory/recall`
- `POST /memory`

**結論**：寫入正確 path 待查 agentmemory 官方協議。不要盲目試路徑浪費回合。

## 關鍵陷阱
1. **VPS 內網才可連**：`8420` 只對 VPS localhost 開放（容器無 host port 映射）。本機 `node` 跑同步腳本會 `fetch failed`。同步必須在 VPS 上跑（cron / ssh）。
2. **優雅降級**：程式化同步（如 `scripts/tdai-memory-sync.mjs`）寫入失敗時應標 `sync_failed` 並保留本地 registry，不崩、不假稱成功。
3. **docker 容器不可直接改源**（見 SKILL.md pitfall 20）：`omniagent-gateway` 是 docker 容器，同理記憶棧容器來源不可 host 改。

## 建議後續
- `hermes curator adopt oa-shared-memory` 後，把本筆記併入該技能 Pitfalls
- 確認正確寫入 path 後，補 `scripts/tdai-memory-sync.mjs` 的 WRITE_PATHS
