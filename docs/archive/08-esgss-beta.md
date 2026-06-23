# 記憶碎片：ESGSS JunAiKey Beta

> **來源**：`C:\Project\esgss_junaikey_beta\`（7712 files, ~100MB）
> **提取日期**：2026-06-19

---

## 1. 核心內容摘要

ESGSS JunAiKey Beta 是一個**大規模 AI 技能/插件系統**（代號 OpenClaw），包含 7712 個文件。它不是 ESG GO 平台的直接迭代，而是一個**獨立的 AI 代理基礎設施**，提供：

- **OpenClaw 技能系統**：50+ 個預建技能（GitHub、Slack、Obsidian、Gemini、Whisper 等）
- **Gateway 伺服器方法**：AGENTS.md、CLAUDE.md 等代理指南
- **Hooks 系統**：command-logger、session-memory、bootstrap-extra-files、boot-md
- **多平台整合**：GitHub、Slack、Notion、Spotify、語音通話、Trello 等
- **Phase 15-24 任務矩陣**：完整的開發階段記錄

### 與 ESG GO 的關係
此資料夾代表 ESG GO 團隊在 **AI 代理基礎設施**方面的探索，可視為 ESG GO 中 OmniAgent / ADK 專家小隊的**技術前身**或**平行項目**。

---

## 2. 架構/設計說明

### 2.1 OpenClaw 技能系統
技能採用三層載入設計（Progressive Disclosure）：
1. **元數據（name + description）**：始終在上下文中（~100 詞）
2. **SKILL.md 正文**：技能觸發時載入（<5000 詞）
3. **捆綁資源**：按需載入（scripts/references/assets）

### 2.2 核心技能列表
| 技能 | 用途 |
|------|------|
| github | GitHub 操作（PR、Issue、CI） |
| slack | Slack 訊息管理 |
| obsidian | Obsidian 筆記庫操作 |
| gemini | Gemini CLI 問答 |
| openai-whisper | 本地語音轉文字 |
| openai-image-gen | OpenAI 圖片生成 |
| summarize | URL/影片/音訊摘要 |
| skill-creator | 技能創建框架 |
| trello | Trello 看板管理 |
| notion | Notion 筆記 |
| nano-pdf | PDF 處理 |
| himalaya | 電子郵件管理 |
| weather | 天氣查詢 |
| voice-call | 語音通話 |
| video-frames | 影片幀提取 |
| openhue | 智慧燈控 |
| spotify-player | Spotify 播放 |
| sonoscli | Sonos 音響控制 |
| sag | 語音合成（TTS） |
| tmux | 終端多路復用 |
| mcporter | 數據導入匯出 |
| oracle | 神諭（AI 決策） |
| ordercli | 訂單管理 |
| food-order | 食物訂購 |
| model-usage | 模型使用量追蹤 |
| session-logs | 會話日誌 |
| healthcheck | 健康檢查 |
| goplaces | 地點搜尋 |
| gifgrep | GIF 搜尋 |
| eightctl | 8Sleep 智慧床控制 |
| things-mac | Apple Things 任務管理 |
| peekaboo | 螢幕截圖 |
| nano-banana-pro | 圖片生成 |
| imsg | iMessage 管理 |
| gog | GOG 遊戲平台 |
| session-memory | 會話記憶 |
| boot-md | Markdown 啟動器 |
| bootstrap-extra-files | 額外文件引導 |
| command-logger | 命令日誌 |

### 2.3 任務進度（Phase 15-24）
| 階段 | 狀態 | 內容 |
|------|------|------|
| Phase 15 | ✅ | NCB 數據整合、5T 密封、UI 整合 |
| Phase 16 | ✅ | OmniClaw 實作、OpenClaw 代理綁定 |
| Phase 17 | ✅ | OmniClaw 人格、社群中心 UI |
| Phase 18 | ✅ | 多簽驗證、成就系統 |
| Phase 19 | ✅ | 治理 UUID 矩陣、資產可追溯性 |
| Phase 20 | ✅ | 治理意圖、環境攝取 |
| Phase 21 | ✅ | 水晶多方代理密封驗證 |
| Phase 22 | ✅ | 完整性通行證等級進化引擎 |
| Phase 23 | ✅ | 動態商業情報驗證 |
| Phase 24 | ✅ | 智能工作流與任務矩陣協調 |

### 2.4 核心數據實體
從 `task.md` 和 GraphQL Schema 中可提取的核心實體：
- `AuditRecord` — 審計記錄
- `Report` / `ReportSection` — 報告與章節
- `IntelligenceModule` / `IntelligenceSource` / `IntelligenceSignal` — 情報模組
- `Challenge` / `ChallengeParticipation` — 挑戰系統
- `SocialGroup` / `SocialAdvice` — 社群建議
- `Crystal` / `CrystalSynthesis` — 水晶密封系統
- `IntegrityPassport` — 完整性通行證
- `OmniClawAgent` — OpenClaw 代理

---

## 3. 關鍵代碼片段

### 3.1 技能結構範例
```markdown
---
name: github
description: "GitHub operations via `gh` CLI: issues, PRs, CI runs..."
metadata:
  openclaw:
    emoji: "🐙"
    requires: { "bins": ["gh"] }
---
# GitHub Skill
Use the `gh` CLI to interact with GitHub repositories...
```

### 3.2 技能設計原則
- **簡潔為先**：只寫 AI 不知道的內容
- **自由度匹配**：窄橋（低自由度）用精確腳本，開闊地（高自由度）用文字指引
- **三層載入**：元數據 → SKILL.md → 捆綁資源
- **避免重複**：資訊放在 SKILL.md 或 references 中，不要兩邊都有

### 3.3 5T 協議整合
Phase 15 完成了以下 5T 密封整合：
- `BackendService.ts` → NCB 客戶端 + 標準代理路由
- `EsgDataMapper.ts` → 5T 協議支柱強化
- `OmniDataAdapter.ts` → 自動化 5T 密封

---

## 4. 與現有 esggo 項目的關聯

- **Beta → MVP**：Beta 的 Phase 15-24 任務記錄了從 MVP 到 V1.0 的完整演進
- **Beta → Original**：Beta 的 Browser Harness 能力在 Original 中已有類似實現
- **Beta → V1.0**：Beta 的 OpenClaw 技能系統可視為 V1.0 中 ADK 專家小隊的技術基礎
- **核心保留**：5T 密封、完整性通行證、水晶密封系統、社群中心、多簽驗證等為 Beta 的獨特貢獻
- **差異點**：Beta 更偏向**基礎設施/工具鏈**，而 ESG GO 系列更偏向**應用層/用戶介面**

---

## 5. 資料夾規模說明

此資料夾達 7712 個文件、~100MB，主要包含：
- `openclaw/skills/` — 50+ 個技能定義
- `openclaw/src/` — OpenClaw 核心源碼（hooks、gateway、bs）
- `openclaw/docs/` — 完整文件
- `openclaw/tests/` — 測試套件
- 大量 `.git/` 版本控制檔案

**注意**：此資料夾的絕大部分內容為 OpenClaw 開源項目本身，ESG GO 相關的自定義內容主要在 `task.md` 和 Phase 15-24 的任務記錄中。

---

*提取者：OWL | 批次 2 | 2026-06-19*
