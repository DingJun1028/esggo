# 🏛️ OmniHermes 系統 + ESG Go 系統 — 平台品牌風格元素規格書 v1.1

> **Platform:** OmniHermes + ESG Go | **Version:** 8.5.1-Alpha | **Framework:** Berkeley Haas × TSISDA × 5T Protocol

---

## 1. 專案概觀 (Project Overview)

| 欄位 | 內容 |
|------|------|
| **專案名稱** | OmniHermes 系統 + ESG Go 系統 (Goodward Sustainability Terminal with Omni-Agent) |
| **系統代號** | Omni_Terminal v8.5.1-Alpha |
| **目標對象** | 台灣中小企業 ESG 負責人、永續委員會、稽核師、投資人 |
| **設計目標** | 5T 誠信協議視覺化、GRI 合規操作直覺化、Omni-Agent 智能協作透明化 |
| **支援平台** | ✅ Web (Responsive) ✅ Mobile (PWA) |
| **設計哲學** | Liquid Glass · Bento Grid · Berkeley Academic Precision |
| **核心協議** | 5T Integrity Protocol (Tangible · Traceable · Trackable · Transparent · Trustworthy) |

---

## 2. 視覺風格定義 (Visual Identity)

### 2.1 色彩規範 (Color Palette)

#### 主品牌色系 — Berkeley Academic

| 類別 | Token Name | 色碼 (HEX) | RGB | 用途描述 |
|------|-----------|-----------|-----|---------|
| **主色 Primary** | `--color-berkeley-blue` | `#003262` | rgb(0,50,98) | 側邊欄背景、主要按鈕、品牌識別核心 |
| **強調金 Accent** | `--color-california-gold` | `#FDB515` | rgb(253,181,21) | 活躍選單項目、5T 封印標識、CTA 按鈕 |
| **輔助藍 Secondary** | `--color-founders-rock` | `#3B7EA1` | rgb(59,126,161) | 副標題、連結文字、資訊徽章 |
| **深藍 Dark** | `--color-berkeley-dark` | `#1A3A5C` | rgb(26,58,92) | 卡片背景深色變體 |
| **淺藍 Light** | `--color-sather-gate` | `#B9D9EB` | rgb(185,217,235) | 背景淡染、表格行間隔 |

#### 功能語義色系 — 5T Protocol Status

| 5T 門徑 | Token Name | 色碼 (HEX) | 用途描述 |
|--------|-----------|-----------|---------|
| **T1 Tangible** | `--t1-tangible` | `#10B981` | 可感知指標已具體化 · 成功狀態 |
| **T2 Traceable** | `--t2-traceable` | `#3B7EA1` | 可溯源鏈式日誌 · 資訊標記 |
| **T3 Trackable** | `--t3-trackable` | `#8B5CF6` | 可追蹤生命週期 · 流轉路徑 |
| **T4 Transparent** | `--t4-transparent` | `#F59E0B` | 可透明驗算 · 警示/需確認 |
| **T5 Trustworthy** | `--t5-trustworthy` | `#003262` | 不可篡改 Hash Lock · 終極封印 |

#### 語義功能色系 — System States

| 類別 | 色碼 (HEX) | RGBA (Glass版) | 用途描述 |
|------|-----------|--------------|---------|
| **成功 Success** | `#22C55E` | `rgba(34,197,94,0.15)` | 驗證通過、ZKP 封印成功、指標達標 |
| **警告 Warning** | `#F59E0B` | `rgba(245,158,11,0.15)` | 綠漂風險偵測、數據待確認 |
| **錯誤 Error** | `#EF4444` | `rgba(239,68,68,0.15)` | 驗證失敗、合規缺口嚴重 |
| **資訊 Info** | `#06B6D4` | `rgba(6,182,212,0.15)` | 系統通知、情報更新 |
| **中性 Neutral** | `#6B7280` | `rgba(107,114,128,0.15)` | 停用狀態、次要資訊 |

#### 背景層次系統 (Background Hierarchy)

