# 第二十五章 · 落地總結（Best-Practice Implementation Closure）

> 接於 §24 缺口補齊診斷之後；終章封印仍為最高律法，本章不逾其界。
> 本章將本會話（用戶授權「全部都是」）從 §23 最佳實踐 → §24 診斷 → P0~P2 實作 → 實跑驗證的完整閉環落成章節。

## 25.1　規劃項目與實作對照

| 項目 | 規劃 (§24.3) | 實作產物 | 狀態 | 驗證 |
| --- | --- | --- | --- | --- |
| P0 統一5T契約 | omni-agent-bus 暴露 HTTP 5T 閘 | esggo `app/api/verify-5t/route.ts` + aistation `gate5t.verify_via_esggo` 改呼叫 | ✅ 已推 (dc80833d / aa17590) | tsc + pytest 綠 |
| P1 跨倉KPI看板 | 聚合 esggo summary + aistation metrics | aistation `kpi.py`: `fetch_esggo_summary` + `build_weekly_report` + `render_weekly_markdown` | ✅ 已推 (03418b9 / d46a09c) | pytest 17/17 綠 |
| P1 電子報n8n | newsletter 包週報 cron | aistation `scripts/weekly_report.py` + `n8n/weekly-swarm-report.json` | ✅ 已推 (03418b9) | dry-run markdown 實跑 |
| P2 熵減+配對率埋點 | lifecycle 追蹤 | esggo `packages/omni-agent-bus/src/patterns/lifecycle.ts` + index 匯出 + smoke | ✅ 已推 (609555e6e) | tsx 實跑 + tsc 綠 |
| 備份章節推送 | learning-center §23+§24 | stash WIP → rebase → push → pop | ✅ 已推 (36203baa) | WIP 11 檔完整還原 |

## 25.2　實跑驗證發現（誠實記錄）

### 25.2.1 `/api/verify-5t` 端點實際回應（本機 dev server :3939）
```
POST /api/verify-5t
→ {"pass":false,"status":{"traceable":false,...},"score":{"traceable":0,...},
   "hashLock":"<sha256>","source":"esggo-five-t-protocol"}
```
**關鍵揭露**：esggo 的 `calculateFiveTScore` 要求 `sources.length >= 4` 才 `traceable=1`。
aistation 的 artifact 僅帶 1 個 `source_origin` → `traceable=0` → 權威閘不通過。
這正是 P0「單一真相源」的價值：暴露 aistation 原本 5T 閘太寬鬆（布林存在即過），
未來 aistation artifact 需帶多源 `sources` 才能過 esggo 權威閘。

### 25.2.2 跨倉 KPI 雙層嵌套 bug（已修）
esggo `/api/omni-center/summary` 回傳 `{success:true, data:{success:true, data:{...}}}`（雙層）。
aistation `fetch_esggo_summary` 原取 `.get("data")` 只拿到外層 → `案件數: ?`。
**修復**：遞迴 unwrap `{data:{data:{...}}}`（kpi.py d46a09c），新增 3 測試覆蓋。

### 25.2.3 `/api/verify-5t` JSON 轉義
curl 直接傳中文雙引號 JSON 會報 `Bad escaped character`；用 `--data-binary @file` 解決。
（esggo 端已用 `safeJsonParse` 容錯，回 400 而非 500。）

## 25.3　5T 契約統一狀態（單一真相源達成）

```
aistation.artifact
      │  (source_origin, lifecycle_hooks, ui_feedback, transparent_audit, frozen)
      ▼
gate5t.verify_via_esggo() ──HTTP POST──▶ esggo /api/verify-5t
                                          │  使用 five-t-protocol.ts
                                          │  calculateFiveTScore → FiveTGatekeeper.evaluate
                                          ▼
                                     {pass, status, score, hashLock}
      ◀───────────────────────────────────
aistation 接受 esggo 權威判定 (本地 fallback 僅當 ESGO_HASHLOCK_URL 未設)
```

## 25.4　待續項（非阻塞）

- aistation artifact 需補 `sources: string[]`（多源）以過 esggo 權威閘（P0 揭露的寬鬆問題）
- n8n workflow 需 VPS 實部署 + Telegram/Slack 憑證（免費路徑：Hermes webhook 已設）
- omni-agent-bus `src/patterns/` 整目錄在 esggo 中未追蹤（含既有 five-t.ts），P2 lifecycle 隨之列於未追蹤區；
  未強推整目錄以避免夾帶用戶其他開發中 patterns（尊重 working tree）

## 25.5　喚醒指引

- 主典：`C:/Project/esggo/esggo-omni-center/soul-full.md` §二十五
- 備份：`C:/Project/esggo-learning-center/soul-chapter-25-landing-summary.md`
- 代碼：aistation `src/{gate5t,kpi,newsletter}.py` + `scripts/weekly_report.py` + `n8n/weekly-swarm-report.json`；
  esggo `app/api/verify-5t/route.ts` + `packages/omni-agent-bus/src/patterns/lifecycle.ts`
- 喚醒技能：`oa-dual-agent-obsidian` 已補 §25
