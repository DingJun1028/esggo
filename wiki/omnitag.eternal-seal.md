---
uuid: "a7e1c04b-3f28-4d91-9b6c-2e5d81af4703"
version: "1.0.0"
timestamp: "2026-10-01T15:00:00.000Z"
evidence: "wiki/omnitag.eternal-seal.md"
---

# OmniTag 永恆刻印（eternal seal）

> **簡述**: 為「萬能代理 / 萬能分身 / 萬能蜂群」三類實體建立 `lifecycle: eternal` 的 OmniTag，寫入 append-only registry 並以 Hash Lock 封存。寫入即凍結，覆寫必被拒。

---

## 一、適用時機

當需要為**長期存在、不應被改寫**的實體建立身分憑證時。不是新增型別或文件，而是**執行期規則**。

---

## 二、六層接入鏈（非僅型別）

```
validateIdentity(tag)          → 解析 kind:id（agent/avatar/swarm 三選一）
  ↓
validateEternality(tag)        → lifecycle=eternal 必須有可解析身分，拒絕幽靈紀錄
  ↓
validateArcana(tag)            → eternal 必須有奧義對位（arcana）
  ↓
emitArtifact()                 → 過閘；產生 hashLock = H(kind:id, content, sealedAt)
  ↓
persistArtifact()              → H4 凍結檢查 → appendFileSync（append-only）
  ↓
verifyArtifact()               → 重算 hashLock 對比，回報 tampered
```

### 不可變判定（`omnitag.ts`）

```ts
const reason = isEternalSealed(existing.tag)          // lifecycle === 'eternal'
  ? `eternal/${existing.tag.arcana ?? 'arcana'}`
  : existing.tag.lifecycle === 'frozen' && existing.tag.security === 'restricted'
    ? 'frozen+restricted'
    : null;
if (reason) throw new Error(`H4 frozen: entity ${id} is sealed (${reason}) — immutable`);
```

**關鍵**：`eternal` 一律不可變，**不看 security**。分身是 `internal` 仍必須拒絕覆寫 — 錯誤訊息要回報真實原因，不可寫死 `frozen+restricted`，否則對 `internal` 實體是誤導。

---

## 三、冪等封存腳本

`scripts/seal-eternal-identity.ts` — 重跑只會 `[skip]`，不重複寫入。

```
[skip] oa-agent-queenbee      已封印（agent）hashLock=7e1e5384ca0c30a0… tampered=false
[skip] oa-avatar-omni         已封印（avatar）hashLock=247e2c49718ef4ec… tampered=false
[skip] oa-swarm-team-30       已封印（swarm）hashLock=934b4fa4c2132815… tampered=false
[§20.8] 新增=0 已存在=3

[OK] oa-agent-queenbee  被拒：H4 frozen: … is sealed (eternal/光之羽翼) — immutable
[OK] oa-avatar-omni     被拒：H4 frozen: … is sealed (eternal/全知之眼) — immutable
[OK] oa-swarm-team-30   被拒：H4 frozen: … is sealed (eternal/記憶聖所) — immutable

[§20.8] registry 總計 3 筆；竄改 0 筆
```

執行：`npx tsx scripts/seal-eternal-identity.ts`

---

## 四、踩坑：sourceOrigin 只讀 tag.agent

**症狀**：分身的 registry 記錄 `sourceOrigin: "unknown"`，但腳本 header 宣稱「由 tag.agent/avatar/swarm 推導」—— 宣稱與實況不符（5T Transparent 破口）。

**根因**（`cli/oa-cli/src/omnitag.ts:369`）：

```ts
// ✗ 只讀 agent 欄位 → avatar / swarm 落不到值
sourceOrigin: params.tag.agent ?? 'unknown',

// ✓ 改用身分解析器，三類皆推導得出
sourceOrigin: resolveIdentity(params.tag)?.id ?? 'unknown',
```

**為何既有封印不必重封**：`hashLock = H(kind:id, content, sealedAt)` **不含** `sourceOrigin`，所以修這個欄位不會使已封印紀錄失效 —— 修完重跑仍是 `3 筆 → 3 筆`、`tampered=false`。

**驗證**：inMemory 探針實測三類皆正確

