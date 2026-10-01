/**
 * J1 基礎流 Foundation · 產品功能終始矩陣 canonical
 * 產物形態：行程主體資料（journeys / members / prep / schedule / notes / checkins）
 * source_origin: apps/ftg-journey-server/server.js 實掃（2026-10-01）
 * 官網對照：apps/ftg-tours-website 企業員工旅遊
 * 陣列歸屬以 apps/ftg-journey-web/src/features/Philosophy.jsx STREAMS 為唯一真義
 */

import type { JourneyCell } from './types';

export const J1_FOUNDATION: JourneyCell[] = [
  {
    pillar: 'memory',
    endState: '旅程主體（標題/目的地/日期/目的/service_type/stage）只存一份，Dashboard 與 Impact Note 讀同一 journeys 表，無平行副本。',
    startChain: 'JourneyDetail 與 ImpactNotePage 目前各自 fetch /api/journeys/:id，將回傳欄位統一為 J1 主體欄位清單。',
    probe: 'apps/ftg-journey-server/server.js 存在',
  },
  {
    pillar: 'time',
    endState: '每筆 prep/schedule/notes/checkin 帶 created_at，summary 可回溯旅程的時間軸順序，不靠陣列順序推測。',
    startChain: '為 prep_items 與 schedule 表補上 created_at 欄位並於 POST 寫入 Date.now()。',
    probe: 'apps/ftg-journey-server/esg-tasks.js 存在',
  },
  {
    pillar: 'space',
    endState: '本機 DB_PATH 可覆寫（暫存 DB 做 E2E），VPS 走正式 ftg-journey.db；兩端同一份 schema，無本機專屬欄位。',
    startChain: '將 19 張表的 CREATE TABLE 抽成單一 schema 模組，啟動時 migrate 而非內嵌在 server.js。',
    probe: 'apps/ftg-journey-server/Dockerfile 存在',
  },
  {
    pillar: 'causality',
    endState: '每個 prep 勾選、checkin、note 都可回溯到journey_id + email，summary 的完成率可逐項還原。',
    startChain: 'summary 端點已在算 prep_rate/checkin_rate，將計算式抽成純函式並加單元測試鎖定。',
    probe: 'apps/ftg-journey-server/esg-tasks.test.js 存在',
  },
  {
    pillar: 'immortal',
    endState: '已完成旅程的成果摘要定稿後凍結（不可再編輯 prep/schedule），避免對外數字與原始紀錄不一致。',
    startChain: '為 journeys 加 frozen_at 欄位，stage 轉 completed 時寫入。',
    probe: 'apps/ftg-journey-web/src/pages/JourneyDetail.jsx 存在',
  },
  {
    pillar: 'circular',
    endState: 'summary 的成果數據回流為下一趟旅程的起點（沿用同一批 ESG 任務模板與行程骨架），形成「合→起」閉環。',
    startChain: 'summary 回傳的 stage 與 metric 清單提供「以此為範本複製旅程」的前端預填。',
    probe: 'apps/ftg-journey-web/src/pages/Dashboard.jsx 存在',
  },
];

export default J1_FOUNDATION;
