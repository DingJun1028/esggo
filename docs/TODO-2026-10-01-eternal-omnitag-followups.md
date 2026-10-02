# TODO — 2026-10-01 永恆刻印後續未果項

> 5T-Traceable: 每項均附本輪實測證據或明確標註「待實測」
> 5T-Transparent: 已完成項與未完成項嚴格分開，不以「應該可以」冒充驗證

---

## 一、已閉環（實測通過，可信）

- [x] 永恆刻印三類實體落盤 `.oa/omnitag-registry.jsonl`（3 筆，append-only）
- [x] 冪等性：重跑 `3 → 3`，全 skip，無重複寫入
- [x] 不可變性：3/3 覆寫被拒，錯誤訊息回報真實 `eternal/<arcana>`
- [x] Hash Lock 完整性：3/3 `tampered=false`
- [x] 測試 41 passed（omnitag-eternal 13 + contract + five-t-gate）
- [x] 合約率 `pnpm oa:audit` = 100.0%（101 檔）
- [x] typecheck omnitag / oa-cli 相關錯誤 0
- [x] **`sourceOrigin` 根因修正** — `omnitag.ts:369` 改用 `resolveIdentity()?.id`，三類實測皆推導成功

---

## 二、未果待辦

### P1 · 既有 3 筆封印的 `sourceOrigin` 仍為 `unknown`

- [ ] **現況**：修正只對**新寫入**生效。既有 3 筆是修正前寫入的，內容不可改（append-only + eternal）。
      實際落盤：`oa-agent-queenbee` = `agent:01`（正確），`oa-avatar-omni` / `oa-swarm-team-30` = `unknown`
- [ ] **不需緊急處理的原因**：`sourceOrigin` **不在 hashLock 計算式內**
      （`hashLock = H(kind:id, content, sealedAt)`），所以補寫不會破壞完整性證據
- [ ] **選項待你決定**：
  - [ ] **A（建議）**：不動既有紀錄，維持「刻印即終態」純度。已知的 metadata 缺陷誠實記錄於本檔
  - [ ] **B**：另開 v2 registry（`omnitag-registry.v2.jsonl`）以正確 sourceOrigin 重封，
        舊檔保留為 audit trail。**代價**：`sealedAt` 與 `hashLock` 全變，須同步更新三處引用
- [ ] ⚠️ **不可直接改寫 JSONL** —— 那正是 H4 凍結要防的事，做了整套刻印機制就失效
- [x] **已加入持續可視化（2026-10-01）**：`verify-eternal-seals.ts` 每次 CI 執行都會
      `[GATE WARN]` 列出這 2 筆，`seal-eternal-identity.ts` 自檢段則 `rc=1`。
      缺口不再需要人回頭翻 JSONL 才发现 —— **選項 A/B 仍待你決定，不擅自行動**

### P2 · ~~無獨立測試覆蓋 `sourceOrigin` 三類推導~~ ✅ 已閉環（2026-10-01）

- [x] **已補**：`omnitag-eternal.test.ts` 新增 `describe('§20.8 sourceOrigin 三類推導（2026-01 回歸護欄）')`，
      4 條測試（agent / avatar / swarm + hashLock 不受影響）
- [x] 測試數 **41 → 45 passed**
- [x] **反向測試驗證護欄有效**（非恆真斷言）：故意把實作退回 `params.tag.agent ?? 'unknown'`，
      3 條即時失敗；還原後 22/22 綠

### P3 · ~~CI 未接 `verifySeal`~~ ✅ 已閉環（2026-10-01）

- [x] **已補**：新增 `scripts/verify-eternal-seals.ts`（唯讀 gate，不寫入）
- [x] **已接 CI**：`.github/workflows/omnitag-weekly-audit.yml` 新增 job `eternal-seal-integrity`
- [x] **觸發時機升級**：原僅 `schedule`(週) + `workflow_dispatch`；已加 `pull_request`
      且以 `paths` 限定 registry / omnitag.ts / gate 腳本 —— **竄改在合併前就被擋**
- [x] **與既有抽驗互補**：`omnitag-audit` 量「新寫入 tag 合約率」，本 gate 量「已落盤刻印是否被竄改」
- [x] **反向測試驗證 gate 真會擋**（非只印字）：手動竄改第 2 筆 `content` →
      `tampered=true`、`[GATE FAIL]`、`rc=1`；還原後 `tampered=false`、`rc=0`
- [x] **gate 分級設計**：`tampered` = 硬阻斷；`sourceOrigin=unknown` = warn（P1 未結）
      理由：長期紅的 gate 等於沒有 gate。可用 `OMNITAG_BLOCK_UNKNOWN_ORIGIN=1` 升級為硬 gate
- [ ] **殘餘**：`--chain` 產生的鏈仍未自動掛到 `scripts/verify_soul_canon.py` 尾站（§21 已知未收斂）
- [ ] ⚠️ **必須先 commit `.oa/omnitag-registry.jsonl`，否則 CI 恆紅**
      實測：在無 registry 的環境跑 gate → `rc=1`、`registry 無紀錄`。
      這是**正確的 fail-safe**（缺資料不等於通過），但代表 gate 未 commit 前
      `eternal-seal-integrity` 會一直紅。`.oa/` 未被 gitignore，只是尚未 `git add`。
      **未擅自 commit** —— 對外發布屬 H3 紅線，須你確認。

### P4 · ~~腳本註解與實況需長期對帳~~ ✅ 已閉環（2026-10-01）

- [x] **已補**：`seal-eternal-identity.ts` 尾部加自檢段，回讀 registry 斷言
      `sourceOrigin` 與 `resolveIdentity(tag)?.id` 相符，不符即 `process.exitCode = 1`
- [x] **實測證明它有效**：本輪執行即回報
      `[FAIL] oa-avatar-omni 期望=avatar:omni 實際=unknown`、真實 `rc=1`
      —— 這是 P1 缺口第一次被機器自動抓到，而非靠人回頭讀 JSONL
- [x] 註解已同步改為誠實描述（移除「已由…推導」的過期宣稱）

---

## 三、本輪刻意未做（需 H3 會同）

- [ ] **未推送 VPS / 未同步 production** —— 屬 H3 紅線（對外發布），本地全綠不等於可自動同步
- [ ] 未 commit / 未 push（依專案規範，未經指示不動 git）

---

## 相關

- 技書：`wiki/omnitag.eternal-seal.md`
- 共享記憶：`vault/Agents/context/OmniTagEternalSeal.md`
- 實作：`cli/oa-cli/src/omnitag.ts`
- Registry：`.oa/omnitag-registry.jsonl`