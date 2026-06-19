# 🔮 OMNI_MANUAL: Gnosis Engine
## "The Future is Prescribed"

> **[Metadata]**
> - **UUID**: `gnosis-engine-manual-v10`
> - **Version**: `10.0.0`
> - **Type**: `Core | Infrastructure`
> - **Authority**: `Antigravity`
> - **Alignment**: `Nature Resonance`

## 1. 需求與目的 (Requirements & Purpose)
Gnosis Engine 是 InfoOne 生態系中的「先知」模組。其存在是為了透過 AI 驅動的模擬，預測 ESG 行動的長遠影響力，將抽象的數據轉換為具體的戰略態勢。

- **核心目的**: 消除永續發展路徑上的不確定性。
- **預算原則**: 每一分資源的投入都應能透過 Gnosis 預見其對 5T 指標的正向貢獻。

## 2. 功能與架構 (Functionality & Architecture)

### 2.1 核心邏輯 - GnosisForecaster
預測演算採用 $I_{future} = \sum (Atom_{impact} \times \omega_{context})$ 公式，其中:
- **Atom_impact**: 原子級影響力指標。
- **w_context**: 當前與預測情境的權重。

### 2.2 視覺化揭示 - Gnosis Heatmap
透過 `GnosisHeatmap.tsx` 實踐「靈覺視覺化」：
- **風險節點 (RiskNodes)**: 16 個自動生成的關鍵風險監控點。
- **色感映射 (Color Mapping)**: 🟢 (Safe), 🟠 (Yielding), 🔴 (Critical)。

## 3. 5T 協議標準 (5T Standards)
- **Tangible (可感知)**: 透過熱力圖梯度反映風險強度。
- **Traceable (可溯源)**: 預測數據必須標註 `forecast_origin`。
- **Transparent (可透明)**: 預測公式與權重對高級用戶公開。
- **Trustworthy (不可篡改)**: 預測結果生成後進入「凍結」狀態，作為歷史決策參考。

## 4. 實作參照 (Implementation Reference)
- 核心引擎: [gnosis-engine.ts](file:///c:/Project%20(Back%20Up)/esggo_MVP/esggo_mvp/src/core/gnosis-engine.ts)
- 視覺組件: [GnosisHeatmap.tsx](file:///c:/Project%20(Back%20Up)/esggo_MVP/esggo_mvp/frontend/src/components/GnosisHeatmap.tsx)
