/**
 * D3 ESG 戰情室 · 域層終始矩陣 canonical
 * 產物形態：內部儀表狀態 → 瞬時狀態，不需凍結
 * source_origin: docs/ESGGO-ROUTE-INVENTORY.md
 */

import type { DomainCell } from './d1.report.matrix';

export const D3_WARROOM: DomainCell[] = [
  {
    pillar: 'memory',
    endState: '戰情室只讀不存：所有指標來自 D1/D2/D4 的既有產物，戰情室本身不擁有狀態。',
    startChain: '消解 /omni-center 與 /sustain-center 的職責重疊，戰情室統一為 /sustain-center。',
    probe: 'app/omni-center/page.tsx 改為轉址至 /sustain-center',
  },
  {
    pillar: 'time',
    endState: '戰情室有單一時鐘來源，所有面板顯示同一時間戳，無混用時鐘。',
    startChain: '統一 dashboard 聚合端使用單一 now() 取樣。',
    probe: 'app/api/sustain-center/dashboard/route.ts 只有一個時間取樣點',
  },
  {
    pillar: 'space',
    endState: '本機可離線看戰情（讀本地 SQLite），雲端看即時（讀 VPS 服務），介面一致。',
    startChain: '將 dashboard 端點的資料來源抽象為 provider，本機與雲端各一實作。',
    probe: 'grep -rn "provider" app/api/sustain-center/dashboard/route.ts',
  },
  {
    pillar: 'causality',
    endState: '戰情室每個紅燈都有對應證據連結（點燈 → 見證據），不可只報警不給證據。',
    startChain: 'dashboard 回應加入 evidenceUrl 欄位。',
    probe: 'grep -n "evidenceUrl" app/api/sustain-center/dashboard/route.ts',
  },
  {
    pillar: 'immortal',
    endState: '戰情狀態不凍結，但每次告警事件寫入不可變事件流（append-only）。',
    startChain: '告警走 /api/verify-5t 同一守門，確保 5T 一致而非另立一套。',
    probe: 'app/api/verify-5t/route.ts 為唯一 5T 端點且戰情室引用它',
  },
  {
    pillar: 'circular',
    endState: '戰情室發現的缺口自動回流 D1 議題清單與 D4 學習路徑。',
    startChain: '把 dashboard 的 anomaly 欄位接到議題產生器。',
    probe: 'grep -rn "anomaly" app/api/sustain-center/dashboard/route.ts',
  },
];

export default D3_WARROOM;
