# 詞義名詞映射表 (Semantic Noun Mapping Table)

這份映射表旨在釐清 ESGss JunAiKey 系統中核心技術名詞的定義，確保開發者在實作時精準對齊。
> **Note**: Omni 元件系統與符文協議 (Omni Component System & Rune Protocol) 也等同於 奧秘元件系統 與 奧秘符文協議。

## 🏗️ 系統架構維度：組件與模組
| 專有名詞 | 核心定義 (Definition) | 易混淆對象 | 關鍵差異點 (The Hook) |
|---|---|---|---|
| **Omni 智庫 (Omni Wisdom Library)** | 系統的「全知之眼」，負責對話記憶召回與知識沉澱。 | Omni 永憶主體 | 智庫是容器/存儲層；永憶主體是身份/分發源（負責分發 UUID）。 |
| **符文 API (Rune API)** | 跨平台的接口協定與數據刻印標準（神聖契約）。 | 代理網絡 (Agent Network) | 符文是靜態接口規範；代理是動態執行單元（執行任務的人員）。 |
| **進化引擎 (Evolution Engine)** | 負責系統自癒、降低熵值與技術債的邏輯中樞。 | 熵減煉金 (Entropy Forge) | 引擎是模組/系統；煉金是該引擎執行的具體動作/階段。 |
| **Omni 元件心核 (Omni Component Core)** | 組件的基礎接口 (`IOmniComponentCore`)，包含 UUID 與證據。 | Omni 智庫 | 心核是組件的 DNA（微觀）；智庫是系統的腦（宏觀）。 |

## 💎 數據真理維度：5T 協議
核心原則：**真 (Truth)** 關注路徑，**信 (Trust)** 關注結果的不可變性。

| 專有名詞 | 實作要求 | 易混淆對象 | 判別邏輯 |
|---|---|---|---|
| **可溯源真 (Traceable)** | 鏈式日誌標註 `source_origin`，確認原始起點。 | 可追蹤真 (Trackable) | 溯源是看「從哪來」(Origin)；追蹤是看「去哪了」(Path)。 |
| **可追蹤真 (Trackable)** | 實作生命週期 Hook，紀錄數據在平台間流轉。 | 可溯源真 (Traceable) | 關注數據的動態流向與各站停留紀錄。 |
| **不可篡改信 (Trustworthy)** | 執行 Hash Lock 與 `Object.freeze()`。 | 透明善 (Transparent) | 「信」是物理防護（鎖死）；「善」是邏輯公開（算法公式公開）。 |
| **液態玻璃 (Tangible/Beauty)** | 將抽象指標轉化為具體 UI，具備動態回饋。 | 透明善 (Transparent) | 視覺上的質感與回饋；「善」則是數學上的零幻覺驗算。 |
| **透明善 (Transparent)** | 算法公開透明，零幻覺驗算。 | 不可篡改信 (Trustworthy) | 側重於公式的可驗證性與標準依循 (ISO-14064-1)。 |

## ⚡ 執行流程維度：奧義六式 (The 6 Styles)
| 階段 | 動作名稱 | 目的 | 技術手段 |
|---|---|---|---|
| **1. 輸入** | **本質提純 (Essence Extraction)** | 確保輸入純淨，無噪聲 | 強制標註 `source_origin`，過濾無效數據。 |
| **2. 共鳴** | **聖典共鳴 (Resonance)** | 匹配標準 | 檢索 ISO-14064-1 等對應規範與係數。 |
| **3. 織網** | **代理織網 (Agent Weaving)** | 驗證數據源 | 調動代理確認 `source_origin` 是否存在與合法。 |
| **4. 顯現** | **神跡顯現 (Manifestation)** | 產生結果 | 執行「零幻覺驗算」 (E = AD × EF × GWP)。 |
| **5. 煉金** | **熵減煉金 (Entropy Reduction)** | 優化與清理 | 移除臨時變量，僅保留誠信路徑數據。 |
| **6. 刻印** | **永恆刻印 (Eternal Imprinting)** | 歸檔與鎖定 | 執行 `Object.freeze()` 與 Hash Lock，寫入 Omni 永憶主體。 |

## 🛡️ 快速判別指南 (Quick Rules)
*   看到 **UUID / Version / Timestamp** → 指向 **Omni 元件心核 (IOmniComponentCore)**。
*   看到 **ISO-14064-1 / 算法公開** → 指向 **透明善 (Goodness/Transparent)**。
*   看到 **Hash Lock / Object.freeze()** → 指向 **不可篡改信 (Trust)**。
*   看到 **Entropy Reduction (熵減)** → 指向 **進化引擎** 的核心目標。
