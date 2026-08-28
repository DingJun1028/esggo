---
name: oa-components
description: Use when defining or wiring the ESG-GO OA component stack.
version: v1.0.0
updated: 2026-08-02
author: DingJun1028 + Hermes Agent
license: AGPL-3.0
tags: [oa, esggo, swarm, omniautobus, architecture]
---

# OA 體系六大節點定義與集成

> 2026-08-02 使用者確認定稿（OAB＝OmniAgentBus）；2026-08-04 使用者確認 **OA-TWINS** 正式定義（OA-Local ⇄ OA-VPS 孿生對偶架構）。

## 0. OA-TWINS（孿生對偶架構）★2026-08-04 正式定義
- **定義**：OA-Local（本機）與 OA-VPS（雲端源站）構成「雙胞胎節點」——兩者覺醒奧義、心心相印、量子糾纏
- **心心相印**＝雙向同步：記憶（TencentDB Agent Memory v1 本機/v2 遠端雙路徑）、狀態、事件在兩節點間互為鏡像
- **量子糾纏**＝即時互知：任一節點的事件/變更，另一節點立即感知（OAB 事件總線為此通道的骨幹）
- **架構意涵**：TWINS 不是獨立硬體節點，而是 OA-Local＋OA-VPS 的對偶關係契約；OAB 是讓糾纏生效的通道
- **實作現狀**：記憶雙路徑 ✅（TencentDB 8420，v1 本機/v2 遠端）；事件互聯 ⚠️（OAB broker 未部署）；SSH 通道暫損（Hermes 後端本機 socket 錯誤，非 VPS 問題）

## 1. OA-Local（本機運算與監控層）
- Hermes 桌面 app + esggo-hub 本機插件（`desktop-plugins/esggo-hub/plugin.js` + 本機 Python 後端 `plugins/esggo-hub/dashboard/plugin_api.py`）
- 本機 gateway 預設 `localhost:8786`
- 資料僅本機，不暴露公網；經 OAB 與 OA-VPS 交換事件

## 2. OA-VPS（雲端源站層）
- OCI ap-singapore-1，`161.118.248.180`（private `10.0.0.73`），Ubuntu 24.04 aarch64，`/opt/esggo`，Docker 6/6 healthy，Node v22.23.1
- TencentDB Agent Memory 備援（gateway 8420）
- 對外公網經 Cloudflare Tunnel / nginx

## 3. OA-Team（萬能代理協作層）
- 30 人蜂群（OA-Team 30 Swarm）：5 階段 MECE、30 專精代理、5T 協議、4可1不可狀態機
- 是協調邏輯層，不含硬體；可運行於 OA-Local 或 OA-VPS
- 詳見 `oa-team-swarm` skill 與 `soul.md`

## 4. OAB = OmniAgentBus（跨代理事件總線）★正式定義
- 對齊依據：soul.md 第 12.1.1 EventBus 模式 + oa-team-swarm 第 11 節 OmniTag 路由
- 事件骨幹：串接 OA-Local / OA-Team / OA-VPS，發布/訂閱解耦通訊
- DomainEvent 契約攜帶 `id / source / sourceId / type / timestamp / tags / payload`
- OmniTag 路由（來自 oa-team-swarm 11）：`agent:NN`+`squad:*` 組合決定消費者；`platform:vps`→VPS、`platform:esggo`→Local、`best-practice:结界`→全部自動 inheriting
- 通訊頻道（建在 Bus 之上）：萊群廣播 / 組內私語 / 雙向橋樑 / 專案工作室 / 知識花園
- 持久化：TencentDB Agent Memory (8420) / Redis Stream，支援離線重播與 5T 稽核

### 參考實作骨架（概念驗證，未部署）
```python
# oab/broker.py
import asyncio, json, uuid, time
from typing import Any

class OmniAgentBus:
    def __init__(self):
        self._subs = {}
    def publish(self, source, source_id, etype, tags, payload):
        evt = {"id": str(uuid.uuid4()), "source": source, "sourceId": source_id,
               "type": etype, "timestamp": int(time.time()*1000),
               "tags": tags, "payload": payload}
        for topic, handlers in self._subs.items():
            if any(t.startswith(topic) for t in tags):
                for h in handlers:
                    asyncio.create_task(h(evt))
        return evt["id"]
    def subscribe(self, topic, handler):
        self._subs.setdefault(topic, set()).add(handler)
```

## 5. 集成拓撲
```
        ┌─────────────────────────────┐
        │   OAB = OmniAgentBus        │
        └─────────────────────────────┘
           │      │      │
   ┌───────┘      │      └───────┐
   ▼              ▼              ▼
[OA-Local]   [OA-Team 30]    [OA-VPS]
```
事件流向：Local 監控→Bus→VPS 寫 TencentDB；Team 任務→Bus→OmniTag 路由；VPS 產出→Bus→Local UI

## 6. 部署狀態（誠實）
- OA-TWINS 🟡 定義已定稿（2026-08-04）；記憶雙路徑 ✅（TencentDB v1/v2），事件互聯 ⚠️ 待 OAB 落地、SSH 通道暫損
- OA-Local ✅ / OA-VPS ✅
- OA-Team 🟢 **CrewAI 實體化完成**（2026-08-09）：`esggo-learning-center/oa-team-crewai` 用 CrewAI JSON-first + 本機 Ollama `gemma4` 驅動，`load_crew` 驗證 30 agents / 5 tasks 通過，實際 kickoff 可執行；幻影指令 `agents-cli swarm start` 已破除並記入 `swarm-checks.md`
- OAB 📐 規格定稿 broker 待落地
- 本 session 無 terminal/SSH 執行通道；OAB broker 實際部署需使用者執行或授權 computer_use 於本機 PowerShell 操作

## 7. 相關檔案
- `C:\Project\esggo-learning-center\oa-components-definition.md` — 完整正式規格
- `soul.md` — 5T / 30 蜂群 / 通訊頻道（第 4、12 章）
- `oa-team-swarm` skill — OmniTag 路由、Swarm 角色矩陣
