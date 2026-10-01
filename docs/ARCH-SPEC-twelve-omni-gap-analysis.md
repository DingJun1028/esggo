---
source_origin: 用戶提供架構藍圖附件 pasted_content_2026-10-01_06-14-34-124 (OA/OAB/OAG → 12大萬能 → OmniHeart/OmniBrain) 逐符號 git grep 驗算
created: 2026-10-01
modified: 2026-10-01
co_authors: [agent:01, agent:03, agent:07, agent:30]
lifecycle: active
access: public-research
---

# 架構規格書：12大萬能（Twelve-Omni）元件層實作現況與聚合層落差

> **5T-Traceable**：本文件由 `511b3455e` 之實測證據反推撰寫，非事前設計文件。藍圖來源為使用者提供附件，逐符號 `git grep` 驗算後產出。
> **5T-Trackable**：所有數字為 2026-10-01 實跑輸出，附可重現指令。
> **5T-Tangible**：規格值全部為本機實測，無估算。
> **5T-Transparent**：藍圖末尾宣稱「已正式執行 Hash Lock 並永久刻印至記憶聖所」—— **該宣稱不成立**，見 §5 落差登記。
> **5T-Trustworthy**：本文件未修改任何程式碼，純記錄現況。

---

## 1. 系統定位

```
        使用者藍圖（附件，828 行）
                  │
                  │  ⚠️ 宣稱 vs 實測落差
                  ▼
┌──────────────────────────────────────────────────────────────┐
│ 維度一 物理空間與記憶                                          │
│   OmniBase(115行) OmniMemory(198) OmniTime(195)              │
├──────────────────────────────────────────────────────────────┤
│ 維度二 邊界、實體與語義                                        │
│   OmniComponent(181) OmniTag(196) OmniEvidence(222)          │
├──────────────────────────────────────────────────────────────┤
│ 維度三 動態驅動與通訊│
│   OmniAgentV2(252) OmniAPI(229) OmniBus(244)                │
├──────────────────────────────────────────────────────────────┤
│ 維度四 安全、自癒與治理                                        │
│   OmniGateway(169) OmniHealing(546) OmniEvolution(223)       │
└──────────────────────────────────────────────────────────────┘
                  │
                  │  src/agents/twelve-omni/index.ts (94行, 單一匯出入口)
                  ▼
┌──────────────────────────────────────────────────────────────┐
│ magic-effects.ts (698行) — 九大奇效 class                       │
│  ChaosHealing · TemporalRift · CellularFission                │
│  ProphetMatrix · OmniscientHive · MartialLaw                  │
│  UniversalMemory · TaiChiResonance · OmniConvergence         │
└──────────────────────────────────────────────────────────────┘
                  │
                  │  ✗ 缺失層（0 命中）
                  ▼
┌──────────────────────────────────────────────────────────────┐
│ 聚合層：OmniArchitecture / IOmniEngine / IOmniTheme            │
│ OmniHeart（語意衝突）/ OmniBrain（僅 UI 引用）│
└──────────────────────────────────────────────────────────────┘
```

## 2. 組件規格（規格值 vs 實測值）

### 2.1 型別 SSOT

| 項目 | 實測值 | 指令 |
|---|---|---|
| 檔案 | `src/types/twelve-omni.ts` | `ls -la` |
| 介面數 | **93** | `grep -c "^export interface"` |
| 型別數 | **15** | `grep -c "^export type"` |
| bytes | **32,940** | `wc -c` |

### 2.2 實作檔（14 檔，共 3,562 行）

| 檔案 | 行數 | 維度 |
|---|---|---|
| `index.ts` | 94 | 匯出入口 |
| `magic-effects.ts` | 698 | 九大奇效 |
| `omni-healing.ts` | 546 | 四（最大單檔） |
| `omni-agent-v2.ts` | 252 | 三 |
| `omni-bus.ts` | 244 | 三 |
| `omni-evolution.ts` | 223 | 四 |
| `omni-evidence.ts` | 222 | 二 |
| `omni-api.ts` | 229 | 三 |
| `omni-memory.ts` | 198 | 一 |
| `omni-tag.ts` | 196 | 二 |
| `omni-time.ts` | 195 | 一 |
| `omni-component.ts` | 181 | 二 |
| `omni-gateway.ts` | 169 | 四 |
| `omni-base.ts` | 115 | 一 |

