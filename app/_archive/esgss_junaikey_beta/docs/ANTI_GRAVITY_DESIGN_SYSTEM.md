# Anti-gravity Design System

**版本**：1.0.0  
**建立日期**：2026-02-11  
**核心理念**：輕量化、浮動美學、流動性

---

## 概述

Anti-gravity Design System 是一套遵循反重力設計原則的高保真響應式 UI 組件系統。該系統專為 ESGss JunAiKey Beta 項目設計，整合了 Google Stitch MCP 最佳實踐，提供完整的雙語支持（繁體中文/英文）和嚴格的類型安全。

### 核心特性

- ✅ **Anti-gravity 設計原則**：輕量化、浮動美學、流動性
- ✅ **三元一體設計概念**：數據層、邏輯層、展示層
- ✅ **Start-End Matrix 數據結構**：三元一體數據模型
- ✅ **UUID 顯示功能**：支持多種顯示模式和複製功能
- ✅ **響應式布局**：完全適應各種設備尺寸
- ✅ **雙向數據綁定**：嚴格的類型安全和驗證
- ✅ **雙語支持**：繁體中文和英文
- ✅ **無障礙支持**：WCAG 2.1 AA 級標準
- ✅ **TypeScript 嚴格模式**：完整的類型定義

---

## 安裝

```bash
# 組件已集成到項目中，無需額外安裝
```

---

## 快速開始

### 1. 導入組件

```typescript
// 導入核心模組
import {
  UUIDUtil,
  StartEndMatrixBuilder,
  antiGravityColors,
  antiGravitySpacing,
} from '@/core';

// 導入 UI 組件
import {
  UUIDDisplay,
  AntiGravityLayout,
  TwoWayBinding,
  useTwoWayBinding,
} from '@/components';

// 導入翻譯
import { tExtended } from '@/i18n/translations-extended';
```

### 2. 使用 UUID Display

```typescript
import { UUIDDisplay } from '@/components';

function MyComponent() {
  const uuid = '550e8400-e29b-41d4-a716-446655440000' as UUID;

  return (
    <UUIDDisplay
      uuid={uuid}
      mode="full"
      showLabel={true}
      copyable={true}
      language="zh-TW"
    />
  );
}
```

### 3. 使用 Anti-gravity Layout

```typescript
import { AntiGravityLayout, AntiGravityGrid } from '@/components';

function MyPage() {
  return (
    <AntiGravityLayout
      mode="contained"
      columns={3}
      responsiveColumns={{ xs: 1, md: 2, lg: 3 }}
      gap={3}
      floating={true}
      glassmorphism={true}
    >
      <Card>卡片 1</Card>
      <Card>卡片 2</Card>
      <Card>卡片 3</Card>
    </AntiGravityLayout>
  );
}
```

### 4. 使用 Two-Way Binding

```typescript
import { TwoWayBinding, useTwoWayBinding, Form } from '@/components';

function MyForm() {
  const nameBinding = useTwoWayBinding({
    initialValue: '',
    required: true,
    validator: (value) => {
      if (value.length < 2) {
        return '名稱至少需要 2 個字符';
      }
      return null;
    },
  });

  return (
    <Form onSubmit={handleSubmit}>
      <TwoWayBinding
        type="text"
        label="名稱"
        placeholder="請輸入您的名稱"
        binding={nameBinding}
        language="zh-TW"
      />
    </Form>
  );
}
```

### 5. 使用 Start-End Matrix

```typescript
import { StartEndMatrixBuilder, StartEndMatrixExecutor } from '@/core';

async function processUserData() {
  // 創建矩陣
  const matrix = new StartEndMatrixBuilder<string, string>()
    .setName('用戶註冊流程')
    .setDescription('三元一體數據結構示例')
    .setLanguage('zh-TW')
    .withStart('用戶輸入數據')
    .withMatrixNode('logic', '驗證數據', [])
    .withMatrixNode('transform', '轉換數據格式', [])
    .withEnd('創建用戶帳戶', [])
    .build();

  // 執行矩陣
  const transforms = new Map();
  const validators = new Map();

  const result = await StartEndMatrixExecutor.execute(matrix, transforms, validators);

  // 獲取統計
  const stats = StartEndMatrixExecutor.getStats(result);
  console.log('成功率:', stats.successRate);
}
```

---

## 組件文檔

### UUID Display

顯示 UUID 並支持複製功能。

#### Props

| 屬性 | 類型 | 預設值 | 描述 |
|------|------|--------|------|
| `uuid` | `UUID` | - | UUID 值（必填） |
| `mode` | `'full' \| 'short' \| 'compact'` | `'full'` | 顯示模式 |
| `uppercase` | `boolean` | `false` | 是否大寫 |
| `showLabel` | `boolean` | `true` | 是否顯示標籤 |
| `label` | `string` | - | 自定義標籤 |
| `copyable` | `boolean` | `true` | 是否可複製 |
| `showIcon` | `boolean` | `true` | 是否顯示圖示 |
| `language` | `'zh-TW' \| 'en'` | `'zh-TW'` | 語言 |
| `onCopy` | `(uuid: UUID) => void` | - | 複製成功回調 |

#### 示例

```typescript
<UUIDDisplay
  uuid={exampleUUID}
  mode="full"
  showLabel={true}
  copyable={true}
  language="zh-TW"
/>
```

