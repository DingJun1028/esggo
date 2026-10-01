/**
 * J6 留念流 Memorial · 產品功能終始矩陣 canonical
 * 產物形態：對外影響報告（impact 表 → Impact Note，含 GRI/SDG 對應）
 * source_origin: apps/ftg-journey-web/src/pages/ImpactNotePage.jsx + server.js:518-532 實掃（2026-10-01）
 * 官網對照：「把活動成果整理成 HR、ESG、品牌部皆可用的成果素材」
 */

import type { JourneyCell } from './types';

export const J6_MEMORIAL: JourneyCell[] = [
  {
    pillar: 'memory',
    endState: 'Impact Note 對外輸出的 GRI/SDG 對應表只此一份（METRIC_SDGS_MAP / METRIC_GRI_MAP），後端 metric 清單與之有契約測試鎖定。',
    startChain: 'esg-tasks.test.js 已有跨檔契約測試；補上「後端新增 metric 未被前端宣告即失敗」的守門。',
    probe: 'apps/ftg-journey-web/src/pages/ImpactNotePage.jsx 存在',
  },
  {
    pillar: 'time',
    endState: '報告有產出時間與涵蓋期間（generated_at / 期間篩選），讀者知道這份報告講的是哪一趟旅程。',
    startChain: 'summary 已回 generated_at；Impact Note 頁面需顯示該欄位（目前由前端自己產生時間）。',
    probe: 'apps/ftg-journey-server/server.js 存在',
  },
  {
    pillar: 'space',
    endState: '報告可匯出為離線檔（PDF/PPT/CSV），HR 在內網不連線也能取得成果素材。',
    startChain: '前端已產 PPT；補 CSV 匯出（原始單位與 metric 對照表一併輸出）。',
    probe: 'apps/ftg-journey-web/src/pages/Dashboard.jsx 存在',
  },
  {
    pillar: 'causality',
    endState: '報告中每個數字可點擊回溯到原始任務紀錄；無孤證數字、無跨單位硬加總。',
    startChain: 'summarizeImpact 已依 metric 分組；為每個 metric 補「來源任務紀錄」清單欄位。',
    probe: 'apps/ftg-journey-server/esg-tasks.js 存在',
  },
  {
    pillar: 'immortal',
    endState: '報告定稿後凍結：寫入即 Hash Lock + Object.freeze，竄改即現形（對外揭露不可被事後改數字）。',
    startChain: '為 impact 表補 frozen_at + content_hash，定稿時鎖定。',
    probe: 'apps/ftg-journey-server/esg-tasks.test.js 存在',
  },
  {
    pillar: 'circular',
    endState: '報告發布後的外部回饋（客戶/HR 對成果的反應）回流為下一年度的 KPI 目標，形成年度閉環。',
    startChain: '新增 feedback 端點記錄報告接收方反饋，並在 Dashboard 顯示年度對照。',
    probe: 'apps/ftg-journey-web/src/features/Philosophy.jsx 存在',
  },
];

export default J6_MEMORIAL;
