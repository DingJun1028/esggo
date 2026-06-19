# 記憶碎片：esggo MVP（萬能模組原型）

> **來源**：`C:\Project\esggomvp\`（922 files, ~30MB）
> **核心子目錄**：`esggo_mvp-main\`
> **提取日期**：2026-06-19

---

## 1. 核心內容摘要

ESG GO MVP 是「善向永續系統」的**原型驗證版本**，代號 **Omni_Terminal v8.5.0-Alpha**。它是一個以「服務即教學，知識即資產」為核心的**萬能顯化引擎（Omni Manifestation Engine）**，將抽象的永續指標轉換為具備數位主體性的「知識資產（Atoms）」。

### 核心哲學
- **5T 協議**：Truth（真/Traceable）、Goodness（善/Transparent）、Beauty（美/Tangible）、Trust（信/Trustworthy）、Transcend（通/Trackable）
- **三位一體**：OmniOne（物理平台）+ OmniPriest（見證封印）+ OmniGemini（認知合成）
- **英標繁博**：介面命名用英文，UI 與說明用繁體中文

### 技術棧
| 層級 | 技術 |
|------|------|
| 前端 | Next.js 14 + TypeScript + Tailwind CSS + Framer Motion |
| 後端 | Supabase / NCB（NoCodeBackend）PostgreSQL |
| AI | Google Gemini + Genkit + Jules |
| 視覺 | Liquid Glass（液態玻璃擬態）+ Bento Grid |
| 認證 | NextAuth + Google OAuth |
| 協議 | 5T Protocol + SHA-256 封印 + ZKP |

---

## 2. 架構/設計說明

### 2.1 核心層級（Layered Architecture）

```
靈魂層 (Soul Layer - src/core)
├── OmniOne：將使用者意圖 (Seed) 轉化為真實數據 (Atom) 的創世中樞
├── OmniNexus：統一整合閘道，對接 MCP 工具、AI 代理
└── 5T Protocol：真善美信通五維度數據誠信

介面層 (Surface Layer - src/components)
├── LiquidGlass：液態玻璃視覺規範
├── Village System：遊戲化 ESG 元件（PixelNexusCard, AvatarEvolutionPortal）
└── OmniBoard：200+ 功能導航入口

基礎設施層 (Foundation Layer)
├── Supabase / NCB：數據持久化 + RLS 安全策略
└── Redis Cache：高併發響應效能
```

### 2.2 5T 證明鏈（5T Proof Chain）
在 `omni-one.ts` 中，每筆資產誕生須經：
1. **[真] TRACE**：生成 SHA-256 溯源雜湊
2. **[善] VERIFY**：零幻覺驗算（Zero Hallucination Proof）
3. **[信] FREEZE**：Amber Freeze 封印，確保不可篡改
4. **[通] REGISTER**：進入全域 ESG Circle 循環
5. **[美] WRAP**：渲染 AquaFlow 視覺光譜

### 2.3 備援矩陣（Backup Matrix）
- **Model Carousel**：Llama → Mistral → Qwen → DeepSeek 循環切換，降低 429 影響
- **Auto-Karma-Repair**：自動偵測修復亂碼或邏輯鏈斷裂

### 2.4 200 個功能分類矩陣（MECE）
| 領域 | 功能數 | 範疇 |
|------|--------|------|
| ENV（環境） | 60 | 碳排放、能源、水資源、廢棄物 |
| SOC（社會） | 55 | 員工、供應商、社區、客戶 |
| GOV（治理） | 50 | 董事會、風險管理、合規 |
| AGC（代理） | 35 | 數據代理、AI 代理、API 整合 |

### 2.5 Trinity 三位一體
| 實體 | 角色 | 被動技能 |
|------|------|----------|
| OmniOne | 物理平台 | Genesis Manifestation、Circle Flow Integration、Heritage Continuity |
| OmniPriest | 見證封印 | Zero Hallucination Proof、Amber Freeze、Witness Ledger、5T Compliance Guard |
| OmniGemini | 認知合成 | Gnosis Synthesis、Trend Prediction Amplifier、Contextual Memory |

---

## 3. 關鍵代碼片段

### 3.1 Agent YAML 配置（Model Carousel）
```yaml
# agent.yaml
description: "Gitclaw Agent 專屬配置與環境參數"
version: "v2.2"
name: "gitclaw-esggo"
models:
  - "meta-llama/llama-3.3-70b-instruct:free"
  - "mistralai/mistral-small-3.1-24b-instruct:free"
  - "qwen/qwen-2.5-72b-instruct:free"
  - "deepseek/deepseek-chat:free"
  - "google/gemini-2.0-flash-lite-preview-02-05:free"
