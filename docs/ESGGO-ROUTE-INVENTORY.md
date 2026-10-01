# ESGGO 路由歸屬清單（Route Inventory）

> **本檔為機讀產物，勿手動編輯。** 由 `node scripts/verify-domain-matrix.mjs --inventory` 重產。
> source_origin: `src/matrix/routes.ts` + 檔案系統實掃（`app/` + `src/app/`）
> co_authors: [萬能蜂后(01), 萬能架構蜂(09), 萬能數據蜂(10), 萬能質控蜂(30)]

- 產生時間: `2026-09-30T23:40:13.911Z`
- 總計: **137** 條（頁面 30 + API 107）
- 守門結果: **PASS (EXIT=0)**

## 歸屬分布

| 域 | 意義 | 條數 | 產物形態 | Hash Lock |
|---|---|---:|---|---|
| D1 | 永續報告 | 26 | 對外正式文件 | 需凍結 |
| D2 | 商情中心 | 16 | 外部情報 | 免凍結（情報具時效性，每分鐘變動；若凍結將使 hash 每分鐘失效，凍結無意義。） |
| D3 | ESG 戰情室 | 25 | 內部儀表狀態 | 免凍結（儀表為瞬時狀態投影，非事實記錄；凍結會使戰情室無法反映現況。） |
| D4 | 永續閱覽室 | 22 | 知識累積 | 需凍結 |
| D5 | 每日 ESGGO | 15 | 每日觀察 | 免凍結（每日重寫之觀察層；歷史以 append-only archive 保留，不需凍結當日版本。） |
| P0 | 平台層 | 33 | `⚠ canonical 缺 P0` | `⚠ 無法判定` |

## 已登記死碼（src/app 被根 app/ 遮蔽）

> 18 條。Next.js 只解析單一 app 目錄，根 `app/` 存在時 `src/app/**` 全部不生效。
> 階段 0 為凍結現況，故列為 baseline（WARN）；baseline 之外的新死碼才報紅。

- `/api/delegation`
- `/api/delegation/[id]`
- `/api/delegation/[id]/execute`
- `/api/delegation/audit`
- `/api/delegation/events`
- `/api/delegation/events/stream`
- `/api/delegation/health`
- `/api/delegation/metrics`
- `/api/esg-report`
- `/api/health`
- `/api/health-metrics`
- `/api/health/metrics`
- `/api/healthz`
- `/delegation/events`
- `/demo/delegation`
- `/demo/esg-analysis`
- `/design-system`
- `/omni-factory`

## 逐條歸屬