| 層次 | Token | 色碼/值 | 說明 |
|------|-------|--------|------|
| **Layer 0 — Void** | `--bg-void` | `#F8F9FA` | 頁面最底層背景 |
| **Layer 1 — Surface** | `--bg-surface` | `#FFFFFF` | 卡片、模組背景 |
| **Layer 2 — Elevated** | `--bg-elevated` | `rgba(255,255,255,0.85)` | 浮起元素、側邊欄 |
| **Layer 3 — Overlay** | `--bg-overlay` | `rgba(0,50,98,0.08)` | Modal 遮罩底層 |
| **Glass Surface** | `--glass-surface` | `rgba(255,255,255,0.7)` | 玻璃擬態卡片 |
| **Glass Border** | `--glass-border` | `rgba(0,50,98,0.12)` | 玻璃卡片邊框 |

---

### 2.2 字體規範 (Typography)

#### 字型家族 (Font Families)

| 用途 | 字型名稱 | 備用字型 |
|------|---------|---------|
| **主要標題** | `Inter` | `system-ui, -apple-system` |
| **中文內容** | `Noto Sans TC` | `PingFang TC, Microsoft JhengHei` |
| **數據/代碼** | `JetBrains Mono` | `Fira Code, Consolas` |
| **品牌 Logo** | `Inter Black` | `Arial Black` |

#### 字型比例尺 (Type Scale)

| 層級 | 元素 | 尺寸 | 字重 | 行高 | 字距 | 用途 |
|------|------|------|------|------|------|------|
| **Display** | 品牌大標 | `48px / 3rem` | `900 Black` | `1.1` | `-0.02em` | 登入頁英雄區 |
| **H1** | 頁面主標 | `32px / 2rem` | `700 Bold` | `1.2` | `-0.01em` | 模組頁面標題 |
| **H2** | 區塊標題 | `24px / 1.5rem` | `600 Semi-Bold` | `1.3` | `-0.005em` | 卡片標題、章節標 |
| **H3** | 子標題 | `18px / 1.125rem` | `600 Semi-Bold` | `1.4` | `0` | 表單區塊標題 |
| **H4** | 標籤標題 | `14px / 0.875rem` | `700 Bold` | `1.4` | `0.08em uppercase` | 導覽群組標籤 |
| **Body L** | 主文大 | `16px / 1rem` | `400 Regular` | `1.6` | `0` | 說明文字、內文 |
| **Body** | 主文 | `14px / 0.875rem` | `400 Regular` | `1.5` | `0` | 一般內文、表格 |
| **Body S** | 主文小 | `13px / 0.8125rem` | `400 Regular` | `1.5` | `0` | 次要說明 |
| **Caption** | 說明文 | `12px / 0.75rem` | `400 Regular` | `1.4` | `0` | 提示、腳注 |
| **Overline** | 上標字 | `11px / 0.6875rem` | `700 Bold` | `1.4` | `0.1em uppercase` | 類別標記、微型標題 |
| **Mono** | 數據字 | `13px / 0.8125rem` | `500 Medium` | `1.4` | `0` | Hash值、數字數據 |

---

## 3. 元件庫規範 (Component Library)

### 3.1 按鈕系統 (Button System)

| 類型 | 背景 | 文字 | 邊框 | Hover | 用途 |
|------|------|------|------|-------|------|
| **Primary** | `#003262` | `#FDB515` | 無 | `bg: #1A3A5C, scale: 1.02` | 主要操作、5T 封印 |
| **Secondary** | `#FDB515` | `#003262` | 無 | `bg: #FCC136, shadow: 0 4px 12px rgba(253,181,21,0.3)` | 次要強調操作 |
| **Ghost** | `transparent` | `#003262` | `1px #003262` | `bg: rgba(0,50,98,0.08)` | 取消、次要選項 |
| **Danger** | `transparent` | `#EF4444` | `1px #EF4444` | `bg: rgba(239,68,68,0.1)` | 刪除、警告操作 |
| **Success** | `rgba(34,197,94,0.1)` | `#16A34A` | `1px #22C55E` | `bg: rgba(34,197,94,0.2)` | 驗證通過確認 |
| **Glass** | `rgba(255,255,255,0.7)` | `#003262` | `1px rgba(0,50,98,0.15)` | `backdrop-blur 增強` | 卡片內按鈕 |

