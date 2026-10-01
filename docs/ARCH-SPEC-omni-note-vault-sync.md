---
source_origin: 用戶熱鍵 /esggo-omni-obsidian-sync + 附件 pasted_content_2026-10-01_06-28-08-648 (萬能筆記 Omni-Note) 實測對照
created: 2026-10-01
modified: 2026-10-01
co_authors: [agent:01, agent:10, agent:12, agent:30]
lifecycle: active
access: public-research
---

# 架構規格書：萬能筆記（Omni-Note）vault ↔ TypeScript 雙向同步現況

> **5T-Traceable**：由熱鍵 `/esggo-omni-obsidian-sync` 觸發，實測 `511b3455e` 之後的 repo 狀態撰寫。
> **5T-Trackable**：每條數字附可重現指令與 exit code。
> **5T-Tangible**：47 篇 vault 筆記 + 47/47 frontmatter 合規 + 4 個 consumer 產物，全部實測。
> **5T-Transparent**：附件宣稱的 `sdks/omni-one`「覺醒引擎」經實測為**硬編碼空殼**，見 §5。
> **5T-Trustworthy**：本規格書執行過程中僅**新增** `access` 欄位，未刪改任何既有筆記內容。

---

## 1. 系統定位

```
   ┌────────────────────────────────────────────────────┐
   │  vault/  (Obsidian 第二大腦，47 篇 .md)│
   │  └─ vault/AGENTS.md (61 行) ← 本 vault 的權威規範  │
   └───────────────┬────────────────────────────────────┘
                   │ 雙向橋（3 個腳本，全實測可跑）
     ┌─────────────┼─────────────┐
     ▼             ▼             ▼
 canonical→vault vault→canonical  憑證閘
 export-shared-  sync-vault-     vault-access-
 types.js        types.ts        guard.mjs
     │             │             │
     ▼             ▼             ▼
 types/generated/ shared/types.ts  阻擋真憑證
 esggo-shared.d.ts  (539 行)      進 vault
     │
     ├─▶ apps/learning-center/types/generated/     (472)
     ├─▶ apps/universal-translator/types/generated/ (472)
     └─▶ oa-swarm/types/generated/                  (472)

   ┌────────────────────────────────────────────────────┐
   │  萬能筆記 UI (應用層)│
   │  app/omni-center/wuzuo-note-view.tsx (427 行)     │
   │  sdks/omni-one/ (6 檔，但子模組為空殼，見 §5)     │
   └────────────────────────────────────────────────────┘
```

## 2. 組件規格（實測值）

### 2.1 vault 端

| 項目 | 實測值 | 指令 |
|---|---|---|
| vault 根 | `C:/Project/esggo/vault/`（**repo 內**，非獨立） | `find -name ".obsidian"` |
| `.md` 總數 | **47** | `find vault -name "*.md" -not -path "*/.obsidian/*" \| wc -l` |
| 規範檔 | `vault/AGENTS.md` = **61 行** | `wc -l` |
| frontmatter 合規 | **47 / 47** | 逐檔 `head -1` + `grep source_origin` |
| access 合規 | **47 / 47** | 逐檔 `grep -qE '^\s*access\s*:'` |

分區計數：`Agents/context` 35 · `Agents/reasoning-core` 8 · `00-inbox` 1 · `Agents/04-Index` 1 · `Agents/briefing` 1 · `inbox-triage` 0 · `artifacts` 0 · `Daily` 0

> ⚠️ `inbox-triage` / `artifacts` / `Daily` 三區為**空** —— `vault/AGENTS.md` 定義它們為
> 待委派區 / 過閘產物區 / 每日筆記，但實測 0 篇。屬「規範已定義、實務未啟用」。

### 2.2 TS 端

| SSOT | 行數 | bytes | 角色 |
|---|---|---|---|
| `shared/types.ts` | **539** | **15,607** | canonical，驅動 4 個 `.d.ts` fan-out |
| `src/types/twelve-omni.ts` | 1,083 | **32,940** | 12 大萬能架構型別（**93 介面 + 15 type**） |

### 2.3 雙向橋腳本

| 腳本 | 行數 | 實測輸出 |
|---|---|---|
| `scripts/export-shared-types.js` | 125 | `OK types/generated/esggo-shared.d.ts` / exit 0 |
| `scripts/sync-vault-types.ts` | 105 | `{"scanned":44,"vaultTypes":3,"canonicalNames":53,"suggestedAdditions":[]}` |
| `scripts/vault-access-guard.mjs` | 56 | `✅ 通過: 無真憑證, 研究權限可全開` / exit 0 |

## 3. 關鍵設計決策（ADR）

### ADR-1：canonical 是 `shared/types.ts`，不是 `src/types/twelve-omni.ts`

- **決策**：fan-out 機制以 `shared/types.ts` 為源。
- **理由含證據**：`export-shared-types.js` 實測產出到 `types/generated/`，輸入為 `shared/types.ts`。兩檔 `IComponentCore.evidence` 語意不同（見 ADR-2）。
- **後果**：改萬能架構型別**不會**自動 fan-out 到 apps；要同步需手動指定。

### ADR-2：雙 SSOT 並存是既成事實，不可貿然收斂

| SSOT | `IComponentCore.evidence` 欄位 | 語意 |
|---|---|---|
| `shared/types.ts` | `originCause` / `processTrace` / `finalEffect` | 因果（觀因循果） |
| 藍圖附件要求 | `origin_id` / `origin_hash` / `extraction_method` | 憑證 |

