/**
 * D4 永續閱覽室 · 域層終始矩陣 canonical
 * 產物形態：知識累積 → 需凍結（觀點須可引用、不可竄改）
 * source_origin: docs/ESGGO-ROUTE-INVENTORY.md
 */

import type { DomainCell } from './d1.report.matrix';

export const D4_READING: DomainCell[] = [
  {
    pillar: 'memory',
    endState: 'wiki / resources / learning-center 三者收斂為單一知識消費端：以 /wiki 為門戶。',
    startChain: '將 /resources 與 /learning-center 轉為 /wiki/[slug] 的分類視圖。',
    probe: 'app/resources/page.tsx 與 app/learning-center/page.tsx 皆轉址至 /wiki',
  },
  {
    pillar: 'time',
    endState: '知識卡有「最後查證」時間，超期自動標示待複驗，不假裝永遠正確。',
    startChain: '為知識卡 schema 加 verifiedAt 與 ttl。',
    probe: 'grep -rn "verifiedAt" app/wiki',
  },
  {
    pillar: 'space',
    endState: '知識主體在 vault（git 三端同步），閱覽端為投影消費，兩者分離。',
    startChain: '把 vault/ 作為知識 SSOT，/wiki 僅讀取投影結果。',
    probe: 'ls vault/Agents/context 存在且非空',
  },
  {
    pillar: 'causality',
    endState: '每張知識卡帶來源（URL 或 vault 節點），可追至原點。',
    startChain: '知識卡必填 source 欄位，缺者不入 MOC。',
    probe: 'grep -rn "source" vault/AGENTS.md',
  },
  {
    pillar: 'immortal',
    endState: '知識卡定稿後凍結並帶 Hash Lock，被引用時可驗未被改。',
    startChain: '知識卡發布走 /api/hashlock，寫入即凍結。',
    probe: 'grep -rn "hashlock" app/api/ai-notes/[id]/route.ts',
  },
  {
    pillar: 'circular',
    endState: '閱覽行為（village vote、surveys）回流為知識卡的優先序，決定下一輪查證順序。',
    startChain: '將 village/surveys 票數作為知識卡排序依據。',
    probe: 'grep -rn "vote" app/api/village/trends/route.ts',
  },
];

export default D4_READING;
