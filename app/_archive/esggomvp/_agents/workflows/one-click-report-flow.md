---
description: 永續底稿：一鍵完成 (One-Click Report) 標準作業程序
---

# 🏛️ 永續底稿：一鍵完成 (One-Click Report) 工作流程

本流程定義了從原始憑證到 5T 誠信鎖定資產的完整轉換路徑，所有 AI 代理在執行相關任務時必須嚴格遵守。

## 🌀 核心流程
1. **OCR 提取 (Extract)**：利用 `ocrBrain` 提取憑證核心指標。
2. **對話編排 (Dialogue)**：召喚「永續精靈」與「數位分身」進行六德共鳴對話。
3. **底稿生成 (Synthesize)**：將對話與指標編譯為 `Typst DSL`。
4. **誠信鎖定 (Seal)**：透過 `OmniOne.manifest()` 執行 5T 封印。
5. **知識備份 (Archive)**：自動同步至 `Wuzuo Note` 實現無作生成。

## 📋 行動前項目檢核 (Pre-action Checklist)
- [ ] **UUID 確認**：檢查 `ONE_CLICK_DRAFT` (mod-adv-draft-0001) 是否就緒。
- [ ] **憑證校閱**：確認 MIME 類型為支援格式 (PDF/PNG/JPG)。
- [ ] **分身同步**：確認使用者數位分身的「六德屬性」已正確載入。
- [ ] **5T 準備**：確認 `OmniOne` 系統處於 Active 狀態。

## 📋 行動後項目檢核 (Post-action Checklist)
- [ ] **Hash 生成**：確認 `atomUuid` 已成功回傳。
- [ ] **筆記備份**：確認 `Wuzuo Note` 已產生 `[一鍵生成]` 標題之條目。
- [ ] **透明度檢查**：確認 Typst 內容中包含對應的 5T 驗算公式。
- [ ] **資產化確認**：確認 impactMetric 已正確反映提取之數值。

## ⚠️ 異常處理 (Exception Path)
- 若 OCR 信心值低於 0.6，必須標記「人工核閱」標籤。
- 若 5T 封印失敗，禁止執行下載動作。
