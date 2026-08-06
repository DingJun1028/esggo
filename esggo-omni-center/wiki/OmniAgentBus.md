# OmniAgentBus 完整功能盤點

## 📋 總覽

`OmniAgentBus` 是 ESGGO 的核心事件匯流排（Event Bus），負責系統內所有模組的通訊、協調與自動化。

**檔案位置**: `lib/agents/omni-agent-bus.ts` (1057 行)
**版本**: v4.0.0
**設計模式**: Singleton + Observer + Skill Registry

---

## 🏗️ 架構圖

```
┌─────────────────────────────────────────────────────────────┐
│                      OmniAgentBus                           │
│                     (Singleton Instance)                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Event Bus   │  │ Skill Registry│  │ SSE Bridge   │      │
│  │  (publish/   │  │ (register/   │  │ (broadcast   │      │
│  │   subscribe) │  │  execute)    │  │  hooks)      │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │               │
│  ┌──────▼─────────────────▼─────────────────▼───────┐      │
│  │              Event Propagation Engine             │      │
│  │  1. Local Listeners (In-memory)                   │      │
│  │  2. SSE Broadcast Hooks (Real-time push)          │      │
│  │  3. NCBDB/Supabase Persistence                    │      │
│  └──────────────────────────────────────────────────┘      │
│                                                             │
│  ┌──────────────────────────────────────────────────┐      │
│  │          奧義六式 (Celestial Command Framework)    │      │
│  │  1. 本質提純 (Entropy Refinement)                  │      │
│  │  2. 聖典共鳴 (Sacred Resonance)                    │      │
│  │  3. 代理織網 (Agent Weaving)                       │      │
│  │  4. 神跡顯現 (Divine Manifestation)                │      │
│  │  5. 熵減煉金 (Entropy Alchemy)                     │      │
│  │  6. 永恆刻印 (Eternal Engraving)                   │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 核心功能

### 1. 事件系統 (Event Bus)

| 方法 | 說明 |
|------|------|
| `publish(event, payload)` | 發布事件到所有監聽器 + SSE + NCBDB |
| `subscribe(event, callback)` | 訂閱事件，返回取消訂閱函數 |
| `broadcastGlobalNotification(msg, context)` | 全域通知，觸發 `system:global:sync` |

### 2. Skill 註冊系統 (Skill Registry)

| 方法 | 說明 |
|------|------|
| `registerSkill(skill)` | 註冊技能，自動訂閱 trigger 事件 |
| `unregisterSkill(skillId)` | 移除技能 |
| `getSkill(skillId)` | 取得單一技能 |
| `listSkills()` | 列出所有技能 |

### 3. SSE 廣播橋接 (SSE Bridge)

| 方法 | 說明 |
|------|------|
| `registerBroadcastHook(hook)` | 註冊廣播 hook（如 SSE push） |
| `unregisterBroadcastHook(hook)` | 移除廣播 hook |
| `hookCount` | 取得目前 hook 數量 |

### 4. 自治模式 (Autonomy Mode)

| 方法 | 說明 |
|------|------|
| `startAutonomy(intervalMs)` | 啟動自治模式，定期觸發 `system:autonomy:tick` |
| `stopAutonomy()` | 停止自治模式 |

### 5. 奧義六式 (Celestial Command Framework)

| 方法 | 說明 |
|------|------|
| `executeCelestialCommand(intent, context)` | 執行奧義六式完整流程 |
| `penetrationBypass(target, reason)` | 深度穿透繞過 |

### 6. Supabase CLI 整合

| 方法 | 說明 |
|------|------|
| `runSupabaseCommand(cmd, workdir)` | 執行 Supabase CLI 命令 |
| `supabaseInit/Start/Stop/DbPush/DbReset` | 快捷方法 |

---

## ⚔️ 已註冊技能清單 (22 個)

### 🔐 安全類

| ID | 名稱 | 觸發事件 | 說明 |
|----|------|----------|------|
| `deep-penetration` | Deep Penetration | `security:barrier` | 深度穿透繞過安全屏障 |
| `omni-key` | Omni Key | `lock:engaged` | 萬能鑰匙解鎖 |
| `sacred-judgement` | 神聖裁決 | `security:breach:detected` | 最終安全防線，凍結威脅 |

### 📦 金庫/封印類

| ID | 名稱 | 觸發事件 | 說明 |
|----|------|----------|------|
| `vault-seal-watcher` | Vault Seal Watcher | `vault:seal:5t` | 監聽 5T 封印，觸發下游驗證 |
| `color-drop-issuer` | Color Drop Issuer | `vault:seal:verified` | 產生 Color Drop ID |
| `color-drop-verifier` | Color Drop Verifier | `color:drop:verify` | 驗證 Color Drop 完整性 |
| `spontaneous-wondrous-virtue-validator` | 無作妙德驗證器 | `color:drop:issued` | 自動驗證 + QKP 治療評估 |
| `chronos-break` | 時空斷點 | `vault:seal:verified` | 鑄造時空絕對錨點 |

### 🔄 自動化類

| ID | 名稱 | 觸發事件 | 說明 |
|----|------|----------|------|
| `evidence-risk-assessor` | Evidence Risk Assessor | `system:autonomy:tick` | 自主掃描未封印高風險證據 |
| `zkp-proof-generator` | ZKP Proof Generator | `system:autonomy:tick` | 自動產生 ZKP 證明 |
| `alert-resolver` | Alert Resolver | `notification:alert` | 自動修復高嚴重性警報 |
| `autonomous-iterator` | 自主優化迭代器 | `system:evolution:mutated` | 系統自我優化迭代 |

### 📝 報告/同步類

| ID | 名稱 | 觸發事件 | 說明 |
|----|------|----------|------|
| `sustainwrite-sync-agent` | SustainWrite Sync Agent | `vault:seal:zkp_ready` | 同步 ZKP 證據到報告章節 |
| `digital-twin-optimizer` | Digital Twin Optimizer | `sustainwrite:section:synced` | 重新計算數位孿生指標 |

### 🧬 進化類

| ID | 名稱 | 觸發事件 | 說明 |
|----|------|----------|------|
| `infinite-evolution-wheel` | 無限進化輪 | `twin:metrics:updated` | 自我進化，縮減技能冷卻 |
| `void-reflection` | 虛空鏡像 | `skill:error` | 錯誤沙盒診斷 |
| `omni-convergence` | 萬法歸流 | `system:autonomy:tick` | 熵壓縮，淨化系統雜訊 |
| `causal-inscription` | 因果刻印 | `auth:persona:interact` | 將行為刻印於因果網路 |

### 🌐 網路類

| ID | 名稱 | 觸發事件 | 說明 |
|----|------|----------|------|
| `broadcom-protocol` | Broadcom Protocol | `network:restricted` | 建立廣域連線 |

### 🔮 特殊類

| ID | 名稱 | 觸發事件 | 說明 |
|----|------|----------|------|
| `spontaneous-virtue-seamless-unity` | 無作妙德圓通無礙 | `system:global:sync` | 系統全域同步與自我療癒 |

---

## 📡 事件類型總覽

### 系統事件
- `system:global:sync` - 全域同步
- `system:autonomy:tick` - 自治模式 tick
- `system:flow:optimized` - 系統流程優化
- `system:evolution:mutated` - 系統進化
- `system:omni:converged` - 萬法歸流
- `system:causal:inscribed` - 因果刻印
- `system:chronos:anchored` - 時空錨定
- `system:sacred:purge` - 神聖淨化
- `system:void:mirrored` - 虛空鏡像

### 金庫事件
- `vault:seal:5t` - 5T 封印
- `vault:seal:verified` - 封印驗證完成
- `vault:seal:zkp_ready` - ZKP 證明就緒

### Color Drop 事件
- `color:drop:issued` - Color Drop 發行
- `color:drop:verified` - Color Drop 驗證
- `color:drop:verify` - 請求驗證

### 報告事件
- `sustainwrite:section:synced` - 報告章節同步
- `twin:metrics:updated` - 數位孿生指標更新

### 安全事件
- `security:barrier` - 安全屏障
- `security:breach:detected` - 安全漏洞偵測

### 通知事件
- `notification:alert` - 警報通知

### 技能事件
- `skill:executed` - 技能執行完成
- `skill:error` - 技能執行錯誤
- `skill:penetration` - 穿透事件

### 認證事件
- `auth:persona:interact` - 使用者行為

### Supabase 事件
- `supabase:run` - 執行 Supabase 命令
- `supabase:status` - 命令狀態更新
- `supabase:command` - 命令結果

---

## 🔌 整合應用

### 已整合的 API 路由

| 路由 | 使用方式 |
|------|----------|
| `/api/omni-agent-api/stream/events` | SSE 串流，訂閱 Bus 事件 |
| `/api/omni-agent-api/stream/route` | SSE 端點，橋接 Bus 到前端 |
| `/api/omni-jules/route` | 接收 HEAL 訊號 |
| `/api/system/autonomy/route` | 控制自治模式 |
| `/api/vault/seal/route` | 封印時觸發 Bus 事件 |

### 已整合的前端頁面

| 頁面 | 使用方式 |
|------|----------|
| `/environmental` | `useOmniAgentBus` hook |

### 已整合的持久化

| 系統 | 說明 |
|------|------|
| Supabase AuditRecord | 持久化核心事件 |
| NCBDB omni_event_bus | 同步所有 Bus 事件 |
| Firebase | 透過 Data Connect 整合 |

---

## 🔄 完整事件流程

### 5T 封印流程
```
vault:seal:5t → vault-seal-watcher → vault:seal:verified
  → color-drop-issuer → color:drop:issued
  → spontaneous-wondrous-virtue-validator
  → color:drop:verify → color-drop-verifier → color:drop:verified
  → chronos-break (時空錨定)
