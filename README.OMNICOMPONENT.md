# ESGGO OmniComponent Library v1.1.0

> **ESGGO Classic 善向永續 經典版** | **OmniAgent & OmniAssistant 共同代理**

## 🚀 Quick Start

```tsx
import { 
  OmniButton, 
  OmniInput, 
  OmniBadge, 
  OmniCard,
  OmniKPICard,
  OmniAssistant 
} from '@/components/ui';
import { OmniThemeProvider, useOmniTheme } from '@/components/theme';
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| `OMNICOMPONENT_DESIGN_SYSTEM_v1.1.md` | 完整設計系統規範 |
| `OMNICOMPONENT_FINAL_DELIVERY.md` | 最終摘要 |
| `OMNICOMPONENT_INDEX.md` | 元件目錄 |
| `OMNIFACTORY_DSL.md` | 萬能工廠 DSL |
| `OMNIFACTORY_MARKETPLACE.md` | 市集清單 |

## 🎨 Theme Support

- Light Mode: `#F8FAFC` background, `#059669` primary
- Dark Mode: `#020617` background, `#34D399` primary
- System Mode: Follows OS preference

## 🏭 OmniFactory

提交 `OmniAssistant-REQ-v1.1.0.md` 格式需求單，自動生成並上架至市集。

---

## 📦 Export

```typescript
// Design Tokens
export const DesignTokens = {
  colors: {
    primary: '#059669',
    background: '#F8FAFC',
    surface: 'rgba(255,255,255,0.7)',
  },
  spacing: {
    sm: '4px',
    md: '8px',
    lg: '16px',
  },
};
```