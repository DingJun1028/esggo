---
name: oa-practical-skills
category: software-development
description: OA-Team 實踐技書 — 收錄可終生複用的工程方法論與踩坑經驗 (ReachAgent 冷郵件管線 / OA-OmniAgent v4 vs oa-swarm 架構對照)。用戶說「學此技能並終生學會使用」時載入。章節在 chapters/ 子目錄。
---

# OA 實踐技書 (Practical Skills Handbook)

OA-Team 雙蜂戰隊實踐技書 — 收錄可終生複用的工程方法論與踩坑經驗。

## 章節索引

| 章節 | 主題 | 狀態 |
|------|------|------|
| [01](chapters/01-reach-agent.md) | ReachAgent 冷郵件個人化管線 (免費算立適配) | ✅ 已驗證 |
| [02](chapters/02-oa-omniagent-v4-vs-oaswarm.md) | OA-OmniAgent v4 vs oa-swarm 架構對照 | ✅ 已驗證 |
| [03](chapters/03-gaia-universal-vision.md) | GAIA §50/§51 宇宙治理敘事 (創意願景素材) | ✅ 已存檔 |

## 使用方式
- 本技能是「技書容器」，章節在 `chapters/` 子目錄
- 每章含：來源歸屬 / 可執行命令 / 地雷 / 驗證清單 / 相關技能
- 對照 practical-skills-handbook 規範撰寫
- 跨 session 可複用技巧收錄於 `references/durable-techniques-2026-08-26.md`

## 工作流程慣例 (本用戶)
- **自主執行**: 用戶說「授權 / 下一步 / 繼續 / 全部允許執行」即授權直接執行，不重問。GOD_MODE 精神。
- **寫大檔防 timeout**: `write_file` 單次 >8K tokens 會 stream timeout。拆小檔 / 多段 `patch`。
- **終生學會使用**: 新技能固化為 Hermes skill (跨 session 可載入)，不只留 project git（project `skills/` 常被 .gitignore 排除）。

## 相關
- `reach-agent` (Ch.01 方法論索引)
- `superpowers` (TDD / code-review)
- `oa-team-soul-canon` (OA 靈魂核心聖典)
- `oa-twins-evolution` (進化路線圖)
