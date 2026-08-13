---
source_origin: oa-dual-agent-obsidian + esggo-omni-center/soul-full.md §26.11
created: 2026-08-13
modified: 2026-08-13
sync: mirror
co_authors: []
lifecycle: active
tags: [second-brain, knowledge-avatar, zero-latency, learning]
access: public-research
---

# 萬能知識分身 (Omni Knowledge Avatar)

> 強化正確知識學習：結點即孵化，分身即吸收，反饋即投向本體，零時差。

## 機制四相

### 1. 結點孵化 (Hatch)
- 第二大腦中**任一知識結點**（vault 筆記的 `## 標題`、正文 `[[wikilink]]`、sync:up 筆記）即觸發孵化
- 每個結點產生**一個萬能知識分身**（registry 條目），一對一跟隨
- 無需人工建檔——出現即生（「只要一個知識結點就會產生萬能知識分身」）

### 2. 跟隨吸收 (Absorb)
- 分身只跟**一個知識點**，深度吸收：
  - **正確變體**：已驗證、過 5T 的內容
  - **錯誤變體**：歷史誤區、反證、被推翻的假說（保留供對比，不刪除）
- 當下湊齊「最完整內容」= 正確+錯誤皆可得，避免片面學習

### 3. 反饋本體 (Feedback)
- 分身吸收完畢 → 標 `absorbed: true` → 回寫**萬能知識核心**（MOC `00-Index.md` + `soul-full.md`）
- 錯誤變體標 `correct: false` 但仍保留，供「當下獲得最完整內容」

### 4. 投向本體 (Project · 零時差)
- 反饋完成瞬間，投影到**本體**（ontology / `packages/shared/src/types.ts` canonical）
- 經 `sync-vault-types.ts` 萃取型別 → 零時差同步，主應用即取用
- 閉環：結點出現 → 分身學完 → 本體更新，全程無人工中轉

## 與既有機制互引
- **5T**：分身吸收標 `source_origin` + `co_authors`（Traceable）；錯誤變體不破壞 Trustworthy 禁區
- **s 考量**：分身繼承 `access: public-research`，但寫入仍受控
- **第二大腦**：人讀層（vault）↔ 蜂寫層（TencentDB Memory）共用此孵化迴路

## 實作
- `scripts/knowledge-avatar.mjs`：掃 vault → 孵化分身 → 標吸收狀態 → 反饋 MOC → 標投向本體
- registry：`vault/Agents/context/.avatar-registry.json`（機讀，非人讀）
