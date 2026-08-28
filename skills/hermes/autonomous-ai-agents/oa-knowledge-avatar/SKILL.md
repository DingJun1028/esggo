---
name: oa-knowledge-avatar
category: autonomous-ai-agents
description: 萬能知識分身零時差學習迴路 — 結點孵化/分身吸收/蜂寫層同步/讀回繼承。OA-Team 第二大腦自迭代記憶螺旋。
tags: [soul, swarm, knowledge-avatar, second-brain, tencentdb, 5t, inheritance, omni]
---

# 萬能知識分身 · 零時差學習迴路

## When to use
- 使用者說「知識分身」「第二大腦學習」「結點孵化」「融會貫通傳承」「OA 蜂寫層」
- 要把 Obsidian vault 筆記變成「會自我迭代的活記憶」而非靜態存檔
- 要接 TencentDB Agent Memory 作為 OA 蜂群共享記憶後端（讀+寫雙向）

## 四相機制（本體邏輯）
1. **Hatch 孵化**：掃 vault 所有知識結點（## 標題 + [[wikilink]）→ 每結點一個萬能知識分身
2. **Absorb 吸收**：分身跟一知識點，正確+錯誤變體皆保留（當下湊齊最完整內容）
3. **Feedback 反饋**：吸收完標 absorbed → 反饋 MOC (00-Index.md) + soul
4. **Project 投向**：瞬間投向本體 (shared/types.ts) 經 sync-vault-types.ts --apply，零時差

## 七相傳承迴路（VPS cron avatar-daily.sh，每日 05:00）
```
Inherit(繼承前日) → Hatch(孵化新結點) → Write(蜂寫層+retry) → Guard(憑證閘)
→ Clean(回歸) → Metrics(指標) → MOC(回流)
```
- Inherit: `oa-memory-recall.mjs 'avatar'` 讀回前日記憶；本機通常 `fetch failed`，屬預期邊界
- Hatch: `knowledge-avatar.mjs` 掃 vault → `.avatar-registry.json` + `.avatar-types.d.ts`
- Write: `tdai-memory-sync.mjs`；VPS 內網可寫 8420，本機優雅降級不丟本地狀態
- Guard: `vault-access-guard.mjs` 掃真憑證 + `access` 欄位
- Clean: `avatar-cleanup.mjs` 清 `IAvatarProbe*` 測試型別
- Metrics: `avatar-metrics.mjs` 解析 `avatar.log` 末次 run → `avatar-metrics.json`
- MOC: `avatar-moc-sync.mjs` 回寫 `00-Index.md` 知識分身日報

### 腦補同步 (Obsidian 3-endpoint: Mobile + Desktop + Git)
- **Desktop**: Obsidian + obsidian-git plugin, auto-commit + auto-push every 60s
- **Mobile**: Obsidian Mobile app + obsidian-git plugin, auto-pull + auto-push every 60s
- **Git**: `git@github.com:DingJun1028/esggo.git` (branch: `feature/aistation-core-modules`), vault at `C:/Project/esggo/vault/`
- **Cron**: `30 5 * * * node /opt/esggo/scripts/tdai-memory-sync.mjs` (after avatar-daily.sh at 5:00 AM)
- **tdai-memory-sync.mjs**: writes `.avatar-registry.json` entries → `/v3/conversation/add`，優雅降級 (local fetch failed → log, not crash)

## 可觀測 + 自癒 (2026-08-13 補齊, 2026-08-27 實證更新)
- `avatar-metrics.mjs`
  - 解析 avatar.log 末次 run，產 `avatar-metrics.json`
  - 指標：`hatched/synced/syncFailed/guardOk/cleaned/recall/healthy`
  - 邊界處理：`失敗樣本:` 與 `[recall] ✗ fetch failed` 不納入真實錯誤
  - 健康度：`healthy = syncFailed==0 && errors==0 && guardOk`
- `avatar-moc-sync.mjs` — 讀 metrics 寫回 `00-Index.md` 的「知識分身日報」狀態行（OA 蜂群可讀）
- VPS `avatar-daily.sh` 七相：Inherit→Hatch→Write(retry 3)→Guard→Clean→Metrics→MOC
- 自癒：
  - tdai-sync 失敗自動 retry 3 次（間隔 5s）
  - 本地 8420 不可達時優雅降級，不阻塞後續相
- 健康度邊界：
  - VPS：Guard 通過 + sync 成功 + cleanup 通過 → 可達 `healthy=true`
  - 本地：`[recall] ✗ fetch failed` 屬正常限制；metrics 已排除 boundary noise

## 腳本清單（esggo repo scripts/）
- `knowledge-avatar.mjs` — 孵化+吸收+型別投影
- `tdai-memory-sync.mjs` — 寫入蜂寫層（優雅降級：連不到時本地不丟）
- `oa-memory-recall.mjs` — 讀回（B 線雙向閉環）
- `vault-access-guard.mjs` — 公開前掃真憑證
- `avatar-cleanup.mjs` — 防回歸清測試型別
- `sync-vault-types.ts` — vault→canonical 型別同步（接 .avatar-types.d.ts）

## VPS 實證 (2026-08-27 三環境部署)
- **本地**: 3 Docker containers healthy (tdai-memory-core 8420, tdai-memory-hub 8125/8424, tdai-proxy 8096)
- **VPS**: 3 Docker containers running 26h+ uptime, all healthy
- **Public**: Cloudflare Tunnel → `memory.esggo.co` (proxy:8096) + `gateway.esggo.co` (core:8420)
- tdai-memory-sync 140 全數同步成功 (`tasksConsumed: 2, tasksCompleted: 2` pipeline verified)
- Claude Code proxy 驗證: `"3 + 4 equals 7."` (qwen2.5:3b) / `"Hello! How can I help you today?"` (gemma4:e4b)

## VPS 實證 (2026-08-13)
- 孵化 138 分身（正確 129 / 錯誤 9 皆存）
- tdai-sync 91 全數同步成功（VPS 內網）
- recall 讀回 10 筆 [avatar ...] 驗證
- typecheck TC=0 / vitest 597 passed

## 資產化位置
- soul: `esggo-omni-center/soul-full.md` §26.11（ABC）/ §26.12（深入）/ §26.13（傳承）
- vault: `vault/Agents/context/OmniKnowledgeAvatar.md` + `OmniKnowledgeInheritance.md`
- 批次: f5f74ecbc(recall) / ab3980af1(cleanup) / 41764c89e(cron) / 045240abe(§26.13)

## Pitfalls
- 本地跑 tdai-sync 會 fetch failed（8420 只在 VPS）→ 正常，VPS cron 才連得到
- shared/types.ts 勿手動加 IAvatarProbe*（cleanup 會清，且污染 canonical）
- `.avatar-types.d.ts` / `.avatar-registry.json` 是 gitignored 機讀產物
- 勿用本地 Hermes cron 跑（依賴 Gemini，會 404）→ 用 VPS crontab
- **Obsidian Git plugin 下載**: repo 已遷移至 `Vinzent03/obsidian-git` (原 `denolehov`), v2.39.0. GitHub release 中的 asset 名稱為 `ObsidianGit.zip`, 下載 URL 格式: `https://github.com/Vinzent03/obsidian-git/releases/download/2.39.0/main.js` 等
- **Proxy host networking**: `--network host` 模式下 Docker service name (`memory-core`) 不可用，必須用 `127.0.0.1:8420`
