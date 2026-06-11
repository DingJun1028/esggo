# ESGGO OmniComponent Library - Index

**Version:** v1.1.0  
**Theme:** ESGGO Classic 善向永續 經典版  
**Last Updated:** 2026-06-09

---

## Component Directory

### Atom (原子元件)

| Component | File | Stories | Requirements |
|-----------|------|---------|--------------|
| OmniButton | `src/components/ui/atom/OmniButton.tsx` | ✅ | ✅ |
| OmniInput | `src/components/ui/atom/OmniInput.tsx` | ✅ | - |
| OmniBadge | `src/components/ui/atom/OmniBadge.tsx` | ✅ | - |
| OmniIcon | `src/components/ui/atom/OmniIcon.tsx` | - | - |
| OmniDivider | `src/components/ui/atom/OmniDivider.tsx` | - | - |
| OmniCard | `src/components/ui/atom/OmniCard.tsx` | - | - |

### Molecule (分子元件)

| Component | File | Stories | Requirements |
|-----------|------|---------|--------------|
| OmniKPICard | `src/components/ui/molecule/OmniKPICard.tsx` | - | - |
| OmniFormField | `src/components/ui/molecule/OmniFormField.tsx` | - | - |

### Organism (組織元件)

| Component | File | Stories | Requirements |
|-----------|------|---------|--------------|
| OmniAssistant | `src/components/assistant/OmniAssistant.tsx` | ✅ | ✅ |
| OmniModal | `src/components/ui/organism/OmniModal.tsx` | - | - |

### Mobile-Specific

| Component | File | Stories | Requirements |
|-----------|------|---------|--------------|
| MobileBottomNav | `src/components/ui/mobile/MobileBottomNav.tsx` | - | - |
| MobileDrawer | `src/components/ui/mobile/MobileDrawer.tsx` | - | - |

---

## Theme Files

| Theme | File | Description |
|-------|------|-------------|
| Light | `src/styles/themes/omni-light.css` | ESGGO Classic Light |
| Dark | `src/styles/themes/omni-dark.css` | ESGGO Classic Dark |
| System | `src/styles/themes/omni-system.css` | Follow System Preference |

---

## Design Documentation

| Document | File | Description |
|----------|------|-------------|
| Main Design System | `OMNICOMPONENT_DESIGN_SYSTEM_v1.1.md` | 完整設計規範 |
| Component Requirements | `.kilo/component-requirements/` | 元件需求單 |

---

## Quick Start

```tsx
// Import components
import { OmniButton } from '@/components/ui/atom/OmniButton';
import { OmniInput } from '@/components/ui/atom/OmniInput';
import { OmniBadge } from '@/components/ui/atom/OmniBadge';
import { OmniAssistant } from '@/components/assistant/OmniAssistant';
import { ThemeProvider } from '@/components/theme/OmniThemeProvider';

// Wrap app with theme provider
function App() {
  return (
    <ThemeProvider>
      <OmniAssistant />
      {/* Your content */}
    </ThemeProvider>
  );
}
```

---

## 5T Protocol Quick Reference

| T-Level | Color | Badge Variant | Use Case |
|---------|-------|---------------|----------|
| T1 Tangible | `#10B981` | `t1` | 可感知指標 |
| T2 Traceable | `#3B7EA1` | `t2` | 可溯源日誌 |
| T3 Trackable | `#8B5CF6` | `t3` | 可追蹤生命週期 |
| T4 Transparent | `#F59E0B` | `t4` | 可透明驗算 |
| T5 Trustworthy | `#003262` | `t5` | 不可篡改封印 |

---

## 4. OmniFactory (萬能工廠)

| 文件 | 說明 |
|------|------|
| `OMNIFACTORY_DSL.md` | 萬能工廠 DSL 規範 |
| `omni-factory-builder.ts` | 自動生成器 |
| `.kilo/component-requirements/` | 需求單範本 |

| 用戶權限 | 自訂頁面數 |
|----------|------------|
| Free | 1 頁 |
| Pro | 3 頁 |
| Enterprise | 無限 |

## 5. 平台融合

| 現有元件 | 融合狀態 |
|----------|----------|
| SelectionHouse | ✅ Mobile 選擇介面 (與 MobileBottomNav 互補) |
| BrandCard/BrandBadge | ✅ 可透過 OmniCard/OmniBadge 替代升級 |

---