#### 按鈕尺寸

| 尺寸 | Padding | 字型 | 圓角 | 最小高度 | 用途 |
|------|---------|------|------|---------|------|
| **XL** | `16px 32px` | `16px` | `12px` | `56px` | 登入頁 CTA |
| **L** | `12px 24px` | `14px` | `10px` | `48px` | 主要操作區 |
| **M** | `8px 16px` | `14px` | `8px` | `44px` | 一般操作按鈕 (WCAG AA) |
| **S** | `6px 12px` | `12px` | `6px` | `36px` | 表格行內操作 |
| **Icon** | `8px` | — | `8px` | `44px` | 圖示按鈕 (WCAG AA) |

#### 按鈕狀態

| 狀態 | 視覺效果 |
|------|---------|
| **Normal** | 基礎樣式 |
| **Hover** | `translateY(-1px)` + 陰影增強 |
| **Focus** | `outline: 2px solid #FDB515, offset: 2px` |
| **Active** | `translateY(0)` + 亮度降低 10% |
| **Disabled** | `opacity: 0.4, cursor: not-allowed` |
| **Loading** | 文字替換為 Spinner + 文字 |

---

### 3.2 徽章/標籤系統 (Badge & Tag System)

| 類型 | 色碼 | 背景 | 用途 |
|------|------|------|------|
| **GRI 標準** | `#003262` | `rgba(0,50,98,0.1)` | GRI 準則標記 |
| **5T-T1** | `#10B981` | `rgba(16,185,129,0.1)` | Tangible 可感知 |
| **5T-T2** | `#3B7EA1` | `rgba(59,126,161,0.1)` | Traceable 可溯源 |
| **5T-T3** | `#8B5CF6` | `rgba(139,92,246,0.1)` | Trackable 可追蹤 |
| **5T-T4** | `#F59E0B` | `rgba(245,158,11,0.1)` | Transparent 可透明 |
| **5T-T5** | `#003262` | `rgba(0,50,98,0.15)` | Trustworthy 不可篡改 |
| **ZKP 驗證** | `#6366F1` | `rgba(99,102,241,0.1)` | ZKP 零知識證明 |
| **緊急/高衝擊** | `#EF4444` | `rgba(239,68,68,0.1)` | 高優先緊急事項 |
| **已驗證** | `#22C55E` | `rgba(34,197,94,0.1)` | 已完成驗證狀態 |
| **待處理** | `#F59E0B` | `rgba(245,158,11,0.1)` | 等待審核中 |

---

### 3.3 卡片系統 (Card System — Bento Grid)

#### 玻璃卡片規範 (Glass Card Specification)

```css
.card-glass {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(0, 50, 98, 0.08);
  border-radius: 16px;
  box-shadow:
    0 1px 3px rgba(0,0,0,0.04),
    0 4px 12px rgba(0,50,98,0.06),
    inset 0 1px 0 rgba(255,255,255,0.9);
  padding: 24px;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.card-glass:hover {
  transform: translateY(-2px);
  box-shadow:
    0 4px 6px rgba(0,0,0,0.06),
    0 12px 24px rgba(0,50,98,0.1);
  border-color: rgba(0, 50, 98, 0.15);
}
```

#### KPI 卡片結構

| 元素 | 規格 |
|------|------|
| **圖示** | 40×40px，圓角 10px，品牌色背景 |
| **數值** | `32px Bold JetBrains Mono` |
| **單位** | `14px Regular` 灰色 |
| **趨勢** | 綠色上箭頭 / 紅色下箭頭 + 百分比 |
| **標題** | `12px Uppercase Bold` 灰色 |
| **底部** | GRI 參考標籤 |
| **互動** | 點擊展開計算公式 + 數據來源 + 細項分解 |

