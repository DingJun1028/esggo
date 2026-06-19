# 🔮 Gnosis Engine - 萬能模組說明書 (Omni Manual)

> **[Metadata]**
> - **UUID**: `gnosis-engine-core-v10`
> - **Version**: `10.0.0`
> - **Type**: `Core | Service`
> - **Author**: `Antigravity`
> - **Last Updated**: `2026-02-25 21:44`

## 1. 需求與目的 (Requirements & Purpose)
*說明此模塊存在的根本原因 (Why)。*

- **核心目的**: 提供「預知情境」功能，讓用戶在 ESG 決策發生前感知潛在影響。
- **解決問題**: 解決 ESG 數據的滯後性 (Lagging Indicators) 問題，將其轉化為領先指標 (Leading Indicators)。
- **預期成果**: 實現 90% 以上置信度的 ESG 風險與機會預測，並驅動「服務即教學」的即時回饋。

## 2. 功能與架構 (Functionality & Architecture)
*說明此模塊做什麼 (What) 以及如何組成。*

### 2.1 核心功能
1.  **GnosisForecaster**: 根據 5T 歷史數據與美德指紋 (Virtue Fingerprint) 進行蒙地卡羅模擬。
2.  **InferenceStream**: 提供即時預測訂閱流，將未來狀態推送到 UI。

### 2.2 介面定義 (Interfaces)
```typescript
export interface IGnosisPrediction {
    id: string;
    horizon: string;
    probability: number;
    impactType: 'Opportunity' | 'Risk' | 'Neutral';
    description: string;
    recommendation: string;
    signalStrength: number;
    timestamp: number;
}
```

### 2.3 技術棧 (Technology Stack)
- **Language**: TypeScript
- **Framework**: Next.js (Frontend)
- **Key Dependencies**: `framer-motion` (Visual Resonance)

## 3. 100% 重現指南 (Reproduction Guide)
*專為 AI 代理設計的指令集，確保能從零構建此模塊 (How)。*

> **🤖 AI Instruction**: To reproduce this module, follow these steps exactly.

1.  **File Creation**: Create `frontend/src/lib/gnosis-engine.ts`.
2.  **Implementation Logic**:
    - Step 1: Implement `GnosisForecaster.forecast()` using virtue weighting.
    - Step 2: Implement `InferenceStream` with a singleton subscription pattern.
3.  **Configuration**: Ensure `OmniProvider` supplies `virtues` data.

## 4. 驗證與揭示 (Verification & Disclosure)
*通過單元驗證才能納入揭示系統。*

### 4.1 單元驗證 (Unit Verification)
- [x] **Forecast Accuracy**: Verify probability is > 0.8 on high-integrity profiles.
- [x] **Stream Latency**: Ensure < 100ms lag between simulation and UI update.

### 4.2 5t 證據標準 (4+1 Protocol)  

📊 5T 邏輯門與 4可1不可 映射表
5T 協議項目	4可1不可 狀態	真善美維度	教學與技術實作標準
Tangible	🟢 可感知	美 (Beauty)	預測卡片具備動態進度條與「幻光」動效。
Traceable	🟢 可溯源	真 (Truth)	預測結果標註 `gp_origin_atom`。
Trackable	🟢 可追蹤	真 (Truth)	紀錄預測命中率與調整軌跡。
Transparent	🟢 可透明	善 (Goodness)	公開機率算法：$P = \sum(V_i \times W_i)$。
Trustworthy	🔴 不可篡改	信 (Trust)	預測結果生成後執行 `Object.freeze()` 封存。

## 5. 完整代碼參照 (Source Reference)
- [Gnosis Engine](file:///c:/Project%20(Back%20Up)/esggo_MVP/esggo_mvp/frontend/src/lib/gnosis-engine.ts)
