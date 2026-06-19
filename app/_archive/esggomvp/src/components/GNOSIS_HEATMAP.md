# 🔮 Gnosis Heatmap - 萬能模組說明書 (Omni Manual)

> **[Metadata]**
> - **UUID**: `gnosis-heatmap-ui-v10`
> - **Version**: `10.0.0`
> - **Type**: `UI | Service`
> - **Author**: `Antigravity`
> - **Last Updated**: `2026-02-25 21:50`

## 1. 需求與目的 (Requirements & Purpose)
*說明此模塊存在的根本原因 (Why)。*

- **核心目的**: 提供全域 ESG 風險的視覺化「靈覺」感應。
- **解決問題**: 讓用戶直觀識別不同區域、不同維度的 ESG 漂移 (Drift) 與 臨界 (Critical) 狀態。
- **預期成果**: 建立一個動態反應的熱圖，支援「無作妙德」式的雙向導航。

## 2. 功能與架構 (Functionality & Architecture)
*說明此模塊做什麼 (What) 以及如何組成。*

### 2.1 核心功能
1.  **RiskNode Logic**: 自動生成 16 個核心風險節點。
2.  **Adaptive Color Mapping**: 根據風險強度自動切換 🟢/🟠/🔴 色感。
3.  **Intensity Reveal**: 懸停時揭示精確的影響力強度。

### 2.2 介面定義 (Interfaces)
```typescript
interface IRiskNode {
    id: number;
    risk: number;
    label: string;
    region: string;
}
```

### 3. 100% 重現指南 (Reproduction Guide)
> 🤖 AI Instruction: To reproduce this module, follow these steps exactly.

1.  **File Creation**: Create `frontend/src/components/GnosisHeatmap.tsx`.
2.  **Styling**: Use `sentient-glass` class for background.
3.  **Animation**: Use `framer-motion` for node entry and hover effects.

## 4. 驗證與揭示 (Verification & Disclosure)

### 4.1 5t 證據標準 (4+1 Protocol)  
- **Tangible**: 通過熱力梯度實現動態感知。
- **Traceable**: 節點數據鏈接至 `GnosisForecaster`。
- **Trustworthy**: 渲染後執行 `Object.freeze()`。

## 5. 完整代碼參照 (Source Reference)
- [Gnosis Heatmap Component](file:///c:/Project%20(Back%20Up)/esggo_MVP/esggo_mvp/frontend/src/components/GnosisHeatmap.tsx)