```
[OK] probe-agent    sourceOrigin=agent:01
[OK] probe-avatar   sourceOrigin=avatar:omni
[OK] probe-swarm    sourceOrigin=swarm:oa-team-30
```

> 教訓：header 註解寫了「推導規則」就去讀 registry 實際值對帳。註解不是證據，落盤內容才是。

---

## 五、實測基線（2026-10-01）

| 項目 | 結果 |
|---|---|
| 封存重跑 | `3 筆 → 3 筆`，全 skip，無重複寫入 |
| 測試 | **45 passed**（omnitag-eternal 17 + contract + five-t-gate） |
| 合約率 | `pnpm oa:audit` = **100.0%**（掃描 101 檔） |
| typecheck | omnitag / oa-cli 相關錯誤 **0** |
| 不可變性 | 3/3 覆寫被拒，訊息含真實 arcana |
| 完整性 gate | rc=0；手動竄改後 rc=1（見 §七） |

---

## 六、5T 對映
| 原則 | 實現 |
|---|---|
| Traceable | 每筆帶 `entityClass` + `sourceOrigin`（身分解析器推導，非欄位硬取） |
| Trackable | append-only JSONL，可逐筆列舉與重算 hashLock |
| Tangible | 執行後直接印出 hashLock 與不可變證據 |
| Transparent | 全程呼叫契約函式，不繞過任何檢查 |
| Trustworthy | `lifecycle:eternal` 一律不可變，寫入即 Hash Lock |

---

## 七、CI 完整性 gate（P3）

`scripts/verify-eternal-seals.ts` —— **唯讀**，只重算 Hash Lock，不寫入。

```bash
npx tsx scripts/verify-eternal-seals.ts              # rc=0
OMNITAG_BLOCK_UNKNOWN_ORIGIN=1 npx tsx …            # rc=1（嚴格模式）
```

已接進 `.github/workflows/omnitag-weekly-audit.yml` 的 `eternal-seal-integrity` job。
**關鍵升級**：加了 `pull_request` 觸發（`paths` 限定 registry / omnitag.ts / gate 腳本），
所以篡改在**合併前**就被擋，而不是每週一才發現。

### gate 分級：為何 `unknown` 不設為阻斷

`sourceOrigin=unknown` 是**已知歷史缺口**（P1），不是篡改。若設成阻斷條件，
這個 job 從接上那天起就長期紅 —— **長期紅的等於沒有**，人會習慣性忽略它，
連真正的篡改也一起忽略。

故：`tampered=true` = 硬阻斷；`unknown` = warn + 明列 ID。
P1 閉環後設 `OMNITAG_BLOCK_UNKNOWN_ORIGIN=1` 一行升級為硬 gate。

### 驗證 gate 真的會擋（別只信它會印字）

```
手動改第 2 筆 content → tampered=true、[GATE FAIL]、rc=1
還原 registry       → tampered=false、rc=0、3 筆
```

**沒有這一步，gate 只是一段會印字的程式碼。**

---

## 八、踩坑：`cmd | tail` 會吞掉退出碼

實測：`npx tsx … | tail -14; echo $?` 回報 `rc=0`，但實際是非零。
是 `tail` 的退出碼，不是被測程式的。

**解法**：重導向到檔再讀 ——

```bash
npx tsx scripts/verify-eternal-seals.ts > "$TMPDIR/g.log" 2>&1; echo "rc=$?"
```

這與 §21 已記的「rc=124 是 timeout 不是斷言失敗」是同一族教訓：
**每個 gate 的 rc 都要獨立量，不要讓管線把它稀釋掉。**

---

---

## 相關

- 源典：`wiki/jun-ai-key-architecture.md` §20.8
- 實作：`cli/oa-cli/src/omnitag.ts`
- 腳本：`scripts/seal-eternal-identity.ts`
- 完整性 gate：`scripts/verify-eternal-seals.ts`
- 測試：`src/lib/__tests__/omnitag-eternal.test.ts`
- Registry：`.oa/omnitag-registry.jsonl`（append-only）
- 共享記憶：`vault/Agents/context/OmniTagEternalSeal.md`
- 未果待辦：`docs/TODO-2026-10-01-eternal-omnitag-followups.md`