---

### 3.4 表單元件 (Form Elements)

| 元件 | 正常狀態 | Focus 狀態 | Error 狀態 | 高度 |
|------|---------|-----------|-----------|------|
| **Input** | `border: 1px solid #E5E7EB` | `border: 2px solid #003262, shadow: 0 0 0 3px rgba(0,50,98,0.15)` | `border: 2px solid #EF4444, shadow: 0 0 0 3px rgba(239,68,68,0.15)` | `44px (WCAG AA)` |
| **Select** | 同 Input | 同 Input | 同 Input | `44px` |
| **Textarea** | 同 Input + `min-height: 120px` | 同 Input | 同 Input | `auto` |
| **Checkbox** | `border: 2px solid #D1D5DB` | 選中時 `bg: #003262` | `border: 2px solid #EF4444` | `20×20px` |
| **Radio** | `border: 2px solid #D1D5DB` | 選中時圓點 `bg: #003262` | `border: 2px solid #EF4444` | `20×20px` |
| **Toggle** | `bg: #E5E7EB` | `bg: #003262` (ON) | — | `24×44px` |

---

### 3.5 圖示規範 (Icons)

| 規格項目 | 規格值 |
|---------|-------|
| **圖示庫** | Lucide React (首選) |
| **尺寸 S** | `16×16px` — 行內圖示、標籤 |
| **尺寸 M** | `20×20px` — 按鈕圖示、導覽 |
| **尺寸 L** | `24×24px` — 卡片標題圖示 |
| **尺寸 XL** | `32×32px` — 頁面標題圖示 |
| **尺寸 Hero** | `48×48px` — 模組封面圖示 |
| **線寬** | `1.5px (Lucide 預設)` |
| **色彩** | 繼承父元素顏色 (`currentColor`) |

#### 核心功能圖示對應

| 功能 | 圖示 | 說明 |
|------|------|------|
| 5T 封印 | `Shield` | 資料保護、不可篡改 |
| ZKP 驗證 | `Lock` | 零知識證明 |
| GRI 合規 | `CheckCircle` | 國際標準達標 |
| 碳排放 | `Leaf` | 環境指標 |
| 稽核日誌 | `Activity` | 追蹤記錄 |
| 任務中心 | `ClipboardList` | 任務管理 |
| 數位分身 | `Fingerprint` | 身份知識庫 |
| AI 諮詢 | `Brain` | 智慧代理 |
| 證據金庫 | `Database` | 文件存證 |
| 發布報告 | `FileText` | 永續報告書 |
| 商情中心 | `BarChart2` | 情報分析 |
| 健檢評估 | `Heart` | ESG 健康檢查 |

---

## 4. 佈局與網格 (Layout & Grid)

### 4.1 斷點定義 (Breakpoints)

| 名稱 | 範圍 | 佈局策略 |
|------|------|---------|
| **Mobile XS** | `< 480px` | 單欄、底部導覽列 |
| **Mobile** | `480px — 767px` | 單欄、底部導覽列 |
| **Tablet** | `768px — 1023px` | 雙欄 + 收合側邊欄 |
| **Desktop** | `1024px — 1279px` | 側邊欄 + 主內容 12欄網格 |
| **Desktop L** | `1280px — 1535px` | 側邊欄展開 + 主內容 |
| **Desktop XL** | `≥ 1536px` | 最大寬度限制 `1920px` |

### 4.2 側邊欄規範 (Sidebar Specification)

| 狀態 | 寬度 | 行為 |
|------|------|------|
| **展開** | `280px` | 顯示圖示 + 文字 + 群組標籤 |
| **收合** | `72px` | 僅顯示圖示，Tooltip 提示 |
| **Mobile** | `100vw` | Drawer 覆蓋式 |
| **過渡** | `300ms ease-in-out` | 寬度平滑變化 |

### 4.3 主內容區域