```

### 證據風險管理流程
```
system:autonomy:tick → evidence-risk-assessor → notification:alert
  → alert-resolver → vault:seal:5t (自動修復)
```

### ZKP 證明流程
```
system:autonomy:tick → zkp-proof-generator → vault:seal:zkp_ready
  → sustainwrite-sync-agent → sustainwrite:section:synced
  → digital-twin-optimizer → twin:metrics:updated
  → infinite-evolution-wheel → system:evolution:mutated
  → autonomous-iterator → system:flow:optimized
```

### 奧義六式執行流程
```
executeCelestialCommand(intent, context)
  → 1. extractQuantumEssence (本質提純)
  → 2. SacredLibrary.resonate (聖典共鳴)
  → 3. activateAgents (代理織網)
  → 4. agentNetwork.manifest (神跡顯現)
  → 5. EntropyForge.purify (熵減煉金)
  → 6. OmnipotentRepository.engrave (永恆刻印)
```

---

## ⚠️ 已知問題

1. **模擬資料**: 部分技能使用 `Math.random()` 產生模擬資料
2. **FALLBACK 模式**: 當 Supabase 金鑰為 FALLBACK 時，使用模擬資料
3. **冷卻時間管理**: 技能冷卻時間在進化時可能被縮減
4. **錯誤處理**: 大部分錯誤被 `catch` 吞掉，只記錄 warning

---

## 📊 統計

- **總程式碼行數**: 1057 行
- **已註冊技能數**: 22 個
- **事件類型數**: 30+ 種
- **整合 API 路由**: 5 個
- **整合前端頁面**: 1 個
