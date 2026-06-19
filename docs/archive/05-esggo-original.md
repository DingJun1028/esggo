# 記憶碎片：ESG GO Original

> **來源**：`C:\Project\esggo_original\`（674 files, ~20MB）
> **提取日期**：2026-06-19

---

## 1. 核心內容摘要

ESG GO Original 是 ESG GO 系列的**最早版本**（原型），定位為「ESG GO | Omni_Terminal v4.5 · Enterprise ESG Sovereign Platform」。此版本確立了**Berkeley 5T 主權架構**、**品牌設計系統**、**UIUX 防崩壞治理規範**，以及**OmniAgent CLI** 系統。

### 核心特點
- **OmniAgent CLI**：`ctl.ps1 start` 啟動平台、`omni.mjs agent run` 觸發 AI 代理
- **完整品牌系統**：Berkeley Academic Palette、Bento Grid 佈局、玻璃擬態
- **UIUX 治理規範**：六大頁面模板（Dashboard/List/Detail/Form/Report）驗收清單
- **JunAIKey 萬能開發光耀聖典**：九條聖典條目，定義系統哲學
- **Browser Harness**：完整的瀏覽器自動化能力（滾動、截圖、下載、Cookie 等）

---

## 2. 架構/設計說明

### 2.1 品牌原子庫（Brand Atomic Library）
| 層級 | 元件 |
|------|------|
| 原子（Atoms） | BrandStatusDot、BrandBadge、BrandButton、BrandAvatar |
| 分子（Molecules） | BrandKpiCard、BrandT5Strip、BrandSearchBar |
| 生物（Organisms） | VaultOmniTable、OmniAgentFloatingAgent、StandardPage |

### 2.2 品牌色彩規範
```
主色 Primary: #003262 (Berkeley Blue)
強調金 Accent: #FDB515 (California Gold)
深藍 Dark: #1A3A5C (Berkeley Dark)
淺藍 Light: #B9D9EB (Sather Gate)
玻璃表面: rgba(255,255,255,0.7)
玻璃邊框: rgba(0,50,98,0.12)
```

### 2.3 字體系統
| 用途 | 字型 |
|------|------|
| 主要標題 | Inter |
| 中文內容 | Noto Sans TC |
| 數據/代碼 | JetBrains Mono |
| 品牌 Logo | Inter Black |

### 2.4 按鈕系統
| 類型 | 背景 | 文字 | 用途 |
|------|------|------|------|
| Primary | #003262 | #FDB515 | 主要操作、5T 封印 |
| Secondary | #FDB515 | #003262 | 次要強調 |
| Ghost | transparent | #003262 | 取消 |
| Danger | transparent | #EF4444 | 刪除 |
| Glass | rgba(255,255,255,0.7) | #003262 | 卡片內按鈕 |

### 2.5 JunAIKey 九條聖典
1. **繁中英碼，終始矩陣**：雙語智慧流程
2. **程式語言，TypeScript**：類型安全與架構韌性
3. **承上啟下，無縫延伸**：智能上下文感知
4. **萬能進化，無限循環**：熵減寶石淬煉
5. **無定義中，自有定義**：靈活性與適應性
6. **以終為始，始終如一**：目標導向
7. **簡單，快速，好用，效能**：四大支柱
8. **以用戶為同心圓中心的 SaaS 應用**：雲端部署
9. **實現 0-1-無限**：從概念到普惠

### 2.6 奧義六式執行框架
1. 本質提純（extractQuantumEssence）
2. 聖典共鳴（SacredLibrary.resonate）
3. 代理織網（activateAgents）
4. 神跡顯現（agentNetwork.manifest）
5. 熵減煉金（EntropyForge.purify）
6. 永恆刻印（OmnipotentRepository.engrave）

### 2.7 UIUX 防崩壞治理規範
- 一致性優先於局部炫技
- 可理解性優先於裝飾性
- 主任務優先於次要資訊
- 模板化優先於自由拼接
- 狀態完整性優先於靜態美觀（hover/focus/disabled/loading/error/empty 六態）
- 工程可實作性（全端雙向 TypeScript 型別）

### 2.8 Browser Harness 能力
- 滾動、截圖、下載、Cookie、對話框、拖放
- 跨源 iframe、網路請求、列印為 PDF
- 域名技能：Zillow、YouTube、X/Twitter、小紅書、World Bank 等

---

## 3. 關鍵代碼片段

### 3.1 玻璃卡片 CSS
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
```

### 3.2 OmniAgent CLI 指令
```powershell
.\ctl.ps1 start                    # 啟動所有平台服務
node cli/omni.mjs agent run "..."  # 觸發 AI 代理
node cli/omni.mjs vault list       # 查看雜湊鎖定狀態
node cli/omni.mjs audit report     # 5T 完整性報告
```

### 3.3 API 回應格式
```json
{
  "status": "success",
  "t5_tag": "T1..T5",
  "data": { ... },
  "hash_lock": "sha256:...",
  "meta": { "node": "blue-edge-01", "timestamp": 1716422400000 }
}
```

---

## 4. 與現有 esggo 項目的關聯

- **Original → MVP**：Original 的品牌系統、5T 協議、奧義六式被 MVP 繼承並擴展
- **Original → Alpha**：Original 的 Data Connect 基礎、Report 系統被 Alpha 重構
- **Original → V1.0**：V1.0 是 Original 的最終進化版
- **Original → Beta**：Original 的 Browser Harness 能力在 Beta 的 OpenClaw 系統中得到延伸
- **核心保留**：Berkeley 品牌色彩、玻璃卡片 CSS、UIUX 治理規範、奧義六式框架為 Original 的獨特貢獻

---

*提取者：OWL | 批次 2 | 2026-06-19*
