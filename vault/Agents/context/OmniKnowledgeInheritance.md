---
source_origin: oa-dual-agent-obsidian + esggo-omni-center/soul-full.md §26.13
created: 2026-08-13
modified: 2026-08-13
sync: mirror
co_authors: []
lifecycle: active
tags: [second-brain, knowledge-avatar, inheritance, 5t, omni-swarm]
access: public-research
---

# 萬能知識分身 · 融會貫通傳承迭代

## 核心思想
結點孵化只是起點。真正的「強化正確知識學習」在於：
> **每日繼承前日記憶 → 當下湊齊最完整內容（正確+錯誤皆得）→ 瞬間投向本體 → 蜂寫層同步 → 次日再繼承**

形成**自迭代螺旋**：舊記憶不是靜態存檔，而是每日被重新讀取、重新吸收、重新投射。

## 五相傳承迴路（VPS cron avatar-daily.sh）
1. **Inherit 繼承**：`oa-memory-recall.mjs` 讀回前日知識分身狀態（融會）
2. **Hatch 孵化**：`knowledge-avatar.mjs` 掃新結點（貫通）
3. **Write 寫入**：`tdai-memory-sync.mjs` 同步進 TencentDB 蜂寫層（傳承）
4. **Guard 防線**：`vault-access-guard.mjs` 憑證閘（安全）
5. **Clean 回歸**：`avatar-cleanup.mjs` 清測試型別（純淨）

## 零時差保證
- 錯誤變體當下保留（不刪除）→ 對比學習
- 本體（shared/types.ts）經 sync-vault-types --apply 即更新
- 蜂寫層（TencentDB）經 /v3/conversation/add 即寫入
- 讀取（OA 蜂群）經 /v3/conversation/query 即取用

## 實證
- VPS cron 每日 05:00 自跑五相，91 分身全數同步 + recall 讀回驗證
- 批次: f5f74ecbc (recall) / ab3980af1 (cleanup) / 41764c89e (cron)

## ABC 三線 × 傳承
- A 持續孵化 = cron 載體
- B 蜂寫層同步 = write + inherit 雙向
- C canonical 萃取 = hatch→sync 投向本體
- 傳承 = 五相螺旋自迭代，非一次性動作