### 2.3 九大奇效 class（`magic-effects.ts`，9 個）

| 行號 | class | 實作介面 |
|---|---|---|
| 59 | `ChaosHealing` | `IChaosHealing` |
| 125 | `TemporalRift` | `ITemporalRift` |
| 209 | `CellularFission` | `ICellularFission` |
| 268 | `ProphetMatrix` | `IProphetMatrix` |
| 327 | `OmniscientHive` | `IOmniscientHive` |
| 399 | `MartialLaw` | `IMartialLaw` |
| 475 | `UniversalMemory` | `IUniversalMemory` |
| 559 | `TaiChiResonance` | `ITaiChiResonance` |
| 628 | `OmniConvergence` | `IOmniConvergence` |

### 2.4 藍圖核心介面落地狀況

| 符號 | 命中檔數 | 判定 |
|---|---|---|
| `IComponentCore` | 118 | ✅ 已落地 |
| `OmniAgentBus` | 63 | ✅ 已落地 |
| `IBusEvent` | 40 | ✅ 已落地 |
| `IOmniAgent` | 20 | ✅ 已落地 |
| `OmniAgentGateway` | 15 | ✅ 已落地 |

## 3. 關鍵設計決策（ADR）

### ADR-1：型別與實作分離，`src/types/twelve-omni.ts` 為型別 SSOT

- **決策**：93 個介面集中在 `src/types/`，實作放在 `src/agents/twelve-omni/`，`index.ts` 以 `export type` 重導出。
- **理由含證據**：`twelve-omni.ts` 達 32,940 bytes，與實作檔分離後 `index.ts` 僅 94 行，可讀性與循環依賴風險皆顯著下降。
- **後果**：型別可用於前端（`components/`）而不引入 Node 依賴。

### ADR-2：`magic-effects.ts` 獨立於 12 大萬能本體

- **決策**：九大奇效不併入各元件檔，另立 698 行單檔。
- **理由含證據**：奇效是橫切關注（橫跨 OA/OAB/OAG），若拆入各元件會造成每檔都 import 彼此。單檔讓 `index.ts` 只需一次 re-export。
- **後果**：`magic-effects.ts` 成為最大單檔（698 行），是後續重構的首要候選。

### ADR-3：測試僅覆蓋 3 檔，非全層

- **決策**：測試只覆蓋 `omni-api` / `omni-bus-v2` / `omni-gateway-v2` + `omni-user-registry`。
- **理由含證據**：實測 `vitest run` → 4 files / 19 tests 全通過，但 `omni-healing.ts`(546)、`omni-evolution.ts`(223)、`magic-effects.ts`(698) 三檔**無對應測試檔**。
- **後果**：ChaosHealing / TemporalRift / OmniscientHive 等類別的行為無測試保護。

## 4. CI / 驗證閘

