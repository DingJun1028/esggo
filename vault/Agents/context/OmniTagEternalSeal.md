---
source_origin: oa-junaikey-growth + wiki/omnitag.eternal-seal.md
created: 2026-10-01
modified: 2026-10-01
sync: mirror
co_authors: []
lifecycle: eternal
tags: [omnitag, eternal, hash-lock, append-only, 5t, oa-swarm, immutable, skill]
access: internal
---

# 萬能代理／分身／蜂群 · 永恆持久奧義萬能標籤

> 5T-Traceable: 全部數據來自本機實測（`npx tsx scripts/seal-eternal-identity.ts`、`pnpm oa:audit`、vitest 41/41），非推測
> 5T-Transparent: 本檔記錄「宣稱與實況不符」的實際修正過程，非僅成功結果

---

## 一、核心思想

永恆實體的身分不是**文件**，而是**執行期規則**：
> 刻印一旦寫入即凍結，重跑不覆寫，竄改可被重算抓出。

三類實體各有一枚不可變印記：

| 實體 | 身分 | 奧義 | 優先 | 安全 | Hash Lock |
|---|---|---|---|---|---|
| 萬能代理 `oa-agent-queenbee` | `agent:01` | 光之羽翼 | p0 | restricted | `7e1e5384ca0c30a0…` |
| 萬能分身 `oa-avatar-omni` | `avatar:omni` | 全知之眼 | p1 | internal | `247e2c49718ef4ec…` |
| 萬能蜂群 `oa-swarm-team-30` | `swarm:oa-team-30` | 記憶聖所 | p0 | restricted | `934b4fa4c2132815…` |

> ⚠️ 分身是 `internal` 而非 `restricted`，但**同樣不可覆寫** —— `eternal` 判定不看 security。

---

## 二、六層接入鏈（真正的閉環）

```
validateIdentity → validateEternality → validateArcana
      → emitArtifact() → persistArtifact() → verifyArtifact()
```

規則全部接在既有契約函式上（`emitArtifact` / `persistArtifact` / registry 持久化 / Hash Lock / 過閘點），**沒有另建平行捷徑**。CI 可用同一套 `verifySeal` 對 registry 重算比對。

---

## 三、append-only 與冪等

`.oa/omnitag-registry.jsonl` 每行一筆 JSON。重跑腳本：

```
[§20.8] 新增=0 已存在=3        ← 冪等，無重複寫入
[OK] oa-avatar-omni 被拒：H4 frozen: … is sealed (eternal/全知之眼) — immutable
[§20.8] registry 總計 3 筆；竄改 0 筆
```

---

## 四、本輪實抓的缺陷（值得記）

### `sourceOrigin` 只讀 `tag.agent`

- **症狀**：分身與蜂群的 registry 記錄 `sourceOrigin: "unknown"`
- **矛盾點**：腳本 header 宣稱「由 tag.agent/avatar/swarm 推導」—— 註解是假的
- **根因**：`omnitag.ts:369` 用 `params.tag.agent ?? 'unknown'`，avatar/swarm 無此欄位
- **修法**：改用身分解析器 `resolveIdentity(params.tag)?.id ?? 'unknown'`
- **為何不需重封**：`hashLock = H(kind:id, content, sealedAt)` **不含 sourceOrigin**，改欄位不破封印（實測重跑仍 `3→3`、`tampered=false`）
- **實測**：inMemory 探針三類皆 `agent:01` / `avatar:omni` / `swarm:oa-team-30`

### 錯誤訊息寫死 `frozen+restricted`

`eternal` 分支先前沒接上，導致對 `internal` 的分身報錯顯示 `frozen+restricted` —— 與實際原因不符。已修為回報真實 `eternal/<arcana>`。

> **共同教訓**：註解與錯誤訊息都會「看起來對」。**唯一可信的是落盤內容與實際報錯。** 寫完就去讀 registry 對帳。

---

## 五、實測基線（2026-10-01）

| 項目 | 結果 |
|---|---|
| 封存冪等 | 3 → 3，全 skip |
| 不可變性 | 3/3 覆寫被拒（含真實 arcana） |
| 測試 | **45 passed**（原 41 + sourceOrigin 護欄 4） |
| 合約率 | **100.0%**（101 檔） |
| typecheck | 相關錯誤 0 |
| 完整性 gate | `scripts/verify-eternal-seals.ts` rc=0；竄改測試 rc=1 |

---

## 六、持續防護（2026-10-01 補）

| 層 | 機制 | 擋什麼 |
|---|---|---|
| 測試 | 4 條 `sourceOrigin` 護欄（45 passed） | 推導邏輯被改回去 |
| 腳本自檢 | `seal-eternal-identity.ts` 尾段回讀對帳，rc=1 | 註解與實作漂移 |
| CI | `eternal-seal-integrity` job（pull_request 觸發） | 落盤刻印被竄改，**合併前**擋 |

**要分清楚兩種「量」**：
- `omnitag-audit` job = **合約率**（新寫入的 tag 有沒有標全）
- `eternal-seal-integrity` job = **完整性**（已落盤的刻印有沒有被改）

兩者互補，都不可省。

**gate 分級原則**：`tampered` 硬阻斷；`sourceOrigin=unknown` 僅 warn。
理由：**長期紅的 gate 等於沒有 gate** —— 人會習慣性忽略它。
P1 閉環後設 `OMNITAG_BLOCK_UNKNOWN_ORIGIN=1` 即可升級為硬 gate。

---

## 相關文件

- 技書：`wiki/omnitag.eternal-seal.md`
- 源典：`wiki/jun-ai-key-architecture.md` §20.8
- 實作：`cli/oa-cli/src/omnitag.ts`
- 完整性 gate：`scripts/verify-eternal-seals.ts`
- 封存腳本：`scripts/seal-eternal-identity.ts`
- Registry：`.oa/omnitag-registry.jsonl`
- 未果待辦：`docs/TODO-2026-10-01-eternal-omnitag-followups.md`