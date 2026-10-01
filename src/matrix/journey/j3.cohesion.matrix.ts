/**
 * J3 凝聚流 Cohesion · 產品功能終始矩陣 canonical
 * 產物形態：主管共識紀錄（executive_tools 單一通用表，tool_type 區分）
 * source_origin: apps/ftg-journey-server/server.js:719-751 實掃（2026-10-01）
 * 官網對照：「在自然場域中重新對齊使命、文化與永續轉型方向」
 */

import type { JourneyCell } from './types';

export const J3_COHESION: JourneyCell[] = [
  {
    pillar: 'memory',
    endState: '共識營工具（Opportunity Map / Roadmap 等）統一收在 executive_tools 一張表，以 tool_type 區分，不因新增工具就擴 schema。',
    startChain: '保持 executive_tools 的 tool_type 泛用設計；新增工具只需前端加一頁，不動後端表。',
    probe: 'apps/ftg-journey-web/src/features/Executive.jsx 存在',
  },
  {
    pillar: 'time',
    endState: '共識紀錄有 updated_at，可看出「這條共識最後一次被誰修訂、什麼時候」，Roadmap 才有版本感。',
    startChain: 'POST /executive/:toolType 目前以 UPSERT 覆寫，需在覆寫前保留前一版快照。',
    probe: 'apps/ftg-journey-server/server.js 存在',
  },
  {
    pillar: 'space',
    endState: '共識營工具在無網時仍可離線填寫草稿，現場共識不會因為訊號差而記不下來。',
    startChain: 'Executive.jsx 的儲存改為先寫本地、恢復連線後同步（目前直接 fetch 失敗即丟失）。',
    probe: 'apps/ftg-journey-web/src/features/Executive.jsx 存在',
  },
  {
    pillar: 'causality',
    endState: '每則共識可標註「這條共識來自哪場旅程的哪個工作坊」，否則多年後無人知其來源。',
    startChain: 'executive_tools 已有 journey_id；補 user_email 記錄修訂者，POST 目前只寫 journey_id 與 data。',
    probe: 'apps/ftg-journey-server/server.js 存在',
  },
  {
    pillar: 'immortal',
    endState: '定稿的 Roadmap（status=frozen）不可再改，變更需另開修訂版，確保年度對外揭露的 Roadmap 不會被竄改。',
    startChain: '為 executive_tools 的 data 加 { status: draft|frozen }，frozen 後 POST 直接 409。',
    probe: 'apps/ftg-journey-server/esg-tasks.js 存在',
  },
  {
    pillar: 'circular',
    endState: '共識營產出的 Roadmap 條目回流為下一年度旅程規劃的依據（Dashboard 顯示未達成 Roadmap 進度）。',
    startChain: 'Roadmap 條目加 journey 關聯欄位，讓「共識→行程」閉環可視。',
    probe: 'apps/ftg-journey-web/src/pages/Dashboard.jsx 存在',
  },
];

export default J3_COHESION;
