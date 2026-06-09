# OmniAssistant 元件需求單 - v1.1.0

**Component:** OmniAssistant  
**Version:** v1.1.0  
**Type:** Organism  
**Category:** Assistant/Floating Widget  
**Theme Support:** Light/Dark/System  
**Mobile Support:** Yes (Desktop & Mobile variants)

---

## Properties

| Property | Type | Default | Options | Description |
|----------|------|---------|---------|-------------|
| `variant` | string | 'compact' | 'compact', 'expanded' | 顯示模式 |
| `position` | { x, y } | undefined | - | 位置座標 (允許拖動) |
| `size` | string | 'md' | 'sm', 'md', 'lg' | 光球尺寸 |
| `color` | string | 'berkeley-blue' | 'berkeley-blue', 'california-gold', 'glow-cyan', 'glow-emerald' | 主題顏色 |
| `initialState` | string | 'idle' | 'idle', 'listening', 'processing', 'speaking' | 初始狀態 |
| `autoCollapse` | boolean | true | - | 自動收縮 |
| `allowDrag` | boolean | true | - | 允許拖動 |
| `onPositionChange` | function | - | - | 位置變更回調 |
| `onStateChange` | function | - | - | 狀態變更回調 |

---

## Visual States

| State | Visual | Animation | 5T Status |
|-------|--------|-----------|-----------|
| **Default/Compact** | 56×56px 圓形光球 | pulse 4s 緩慢閃動 | Idle |
| **Hover** | scale: 1.1 + glow pulse | 150ms ease-out | Ready |
| **Dragging** | scale: 1.05 + shadow-xl | 跟隨滑鼠移動 | Active |
| **Listening** | 波紋擴散效果 | scale 1.2 循環 800ms | Tangible |
| **Processing** | 旋轉動態 + 載入指示 | spin 1s linear | Trackable |
| **Speaking** | 音波視覺動態 | bar height 變化 200ms | Transparent |
| **Expanded** | 320px寬對話視窗 | slide-up 250ms | Interactive |

---

## Light Theme

| State | Background | Text | Border | Shadow |
|-------|------------|------|--------|--------|
| **Compact** | `#003262` | `#FDB515` | none | lg |
| **Expanded** | rgba(255,255,255,0.85) | `#0F172A` | `#E2E8F0` | xl |
| **Hover** | `#1A3A5C` | `#FDB515` | none | xl |

---

## Dark Theme

| State | Background | Text | Border | Shadow |
|-------|------------|------|--------|--------|
| **Compact** | `#FDB515` | `#003262` | none | lg |
| **Expanded** | rgba(30,41,59,0.85) | `#F8FAFC` | `#334155` | xl |
| **Hover** | `#FCC136` | `#003262` | none | xl |

---

## Accessibility

| Criterion | Standard |
|-----------|----------|
| **ARIA** | `role="button"`, `aria-label="OmniAssistant 助理"`, `aria-expanded` |
| **Keyboard** | Esc 關閉, Tab focus |
| **Focus Indicator** | 2px solid `#FDB515` outline |
| **Touch Target** | 最小 48×48px |
| **Reduced Motion** | 暫停動畫, 使用即時狀態變化 |

---

## 5T Integration

| Dimension | Implementation |
|-----------|----------------|
| **Tangible** | 即時語音/文字回饋, 點擊反應立即視覺化 |
| **Traceable** | 對話紀錄自動上傳至 AuditTrail, Hash Lock 存證 |
| **Trackable** | lifecycle Hook 記錄互動狀態, 位置變更 |
| **Transparent** | 顯示 AI 思考步驟, 計算公式展開 |
| **Trustworthy** | 對話加密通訊, SHA-256 封印校驗 |

---

## Mobile-Specific

| Feature | Implementation |
|---------|---------------|
| **Touch Target** | 56×56px (符合 WCAG AA) |
| **Long Press** | 800ms 切換顏色主題 |
| **Edge Snap** | 貼近邊緣自動對齊 (左/右) |
| **Safe Area** | 自動避開 iPhone Home Indicator |
| **Haptic Feedback** | 點擊震動回饋 |

---

## Security & Backup

| Feature | Description |
|---------|-------------|
| **Session Sync** | 與 OmniAgent 即時同步對話狀態 |
| **Offline Mode** | 本地快取最近對話, 斷線時仍可用 |
| **Encryption** | End-to-End 對話加密, 消息不可篡改 |
| **Quick Switch** | 一鍵切換至主 OmniAgent 介面 |
| **Backup Trigger** | 提供備份操作按鈕存取 |

---

## Dependencies

```json
{
  "lucide-react": "^0.292.0",
  "class-variance-authority": "^0.7.0",
  "tailwind-merge": "^3.6.0",
  "@types/react": "^18.2.33"
}
```

---

## Usage Example

```tsx
import { OmniAssistant } from '@/components/assistant/OmniAssistant';

function App() {
  return (
    <OmniAssistant 
      color="berkeley-blue"
      initialState="idle"
      allowDrag={true}
      onPositionChange={(pos) => console.log('Position:', pos)}
    />
  );
}
```

---

## Related Components

| Component | Relation |
|-----------|----------|
| OmniAgent | 主版本，功能完全同步 |
| MobileBottomNav | 手機版輔助導覽 |
| OmniModal | 展開狀態使用 Modal 結構 |

---