| 規格 | 值 |
|------|---|
| **頂部安全距離** | `24px` |
| **底部安全距離** | `24px` |
| **頁面內邊距** | `24px (Mobile: 16px)` |
| **卡片間距** | `16px — 24px` |
| **最大內容寬度** | `1440px` |

### 4.4 間距系統 (Spacing System — 8px Base)

| Token | 值 | 用途 |
|-------|---|------|
| `spacing-1` | `4px` | 元素內部微間距 |
| `spacing-2` | `8px` | 緊密相關元素 |
| `spacing-3` | `12px` | 元件內部間距 |
| `spacing-4` | `16px` | 元件間標準間距 |
| `spacing-6` | `24px` | 區塊標準間距 |
| `spacing-8` | `32px` | 大區塊分隔 |
| `spacing-12` | `48px` | 頁面區段分隔 |
| `spacing-16` | `64px` | 頁面大區段 |

### 4.5 圓角規範 (Border Radius)

| Token | 值 | 用途 |
|-------|---|------|
| `radius-sm` | `4px` | 徽章、小型元素 |
| `radius-md` | `8px` | 按鈕、輸入框 |
| `radius-lg` | `12px` | 卡片、下拉選單 |
| `radius-xl` | `16px` | 主要卡片容器 |
| `radius-2xl` | `20px` | 側邊欄、大型面板 |
| `radius-full` | `9999px` | 圓形圖示、標籤 |

---

## 5. 交互與動效 (Interaction & Animation)

### 5.1 過渡時間 (Duration)

| 場景 | 時間 | 緩動 |
|------|------|------|
| **微互動** (Hover, Focus) | `150ms` | `ease-out` |
| **元件展開/收合** | `200ms` | `ease-in-out` |
| **頁面切換** | `300ms` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| **側邊欄展開** | `300ms` | `ease-in-out` |
| **Modal 開啟** | `250ms` | `ease-out` |
| **Toast 通知** | `200ms` 進入 / `150ms` 離開 | `ease-in-out` |
| **5T 封印動畫** | `800ms — 2000ms` | 分段動畫 |
| **ZKP 驗算動畫** | `1500ms — 3000ms` | 步驟式進度 |

### 5.2 動效規格

| 效果 | 規格 |
|------|------|
| **卡片懸停** | `translateY(-2px) + box-shadow 增強` |
| **按鈕按下** | `translateY(1px) + brightness(0.95)` |
| **頁面進入** | `opacity: 0→1 + translateY(8px→0)` |
| **骨架屏** | `shimmer animation 1.5s infinite` |
| **5T 進度環** | `stroke-dashoffset 動畫` |
| **數字計數** | `countUp 動畫 1000ms ease-out` |

### 5.3 讀取狀態 (Loading States)

| 類型 | 實作方式 |
|------|---------|
| **頁面初始** | Skeleton Screen 骨架屏 |
| **數據刷新** | 局部 Skeleton |
| **按鈕提交** | Loading Spinner + 禁用 |
| **AI 生成** | 流式文字輸出動畫 |
| **ZKP 計算** | 4步驟進度條動畫 |
| **上傳文件** | 進度條 + 百分比 |

### 5.4 回饋機制 (Feedback Mechanisms)

| 操作類型 | 回饋方式 | 持續時間 |
|---------|---------|---------|
| **成功操作** | 右上角 Toast ✅ 綠色 | `3秒` 後消失 |
| **警告提示** | 右上角 Toast ⚠️ 黃色 | `5秒` 後消失 |
| **錯誤提示** | 右上角 Toast ❌ 紅色 | 手動關閉 |
| **危險操作** | Modal 確認對話框 | 等待確認 |
| **5T 封印完成** | 全屏 Modal + 封印動畫 | 手動關閉 |
| **表單錯誤** | 欄位行內紅色提示 | 修正後消失 |

---

## 6. 導覽架構 (Navigation Architecture)

### 6.1 側邊欄群組結構

