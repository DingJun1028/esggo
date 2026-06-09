---
uuid: "omni-factory-dsl-v1.1.0"
version: "V1.1.0"
timestamp: "2026-06-09T10:53:00.000Z"
---

# 🏭 萬能工廠 DSL (OmniFactory Framework)

**ESGGO Classic 善向永續 經典版** | **透過需求單自動生成與上架**

---

## 1. 萬能工廠架構

```
User Requirement → OmniAssistant-REQ → Auto-Build → OmniComponent → Market Placement
```

### 1.1 工廠流程圖

```
┌─────────────────┐
│ 用戶提交需求單   │
│ (OmniAssistant- │
│ REQ-v1.1.0.md)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ DSL 解析器       │
│ • MECE 驗證     │
│ • 5T 綁定       │
│ • Theme 確定    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 自動生成器       │
│ • React 元件    │
│ • Storybook     │
│ • 測試案例      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 萬能元件市集    │
│ • 上架審核      │
│ • 善向幣定價    │
│ • 購買整合      │
└─────────────────┘
```

---

## 2. 需求單 DSL 格式

```yaml
# OmniAssistant-REQ-v1.1.0.md 格式標準

Component: [元件名稱]          # 必填
Version: [v1.1.0]             # 必填
Author: [user-id]             # 必填
Category: [atom|molecule|organism|template]  # 必填

DesignTokens:
  primary: [顏色值]          # 語義顏色
  surface: [顏色值]          # 背景材質
  text: [顏色值]             # 文字顏色

States:
  - Default
  - Hover
  - Focus
  - Active
  - Disabled
  - Loading
  - Error
  - Success
  - Expanded
  - Collapsed                 # 總計 10 狀態

5T_Integration:
  Tangible: [具體化方式]
  Traceable: [溯源方式]
  Trackable: [追蹤方式]
  Transparent: [透明方式]
  Trustworthy: [封印方式]

Accessibility_WCAG:
  ARIA: [標籤]
  Keyboard: [支援方式]
  Focus: [指示器]

Mobile_Specific:
  TouchTarget: [最小尺寸]
  Gesture: [手勢支援]
  SafeArea: [安全邊距]

Security:
  Encryption: [加密方式]
  Backup: [備份機制]
  HashLock: [校驗方式]
```

---

## 3. 自動生成規則

### 3.1 DSL 轉 React 元件

```typescript
// DSL Parser Input → React Component Output
function DSLParser(req: RequirementSheet) {
  const component = new ComponentBuilder()
    .setName(req.Component)
    .setCategory(req.Category)
    .setVariants(req.States)
    .setTokens(req.DesignTokens)
    .set5T(req['5T_Integration'])
    .setAccessibility(req.Accessibility_WCAG)
    .build();
  
  return component;
}
```

### 3.2 自動生成檔案結構

```
src/components/ui/factory/
├── [ComponentName]/
│   ├── [ComponentName].tsx      # 主元件
│   ├── [ComponentName].test.ts  # 測試
│   ├── [ComponentName].stories.ts # Storybook
│   └── index.ts                 # 匯出
```

---

## 4. 萬能元件市集

### 4.1 上架條件

| 標準 | 規定 |
|------|------|
| **5T 完整性** | 需完整 5T 維度 |
| **WCAG AA** | 無障礙標準通過 |
| **Theme 相容** | Light/Dark/System 三版 |
| **Mobile First** | 手機端優化 |
| **安全加密** | Trustworthy 封印 |

### 4.2 善向幣定價矩陋

| 等級 | 定價 | 功能 |
|------|------|------|
| **Bronze** | 100 幣 | 基礎元件 (Button, Input) |
| **Silver** | 300 幣 | 進階元件 (Modal, Card) |
| **Gold** | 500 幣 | 複雜元件 (Dashboard, Grid) |
| **Platinum** | 1000 幣 | 完整模組 (Carbon, ESG) |

### 4.3 用戶權限

| 級別 | 最大自訂頁面 | 市集權限 |
|------|--------------|----------|
| **Free** | 1 頁 | 瀏覽/購買 |
| **Pro** | 3 頁 | 創建/上架 |
| **Enterprise** | 無限 | 管理/審核 |

---

## 5. DSL 範例

### 5.1 範例：自定義 ESG 指標卡

```yaml
Component: CustomESGWidget
Version: v1.0.0
Author: user-123
Category: molecule

DesignTokens:
  primary: "#10B981"
  surface: "rgba(255,255,255,0.85)"
  text: "#0F172A"

States:
  - Default
  - Hover
  - Active
  - Disabled
  - Loading
  - Error
  - Success

5T_Integration:
  Tangible: "數值動態顯示"
  Traceable: "source_origin 標記"
  Trackable: "生命週期 Hook"
  Transparent: "運算公式 tooltip"
  Trustworthy: "SHA-256 封印"

Accessibility_WCAG:
  ARIA: "region"
  Keyboard: "Tab 導覽"
  Focus: "2px gold outline"
```

---

## 6. 工廠 API

### 6.1 提交需求單

```typescript
POST /api/factory/submit
Content-Type: application/yaml

{
  component: "string",
  dsl: "yaml-content",
  author: "user-id"
}
```

### 6.2 生成狀態查詢

```typescript
GET /api/factory/status/:requestId
Response: {
  status: "pending" | "building" | "review" | "published" | "failed",
  component_path: "string",
  preview_url: "string"
}
```

### 6.3 上架到市集

```typescript
POST /api/factory/publish
{
  component_id: "string",
  price_tier: "bronze" | "silver" | "gold" | "platinum"
}
```

---

## 7. 安全機制

### 7.1 Hash Lock 校驗

```typescript
// 每個自訂元件需通過校驗
const validateComponent = (dsl: string) => {
  const hash = sha256(dsl);
  return queryAuditTrail(hash).verified;
};
```

### 7.2 防竄改鎖定

```typescript
const ComponentCoreShield = {
  uuid: "FACTORY-CORE-LOCK",
  rules: ["Object.freeze()", "Zero-Hallucination", "Hash-Lock"]
};
```

---