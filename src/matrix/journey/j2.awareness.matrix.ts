/**
 * J2 覺曉流 Awareness · 產品功能終始矩陣 canonical
 * 產物形態：現場任務紀錄（esg_task_logs → impact 同步）
 * source_origin: apps/ftg-journey-server/esg-tasks.js + server.js 實掃（2026-10-01）
 * 官網對照：「讓 ESG 不只是報告文字，而是員工可以親身參與的一日戶外永續團隊行動」
 */

import type { JourneyCell } from './types';

export const J2_AWARENESS: JourneyCell[] = [
  {
    pillar: 'memory',
    endState: '六類 ESG 任務（cleanup/carbon/biodiversity/local/water/waste）只有一份定義，後端 esg-tasks.js 為唯一真實，前端由 API 取得而非自帶副本。',
    startChain: 'JourneyDetail.jsx 第 33 行的 ESG_TASKS 本地副本（欄位較後端多：weight/types/species/habitat/purpose）改為消費 GET /esg-tasks 的 tasks 陣列。',
    probe: 'apps/ftg-journey-server/esg-tasks.js 存在',
  },
  {
    pillar: 'time',
    endState: '任務紀錄即時寫入 esg_task_logs 並同步 impact，現場提交後 summary 立刻反映該筆數字。',
    startChain: 'POST /api/journeys/:id/esg-tasks 已是同步寫入，補上回傳 impact 同步筆數讓前端可顯示確認。',
    probe: 'apps/ftg-journey-web/src/pages/JourneyDetail.jsx 存在',
  },
  {
    pillar: 'space',
    endState: '無網時任務表單仍可填（前端本地暫存），恢復連線後補送；現場山區無訊號是常態而非例外。',
    startChain: '為 openTask() 的提交加入 localStorage 佇列，onLine 時重送。',
    probe: 'apps/ftg-journey-web/src/contexts/AuthContext.jsx 存在',
  },
  {
    pillar: 'causality',
    endState: '每個 impact 數字都能回溯到來源任務紀錄（impact.note 存該筆 JSON），無孤證數字。',
    startChain: 'impactRowsForTask 已把 data JSON 寫入 note；將 note 改為結構化 { task_id, task_log_id } 以便機器回溯。',
    probe: 'apps/ftg-journey-server/esg-tasks.test.js 存在',
  },
  {
    pillar: 'immortal',
    endState: '任務提交後原始紀錄不可修改，只能追加更正紀錄（append-only），確保對外數字可重算。',
    startChain: 'esg_task_logs 目前無 UPDATE 路徑；補上更正 API 時強制寫新列並標 supersedes。',
    probe: 'apps/ftg-journey-server/server.js 存在',
  },
  {
    pillar: 'circular',
    endState: '任務統計（totals）回流為下一趟旅程的任務預設目標（例：上次撿 12 件，下趟目標 15 件）。',
    startChain: 'summarizeTaskLogs 的 totals 已在 GET /esg-tasks 回傳，讓 Dashboard 顯示各任務歷史累計。',
    probe: 'apps/ftg-journey-server/esg-tasks.js 存在',
  },
];

export default J2_AWARENESS;