| 群組 | 項目 |
|------|------|
| **CORE 核心** | 控制台、永續撰寫、數位分身、企業健檢、商情中心 |
| **E · S · G 模組** | 環境指揮、社會影響、公司治理 |
| **GOVERNANCE 治理** | 重大性矩陣、審計日誌、證據金庫 |
| **INSIGHTS 洞察** | 淨零路線圖、VerifyLink™、報告發布、永續閱覽室、供應鏈透明、永續財務、利害關係人 |
| **ACADEMY 學院** | 永續學院、顧問服務 |
| **HERMES AI** | Agent 調度、架構治理 |
| **SYSTEM 系統** | 任務中心、企業管理、AI 平台、整合中心、元件庫 |

### 6.2 行動版底部導覽 (Mobile Bottom Navigation)

| 位置 | 圖示 | 功能 |
|------|------|------|
| 1 | `Home` | 控制台 |
| 2 | `FileText` | 永續撰寫 |
| 3 | `Database` | 證據金庫 |
| 4 | `BarChart3` | 商情中心 |
| 5 | `ClipboardList` | 任務中心 |
| + | `Menu` | 更多 (展開全導覽) |

---

## 7. 5T 協議視覺規範 (5T Protocol Visual System)

### 7.1 5T 狀態條 (T5 Strip)

```
[ T1 Tangible ✓ ] [ T2 Traceable ✓ ] [ T3 Trackable ✓ ] [ T4 Transparent ✓ ] [ T5 Trustworthy 🔒 ]
```

| 狀態 | 顏色 | 圖示 |
|------|------|------|
| 待完成 | `#9CA3AF (灰)` | `○` |
| 進行中 | `#F59E0B (黃)` | `◐` |
| 通過 | `#22C55E (綠)` | `✓` |
| 封印 | `#003262 (深藍)` | `🔒` |

### 7.2 Hash Lock 顯示規範

```
┌─────────────────────────────────────────┐
│ SHA-256: a3f8c2d1...e94b7021            │
│ 封印時間: 2025-05-15 14:32:18 +08:00   │
│ 狀態: Trustworthy ✓                    │
└─────────────────────────────────────────┘
```

字型: `JetBrains Mono 12px` | 背景: `rgba(0,50,98,0.05)` | 邊框: `1px solid rgba(0,50,98,0.15)`

---

## 8. GRI 合規標籤系統 (GRI Compliance Tag System)

| 類別 | 格式 | 範例 |
|------|------|------|
| **GRI 通用揭露** | `GRI X-Y` | `GRI 2-7` |
| **環境準則** | `GRI 3XX-X` | `GRI 305-1` |
| **社會準則** | `GRI 4XX-X` | `GRI 401-1` |
| **TCFD 支柱** | `TCFD 柱名` | `TCFD 治理` |
| **ISSB 標準** | `ISSB SX` | `ISSB S2` |
| **ISO 認證** | `ISO XXXXX-X` | `ISO 14064-1` |
| **金管會規範** | `金管會` | `金管會 強制` |

---

## 9. AI 代理人格視覺系統 (SPIRIT Personas Visual)

| Persona | 顏色 | 圖示 | 簡介 |
|---------|------|------|------|
| **合規守衛 Compliance** | `#003262 深藍` | `ShieldCheck` | 指標對齊與風險控管 |
| **共榮引導 Harmony** | `#10B981 翠綠` | `Users` | 利害關係人與文化視角 |
| **創新先行 Innovation** | `#8B5CF6 紫色` | `Lightbulb` | 永續技術與轉型方案 |
| **Berkeley 導師** | `#FDB515 金色` | `GraduationCap` | 學術框架與最佳實踐 |

---

## 10. 資料視覺化規範 (Data Visualization)

### 10.1 圖表色序 (Chart Color Sequence)

```
1st: #003262  (Berkeley Blue)
2nd: #FDB515  (California Gold)
3rd: #3B7EA1  (Founders Rock)
4th: #10B981  (Emerald Green)
5th: #8B5CF6  (Violet)
6th: #F59E0B  (Amber)
7th: #EF4444  (Red)
8th: #06B6D4  (Cyan)
```

