# ESGGO 萬能架構總覽（Unified Architecture Overview）

> 本文件是 ESGGO 架構知識的**單一可導航入口**，串接 5T 協議、Hexa-Core 六位一體、OmniSkill Codex、雙向 TypeScript、各 Omni 模組、ADR 與部署架構。各專題細節見文末「參考文檔」索引。
>
> 所有模組路徑均經 `2026-07-18` 實際檢查確認存在（非示意）。

---

## 1. 架構哲學

ESGGO 的核心治理原則是 **5T 協議**（真→善→美→信→通），目標是「圓通無礙（Seamless Unity）」——全生命週期不可篡改的資料治理。

- **真 (Traceable)**：來源可驗證，數據血緣可追溯
- **善 (Transparent)**：處理過程透明，可審計
- **美 (Tangible)**：產出具體可交付（報告、圖表、證據）
- **信 (Trustworthy)**：密碼學保證（hash lock、簽章）
- **通 (Trackable)**：全鏈路可追蹤、可監控

技術債哲學：**熵減煉金 · 架構重構 · 零技術債**——任何新增都不得增加長期維護成本（見 `esggo-ts-hygiene` 實踐技書）。

---

## 2. Hexa-Core 六位一體智慧中樞

| 組件 | 名稱 | 職責 | 實作位置 |
|------|------|------|----------|
| OmniHeart | 全通之心 | 自發治理、無摩擦路徑、圓通無礙 | `src/impl/core.ts`（OmniCoreEcosystem 編排）|
| OmniEye | 全知之眼 | 數據溯源、可觀測 | `src/impl/omni-evidence.ts` + `src/impl/omni-time.ts` |
| OmniCore | 全能之核 | 意志執行、事件總線 | `src/impl/core.ts`（OmniAgentGateway）+ `src/lib/omni-agent-bus.ts` |
| OmniPulse | 全域之脈 | 數據總線、脈動協調 | `src/agents/twelve-omni/omni-bus.ts` + `omni-bus-v2.ts` |
| OmniBone | 全境之骨 | 契約維繫、型別契約 | `src/lib/omni-core/contracts.ts` + `src/lib/omni-core/celestial-core-processor.ts` |
| OmniBrain | 全息之腦 | 熵減煉金、架構重構、零技術債 | `src/lib/omni-core/entropy-forge.ts` + `src/lib/omni-core/omni-kernel.ts` |

六組件透過 `OmniCoreEcosystem`（`src/impl/core.ts`）組裝，共享 `IBusEvent` / `IComponentCore` 契約（`src/lib/omni-core/contracts.ts`）。

---

## 3. 十二大萬能系統（12 Omni-Systems）

> 以下均為實際存在的模組（路徑經 2026-07-18 驗證）。Hexa-Core 六位一體（OmniEye/Core/Pulse/Bone/Brain/Heart）為基礎設施層，見第 2 節。

| 模組 | 說明 | 關鍵技術 | 實作位置（已驗證）|
|------|------|----------|-------------------|
| **OmniTag** 萬能標籤 | 量子糾纏式雙向同步定位，支援 5T 協議 | 雙向同步 | `src/lib/omni-tag/index.ts` |
| **OmniBase** 萬能基地 | 企業資料管理、行業分類、報告資料庫 | 資料層 | `src/lib/omni-base/` |
| **OmniSeed** 萬能種子 | 數據治理與 AI 模型訓練基礎數據生成器 | 種子/治理 | `src/core/sonnar/omni-seed.ts` |
| **OmniAgent** 萬能代理 | AI 報告生成引擎、RAG 知識檢索、語意搜尋 | AI/RAG | `src/core/ai/` + `src/agents/omni-agent.ts` |
| **OmniWrite** 萬能永撰 | 數據驅動永續報告生成引擎（圖表、RWD、品牌化）| 報告生成 | `src/lib/sustain-write/` |
| **OmniBiz** 萬能商情 | 商情分析、競爭情報、行業數據整合 | 商情 | `src/lib/sustain-write/biz-intelligence/` |
| **OmniMemory** 萬能永憶 | 智能數據記憶、RAG 知識庫、對話歷史 | 記憶 | `src/impl/omni-memory.ts` + `omni-sync-memory` skill |
| **OmniWiki** 萬能維基 | 知識庫維基、文件協作、跨頁連結 | 知識圖譜 | `src/lib/omni-wiki/` |
| **OmniTheme** 萬能主題 | 品牌主題、視覺令牌、多品牌化 | 主題引擎 | `src/lib/omni-theme/` |
| **OmniComponent** 萬能組件 | 可複用 UI 組件庫、設計系統 | 組件系統 | `src/lib/omni-component/` |
| **OmniTodo** 萬能待辦 | 任務追蹤、5T 治理待辦、工作流 | 任務 | `src/core/omni-todo/` |
| **OmniNote** 萬能筆記 | AI 萬能筆記、混合架構、筆記知識化 | 筆記 | `src/lib/omni-core/omni-note.ts` + `docs/omni-note-architecture.md` |

