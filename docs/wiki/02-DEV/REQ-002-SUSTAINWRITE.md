---
uuid: REQ-UNIV-002-SUSTAINWRITE
version: 1.0.0
timestamp: 2026-06-08T17:30:00Z
evidence: "src/client/components/SustainWrite.tsx"
category: "02-DEV"
sequence: 002
tags: ["SustainWrite","AI","5T","IComponentCore"]
---

# 📄 **02-DEV-REQ-002-SUSTAINWRITE: ESG 數據永續撰寫協助**

## 需求描述
為使用者提供一個 AI 驅動的永續報告撰寫介面（SustainWrite），能即時校驗 5T 原則、產生 ZKP 證明，並支援暗／亮雙主題切換。主要功能包括：
1. 文字輸入框與即時語法/規範校驗（Truth、Goodness）
2. 生成草稿後自動加入 JWT‑Signed ZKP（Trust）
3. 支援 `theme=light|dark` 切換，保持 UI 一致性（Beauty）
4. 文稿完成後可導出為 PDF 並附帶 Hash‑Lock（Transfer）

## 5T 對應表
| 5T 元素 | 實作方式 |
|--------|----------|
| **Truth** | 透過 `useSustainWriteVerification` 勾點即時校驗文本完整性與 ESG 標準匹配。
| **Goodness** | 所有生成文字均依據 `5T‑Protocol` 與 `GRI/ISSB` 標準自動引用。
| **Beauty** | UI 使用 `03-PRO-THEME-001` 主題，支援暗/亮模式，保持視覺一致。
| **Trust** | 完成稿自動產生 ZKP（`generateZKP`）並以 HMAC‑SHA256 簽名。
| **Transfer** | 允許匯出 PDF，內嵌 `hashLock` 與 `evidence` URL，確保跨系統追蹤。

## 依賴與前置條件
- `01-GOV-ZKP-001` 零知識證明模組
- `03-PRO-THEME-001` 暗/亮雙主題設定
- `02-DEV-REQ-001-AUTH` 使用者驗證服務（JWT）

## 輸入/輸出
```json
// Input (React Props)
{
  "initialContent": "string",
  "userId": "uuid"
}
// Output
{
  "draft": "string",
  "zkpProof": "string",
  "pdfUrl": "string"
}
```

## 安全要求
- 所有文字在前端加密傳輸（TLS 1.3）
- ZKP 生成使用 `HMAC‑SHA256`，密鑰保管於 `Vault`
- PDF 內嵌 SHA‑256 雜湊，防止竄改

## 擴充性
- 未來支援多語言翻譯（i18n）
- 支援外部 ESG 數據 API（Carbon‑API）自動填充

## 負責人
- **產品**: gideon-ng
- **前端**: alice-wu
- **AI/Genkit**: bob-lee

## 里程碑
- 設計完成：2026‑07‑01
- 前端原型：2026‑07‑15
- AI 生成與 ZKP 整合：2026‑08‑01
- 上線 Beta：2026‑08‑31

## 產出目標
- **目標字數**：150,000 字（約 30 篇 5 k‑word ESG 報告）
- **使用模板**：Zero算力專家模板（`Zero-Compute-Expert-Template`），提供高效算力分配、分段生成與自動校對。

### 玲算力專家模板概述
| 功能 | 描述 |
|------|------|
| **算力分段** | 根據字數自動切分 5k‑word 單位，分配 GPU/TPU 叢集資源。
| **批次驗證** | 每 5k‑word 產出後即觸發 ZKP 校驗與 5T 合規檢查。
| **持續流式輸出** | 支援 `stream` API，實時回傳文本與進度指標。
| **自動摘要** | 完整稿完成後自動生成 1‑page Executive Summary。
| **錯誤回溯** | 若校驗失敗，自動回滾至最近一次成功的 5k‑word 產出點。

## 工作流程（結合工廠）
1. **呼叫工廠**：`npm run ufactory -- --type=req --id=SUSTAINWRITE-150K`
2. **算力排程**：工廠自動生成 `Zero-Compute-Expert-Template` 配置檔 (`compute.yaml`)。
3. **AI 生成**：Genkit 以 `gemini‑4.0‑pro` 為核心，引入 `Zero-Compute-Expert` 進行分段計算。
4. **ZKP 封印**：每段完成即產生 ZKP，匯入 `Evidence Vault`。
5. **匯出**：最終 PDF 包含全稿 SHA‑256、分段 ZKP 列表與算力報告。

---

## 相關文件
- [01-GOV-ZKP-001 零知識證明實作法](01-GOV/ZKP-implementation.md)
- [03-PRO‑THEME‑001 萬能主題模板](03-PRO/themes/universal-theme.md)
- [00‑SYS‑FACTORY‑001 萬能工廠說明](00-SYS/universal-factory.md)

- 設計完成：2026‑07‑01
- 前端原型：2026‑07‑15
- AI 生成與 ZKP 整合：2026‑08‑01
- 上線 Beta：2026‑08‑31
