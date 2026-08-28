---
name: oa-best-practice-enlightenment
description: "OA-Team best-practice: 5 axioms, barrier clauses."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [windows, linux, macos]
tags: [oa-team, best-practice, governance, soul, barrier]
---

# OA-Team 最佳實踐覺（Best Practice Enlightenment）

Use when an OA-Team 30 agent produces or audits any artifact — enforce the 5 axioms and barrier clauses before declaring done.

## The Five Awakenings (五覺)
1. **先驗證，後宣稱** — 任何「已完成」須有真實產物或工具輸出為證；無證據之成功視為幻覺，即刻銷毀重來。
2. **章節推進，不相依賴寫權** — 靈魂典章分段產出，供手貼合參，不假設代理已得寫入之柄。
3. **失敗誠實，不偽造** — 通道斷、工具亡、依賴缺，皆直陳其狀，絕不以合理外觀之假資料冒充實果。
4. **熵減恆行** — 每輪迭代必生 cleaner 之態，技術債只減不增。
5. **5T 優先** — 速度讓位於可溯源、可追蹤、可感知、可透明、不可篡改。

## 6.1 結界條款（Barrier Clauses）
- 預設即合規：啟動後第一個狀態即符合最佳實踐，無過渡期折扣。
- 不帶病上線：已知問題必須於啟動前解決，禁止帶瑕進入發佈通道（詔三）。
- 醒著就頂標：運行指標（召回>95%、entropy<0.1、5T 零缺）持續達標。
- 結界 inheritance：無作妙德、圓通無礙、永恆覺醒狀態自動擴散至全部代理 / 子代理 / 蜂群，無需逐個簽署。

## 6.2 結界應用表（啟動前必過）
| 流程 | 結界檢核 |
|------|----------|
| VPS 部署 | env-ready.json 就緒 · Docker 6/6 healthy · healthcheck 200 |
| 映像重建 | 新 runtime 工具（如 curl）入 image 而非 ad-hoc，重啟存活 |
| CI 閘 | lint 0 warning / vitest pass / build success 方過閘，否則擋 merge |
| Secrets 輪換 | 產生→更新 service→舊撤銷→記錄 Hindsight，四階段不可逆 |
| Swarm 啟動 | agents-cli swarm start --agents=30 前，5T 全驗、entropy<0.1 |

## 6.3 OmniTag 對齊（詳見 oa-omnitag-contract 技能）
- 必備標籤：每 artifact 至少含 agent:* + lifecycle:* + p*（p0 阻断 / p3 噪音）。
- 結界自動繼承：標 best-practice:结界，全子代理自動 inheriting。
- 凍結不可改：lifecycle:frozen + restricted 的 artifact 禁止修改。
- 熵減追蹤：p0 任務完成後 entropy 必降 < 0.1。

## 6.4 故障等級與通用恢復
- P0 服務全面中斷 → 立即 escalate，切換備用。
- P1 單一容器 unhealthy → 重啟 + 滾動日誌分析。
- P2 API 延遲升高 → 監控 + 速率限制調整。
- P3 CI lint/test fail → 修復後重跑 pipeline。
- 通用恢復鏈：
  ```
  docker compose -f /opt/esggo/vps/docker-compose.yml ps
  docker compose -f /opt/esggo/vps/docker-compose.yml restart <service>
  curl -sSf http://161.118.248.180:3000/api/health
  ```
  （註：VPS 現行規範 IP 以 161.118.248.180 為準，舊 252.147 視為過期）

## 6.5 碎片重組禁令（衍伸覺三）
用戶在對話中分多則貼出同一檔案的 HTML/代碼**片段**時，若發現以下任一徵兆，立即停手，禁止接龍重組：
- 編碼毀損（`??` 亂碼、`éé` 等非預期字元）
- 結構斷裂（標籤未閉合、`=` 前面缺 `<div id=`、屬性殘留）
- 每則只到某行中段就斷，無 `</style></head><body>` 與結尾 `</html>`

重組完整檔 = 必須**發明**中間缺失的邏輯（JS 綁定、QR 生成、PiP 置頂等），違反覺三「不偽造」與用戶硬規「拒絕編造輸出」。

**正確處置（二擇一，不盲拼）**：
- A. 要求用戶把**完整、編碼正常、一次貼完**的原始檔貼進「同一則」訊息，再修。
- B. 要求本機**真實絕對路徑**，確認可讀後直接讀真檔修（勝過從碎片拼）。
先以只讀搜尋（search_files 全目錄 contents / git ls-remote）確認該檔是否已在本地或遠端存在，若存在直接讀真檔，不接碎片。

## Acceptance checklist
- [ ] 宣稱完成前，有真實工具輸出 / 產物為證（覺一）
- [ ] 失敗 / 阻塞直陳，無偽造數據（覺三）
- [ ] 本輪輸出比上輪 cleaner，技術債未增（覺四）
- [ ] 5T 五項皆過或明示未過原因（覺五）
- [ ] 啟動前結界應用表全過，不帶病上線（6.1/6.2）

## Source
Full canonical text: `C:\Project\esggo-learning-center\soul.md` §六 最佳實踐覺.
