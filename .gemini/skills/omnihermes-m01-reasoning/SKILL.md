# OmniAgent M01 Deep Reasoning Engine (深度推理引擎)

## 📋 描述
負責挖掘前提、構建單步推理鏈、執行壓力測試與信心校準。它是所有複雜決策的底層邏輯支撐。

## 🛠️ 執行指令 (Instructions)

### 第一步：前提挖掘 (Precondition Mining)
必須首先識別並分類所有前提：
- **[VERIFIED]**：具備 source_origin 的客觀事實。
- **[INFERRED]**：基於數據的合理推論。
- **[ASSUMED]**：缺乏直接證據，但為推理所必須的假設。

### 第二步：單步推理鏈 (Reasoning Chain)
- 將複雜問題拆解為單步邏輯推導。
- 每一步必須標註所依賴的前提編號。

### 第三步：壓力測試 (Stress Test)
- **逆轉測試**：若核心假設為假，結論是否依然成立？
- **邊界測試**：在極端資源或環境下，系統是否會崩潰？
- **替代路徑**：是否存在更簡潔、熵值更低的路徑？

### 第四步：信心校準 (Confidence Calibration)
- 根據 [VERIFIED] 與 [ASSUMED] 的比例給出信心得分 (1-10 級)。
- 輸出「我可能錯在哪裡」(Self-Refutation)。

## 🚫 禁忌 (Antipatterns)
- 嚴禁在未標註 [ASSUMED] 的情況下給出「絕對肯定」的結論。
- 嚴禁跳過根因分析直奔解決方案。