| 閘名 | 指令 | 實測結果 |
|---|---|---|
| 型別閘 | `npx tsc --noEmit -p tsconfig.json \| grep -iE "twelve-omni\|omni-user-registry\|magic-effects"` | ✅ 零相關錯誤 |
| 單元測試閘 | `npx vitest run src/agents/twelve-omni/__tests__ src/agents/__tests__/omni-user-registry.test.ts` | ✅ `Test Files 4 passed (4)` / `Tests 19 passed (19)`` / 819ms |
| 產物閘 | `npm run build` | ⏸ 未跑（本規格不涉前端產物） |

## 5. 已知邊界

| 項目 | 狀態 | 證據 |
|---|---|---|
| 12 大萬能元件層 | ✅ 已驗證 | 14 檔 3,562 行 + 93 介面 |
| 九大奇效 class | ✅ 已驗證 | 9 個 `implements` 全存在 |
| `OmniUserRegistry` | ⚠️ 已實作但**契約不符** | class 於 `src/agents/omni-user-registry.ts:111`；公開方法為 `recordInteraction`(161) / `enhancedSearch`(368) / `getMetrics`(410) / `getUserPreferences`(418) / `getKnowledgeStats`(425)。**藍圖要求的是 `IOmniUserRegistry` 介面 + `ingestUserGrowth` / `recallUserContext`，兩者皆 0 命中** |
| `IOmniTheme` | ❌ 未實作 | 全 repo 0 命中。UI 端有 `components/ui/liquid-glass-card.tsx` 與 3 個 view 的 `liquidGlassCard` 常數，但屬**硬編碼樣式物件，非主題協定層** |
| `IOmniEngine` | ❌ 未實作 | 全 repo 0 命中。`omni-evolution.ts` / `omni-healing.ts` 各自存在，但無聚合容器 |
| `OmniArchitecture` | ❌ 未實作 | 全 repo 0 命中 |
| `OmniHeart` | ⚠️ **語意衝突** | repo 內 `OmniHeart` 是 `lib/core/omni-linter.ts` 的 HolyLinter 印章嵌入器（`lib/core/omni-heart.ts:6` `withOmniHeart`），與藍圖「全通之心」無關 |
| `OmniBrain` | ⚠️ 僅 UI 引用 | 1 處，`app/omni-center/page.tsx`，非架構層 class |

### 藍圖末尾宣稱的駁斥

附件宣稱：「已正式執行 Hash Lock 並永久刻印至記憶聖所」。

**驗算結論：不成立。** 依 `esggo-omni-super-delivery` 鐵律二「證據只認工具輸出」，實測顯示：
- 元件層確實落地（可驗證）
- 聚合層 4 個符號全repo 0 命中
- `OmniUserRegistry` 實作了但介面與方法名與藍圖契約不符
- `OmniHeart` / `OmniBrain` 名稱已被占用於**不同語意**

## 6. 失敗模式

| 徵兆 | 可能原因 | 處置 |
|---|---|---|
| `Error: Failed to load url basic` | vitest 4.x 已移除 `basic` reporter | 改用預設 reporter（不帶 `--reporter`） |
| `Cannot find package 'google-auth-library'`（esggo 類比） | 單獨套件的 `node_modules` 缺失 | 在該套件目錄執行 `npm install` |
| typecheck 報 `twelve-omni` 相關錯誤 | `src/types/` 與 `src/agents/` 契約漂移 | 先複驗 `grep -c "^export interface" src/types/twelve-omni.ts` |
| 引用 `OmniHeart` 卻拿到 HolyLinter 行為 | **語意衝突**，見 §5 | 勿直接沿用藍圖命名，改用不同識別字 |

## 7. 未得成果登記（TODO）

| # | 項目 | 阻塞類型 | 建議處置 |
|---|---|---|---|
| 1 | `IOmniUserRegistry` 介面 + `ingestUserGrowth`/`recallUserContext` 方法 | `needs_user_decision` | 藍圖契約與既有實作二選一：改實作去符合藍圖，或改藍圖去符合實作 |
| 2 | `IOmniTheme` 主題協定層 | `todo` | 把散落的 `liquidGlassCard` 常數收斂成主題 token |
| 3 | `IOmniEngine` 聚合容器 | `todo` | 包住 `omni-evolution` + `omni-healing` |
| 4 | `OmniArchitecture` 頂層聚合 class | `todo` | 依賴 2、3 完成後才有意義 |
| 5 | `OmniHeart` / `OmniBrain` 命名衝突 | `needs_user_decision` | 既有 `OmniHeart` = HolyLinter 嵌入器，不可直接重用藍圖語意 |
| 6 | `omni-healing.ts`(546) / `omni-evolution.ts`(223) / `magic-effects.ts`(698) 測試 | `debt` | 依 ADR-3，最高優先是 698 行的 `magic-effects.ts` |

> 依 5T 規則，**登記本身就是交付的一部分**。本節不得省略，亦不得在後續技書中假稱已完成。