### 10.2 圖表類型對應

| 用途 | 圖表類型 | 說明 |
|------|---------|------|
| 碳排趨勢 | Area Chart | 漸層填色 |
| GRI 覆蓋率 | Bar Chart | 水平條狀 |
| ESG 雷達 | Radar Chart | E/S/G 三維 |
| 重大性矩陣 | Scatter Plot | 雙軸影響力 |
| 合規完成率 | Donut Chart | 中心顯示百分比 |
| KPI 趨勢 | Line Chart | 細線 + 數據點 |
| 供應鏈 ESG | Grouped Bar | 多供應商比較 |

---

## 11. 響應式行為摘要 (RWD Summary)

| 元素 | Desktop | Tablet | Mobile |
|------|---------|--------|--------|
| 側邊欄 | 固定顯示 280px | 收合 72px | Drawer 覆蓋 |
| Bento Grid | 3-4 欄 (12欄系統) | 2 欄 (6欄) | 1 欄 |
| 表格 | 完整欄位 | 精簡欄位 | 水平捲動 |
| 圖表 | 完整尺寸 | 縮小 | 全寬 |
| 導覽 | 側邊欄 | 側邊欄收合 | 底部導覽列 |
| 模態 Modal | 置中 600px | 置中 480px | 全屏 |
| KPI 卡片 | 橫排 4 格 | 橫排 2 格 | 2格/橫向捲動 |

---

## 12. 可及性規範 (Accessibility — WCAG AA)

| 規範項目 | 標準 |
|---------|------|
| **對比度 — 主要文字** | ≥ 4.5:1 (WCAG AA) |
| **對比度 — 大型文字** | ≥ 3:1 (WCAG AA) |
| **觸控目標最小尺寸** | `44×44px` (WCAG 2.5.8) |
| **鍵盤導覽** | 全元件支援 Tab 焦點 |
| **焦點指示器** | `outline: 2px solid #FDB515, offset: 2px` |
| **ARIA 標籤** | 所有互動元素具備 aria-label |
| **aria-current** | 導覽 active 狀態 |
| **aria-expanded** | 可展開元件 |
| **色盲友善** | 不以顏色為唯一狀態指示 |
| **圖示替代文字** | 所有語義圖示具備 aria-label |
| **減少動效** | 支援 `prefers-reduced-motion` |

---

## 13. UIUX 防崩壞治理規範摘要

| 原則 | 規定 |
|------|------|
| **Dashboard 模板** | 5 秒內可理解系統狀態；KPI 可點擊查看公式+來源+細項 |
| **Bento Grid** | 12欄自適應 → 6欄(Tablet) → 1欄(Mobile) |
| **觸控目標** | 所有按鈕 ≥ 44px (WCAG AA) |
| **狀態完整性** | hover/focus/disabled/loading/error/success 全部定義 |
| **字體層級** | pageTitle/sectionTitle/cardTitle/body/label/helper/overline 固定 7 層 |
| **5T 活動日誌** | T1–T5 標籤色彩對應語意，嚴禁混用 |
| **RWD** | 手機底部導航；桌面側邊欄可收合 |
| **崩壞預警指標** | 同一功能不同頁按鈕文案不一致、相同狀態顏色不同等 9 項 |

---

## 14. 設計原則總結 (Design Principles Summary)

| 原則 | 說明 |
|------|------|
| **誠信第一** | 5T Protocol 視覺化貫穿所有介面 |
| **資訊密度** | Bento Grid 最大化資訊可視性 |
| **學術精準** | Berkeley Design System 學術嚴謹感 |
| **液態感知** | Glassmorphism 玻璃質感層次 |
| **行動優先** | Mobile-first 但桌面體驗更豐富 |
| **零幻覺** | 數據來源清晰標注，拒絕模糊展示 |
| **永續美學** | 用設計語言傳遞永續治理的嚴肅性 |

---

*ESG GO 善向永續品牌風格規格書 v1.0 | Last Updated: 2026-05-21 | Maintained by Antigravity AI*