# Sustainability Report Center - UI/UX Design Specification (v8.5.0)

## 🎨 視覺風格：液態玻璃 (Liquid Glass)
基於「上善若水」哲學，介面應呈現如水般清澈、透明且具備動態流動感的視覺體驗。

### 核心色彩 (Color Tokens)
*   **Primary (Aqua Cyan)**: `#63a6b0` - 核心主色，象徵永續與智慧。
*   **Accent (Eternal Gold)**: `#ffd700` - 輔助色，用於成就、XP 與關鍵高亮。
*   **Surface (Translucent Slate)**: `rgba(5, 12, 20, 0.6)` - 玻璃卡片底色。
*   **Glow (Cyan Aura)**: `rgba(99, 166, 176, 0.4)` - 懸停與啟動態的光量。

---

## 🏛️ 場景一：Sensei Academy (服務即教學)
![Sensei Academy Mockup](sensei_academy_mockup_1770246836584.png)

### UX 邏輯
1.  **沉浸式導軌**：將 GRI/TCFD 章節轉化為「修煉模組」。
2.  **即時反饋**：每完成一個小節，進度條（Liquid Progress）會以波紋效果填充。
3.  **導師語錄**：在側邊欄隨機顯示 `Dr. Thoth` 的 ESG 智慧語錄，強化教學屬性。

---

## ⚡ 場景二：One-Click Wizard (高效資產生成)
![One-Click Wizard Mockup](one_click_report_wizard_1770246868056.png)

### UX 邏輯
1.  **Wizard 導向**：採用四步走流程（數據 -> 框架 -> AI 審核 -> 發布）。
2.  **AI 預覽**：在生成前提供指標預覽圖，讓用戶感知「數據即資產」。
3.  **動態光環**：當 AI 正在處理內容時，中心按鈕呈現脈衝光環效應。

---

## 🏆 場景三：Advancement Hall (晉級殿堂)
![Advancement Hall Mockup](advancement_hall_mockup_1770246949216.png)

### UX 邏輯
1.  **5T 勳章牆**：所有通過 5T 協議驗證的報告書都將獲得專屬勳章。
2.  **等級躍遷**：當用戶從 Apprentice 晉升至 Practitioner 時，全螢幕觸發「水華」視覺慶祝特效。
3.  **權限開放**：清晰顯示下一等級解鎖的權限（如：API 存取、專家模板）。

---

## ✍️ 實作標準 (Implementation Guidelines)
*   **Blur**: 所有背景模糊係數統一設置為 `backdrop-blur-xl` (24px)。
*   **Border**: 採用細邊框 `border-white/10` 模擬玻璃邊緣反光。
*   **Motion**: 使用 `framer-motion` 實現 Staggered Children 進入效果。
