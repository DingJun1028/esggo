/**
 * J4 復元流 Restoration · 產品功能終始矩陣 canonical
 * 產物形態：身心狀態量測與後續追蹤（wellbeing_diagnosis / follow_up_entries）
 * source_origin: apps/ftg-journey-server/server.js:752-796 實掃（2026-10-01）
 * 官網對照：「協助員工從高壓工作中恢復能量，團隊在自然場域重新連結」
 */

import type { JourneyCell } from './types';

export const J4_RESTORATION: JourneyCell[] = [
  {
    pillar: 'memory',
    endState: '六大模組（diagnosis/nature/mindfulness/exercise/diet/sleep）定義集中在 Wellbeing.jsx 一處，新增模組不改後端。',
    startChain: 'WELLBEING_MODULES 目前在 Wellbeing.jsx；模組 id 需與後端 diagnosis 欄位對齊並加契約測試鎖定。',
    probe: 'apps/ftg-journey-web/src/features/Wellbeing.jsx 存在',
  },
  {
    pillar: 'time',
    endState: '診斷與後續追蹤有時間序列，能畫出「出發前 → 旅程中 → 回歸後三個月」的壓力曲線。',
    startChain: 'wellbeing_diagnosis 與 follow_up_entries 目前無日期欄位，補 measured_at。',
    probe: 'apps/ftg-journey-server/server.js 存在',
  },
  {
    pillar: 'space',
    endState: '正念計時等練習功能可離線使用（現場山林無網），計時結果於恢復連線後補送。',
    startChain: '正念練習目前無獨立 API（僅展示），需落地為本地計時 + 補送佇列。',
    probe: 'apps/ftg-journey-web/src/features/Wellbeing.jsx 存在',
  },
  {
    pillar: 'causality',
    endState: '後續追蹤的改善幅度可回溯到是哪一次旅程的哪一次診斷，否則改善歸因不明。',
    startChain: 'follow_up_entries 補 journey_id 與對應 diagnosis id 的關聯欄位。',
    probe: 'apps/ftg-journey-server/esg-tasks.js 存在',
  },
  {
    pillar: 'immortal',
    endState: '員工的心理狀態資料屬敏感個資，不可刪除也不可外洩；讀寫需授權且留存取紀錄。',
    startChain: '現況 verifyToken 只驗身分未驗角色；補 owner/成員/HR 三級權限矩陣。',
    probe: 'apps/ftg-journey-server/esg-tasks.test.js 存在',
  },
  {
    pillar: 'circular',
    endState: '追蹤結果回流為下一趟旅程的模組選型建議（壓力高→優先正念，不需人為判斷）。',
    startChain: 'GET /wellbeing/followup 目前只回資料；讓 Wellness 頁顯示「上次建議」欄位。',
    probe: 'apps/ftg-journey-web/src/features/Wellbeing.jsx 存在',
  },
];

export default J4_RESTORATION;
