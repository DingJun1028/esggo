# Anti-gravity Design System - 快速開始指南

**版本**：1.0.0  
**建立日期**：2026-02-11

---

## 安裝

組件已集成到項目中，無需額外安裝。只需導入即可使用。

---

## 快速開始

### 1. 導入全局樣式

在你的主應用入口文件（如 `main.tsx` 或 `App.tsx`）中導入全局樣式：

```typescript
import './styles/AntiGravityGlobal.css';
```

### 2. 導入組件

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

### 3. 使用 UUID Display

```typescript
import { UUIDDisplay } from '@/components';

function MyComponent() {
  const uuid = '550e8400-e29b-41d4-a716-446655440000' as UUID;

  return (
    <div>
      <h2>UUID 顯示示例</h2>
      
      {/* 完整模式 */}
      <UUIDDisplay
        uuid={uuid}
        mode="full"
        showLabel={true}
        copyable={true}
        language="zh-TW"
      />
      
      {/* 簡短模式 */}
      <UUIDDisplay
        uuid={uuid}
        mode="short"
        showLabel={false}
        copyable={true}
        language="zh-TW"
      />
      
      {/* 緊湊模式 */}
      <UUIDDisplay
        uuid={uuid}
        mode="compact"
        showLabel={false}
        copyable={true}
        language="zh-TW"
      />
    </div>
  );
}
```

### 4. 使用 Anti-gravity Layout

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

