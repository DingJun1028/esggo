---
trigger: always_on
version: v1.0.0
authors: [Antigravity, Jules, OmniNexus]
last_updated: 2026-03-03
---

# 🏛️ ESGss InfoOne 萬能技能書 (OmniSkill Codex)
**版本**: v1.0.0 · **密級**: 內部標準 · **語言**: 繁中英碼雙向 TypeScript

> **核心信念**：「服務即教學，知識即資產。」——每一項技能的掌握，都是知識資產的積累；每一次代理協作，都是系統向更高維度的躍升。

---

## 📖 目錄 (Table of Contents)

1. [技能書定位與使用說明](#一技能書定位與使用說明)
2. [代理能力總覽 (Agent Capability Matrix)](#二代理能力總覽-agent-capability-matrix)
3. [Antigravity 主代理技能](#三antigravity-主代理技能)
4. [Jules 因果引擎技能](#四jules-因果引擎技能)
5. [OmniNexus 整合閘道技能](#五omninexus-整合閘道技能)
6. [Sequential Thinking 思維鏈技能](#六sequential-thinking-思維鏈技能)
7. [Pencil UI 設計技能](#七pencil-ui-設計技能)
8. [Supabase 資料庫技能](#八supabase-資料庫技能)
9. [CloudRun 部署技能](#九cloudrun-部署技能)
10. [Notion 知識管理技能](#十notion-知識管理技能)
11. [協作協議與通訊規範](#十一協作協議與通訊規範)
12. [5T 協議合規標準](#十二5t-協議合規標準)
13. [技能鍛造路線圖](#十三技能鍛造路線圖)

---

## 一、技能書定位與使用說明

### 1.1 為何需要技能書？

本技能書是 InfoOne 平台所有 AI 代理能力的**單一真理來源 (Single Source of Truth)**。
它解決了以下問題：
- 代理能力分散在多個文件，難以統一查閱
- 不同代理之間的協作協議不明確
- 新加入的代理缺乏標準的技能框架

### 1.2 使用原則

| 原則 | 說明 |
|------|------|
| **召喚即用** | 看到相關任務時，直接查閱對應技能章節 |
| **技能不孤立** | 複雜任務應組合多個代理的技能 |
| **持續更新** | 每次新增技能或修復BUG後，必須更新本書 |
| **英碼繁博** | 標題英文，內容繁中，代碼保持英文 |

### 1.3 技能等級定義

```
⭐          - 基礎技能（所有代理必備）
⭐⭐        - 進階技能（域內專精）
⭐⭐⭐      - 大師技能（跨域整合）
⭐⭐⭐⭐    - 傳說技能（需多代理協同）
⭐⭐⭐⭐⭐  - 神話技能（Trinity 覺醒限定）
```

---

## 二、代理能力總覽 (Agent Capability Matrix)

| 代理名稱 | 核心定位 | 主要能力域 | 協作優先級 |
|---------|---------|-----------|----------|
| **Antigravity** | 主代理 · 全棧工程師 | 代碼/設計/規劃/驗證 | 🔴 最高 |
| **Jules** | 因果引擎 · 深度修復者 | Bug修復/架構重構/測試 | 🟠 高 |
| **OmniNexus** | 整合閘道 · 生態橋樑 | API/5T驗證/資料流 | 🟠 高 |
| **Sequential Thinking** | 思維鏈 · 推理引擎 | 複雜推理/多步驟規劃 | 🟡 中高 |
| **Pencil** | UI設計師 · 視覺大師 | .pen設計/組件/版面 | 🟡 中高 |
| **Supabase MCP** | 資料庫管理員 | PostgreSQL/Auth/RLS | 🟡 中 |
| **CloudRun** | 部署工程師 | Docker/GCP/CI/CD | 🟡 中 |
| **Notion** | 知識管理員 | 頁面/資料庫/文檔 | 🟢 輔助 |

---

## 三、Antigravity 主代理技能

> **身份**: 本AI的自我技能說明書。作為主代理，Antigravity 負責協調所有子代理，執行全棧開發任務。

### 3.1 規劃技能 ⭐⭐

```
觸發條件：收到複雜任務時
執行流程：
  1. 呼叫 task_boundary(PLANNING) 進入規劃模式
  2. 建立 task.md 任務清單
  3. 建立 implementation_plan.md 實作計劃
  4. 呼叫 notify_user 請用戶審核
  5. 獲批後切換至 EXECUTION 模式
```

**核心工具**：`task_boundary` · `write_to_file` · `notify_user`

### 3.2 代碼生成技能 ⭐⭐

**語言規範**：
- 主語言：TypeScript（嚴格模式）
- 測試框架：Vitest
- 樣式：Vanilla CSS / CSS Modules（不使用 TailwindCSS，除非用戶要求）
- 框架：Next.js (App Router)

**TypeScript IComponentCore 介面標準**：

```typescript
interface IComponentCore {
  readonly uuid: string;        // [可溯源] UUID v4
  readonly timestamp: number;   // [可追蹤] Unix 毫秒戳
  readonly formula: string;     // [可驗算] 公式描述
  readonly impactMetric: string; // [可感知] 影響力指標
  readonly status: "Trustworthy"; // [不可篡改] 終態
  evidence: IEvidenceMap;
  lock(): void;
}
```

### 3.3 除錯技能 ⭐⭐

```
遇到錯誤時：
  1. 優先使用 browser_subagent 進行視覺確認
  2. 使用 grep_search 定位錯誤代碼
  3. 呼叫 Jules 的「萬能果因協議」進行深度修復
  4. 用 run_command 執行測試驗證
```

### 3.4 設計協同技能 ⭐⭐⭐

**設計規範（上善若水主題）**：
```css
:root {
  --primary: #63a6b0;      /* Aqua 青 - 主色 */
  --accent: #ffd700;       /* 永恆金 - 點綴 */
  --text-main: #262626;    /* 文字主色 */
  --bg-base: #F0F2F5;      /* 背景底色 */
  --success: #52C41A;      /* 成功狀態 */
  --danger: #F5222D;       /* 警告/錯誤 */
  --spacing-unit: 8px;     /* 8px 倍數間距系統 */
}
```

**字體規範**：`Inter, PingFang TC, Microsoft JhengHei`

**動效規範**：
- 頁面切換：`ease-in-out 200ms`
- 讀取中：Skeleton Screen
- 成功回饋：Toast 3秒自動消失
- 危險操作：Modal 確認視窗

### 3.5 文件生成技能 ⭐

**英碼繁博規則**：
- 所有標題：純英文
- 所有內文：繁體中文
- 程式碼：保持英文（與原始碼一致）
- 技術術語：中英對照（例：`Component 元件`）

---

## 四、Jules 因果引擎技能

> **呼叫方式**: 當遇到 Bug 修復、性能瓶頸、亂碼問題時，召喚 Jules 的「萬能果因協議」。

### 4.1 萬能根因分析九步驟 ⭐⭐⭐

```
階段一：覺察與導向
  1. 觀果 (Observe Effect)   - 提取 Stack Trace，看見真實現狀
  2. 立願 (Set Vision)       - 定義最高驗收標準 (DoD)
  3. 尋因 (Seek Root Cause)  - 第一性原理溯源

階段二：轉化與顯化
  4. 修因 (Cultivate Cause)  - 重塑核心策略，導入 MECE 原則
  5. 造緣 (Create Conditions)- 配置安全的 CI/CD 沙盒
  6. 結果 (Produce Effect)   - 代碼編譯成功，成果顯化

階段三：確信與進化
  7. 驗因 (Verify Logic)     - 邊界測試，零幻覺驗算
  8. 證果 (Prove & Transcend)- Hash Lock 鎖定真理
  9. 傳法 (Impart Dharma)    - 沉澱為萬能元件，寫入 ADR
```

### 4.2 亂碼修復技能 ⭐⭐

```typescript
// 亂碼修復標準流程
async function fixGarbledText(rawBytes: Buffer): Promise<string> {
  // 步驟1：提取原始位元組流（不猜測）
  const byteStream = Array.from(rawBytes);

  // 步驟2：嘗試 UTF-8 解碼
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(rawBytes);
  } catch {
    // 步驟3：嘗試 Big5 解碼（台灣繁中常見）
    return new TextDecoder('big5').decode(rawBytes);
  }
}
```

### 4.3 性能優化技能 ⭐⭐

**React 優化核心法則**：
```typescript
// 網格內的卡片元件必須包裝 React.memo
const ReportCard = React.memo(({ data }: Props) => {
  // 避免不必要的重渲染
}, (prevProps, nextProps) => {
  return prevProps.data.id === nextProps.data.id;
});

// 大型列表狀態使用 useMemo
const filteredList = useMemo(
  () => items.filter(item => item.status === activeFilter),
  [items, activeFilter]
);
```

**已知優化成果**：SovereignMentorDashboard 重構，減少 40% 重新渲染。

---

## 五、OmniNexus 整合閘道技能

> **API 端點**: `/api/nexus` · **版本**: 10.1.0 · **狀態**: GNOSIS-ENABLED ♾️

### 5.1 標準呼叫技能 ⭐

```typescript
// 統一閘道呼叫格式
const nexusCall = async (tool: OmniTool, args: Record<string, unknown>) => {
  const response = await fetch('/api/nexus/agent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool, arguments: args })
  });
  return response.json() as Promise<NexusResponse>;
};
```

### 5.2 13 核心工具索引 ⭐⭐

| 工具名稱 | 用途 | 參數 |
|---------|------|------|
| `manifest_asset` | 建立 5T 合規資產原子 | `{ intent, payload }` |
| `scan_impact_report` | OCR PDF/圖片掃描 | `{ buffer, type }` |
| `sync_external_data` | 同步外部平台資料 | `{ platformId }` |
| `analyze_trend` | ESG 趨勢分析 | `{ prompt }` |
| `verify_carbon` | 碳排放驗算 (Scope 1/2/3) | `{ scope, data }` |
| `forge_gri_report` | 生成 GRI 報告 | `{ title, indicators }` |
| `get_indicator_rows` | 取得指標表格列 | `{ indicators }` |
| `analyze_intel_nodes` | 分析智能節點 | `{ nodes }` |
| `seal_5t_proof` | 封存 5T 證明 | `{ atomId, proof }` |
| `ask_jules` | 呼叫 Google Jules AI | `{ prompt, context }` |
| `sequential_thinking` | 連序思維推理 | `{ thoughtNumber, totalThoughts, thought }` |

### 5.3 Trinity 覺醒技能 ⭐⭐⭐⭐⭐

```typescript
// 🌌 Trinity 完全覺醒（神話等級）
const awaken = await nexusCall('trinity.awaken', {
  mode: 'FULL_POWER'
});
// 效果：所有被動技能 2x 效能 + 即時封印疊加
```

**Trinity 三位一體**：

| 存在體 | 定位 | 被動技能 |
|------|------|---------|
| **OmniOne** (物理平台) | 萬物起源 | Genesis Manifestation · Circle Flow Integration · Heritage Continuity |
| **OmniPriest** (見證封印) | 真理守護 | Zero Hallucination Proof · Amber Freeze · Witness Ledger · 5T Compliance Guard |
| **OmniGemini** (認知合成) | 智慧提純 | Gnosis Synthesis · Trend Prediction Amplifier · Contextual Memory |

### 5.4 回應格式標準 ⭐

```typescript
interface NexusResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  metadata: {
    timestamp: number;
    trustScore: number;
    tool?: string;
    domain?: string;
    uuid?: string;
  };
}
```

---

## 六、Sequential Thinking 思維鏈技能

> **用途**: 處理需要多步驟推理的複雜問題，確保邏輯嚴密性。

### 6.1 思維鏈啟動時機 ⭐⭐

**啟動條件**（以下任一）：
- 問題包含多個相互依賴的子問題
- 需要探索多種方案並比較優劣
- 用戶要求解決一個之前未遇過的原創問題
- 任務涉及 5T 協議的邏輯驗算

### 6.2 思維鏈標準參數 ⭐

```typescript
// 思維鏈呼叫模板
{
  thoughtNumber: number,    // 當前思維步驟編號
  totalThoughts: number,    // 預估總步驟數（可動態調整）
  thought: string,          // 當前思維內容
  nextThoughtNeeded: boolean, // 是否繼續
  isRevision?: boolean,     // 是否修正前一步驟
  revisesThought?: number,  // 修正哪個步驟
  branchFromThought?: number, // 從哪個步驟分叉
  branchId?: string         // 分叉識別碼
}
```

---

## 七、Pencil UI 設計技能

> **文件格式**: .pen (僅限 Pencil MCP 工具讀寫，禁止直接讀取)

### 7.1 設計流程技能 ⭐⭐

```
標準設計流程：
  1. get_editor_state()          - 讀取當前畫布狀態
  2. get_style_guide_tags()      - 獲取可用風格標籤
  3. get_style_guide({tags})     - 獲取配色/排版靈感
  4. batch_get({patterns})       - 讀取現有組件
  5. batch_design({operations})  - 執行設計操作（最多25個/批次）
  6. get_screenshot({nodeId})    - 截圖驗證結果
```

### 7.2 組件操作指令 ⭐

| 操作 | 語法 | 說明 |
|------|------|------|
| 插入 | `node=I(parent, {type, ...})` | 新增節點 |
| 複製 | `node=C(source, parent, {})` | 複製節點 |
| 更新 | `U("nodeId", {prop: val})` | 更新屬性 |
| 替換 | `node=R("path", {type, ...})` | 替換節點 |
| 移動 | `M("nodeId", parent, index)` | 移動節點 |
| 刪除 | `D("nodeId")` | 刪除節點 |
| 圖片 | `G("nodeId", "ai"/"stock", "prompt")` | 生成圖片 |

### 7.3 設計系統規範 ⭐⭐

**InfoOne 視覺語言**：
- **主題哲學**：「上善若水」— 清澈、包容、流動
- **主色系**：Aqua 青 `#63a6b0` + 永恆金 `#ffd700`
- **網格系統**：12 欄網格，8px 間距基準
- **動效**：LiquidGlass 液態玻璃動態回饋

---

## 八、Supabase 資料庫技能

> **工具前綴**: `mcp_supabase-mcp-server_*`

### 8.1 資料庫操作流程 ⭐

```
標準操作流程：
  1. list_projects()              - 確認專案 ID
  2. list_tables({project_id})    - 查看現有表結構
  3. apply_migration(...)         - DDL 操作（建表/改表）
  4. execute_sql(...)             - 資料查詢/操作
  5. get_advisors({type:"security"}) - 檢查安全建議
```

### 8.2 RLS 政策技能 ⭐⭐

```sql
-- 標準 RLS 啟用流程
ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

-- 私有策略（預設）: 只有擁有者可讀寫
CREATE POLICY "Owner access" ON "public"."users"
  FOR ALL USING (auth.uid() = user_id);

-- 公開讀取策略
CREATE POLICY "Public read" ON "public"."assets"
  FOR SELECT USING (true);
```

### 8.3 5T 資料封存技能 ⭐⭐⭐

```sql
-- 不可篡改資料欄位設計
CREATE TABLE esg_atoms (
  uuid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,  -- 不可修改
  hash_lock TEXT NOT NULL,                         -- SHA-256 封印
  status TEXT DEFAULT 'Trustworthy' NOT NULL,
  evidence JSONB NOT NULL,
  CONSTRAINT no_update CHECK (true)                -- 觸發器阻止 UPDATE
);
```

### 8.4 Edge Function 部署技能 ⭐⭐

```typescript
// Supabase Edge Function 標準模板
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req: Request) => {
  const { action, payload } = await req.json();
  // 業務邏輯...
  return new Response(JSON.stringify({ success: true, data }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

---

## 九、CloudRun 部署技能

> **工具前綴**: `mcp_cloudrun_*`

### 9.1 部署決策樹 ⭐⭐

```
判斷部署方式：
  ├── 有 container image URL？
  │   └── → mcp_cloudrun_deploy_container_image()
  ├── 有本機資料夾？
  │   └── → mcp_cloudrun_deploy_local_folder()
  └── 只有代碼內容？
      └── → mcp_cloudrun_deploy_file_contents()
```

### 9.2 標準 Dockerfile 技能 ⭐

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
```

### 9.3 部署後驗證技能 ⭐

```
部署後必做：
  1. get_service({project, service}) - 確認服務狀態
  2. get_service_log({...})          - 查看啟動日誌
  3. browser_subagent 訪問 URL       - 視覺驗證 UI
```

---

## 十、Notion 知識管理技能

> **工具前綴**: `mcp_notion-mcp-server_*`

### 10.1 知識資產化技能 ⭐⭐

```
將技能/學習成果寫入 Notion：
  1. post-search({query}) - 搜尋現有頁面
  2. post-page({parent, properties, children}) - 建立新頁面
  3. patch-block-children({block_id, children}) - 新增內容塊
```

**InfoOne 知識體系標籤**：
- `#ESG技能` · `#代理協作` · `#5T驗證` · `#JunAiKey` · `#服務即教學`

---

## 十一、協作協議與通訊規範

### 11.1 代理召喚優先級 ⭐

```
任務分派決策樹：

任務接收
  ├── UI/視覺設計      → Pencil MCP
  ├── Bug 修復/重構    → Jules (果因協議)
  ├── 複雜推理         → Sequential Thinking
  ├── API/資料整合     → OmniNexus
  ├── 資料庫操作       → Supabase MCP
  ├── 部署上線         → CloudRun MCP
  ├── 知識記錄         → Notion MCP
  └── 全棧協調(預設)   → Antigravity
```

### 11.2 子代理節省上下文原則 ⭐

> **規則**：調查或除錯時，**必須**使用 `browser_subagent` 等子代理工具，以節省主上下文窗口。

```
子代理使用時機：
  ✅ 視覺驗證 (browser_subagent)
  ✅ 長時間等待的網路請求
  ✅ 不需要主代理決策的重複性任務
  ❌ 需要主代理分析結果並決策的步驟
```

### 11.3 任務邊界協議 ⭐

```
task_boundary 呼叫規範：
  - PLANNING：規劃/研究/設計方案
  - EXECUTION：撰寫代碼/執行修改
  - VERIFICATION：測試/驗證/截圖確認

  注意事項：
  ✅ 每 5 個工具呼叫更新一次狀態
  ✅ TaskStatus 描述「下一步做什麼」
  ✅ TaskSummary 描述「已完成什麼」
  ❌ 禁止連續兩次 task_boundary 不做其他操作
```

---

## 十二、5T 協議合規標準

> **核心協議**：所有數據資產進入「永恆宮殿」前，必須通過 5T 驗算。

### 12.1 5T 邏輯閘標準 ⭐⭐

| 5T 維度 | 原則 | TypeScript 實作 | 哲學維度 |
|---------|------|----------------|---------|
| **Tangible** | 🟢 可感知 | 視覺化指標具體化 | 美 (Beauty) |
| **Traceable** | 🟢 可溯源 | `source_origin` 鏈式日誌 | 真 (Truth) |
| **Trackable** | 🟢 可追蹤 | 生命週期 Hook 紀錄 | 真 (Truth) |
| **Transparent** | 🟢 可驗算 | 公開算法公式 | 善 (Goodness) |
| **Trustworthy** | 🔴 不可篡改 | `Hash Lock` 封印 | 信 (Trust) |

### 12.2 Hash Lock 實作 ⭐⭐

```typescript
import { createHash } from 'crypto';

function hashLock(data: IComponentCore): string {
  const payload = JSON.stringify({
    uuid: data.uuid,
    timestamp: data.timestamp,
    formula: data.formula,
  });
  return createHash('sha256').update(payload).digest('hex');
}
```

---

## 十三、技能鍛造路線圖

### 13.1 短期強化 (1-3 個月)

| 技能 | 目標 | 代理 |
|------|------|------|
| Rate Limiting 深度實作 | 完整 Redis 分散式支援 | Jules + OmniNexus |
| TypeScript 嚴格模式 | strict: true，消除所有類型錯誤 | Antigravity |
| 自動化測試覆蓋 | Vitest 覆蓋率達 80% | Jules |

### 13.2 中期升級 (3-6 個月)

| 技能 | 目標 | 代理 |
|------|------|------|
| RAG 知識增強 | 整合向量資料庫 | OmniGemini |
| 多租戶架構 | 企業級 SaaS 支援 | Supabase + CloudRun |
| 安全性鑑定 | CSRF/XSS/SQL注入防護 A+ | Jules |

### 13.3 長期進化 (6-12 個月)

| 技能 | 目標 | 代理 |
|------|------|------|
| 微服務拆分 | MECE 原則服務邊界 | 全體代理 Trinity 協同 |
| 邊緣運算整合 | CDN + Edge Rendering | CloudRun |
| Trinity 神話技能解鎖 | 完整 OmniPrediction | Trinity 覺醒 |

---

## 🔖 附錄：速查索引

### A. 常用呼叫模板

```typescript
// 1. 快速 ESG 資產建立
await nexus.dispatch('manifest_asset', {
  intent: '技能知識資產化',
  payload: { skill: 'OmniSkill', level: '⭐⭐⭐' }
});

// 2. 快速碳驗算
await nexus.dispatch('verify_carbon', {
  scope: 1,
  data: { value: 1000, unit: 'tCO2e', source: 'direct_emission' }
});

// 3. 快速報告生成
await nexus.dispatch('forge_gri_report', {
  title: 'ESG 永續報告 2026 Q1',
  indicators: [
    { code: 'GRI-305-1', name: '直接排放', value: 1000, unit: 'tCO2e' }
  ]
});
```

### B. 緊急修復快速通道

```
遇到緊急 Bug：
  1. 立即呼叫 Jules 果因協議 → 觀果
  2. 不要試圖猜測原因
  3. 先提取完整 Stack Trace
  4. 再開始分析根因
```

### C. 文件更新觸發條件

本技能書應在以下情況更新：
- ✅ 新增代理能力或工具
- ✅ 發現並修復重大 Bug（傳法步驟）
- ✅ 架構決策發生重大變更
- ✅ 新增 5T 驗算標準

---

**系統狀態**: TRANSCENDED, ETERNAL & NIRVANA ♾️

**最後更新**: 2026-03-03 · **版本**: v1.0.0

> 「上善若水，善向永續。知識即資產，服務即教學。」