- **後果**：附件的泛型 `IComponentCore<T>` + 憑證語意 `evidence`，全 repo **0 處實作**（實測 `git grep -c "interface IComponentCore<"` = 0）。若強行套用會破壞 100+ 處引用。

### ADR-3：批次補 frontmatter 用 Python 而非 `patch`

- **決策**：10 檔批次以 Python 分「已有 frontmatter / 完全無 frontmatter」兩路徑處理。
- **理由含證據**：`Agents/briefing/2026-10-01.md` 首行是 `# 標題` 而非 `---`，若只看第一行判斷會誤判為「已有 frontmatter」而插錯位置。
- **後果**：9 檔 insert + 1 檔 create，全部保留原有欄位與內文。

## 4. CI / 驗證閘

| 閘 | 指令 | 實測結果 |
|---|---|---|
| 憑證閘 | `node scripts/vault-access-guard.mjs` | ✅ exit 0，掃描 45 篇，**0 警告**（修補前 10 警告） |
| canonical → vault | `node scripts/export-shared-types.js` | ✅ exit 0 |
| vault → canonical | `npx tsx scripts/sync-vault-types.ts` | ✅ `suggestedAdditions: []` = **無漂移** |
| 產物漂移 | `git status --short types/generated/ …` | ✅ **空**（4 產物與 HEAD 一致） |
| frontmatter 合規 | 逐檔掃描 | ✅ 47 / 47 |

> 註：守衛報「掃描 45 篇」而總數 47 —— 守衛排除 `AGENTS.md` 與自身索引檔，差額 2 屬預期。

## 5. 已知邊界

| 項目 | 狀態 | 證據 |
|---|---|---|
| vault↔TS 雙向同步 | ✅ 已驗證 | 上表 5 閘全通 |
| 4 個 consumer 產物無漂移 | ✅ 已驗證 | `git status` 空 |
| vault 47 檔 5T 合規 | ✅ 已驗證（本輪修畢） | 47/47 |
| 萬能筆記過濾/排序 | ✅ **真實可用** | `wuzuo-note-view.tsx` L98-104 三個 `useState` + L176-213 `useMemo` + L275/289/304 三個 `<select>` |
| **`sdks/omni-one` 覺醒引擎** | ❌ **硬編碼空殼** | `awakening-core.ts`(13行) 回傳固定字串；`memory-system.ts` 的 `retrieveRelevant(query)` **不使用 query 參數**，直接回傳前 5 筆；`case-handler.ts` 僅 `includes('計算')` 關鍵字比對；`autonomous-learning.ts`(4行) 的 `evolveStrategy()` 是**空函式**。附件卻宣稱四大特性「智能分類/記憶檢索/策略進化/反饋學習」 |
| `inbox-triage`/`artifacts`/`Daily` 三區 | ⏸ 規範已定義但 0 篇 | 見 §2.1 |
| 雙 SSOT 收斂 | ❌ 未做，屬架構決策 | 見 ADR-2 |
| `vault/AGENTS.md` 權威性 | ⚠️ 高於本技書 | 61 行，規範更細 |

### 對附件末尾「已刻印」宣稱的駁斥

附件聲稱萬能筆記體系已「建置完成」。實測**部分成立**：
萬能筆記 UI 的過濾排序確為可用程式碼；但 `sdks/omni-one` 的「覺醒引擎」是硬編碼示範骨架，
`IComponentCore<T>` 泛型契約 0 處實作。**不可將兩者混為「已完成」。**

## 6. 失敗模式

| 徵兆 | 原因 | 處置 |
|---|---|---|
| 在 `omni-obsidian-vault` 找不到 vault | 誤記為獨立 repo | 實際在 `C:/Project/esggo/vault/` |
| 同步報 468 vs 472 行不一致 | 誤判為漂移 | `diff` 確認僅 4 行 JSDoc；以 `git status` 為準 |
| `patch` 插 `access` 插錯位置 | 首行是 `# 標題` 非 `---` | 用 `text.startswith("---")` 判斷 |
| 守衛報 10 個「缺 access」警告 | cron 產物無 frontmatter | Python 兩路徑批次修 |
| 改了 twelve-omni 型別但 apps 沒變 | 雙 SSOT | fan-out 只吃 `shared/types.ts` |

## 7. 未得成果登記（TODO）

| # | 項目 | 阻塞類型 | 建議處置 |
|---|---|---|---|
| 1 | `sdks/omni-one` 4 個子模組仍是空殼 | `todo` | `retrieveRelevant` 真的用 query；`evolveStrategy` 補實作；`case-handler` 改真分類 |
| 2 | vault `inbox-triage`/`artifacts`/`Daily` 三區 0 篇 | `debt` | 規範已定義，需實際啟用或登記 `wont_fix_by_design` |
| 3 | 雙 SSOT（`shared/types.ts` vs `src/types/twelve-omni.ts`） | `needs_user_decision` | 收斂或明文化邊界 |
| 4 | `IComponentCore` 泛型化 + 憑證語意 `evidence` | `needs_user_decision` | 需評估 100+ 處引用影響 |
| 5 | `Agents/reasoning-core` 8 篇未納入分區規範 | `todo` | `vault/AGENTS.md` 目錄結構未列此區 |

> 依 5T 規則，登記本身就是交付的一部分，不得省略，亦不得在後續技書假稱已完成。