| 路由 | 類型 | 域 | 檔案 |
|---|---|---|---|
| `/api/admin/learning-center/users/[id]/claims` | api | D4 永續閱覽室 | `app/api/admin/learning-center/users/[id]/claims/route.ts` |
| `/api/admin/resources` | api | D4 永續閱覽室 | `app/api/admin/resources/route.ts` |
| `/api/admin/surveys` | api | D4 永續閱覽室 | `app/api/admin/surveys/route.ts` |
| `/api/agent/[id]/thought/demo` | api | P0 平台層 | `app/api/agent/[id]/thought/demo/route.ts` |
| `/api/agent/[id]/thought/stream` | api | P0 平台層 | `app/api/agent/[id]/thought/stream/route.ts` |
| `/api/agentic-twin` | api | D3 ESG 戰情室 | `app/api/agentic-twin/route.ts` |
| `/api/agnes` | api | D3 ESG 戰情室 | `app/api/agnes/route.ts` |
| `/api/ai-notes` | api | D4 永續閱覽室 | `app/api/ai-notes/route.ts` |
| `/api/ai-notes/[id]` | api | D4 永續閱覽室 | `app/api/ai-notes/[id]/route.ts` |
| `/api/ai-notes/[id]/summarize` | api | D4 永續閱覽室 | `app/api/ai-notes/[id]/summarize/route.ts` |
| `/api/ai-notes/search` | api | D4 永續閱覽室 | `app/api/ai-notes/search/route.ts` |
| `/api/ai-notes/tags` | api | D4 永續閱覽室 | `app/api/ai-notes/tags/route.ts` |
| `/api/ai/generate` | api | D2 商情中心 | `app/api/ai/generate/route.ts` |
| `/api/ai/status` | api | D2 商情中心 | `app/api/ai/status/route.ts` |
| `/api/async` | api | D3 ESG 戰情室 | `app/api/async/route.ts` |
| `/api/awaken/pulse` | api | D3 ESG 戰情室 | `app/api/awaken/pulse/route.ts` |
| `/api/awaken/ritual` | api | D3 ESG 戰情室 | `app/api/awaken/ritual/route.ts` |
| `/api/cron` | api | D5 每日 ESGGO | `app/api/cron/route.ts` |
| `/api/daily-report` | api | D5 每日 ESGGO | `app/api/daily-report/route.ts` |
| `/api/daily-report/generate` | api | D5 每日 ESGGO | `app/api/daily-report/generate/route.ts` |
| `/api/data/export` | api | D1 永續報告 | `app/api/data/export/route.ts` |
| `/api/delegation` | api | P0 平台層 | `src/app/api/delegation/route.ts` |
| `/api/delegation/[id]` | api | P0 平台層 | `src/app/api/delegation/[id]/route.ts` |
| `/api/delegation/[id]/execute` | api | P0 平台層 | `src/app/api/delegation/[id]/execute/route.ts` |
| `/api/delegation/audit` | api | P0 平台層 | `src/app/api/delegation/audit/route.ts` |
| `/api/delegation/events` | api | P0 平台層 | `src/app/api/delegation/events/route.ts` |
| `/api/delegation/events/stream` | api | P0 平台層 | `src/app/api/delegation/events/stream/route.ts` |
| `/api/delegation/health` | api | P0 平台層 | `src/app/api/delegation/health/route.ts` |
| `/api/delegation/metrics` | api | P0 平台層 | `src/app/api/delegation/metrics/route.ts` |
| `/api/emm/metrics` | api | D3 ESG 戰情室 | `app/api/emm/metrics/route.ts` |
| `/api/emm/metrics/stream` | api | D3 ESG 戰情室 | `app/api/emm/metrics/stream/route.ts` |
| `/api/esg-report` | api | D1 永續報告 | `src/app/api/esg-report/route.ts` |
| `/api/esg-sonnar` | api | D2 商情中心 | `app/api/esg-sonnar/route.ts` |
| `/api/esg/assess` | api | D1 永續報告 | `app/api/esg/assess/route.ts` |
| `/api/esg/best-practices` | api | D1 永續報告 | `app/api/esg/best-practices/route.ts` |
| `/api/esg/go` | api | D1 永續報告 | `app/api/esg/go/route.ts` |
| `/api/esg/report` | api | D1 永續報告 | `app/api/esg/report/route.ts` |
| `/api/esg/skills` | api | D1 永續報告 | `app/api/esg/skills/route.ts` |
| `/api/esg/skills/[taskType]` | api | D1 永續報告 | `app/api/esg/skills/[taskType]/route.ts` |
| `/api/esg/verify` | api | D1 永續報告 | `app/api/esg/verify/route.ts` |
| `/api/evidence-upload` | api | D1 永續報告 | `app/api/evidence-upload/route.ts` |
| `/api/evidence/parse` | api | D1 永續報告 | `app/api/evidence/parse/route.ts` |
| `/api/hashlock` | api | D3 ESG 戰情室 | `app/api/hashlock/route.ts` |
| `/api/health` | api | D3 ESG 戰情室 | `app/api/health/route.ts` |
| `/api/health` | api | D3 ESG 戰情室 | `src/app/api/health/route.ts` |
| `/api/health-metrics` | api | D3 ESG 戰情室 | `src/app/api/health-metrics/route.ts` |
| `/api/health/metrics` | api | D3 ESG 戰情室 | `src/app/api/health/metrics/route.ts` |
| `/api/healthz` | api | D3 ESG 戰情室 | `app/api/healthz/route.ts` |
| `/api/healthz` | api | D3 ESG 戰情室 | `src/app/api/healthz/route.ts` |
| `/api/learning-center` | api | D4 永續閱覽室 | `app/api/learning-center/route.ts` |
| `/api/learning-center/support` | api | D4 永續閱覽室 | `app/api/learning-center/support/route.ts` |
| `/api/library/download` | api | D1 永續報告 | `app/api/library/download/route.ts` |
| `/api/local-ai/chat` | api | D2 商情中心 | `app/api/local-ai/chat/route.ts` |
| `/api/memory` | api | D4 永續閱覽室 | `app/api/memory/route.ts` |
| `/api/nexus` | api | P0 平台層 | `app/api/nexus/route.ts` |
| `/api/nexus/agent` | api | P0 平台層 | `app/api/nexus/agent/route.ts` |
| `/api/notes` | api | D2 商情中心 | `app/api/notes/route.ts` |
| `/api/omni-agent` | api | P0 平台層 | `app/api/omni-agent/route.ts` |
| `/api/omni-agent/console` | api | P0 平台層 | `app/api/omni-agent/console/route.ts` |
| `/api/omni-center/summary` | api | D3 ESG 戰情室 | `app/api/omni-center/summary/route.ts` |
| `/api/omni-core/status` | api | D3 ESG 戰情室 | `app/api/omni-core/status/route.ts` |
| `/api/omni-factory` | api | P0 平台層 | `app/api/omni-factory/route.ts` |
| `/api/omni-one` | api | D3 ESG 戰情室 | `app/api/omni-one/route.ts` |
| `/api/omni-soul` | api | D3 ESG 戰情室 | `app/api/omni-soul/route.ts` |
| `/api/omni-todo` | api | D3 ESG 戰情室 | `app/api/omni-todo/route.ts` |
| `/api/omni-user-registry` | api | D3 ESG 戰情室 | `app/api/omni-user-registry/route.ts` |
| `/api/omni/plugins` | api | P0 平台層 | `app/api/omni/plugins/route.ts` |
| `/api/omni/sync` | api | D4 永續閱覽室 | `app/api/omni/sync/route.ts` |
| `/api/pdf/parse` | api | D1 永續報告 | `app/api/pdf/parse/route.ts` |
| `/api/rag/ingest` | api | D4 永續閱覽室 | `app/api/rag/ingest/route.ts` |
| `/api/rag/query` | api | D4 永續閱覽室 | `app/api/rag/query/route.ts` |
| `/api/reconnaissance/gateway` | api | D2 商情中心 | `app/api/reconnaissance/gateway/route.ts` |
| `/api/resources` | api | D4 永續閱覽室 | `app/api/resources/route.ts` |
| `/api/sonnar/alerts` | api | D2 商情中心 | `app/api/sonnar/alerts/route.ts` |
| `/api/sonnar/crawl` | api | D2 商情中心 | `app/api/sonnar/crawl/route.ts` |
| `/api/sonnar/document-progress` | api | D2 商情中心 | `app/api/sonnar/document-progress/route.ts` |
| `/api/sonnar/enterprise` | api | D2 商情中心 | `app/api/sonnar/enterprise/route.ts` |
| `/api/sonnar/knowledge` | api | D2 商情中心 | `app/api/sonnar/knowledge/route.ts` |
| `/api/sonnar/ocr` | api | D2 商情中心 | `app/api/sonnar/ocr/route.ts` |
| `/api/sonnar/radar` | api | D2 商情中心 | `app/api/sonnar/radar/route.ts` |
| `/api/sonnar/sustainability` | api | D2 商情中心 | `app/api/sonnar/sustainability/route.ts` |
| `/api/surveys` | api | D4 永續閱覽室 | `app/api/surveys/route.ts` |
| `/api/sustain-center/dashboard` | api | D3 ESG 戰情室 | `app/api/sustain-center/dashboard/route.ts` |
| `/api/sustain-write/c-version` | api | D1 永續報告 | `app/api/sustain-write/c-version/route.ts` |
| `/api/sustain-write/v5` | api | D1 永續報告 | `app/api/sustain-write/v5/route.ts` |
| `/api/sustain-write/v5/async` | api | D1 永續報告 | `app/api/sustain-write/v5/async/route.ts` |
| `/api/sustain-write/v5/documents` | api | D1 永續報告 | `app/api/sustain-write/v5/documents/route.ts` |
| `/api/sustain-write/v5/download` | api | D1 永續報告 | `app/api/sustain-write/v5/download/route.ts` |
| `/api/sustain-write/v5/evidence` | api | D1 永續報告 | `app/api/sustain-write/v5/evidence/route.ts` |
| `/api/sustain-write/v5/grammar` | api | D1 永續報告 | `app/api/sustain-write/v5/grammar/route.ts` |
| `/api/sustain-write/v5/preview` | api | D1 永續報告 | `app/api/sustain-write/v5/preview/route.ts` |
| `/api/sustain-write/v5/progress/[taskId]` | api | D1 永續報告 | `app/api/sustain-write/v5/progress/[taskId]/route.ts` |
| `/api/tags/pair` | api | D4 永續閱覽室 | `app/api/tags/pair/route.ts` |
| `/api/tags/universal` | api | D4 永續閱覽室 | `app/api/tags/universal/route.ts` |
| `/api/user/growth` | api | D5 每日 ESGGO | `app/api/user/growth/route.ts` |
| `/api/user/growth/xp` | api | D5 每日 ESGGO | `app/api/user/growth/xp/route.ts` |
| `/api/user/leaderboard` | api | D5 每日 ESGGO | `app/api/user/leaderboard/route.ts` |
| `/api/user/subscription` | api | D5 每日 ESGGO | `app/api/user/subscription/route.ts` |
| `/api/user/tasks` | api | D5 每日 ESGGO | `app/api/user/tasks/route.ts` |
| `/api/verify-5t` | api | D3 ESG 戰情室 | `app/api/verify-5t/route.ts` |
| `/api/village/data` | api | D5 每日 ESGGO | `app/api/village/data/route.ts` |
| `/api/village/members` | api | D5 每日 ESGGO | `app/api/village/members/route.ts` |
| `/api/village/projects` | api | D5 每日 ESGGO | `app/api/village/projects/route.ts` |
| `/api/village/trends` | api | D5 每日 ESGGO | `app/api/village/trends/route.ts` |
| `/api/village/vote` | api | D5 每日 ESGGO | `app/api/village/vote/route.ts` |
| `/api/zenrows/fetch` | api | D2 商情中心 | `app/api/zenrows/fetch/route.ts` |
| `/api/zkp` | api | D3 ESG 戰情室 | `app/api/zkp/route.ts` |
| `/` | page | P0 平台層 | `app/page.tsx` |
| `/admin` | page | P0 平台層 | `app/admin/page.tsx` |
| `/daily` | page | D5 每日 ESGGO | `app/daily/page.tsx` |
| `/delegation/events` | page | P0 平台層 | `src/app/delegation/events/page.tsx` |
| `/demo/delegation` | page | P0 平台層 | `src/app/demo/delegation/page.tsx` |
| `/demo/esg-analysis` | page | P0 平台層 | `src/app/demo/esg-analysis/page.tsx` |
| `/design-system` | page | P0 平台層 | `src/app/design-system/page.tsx` |
| `/emm` | page | P0 平台層 | `app/emm/page.tsx` |
| `/export` | page | P0 平台層 | `app/export/page.tsx` |
| `/learning-center` | page | D4 永續閱覽室 | `app/learning-center/page.tsx` |
| `/login` | page | P0 平台層 | `app/login/page.tsx` |
| `/omni-agent` | page | P0 平台層 | `app/omni-agent/page.tsx` |
| `/omni-agent/console` | page | P0 平台層 | `app/omni-agent/console/page.tsx` |
| `/omni-base` | page | P0 平台層 | `app/omni-base/page.tsx` |
| `/omni-center` | page | D3 ESG 戰情室 | `app/omni-center/page.tsx` |
| `/omni-factory` | page | P0 平台層 | `app/omni-factory/page.tsx` |
| `/omni-factory` | page | P0 平台層 | `src/app/omni-factory/page.tsx` |
| `/omni-factory/[slug]` | page | P0 平台層 | `app/omni-factory/[slug]/page.tsx` |
| `/omni-todo` | page | P0 平台層 | `app/omni-todo/page.tsx` |
| `/omni/reports` | page | D1 永續報告 | `app/omni/reports/page.tsx` |
| `/omni/reports/[reportId]/edit` | page | D1 永續報告 | `app/omni/reports/[reportId]/edit/page.tsx` |
| `/profile` | page | P0 平台層 | `app/profile/page.tsx` |
| `/resources` | page | D4 永續閱覽室 | `app/resources/page.tsx` |
| `/sonnar` | page | D2 商情中心 | `app/sonnar/page.tsx` |
| `/sustain-center` | page | D3 ESG 戰情室 | `app/sustain-center/page.tsx` |
| `/sustain-write/c-version` | page | D1 永續報告 | `app/sustain-write/c-version/page.tsx` |
| `/sustain-write/v5` | page | D1 永續報告 | `app/sustain-write/v5/page.tsx` |
| `/village` | page | D5 每日 ESGGO | `app/village/page.tsx` |
| `/wiki` | page | D4 永續閱覽室 | `app/wiki/page.tsx` |
| `/wiki/[slug]` | page | D4 永續閱覽室 | `app/wiki/[slug]/page.tsx` |
