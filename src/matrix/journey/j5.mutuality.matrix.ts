/**
 * J5 共好流 Mutuality · 產品功能終始矩陣 canonical
 * 產物形態：家庭共學紀錄（family_tasks / family_observations / photos）
 * source_origin: apps/ftg-journey-server/server.js:797-863 實掃（2026-10-01）
 * 官網對照：「以自然教育、親子共學、無痕戶外與地方體驗，打造員工與家庭共同參與」
 */

import type { JourneyCell } from './types';

export const J5_MUTUALITY: JourneyCell[] = [
  {
    pillar: 'memory',
    endState: '家庭任務模板（nature_bingo/photo_challenge/scavenger_hunt/craft_workshop…）與 ESG 任務同樣單一真實，前端不自帶副本。',
    startChain: 'TASK_TEMPLATES 在 FamilyDay.jsx；比照 esg-tasks.js 抽出 family-tasks.js 並加契約測試。',
    probe: 'apps/ftg-journey-web/src/features/FamilyDay.jsx 存在',
  },
  {
    pillar: 'time',
    endState: '家庭觀察與照片有 created_at，可依時間組合成孩子的成長時間軸。',
    startChain: 'family_observations 與 photos 已有 created_at；確認前端有依時間排序的檢視。',
    probe: 'apps/ftg-journey-server/server.js 存在',
  },
  {
    pillar: 'space',
    endState: '照片上傳在戶外弱網可續傳（分片或重試），不會因一次失敗就丟掉孩子的照片。',
    startChain: 'POST /api/upload 目前單次 multipart；加入重試與失敗佇列。',
    probe: 'apps/ftg-journey-web/src/contexts/AuthContext.jsx 存在',
  },
  {
    pillar: 'causality',
    endState: '每張照片可回溯是哪個任務、哪個任務完成者，成果素材才有脈絡而非一堆孤立圖。',
    startChain: 'photos 表目前只有 journey_id/email/url；補 task_id 關聯。',
    probe: 'apps/ftg-journey-server/esg-tasks.js 存在',
  },
  {
    pillar: 'immortal',
    endState: '家庭照片含兒童影像，屬敏感資料：下架需留紀錄、下架後 URL 立即失效。',
    startChain: '確認照片儲存位置不可公開列目錄；補刪除 API 與審計紀錄。',
    probe: 'apps/ftg-journey-server/esg-tasks.test.js 存在',
  },
  {
    pillar: 'circular',
    endState: '家庭日成果回流為雇主品牌素材（招募/留存文案），成為下一年度企業員工的入職吸引力來源。',
    startChain: 'photos 需標記「可對外分享」與「僅限家人」，供留念流匯總時取用。',
    probe: 'apps/ftg-journey-web/src/pages/ImpactNotePage.jsx 存在',
  },
];

export default J5_MUTUALITY;
