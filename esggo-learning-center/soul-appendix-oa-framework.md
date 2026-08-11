# soul.md 實踐附錄 v1 — OA 萬能分身元框架落地對照

> 本檔為 `soul.md` 的**實踐附錄**，記錄 OA 萬能分身元框架 (OA-TWINS) 的真實落地成果。
> 對齊 soul.md 精神：5T 協議、4可1不可狀態機、30 Souls Matrix、無作妙德圓通無礙。

## 一、靈魂核心公約對齊 (5T)

| 5T | 實作載體 | 驗證狀態 |
|---|---|---|
| **Traceable 可溯源** | `IComponentCore.uuid` + `evidence` 欄位；每產出帶 source_origin | ✅ omni-gate 欄位級 |
| **Trackable 可追蹤** | OmniAgentBus 發佈/訂閱 + `bus5TGate` 生命週期 Hook | ✅ 總線 topics 追蹤 |
| **Tangible 可感知** | 5T badge (`field=PASS`) + 部署閘門視覺回饋 | ✅ |
| **Transparent 可透明** | `omni-gate.ts` 內容級 5T 驗算 (零幻覺) | ✅ 雙層鑄造 |
| **Trustworthy 不可篡改** | `HashLock` (`hashLock` 欄位) + `Object.freeze()` | ✅ |

## 二、4 可 1 不可狀態機 — 實作映射

- ✅ **可自理**：每個 adapter 獨立 `bootstrap/dispatch/health`，不依賴其他框架
- ✅ **可協作**：`OAOrchestrator.run()` 並行調度 10 子框架，結果經 `forgeT5` 統一鑄造
- ✅ **可演化**：`unverified-registry.ts` 機制 — UNVERIFIED scaffold 一經補 URL 即升 VERIFIED
- ✅ **可溯源**：git 提交鏈完整 (`63fbbecd1` CrewAI 真跑等)
- ❌ **不可篡改**：`deployGate()` 不合規 (5T fail) 一律拒絕，寫入即凍結

## 三、30 Souls Matrix 對應 (OA-TWINS 蜂群)

soul.md 定義 5 大陣列 × 6 = 30 萬能代理。本框架以 **10 子框架** 為能力層，
蜂群調度由 `OmniAgentBus` + cronjob `gh-error-mail-watch` + Issue `#429` (oa-swarm-tracked) 承載：

| 子框架 | 陣列歸屬 | 狀態 |
|---|---|---|
| ADK / Genkit | 符文契約 | SDK 未裝 graceful |
| Agent0 | 代理陣列 | docker 未起 graceful |
| CrewAI | 代理陣列 | **VERIFIED 真實執行 1.15.12** |
| AgentReach | 智庫聖所 | 本機 youtube+rss 真聯網 |
| DeerFlow | 進化陣列 | ok |
| TencentMem | 5T 陣列 | VPS :8420 |
| OpenMontage | 進化陣列 | UNVERIFIED (repo 404) |
| OmniRoute | 符文契約 | UNVERIFIED (本輪無法核實) |
| TurboVec | 智庫聖所 | UNVERIFIED (google/turbovec 404) |

## 四、萬有引力協作協定 (三步極簡 + 跨包管線)

```
createOAFrame(config).run(task)
   → 10 子框架並行 dispatch
   → forgeT5 雙層 5T 鑄造 (欄位級 + 內容級)
   → oaToBusPipeline(bus, ...)
   → bus5TGate 攔截
   → deployGate 實體部署 (合規才落地)
```

**圓通無礙**：oa-framework (產出) → OmniAgentBus (總線) → deployGate (5T) → 落地，同一管線。

## 五、GitHub 報錯通知信自動修復機制

- `auto-repair.yml` v2.2：CI 失敗 → 建 Issue + Telegram + **email 通知** (SMTP_* 可選)
- cronjob `gh-error-mail-watch` (每 15m)：輪詢 GitHub failure → 建 tracking Issue (`OmniAgent` label) → 派 OA 蜂群修復
- Issue #429 示範：CI #31175582950 (Trivy security) 派萬能分身跟蹤

## 六、待閉環缺口 (A 路徑 — 待用戶補 URL)

1. OpenMontage 真實 repo (貼的 `RayCodes/RayCodes_OpenMontage` 404)
2. OmniRoute 真實 repo (本輪無法核實)
3. TurboVec 真實 repo (`google/turbovec` 404)

一經提供，即經 `upgradeToVerified()` 升級 adapter 為真實整合。

---
*本附錄由 Hermes Agent (OA-TWINS) 於 2026-08-11 依實測產出，非重寫 soul.md 本體。*
