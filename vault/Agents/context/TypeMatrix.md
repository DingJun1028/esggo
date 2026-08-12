---
source_origin: esggo/shared/types.ts
created: 2026-08-13
modified: 2026-08-13
sync: mirror
lifecycle: active
---

# 型別矩陣鏡像（TypeScript 終始矩陣 · vault 端）

> 本檔由 `scripts/export-shared-types.js` 從 `esggo/shared/types.ts` 自動鏡像。
> **只讀**——要改型別請改 canonical 後重跑 generator，勿手編此檔。

## Canonical 位置
`packages/shared/src/types.ts` → 生成 `apps/<app>/types/generated/esggo-shared.d.ts`

## 核心領域型別（第二大腦記憶系統）
| 型別 | 種類 | 用途 |
|------|------|------|
| `ESGKnowledgeBase` | enum | 知識庫分類（第二大腦索引） |
| `IKnowledgeRecord` | interface | 知識記錄（筆記 ↔ 型別雙向載體） |
| `ISkillNode` | interface | 技能節點（蜂群技能圖譜） |
| `IAgentProfile` | interface | 代理檔案（30 矩陣個體） |
| `IAwakeningResult` | interface | 喚醒結果（靈魂簽章） |
| `IRAGResult` | interface | RAG 檢索結果（語意召回） |
| `IARVOPlan` | interface | ARVO 計畫（熵減路線） |

## 雙向同步狀態
- ✅ canonical → vault：本檔即鏡像
- ⏳ vault → canonical：見 `vault/AGENTS.md` 的 `sync-vault-types.ts` 流程（筆記標 `sync:up` 時提 PR）

## 關聯
- [[OA-Team-第二大腦-架構]]
- [[5T-協定-vault-級]]