### 5. 使用 Two-Way Binding

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

  const emailBinding = useTwoWayBinding({
    initialValue: '',
    required: true,
    validator: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return '請輸入有效的電子郵件';
      }
      return null;
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('表單提交:', {
      name: nameBinding.binding.value,
      email: emailBinding.binding.value,
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <TwoWayBinding
        type="text"
        label="名稱"
        placeholder="請輸入您的名稱"
        binding={nameBinding}
        language="zh-TW"
      />
      
      <TwoWayBinding
        type="email"
        label="電子郵件"
        placeholder="請輸入您的電子郵件"
        binding={emailBinding}
        language="zh-TW"
      />
      
      <button
        type="submit"
        disabled={!nameBinding.isValid || !emailBinding.isValid}
      >
        提交
      </button>
    </Form>
  );
}
```

### 6. 使用 Start-End Matrix

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
  console.log('總節點數:', stats.totalNodes);
  console.log('已完成節點:', stats.completedNodes);
}
```

---

## 常見使用場景

### 場景 1：用戶資料表單

```typescript
import { TwoWayBinding, useTwoWayBinding, Form } from '@/components';

function UserProfileForm() {
  const nameBinding = useTwoWayBinding({ initialValue: '', required: true });
  const emailBinding = useTwoWayBinding({ initialValue: '', required: true });
  const phoneBinding = useTwoWayBinding({ initialValue: '' });
  const ageBinding = useTwoWayBinding({ initialValue: 25, min: 0, max: 120 });
  const agreeBinding = useTwoWayBinding({ initialValue: false, required: true });

  return (
    <Form onSubmit={handleSubmit}>
      <TwoWayBinding type="text" label="姓名" binding={nameBinding} />
      <TwoWayBinding type="email" label="電子郵件" binding={emailBinding} />
      <TwoWayBinding type="text" label="電話" binding={phoneBinding} />
      <TwoWayBinding type="slider" label="年齡" min={0} max={120} binding={ageBinding} />
      <TwoWayBinding type="checkbox" label="我同意條款" binding={agreeBinding} />
      <button type="submit">提交</button>
    </Form>
  );
}
```

### 場景 2：產品列表

```typescript
import { AntiGravityLayout, AntiGravityGrid } from '@/components';
import { UUIDDisplay } from '@/components';

function ProductList({ products }) {
  return (
    <AntiGravityLayout mode="contained" padding={3}>
      <h1>產品列表</h1>
      <AntiGravityGrid
        columns={1}
        responsiveColumns={{ sm: 2, md: 3, lg: 4 }}
        gap={3}
      >
        {products.map((product) => (
          <Card key={product.id} className="floating-card">
            <CardContent>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <UUIDDisplay
                uuid={product.id}
                mode="short"
                showLabel={false}
              />
            </CardContent>
          </Card>
        ))}
      </AntiGravityGrid>
    </AntiGravityLayout>
  );
}
```

### 場景 3：數據處理流程

```typescript
import { StartEndMatrixBuilder, StartEndMatrixExecutor } from '@/core';

async function processDataFlow(inputData) {
  const matrix = new StartEndMatrixBuilder()
    .setName('數據處理流程')
    .withStart(inputData)
    .withMatrixNode('validate', '驗證數據', [])
    .withMatrixNode('transform', '轉換數據', [])
    .withMatrixNode('enrich', '豐富數據', [])
    .withEnd('輸出結果', [])
    .build();

  const transforms = new Map();
  transforms.set(matrix.matrix[0].id, async (data) => {
    // 驗證邏輯
    return data;
  });
  transforms.set(matrix.matrix[1].id, async (data) => {
    // 轉換邏輯
    return data;
  });
  transforms.set(matrix.matrix[2].id, async (data) => {
    // 豐富邏輯
    return data;
  });

  const result = await StartEndMatrixExecutor.execute(matrix, transforms);
  return result.end.data;
}
```

---

## 設計令牌使用

### 色彩

```typescript
import { antiGravityColors } from '@/core';

// 在組件中使用
const style = {
  color: antiGravityColors.primary.main,
  background: antiGravityColors.primary.transparent[20],
};
```

### 間距

```typescript
import { antiGravitySpacing } from '@/core';

// 在組件中使用
const style = {
  padding: antiGravitySpacing[3],  // 24px
  margin: antiGravitySpacing[2],   // 16px
  gap: antiGravitySpacing[1],      // 8px
};
```

### 陰影

```typescript
import { antiGravityShadows } from '@/core';

// 在組件中使用
const style = {
  boxShadow: antiGravityShadows.float.md,
};
```

### 動畫

```typescript
import { antiGravityAnimations } from '@/core';

// 在組件中使用
const style = {
  transition: `all ${antiGravityAnimations.duration.normal} ${antiGravityAnimations.easing.easeOut}`,
};
```

---

## 響應式斷點

```typescript
import { AntiGravityLayout } from '@/components';

<AntiGravityLayout
  columns={1}
  responsiveColumns={{
    xs: 1,    // 0-599px: 1 列
    sm: 2,    // 600-899px: 2 列
    md: 3,    // 900-1199px: 3 列
    lg: 4,    // 1200-1439px: 4 列
    xl: 5,    // 1440-1919px: 5 列
  }}
  gap={3}
>
  {children}
</AntiGravityLayout>
```

---

## 雙語支持

```typescript
import { tExtended } from '@/i18n/translations-extended';

function MyComponent() {
  const [language, setLanguage] = useState<'zh-TW' | 'en'>('zh-TW');

  return (
    <div>
      <h1>{tExtended('antigravity.title', language)}</h1>
      <p>{tExtended('antigravity.subtitle', language)}</p>
      
      <button onClick={() => setLanguage('zh-TW')}>繁體中文</button>
      <button onClick={() => setLanguage('en')}>English</button>
    </div>
  );
}
```

---

## 無障礙支持

所有組件都遵循 WCAG 2.1 AA 級標準：

- ✅ 色彩對比度至少達到 4.5:1
- ✅ 所有互動元素支援鍵盤導航
- ✅ 為圖片和非文字內容提供替代文字
- ✅ 使用 ARIA 標籤增強螢幕閱讀器支援
- ✅ 支援減少動畫的偏好設定

---

## 故障排除

### 問題：UUID 顯示不正確

確保 UUID 類型正確：

```typescript
import { UUIDUtil } from '@/core';

// 正確
const uuid = UUIDUtil.generate() as UUID;

// 錯誤
const uuid = '550e8400-e29b-41d4-a716-446655440000'; // 缺少類型斷言
```

### 問題：響應式布局不工作

確保正確設置響應式列數：

```typescript
<AntiGravityLayout
  columns={1}  // 預設列數
  responsiveColumns={{ xs: 1, md: 2, lg: 3 }}  // 響應式列數
>
  {children}
</AntiGravityLayout>
```

### 問題：雙向綁定驗證不觸發

確保設置 `validateOnChange` 或手動調用 `validate`：

```typescript
const binding = useTwoWayBinding({
  initialValue: '',
  validateOnChange: true,  // 即時驗證
  validator: (value) => {
    if (value.length < 2) {
      return '至少需要 2 個字符';
    }
    return null;
  },
});

// 或手動驗證
await binding.validate();
```

---

## 更多資源

- [完整文檔](./ANTI_GRAVITY_DESIGN_SYSTEM.md)
- [Google Stitch MCP 文檔](./GOOGLE_STITCH_MCP_COMPLETE_EXAMPLE.md)
- [UI/UX 最佳實踐](./GOOGLE_STITCH_UIUX_BEST_PRACTICES.md)

---

## 支援

如有問題或建議，請聯繫開發團隊。
