# esggo_mvp v1.0.0 系統架構與操作說明書
發佈日期：2026-03-18
核心版本：JunAiKey OmniCore v1.0.0
首席架構師：鼎竣 (DingJun Hong)
GitHub Repo: esggo_mvp

## 🏛一、 系統五大支柱 (The 5T Architecture)

本系統的核心設計是為了消除永續報告書編製過程中的「熵增」（混亂與錯誤），並建立不可篡改的「信」。

| 支柱 | 核心定義 | 實作技術 | 智能標籤 |
| :--- | :--- | :--- | :--- |
| **真 (Truth)** | 每筆數據必有原始起點 | source_origin 追蹤與 Zod 契約驗證 | `#全知之眼` |
| **善 (Goodness)** | 算法公開，零幻覺驗算 | [ISO-14064-1] 標準算法與日誌標註 | `#原罪煉金` |
| **美 (Beauty)** | 極簡光學與動態回饋 | 「液態玻璃」質感 UI 與狀態機交互 | `#極致美學` |
| **信 (Trust)** | 數據寫入即刻執行 Hash Lock | SHA-256 數位指紋與 is_frozen 狀態鎖 | `#神聖契約` |
| **通 (Transferful)** | 無縫數據流與自動巡航 | 符文 API 閘道與 ADK 代理網絡 | `#量子刻印` |

## ⚙二、 核心模塊說明 (MECE 架構)

### 1. 記憶聖所 (NCBDB Database)
- **職責**：存儲具備 IComponentCore 規範的結構化數據。
- **關鍵欄位**：uuid (唯一碼)、payload (指標數據)、evidence (證據庫)、is_frozen (鎖定開關)。

### 2. 符文 API 閘道 (Rune Gateway)
- **職責**：擔任「降熵者」，對外部輸入進行「本質提純」。
- **機制**：接收 JSON ➔ Zod 驗證 ➔ 注入 timestamp 與 hash_signature ➔ 寫入 NCBDB。

### 3. ADK 代理網絡 (Agent Network)
- **職責**：自動化巡航，將混亂的憑證轉化為真理。
- **排程**：每日 23:00 啟動深夜煉金，執行 OCR 解析與自動刻印。

### 4. 極簡光學看板 (Visual Dashboard)
- **職責**：透明化呈現。
- **功能**：即時數據流顯示、證據鏈一鍵溯源、Hash 鎖狀態視覺化。

## 📜三、 操作指南 (Operator Manual)

### 1. 手動降熵 (Manual Forge)
- 進入首頁，將憑證圖片拖入「液態玻璃」區域。
- 確認 ADK 小隊解析出的數據無誤後，點擊 **「執行 1-Click 萬能刻印」**。

### 2. 數據確信 (Auditing)
- 在歷史看板中點擊任一卡片。
- 核對 Hash 指紋 是否與原始單據吻合。
- 點擊 Evidence 連結，系統將自動開啟 `source_origin` 原始憑證。

### 3. 系統進化 (Evolution)
- 每週一查看「進化日誌」，了解上週 ADK 小隊解析失敗的「高熵節點」。
- 根據系統建議調整 RuneContract 或優化 Prompt。

## 🛡️四、 永恆公約 (The Eternal Covenant)

1. **禁區原則**：一旦 `is_frozen` 為 true，該數據節點永久不可修改。
2. **證據原則**：無 `source_origin` 之數據不予刻印。
3. **透明原則**：所有計算公式必須在 Transparent 模塊中可查閱。

> *"我們不編寫代碼，我們締結神聖架構契約。"*
