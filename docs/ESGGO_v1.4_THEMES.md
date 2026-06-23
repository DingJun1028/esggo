# ESGGO 善向永續 v1.4 版

## 主題變體選擇

### 六組視覺主題

| 主題 | 名稱 | 描述 | 適用場景 |
|------|------|------|----------|
| 🟢 Green | 綠色永續 | 綠色主調 | 預設主題 |
| 🔵 Blue | 海藍版 | 冰藍主調 | 專業報告 |
| 🟤 Earth | 泥土版 | 大地色調 | CSR 報告 |
| 🌅 Sunset | 日落版 | 暖色系 | 行銷展示 |
| ⚪ Neutral | 中性版 | 灰階主調 | 管理後台 |
| 🌊 Cyan Eternal | 水色青·永恆金 | 水色青與永恆金 | 品牌高級場景 |

## RWD 最佳實踐

### 斷點系統
- **xs**: 0px (手機)
- **sm**: 640px (小型手機)
- **md**: 768px (平板)
- **lg**: 1024px (筆電)
- **xl**: 1280px (桌機)
- **2xl**: 1536px (大屏)

### 格網系統
- 12 欄位格網
- 響應式間距: 8px → 32px
- 容器寬度: 100% → 1320px

### 最佳實踐清單
1. 手機優先 (Mobile First)
2. Flex/Grid 彈性佈局
3. 圖片響應式縮放
4. 字體大小 clamp()
5. 觸控目標最小 44px

## 元件優化

### 響應式元件
- OmniButton: 手機適配大小
- OmniCard: 流式寬度
- OmniGrid: 動態欄位數
- OmniTable: 水滾軸設計

### 字體規範
- 行高: 1.5 (body) / 1.2 (heading)
- 字距: -0.02em (heading) / normal (body)
- 最大寬度: 65ch (閱讀體驗)

## 切換主題

```tsx
import { ThemeProvider, useTheme } from '@/contexts/ThemeProvider';

// 在組件中使用
const { config, variant, setVariant } = useTheme();
```

## 部署清單

- [x] 主題變體配置
- [x] RWD 斷點系統
- [x] 響應式元件
- [x] 字體規範
- [x] 圖片最佳化
- [x] 效能測試