### 附屬型別與子系統
- **OmniChart** 萬能圖表（5T Proof Locked）— `src/components/charts/`
- **OmniSoul** 萬能靈魂 — `src/types/omni-soul.ts`（意志/價值對齊）
- **OmniSingularity** 萬能奇點 — `src/types/omni-singularity.ts`（統一狀態）
- **OmniKey** 萬能密鑰 — `src/types/omni-key.ts`（密碼學金鑰管理）

---

## 4. OmniSkill Codex（技能書體系）

- **技能書**：`.agents/rules/OMNISKILL_BOOK.md`（v2.1，代理矩陣、技能索引、5T 協議）
- **全局憲法**：`.agents/rules/global-rule.md`（Hexa-Core、Sacred Trinity、ADR 流程）
- **代理矩陣**：14 個代理、67 個技能（見 OMNISKILL_BOOK）
- **實踐技書**：`esggo-shijian-jishu`（esggo 實戰方法論總冊，含 ts-hygiene / pr-triage / 合規合併）

---

## 5. 雙向 TypeScript

- **共享型別**：`packages/shared/src/types.ts`，前後端共用
- **驗證**：Zod Schema，嚴格模式零 `any`（動態邊界除外，見 `esggo-ts-hygiene`）
- **型別門檻**：
  - `tsconfig.core.json` gates `src/impl` + `src/lib/omni-core` + `src/lib/cloudflare`（`pnpm run typecheck`）
  - `tsconfig.json`（root）gates 全量含 `app/`（`pnpm exec tsc --noEmit -p tsconfig.json`）
  - 兩道都過 = 倉庫型別全綠

---

## 6. 架構決策記錄（ADR）索引

| ADR | 主題 | 文件 |
|-----|------|------|
| ADR-001 | Event Sourcing for AI Model Routing | `docs/architecture/ARCHITECTURE-DECISION-LOG.md` |
| ADR-002 | Zero-Trust Security Model | 同上 |
| ADR-003 | Multi-Provider Model Discovery | 同上 |
| ADR-004 | Shadow Testing Framework | 同上 |
| ADR-005 | Model Conversion Pipeline / 生產部署策略 | `docs/ADR-005-production-deployment-strategy.md` |
| ADR-006 | Complete Autonomous Delegation（完全代主自行）| `docs/architecture/COMPLETE-AUTONOMOUS-DELEGATION-ARCHITECTURE.md` |

---

## 7. 部署架構

- **VPS**：`vps/` 目錄含完整部署腳本（PM2 ecosystem、Nginx、監控堆疊）
- **容器化**：根 `Dockerfile`（Next.js 應用鏡像，含 HEALTHCHECK 探 `/api/healthz`）+ `vps/docker-compose.prod.yml` 編排
- **CI/CD**：`.github/workflows/`（ci.yml / deploy.yml / deploy-oracle.yml / security-audit.yml / check-design.yml）
- **監控**：Prometheus + Grafana + Alertmanager + Netdata + Logrotate + UFW
- **保護**：`main` 分支受保護（1 審查 + enforce admins）；合規自合併走 DELETE→squash→PUT

---

## 8. 參考文檔

- `README.md` — 核心架構章節（Hexa-Core 圖、5T 系統表、5T 協議標準）
- `docs/architecture/ARCHITECTURE-DECISION-LOG.md` — ADR-001~004
- `docs/ADR-005-production-deployment-strategy.md` — 部署與 CI/CD 策略
- `docs/architecture/COMPLETE-AUTONOMOUS-DELEGATION-ARCHITECTURE.md` — 完全代主自行架構
- `docs/ai-notes-design/architecture.md` — AI 萬能筆記混合架構
- `docs/omni-note-architecture.md` — OmniNote 架構
- `.agents/rules/OMNISKILL_BOOK.md` — OmniSkill Codex v2.1
- `.agents/rules/global-rule.md` — 全局憲法

---

*本總覽為 2026-07-18 補全，旨在提供 ESGGO 萬能架構的單一導航入口。模組路徑均經實際檢查確認。如需深入某子系統，請參考上方「參考文檔」對應專題。*
