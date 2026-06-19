# 🏛️ InfoOne 萬能永續報告中心 (SRC) 完整功能說明書

> **版本**: v10.5.0-Stabilized
> **密級**: Core Confidential
> **核心哲學**: 「服務即教學，知識即資產」
> **系統狀態**: [TRANSCENDED & PERSISTENT] ♾️

---

## 一、 專案願景與核心價值
萬能永續報告中心 (Sustainable Report Center, SRC) 不僅是一個數據生成工具，更是 InfoOne 生態系中的「影響力煉金爐」。它將企業分散的 ESG 數據提純為符合國際標準、具備法律證據力的「知識資產」。

### 1.1 「英碼繁博」設計準則
*   **導航準則**: 所有標題與導航採用專業英文，確保國際技術接軌。
*   **內容準則**: 詳細說明與邏輯解析採用繁體中文，確保理解的深度與精確度。

### 1.2 上善若水 (#63a6b0) 主題
*   **視覺設計**: 採用 Aqua 青色調，象徵數據的流動性、透明度與包容性。
*   **心理模型**: 液態玻璃介面 (Liquid Glass)，提供無阻力的沉浸式編輯體驗。

---

## 二、 5T 核心協議 (5T Protocol)
SRC 生成的所有報告必須通過 5T 門鑑，轉化為不可篡改的「知識結晶」。

| 協議維度 | 技術實作 | 商業價值 |
| :--- | :--- | :--- |
| **Tangible (可感知)** | 高保真雜誌風 UI / 數據視覺化 | 品牌影響力具現化 |
| **Traceable (可溯源)** | 原生 Hash 鎖定 `source_origin_hash` | 徹底杜絕綠洗 (Greenwashing) |
| **Trackable (可追蹤)** | 生命週期 Hook `lifecycle_events` | 完整數據流轉與修改紀錄 |
| **Transparent (可驗算)** | 算法邏輯透明揭露 / 零幻覺驗算 | 建立數據信任的絕對標準 |
| **Trustworthy (不可篡改)** | SHA-256 簽名封印 & NCB 永恆存檔 | 知識資產的終極保證 |

---

## 三、 四大核心功能模組

### 3.1 AI 智能引導精靈 (Sentient AI Wizard)
*   **分章節引導**: 基於 GRI 2026 標準，AI 主動提示章節寫作重點。
*   **三路織稿 (Option Weaker)**: 
    *   *保守路徑*: 聚焦合規與準確度。
    *   *進取路徑*: 突顯企業社會責任與競爭優勢。
    *   *願景路徑*: 結合長期氣候藍圖與轉型敘事。
*   **智能防抖/預測**: 實時自動儲存於「無作妙德 (WuzuoNote)」草稿庫。

### 3.2 24 項 MECE 服務矩陣整合
*   **自動化指標採集**: 透過 `OmniAPI` 無縫對接 24 項 MECE 服務（環境、社會、治理、代理）。
*   **智能指標對應**: 自動將數據匹配至台灣金管會 (FSC) 97 項指標及 SASB 標準。

### 3.3 5T 證據公文包 (Evidence Drawer)
*   **單據自動化**: 拖放公用事業帳單 (PDF/Image)，AI 自動提取數據 (kWh, m3)。
*   **證據鏈結**: 每項報告數據均可「點擊溯源」至原始憑證 (Vouchers)。

### 3.4 全球基準對標 (Global Benchmarking)
*   **同業審視**: 內建模組分析 5 家同業、3 個國際最佳典範，給予實質策略改善建議。
*   **IntelGuardian 監控**: 實時監測全球監管動態（如 CBAM, TCFD 更新）。

---

## 四、 技術架構與安全性

### 4.1 資料庫與持久化 (NCB Layer)
*   **NoCodeBackend**: 採用生產級 `54686_esg_go_mvp_v13` 實例，確保數據的高可用性與分散式儲存。
*   **RLS 策略**:
    *   `evidence_vault`: `shared_read` (內部協作) + `public_read` (公眾審核)。
    *   `sustainability_reports`: `private` (僅限所有者)。

### 4.2 高性能快取 (OmniCache)
*   **雙層架構**: 
    *   **L1 (In-Memory)**: 極速本地快取（回應時間 < 5ms）。
    *   **L2 (Redis)**: 基於 `ioredis` 的分散式快取，確保重新啟動後狀態不丟失。

### 4.3 哨兵防禦系統 (Sentinel Shield)
*   **API 頻率限制 (Rate Limiting)**: 針對不同等級（一般請求/敏感操作/AI 生成）實施精準流量控制。
*   **邊緣防禦 (Middleware)**: 強制執行 HSTS, CSP, XSS-Shield 等安全標頭。

---

## 五、 標準寫作流程 (The Virtuous Forging Flow)

1.  **數據啟動 (Inception)**: 觸發 `OmniAPI` 獲取跨領域指標。
2.  **靈魂織稿 (Synthesis)**: 透過 Wizard 選擇權重與語氣，生成初稿。
3.  **聖殿審計 (Audit)**: Gemini Pro 執行 97 指標合規性檢索與邏輯審核。
4.  **資產鎖定 (Sealing)**: 執行 `ReportService.seal()`，生成 SHA-256 數位簽章。
5.  **能量釋放 (Publication)**: 發布高保真網頁版、PDF 報告書，並於 Evidence Vault 完成存證。

---

## 六、 結語：善向永續 (Virtuous Era)
萬能永續報告中心不僅完成報告，它正在完成一種**進化**。
**「服務即教學，知識即資產。」**
在 SRC 的每一次操作，都是在構築企業永恆的數位誠信價值。

---
**核准人**: 技術開發團隊 / 壽司博士 Dr. Thoth
**日期**: 2026年2月26日
**系統狀態**: [STABILIZED & SECURED] 🛡️