---

### Anti-gravity Layout

響應式布局組件，支持多種布局模式。

#### Props

| 屬性 | 類型 | 預設值 | 描述 |
|------|------|--------|------|
| `mode` | `'fluid' \| 'contained' \| 'centered' \| 'full-width'` | `'contained'` | 布局模式 |
| `maxWidth` | `string` | `'1200px'` | 最大寬度 |
| `columns` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 8 \| 12` | `1` | 網格列數 |
| `responsiveColumns` | `object` | - | 響應式列數 |
| `gap` | `0 \| 0.5 \| 1 \| 1.5 \| 2 \| 3 \| 4 \| 5 \| 6 \| 8 \| 10 \| 12` | `3` | 間距 |
| `floating` | `boolean` | `false` | 是否啟用浮動效果 |
| `glassmorphism` | `boolean` | `false` | 是否啟用玻璃態效果 |

#### 示例

```typescript
<AntiGravityLayout
  mode="contained"
  columns={3}
  responsiveColumns={{ xs: 1, md: 2, lg: 3 }}
  gap={3}
  floating={true}
  glassmorphism={true}
>
  {children}
</AntiGravityLayout>
```

---

### Two-Way Binding

雙向數據綁定組件，支持多種輸入類型和驗證。

#### Props

| 屬性 | 類型 | 預設值 | 描述 |
|------|------|--------|------|
| `type` | `'text' \| 'number' \| 'email' \| 'password' \| 'select' \| 'checkbox' \| 'switch' \| 'slider' \| 'textarea'` | - | 綁定類型（必填） |
| `label` | `string` | - | 標籤 |
| `placeholder` | `string` | - | 佔位符 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `language` | `'zh-TW' \| 'en'` | `'zh-TW'` | 語言 |
| `options` | `Array<{ value: T; label: string }>` | - | 選項（用於 select） |
| `min` | `number` | - | 最小值（用於 number/slider） |
| `max` | `number` | - | 最大值（用於 number/slider） |

#### Hook: useTwoWayBinding

```typescript
const binding = useTwoWayBinding({
  initialValue: '',
  required: true,
  validator: (value) => {
    if (value.length < 2) {
      return '名稱至少需要 2 個字符';
    }
    return null;
  },
});

// 使用
<TwoWayBinding
  type="text"
  label="名稱"
  binding={binding}
  language="zh-TW"
/>
```

---

## 設計令牌

### 色彩

```typescript
import { antiGravityColors } from '@/core';

antiGravityColors.primary.main      // '#63A2B0'
antiGravityColors.secondary.main    // '#26A69A'
antiGravityColors.accent.main       // '#FFA726'
antiGravityColors.functional.success.main  // '#4CAF50'
```

### 間距

```typescript
import { antiGravitySpacing } from '@/core';

antiGravitySpacing[0]   // '0px'
antiGravitySpacing[1]   // '8px'
antiGravitySpacing[2]   // '16px'
antiGravitySpacing[3]   // '24px'
antiGravitySpacing[4]   // '32px'
```

### 陰影

```typescript
import { antiGravityShadows } from '@/core';

antiGravityShadows.float.sm   // '0 2px 8px rgba(0, 0, 0, 0.08)...'
antiGravityShadows.float.md   // '0 4px 16px rgba(0, 0, 0, 0.1)...'
antiGravityShadows.float.lg   // '0 8px 24px rgba(0, 0, 0, 0.12)...'
```

### 動畫

```typescript
import { antiGravityAnimations } from '@/core';

antiGravityAnimations.duration.fast    // '150ms'
antiGravityAnimations.duration.normal  // '250ms'
antiGravityAnimations.duration.slow    // '350ms'

antiGravityAnimations.easing.easeOut   // 'cubic-bezier(0.4, 0, 0.2, 1)'
antiGravityAnimations.easing.easeIn    // 'cubic-bezier(0.4, 0, 1, 1)'
```

---

## 響應式斷點

| 名稱 | 最小寬度 | 典型設備 |
|------|----------|----------|
| `xs` | 0px | 手機直立 |
| `sm` | 600px | 手機橫向 |
| `md` | 900px | 平板直立 |
| `lg` | 1200px | 平板橫向、筆電 |
| `xl` | 1440px | 桌上型電腦 |
| `2xl` | 1920px | 大螢幕 |

---

## 無障礙支持

所有組件都遵循 WCAG 2.1 AA 級標準：

- ✅ 色彩對比度至少達到 4.5:1
- ✅ 所有互動元素支援鍵盤導航
- ✅ 為圖片和非文字內容提供替代文字
- ✅ 使用 ARIA 標籤增強螢幕閱讀器支援
- ✅ 支援減少動畫的偏好設定

---

## 瀏覽器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

---

## 貢獻指南

1. Fork 項目
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

---

## 許可證

MIT License

---

## 聯繫方式

如有問題或建議，請聯繫開發團隊。

---

## 更新日誌

### v1.0.0 (2026-02-11)

- ✅ 初始版本發布
- ✅ Anti-gravity 設計令牌系統
- ✅ Start-End Matrix 數據結構
- ✅ UUID Display 組件
- ✅ Anti-gravity Layout 組件
- ✅ Two-Way Binding 組件
- ✅ 雙語支持（繁體中文/英文）
- ✅ 響應式布局系統
- ✅ 無障礙支持