settings:
  temperature: 0.4
  max_retries: 10
  fallback_strategy: "carousel"
```

### 3.2 OmniNexus AI Agent API
```javascript
// 13 工具統一入口：POST /api/nexus/agent
const response = await fetch('/api/nexus/agent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tool: 'omni_manifest_asset',
    arguments: { intent: 'ESG Analysis', payload: { scope: 2, value: 1500, unit: 'tCO2e' } }
  })
});
```

### 3.3 5T 協議狀態碼
```
201-T1：資料已建立，具備初步溯源
200-T4：資料已完成雜湊鎖定，不可篡改
200-T5：資料已完成 ZKP 封印，具備最高治理主權
403-INTEGRITY_FAIL：偵測到哈希不匹配
```

### 3.4 新增模組路由（Agentic Twin / BI Analytics / Impact Village）
```typescript
// omni-modules.ts
AGENTIC_TWIN: {
    domain: 'Adv', uuid: 'mod-adv-twin-0001',
    route: '/omni/agentic-twin',
    description: 'AI 雙棲決策輔助引擎', status: 'PLANNED'
},
BI_ANALYTICS: {
    domain: 'Adv', uuid: 'mod-adv-bi-0001',
    route: '/omni/bi-analytics',
    description: '高階商業智慧與風險預測', status: 'PLANNED'
},
IMPACT_VILLAGE: {
    domain: 'Comm', uuid: 'mod-comm-village-0001',
    route: '/omni/impact-village',
    description: '供應鏈與社區影響力互動聚落', status: 'PLANNED'
}
```

---

## 4. 系統導航路徑

| 模組 | 路徑 | 功能 |
|------|------|------|
| 萬能首頁 | `/omni` | 系統入口與核心儀表板 |
| 初次共鳴 | `/omni/onboarding` | 用戶導引與數位主體建立 |
| 報告中心 | `/omni/report-center` | 49+ 份 ESG 報告管理 |
| BI 智能分析 | `/omni/bi-analytics` | 高階數據洞察 |
| 斯福氣中心 | `/excellence` | 運營卓越性 |
| 治理中心 | `/governance` | 董事會效能與法規合規 |
| 綜合提純 | `/synthesis` | 5T 協議驗算 |
| 萬能筆記 | `/omni/wuzuo-note` | 知識資產化 |

---

## 5. 與現有 esggo 項目的關聯

- **MVP → V1.0**：MVP 的 5T 協議、Liquid Glass UI、OmniOne 核心在 V1.0 中延續並擴展
- **MVP → Alpha**：Alpha 版本繼承了 MVP 的 Firebase Data Connect 整合與 Report 類型系統
- **MVP → Original**：Original 版本為最早期的 MVP 原型，MVP 資料夾為進化版
- **MVP → Beta**：Beta 版本的 OpenClaw 技能系統可視為 MVP 中 OmniAgent 概念的延伸
- **MVP 核心保留**：5T 協議、SHA-256 封印、Trinity 三位一體、Model Carousel 等核心設計在後續版本中均被保留

---

*提取者：OWL | 批次 2 | 2026-06-19*
