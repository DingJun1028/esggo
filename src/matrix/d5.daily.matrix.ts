/**
 * D5 每日 ESGGO · 域層終始矩陣 canonical
 * 產物形態：每日觀察 → 不需凍結（每日重寫）
 * source_origin: docs/ESGGO-ROUTE-INVENTORY.md
 */

import type { DomainCell } from './d1.report.matrix';

export const D5_DAILY: DomainCell[] = [
  {
    pillar: 'memory',
    endState: '每日報告與 village 共用單一日誌本體，village 歸 D5 為「每日社群觀察」。',
    startChain: '明確將 /village 歸入 D5，於 canonical 記錄歸屬決策。',
    probe: 'src/matrix/d5.daily.matrix.ts 記錄 /village 歸屬且 D3-D5 無重複宣告',
  },
  {
    pillar: 'time',
    endState: '每日 05:00 七相閉環穩定執行（Inherit→Hatch→Write→Guard→Clean→Metrics→MOC），失敗可見。',
    startChain: '讓每日報告讀取 avatar-metrics.json 的健康度，不另造健康指標。',
    probe: 'ls vault/Agents/context/avatar-metrics.json 或 scripts/avatar-metrics.mjs 存在',
  },
  {
    pillar: 'space',
    endState: '本機 cron 優雅降級（8420 不可達時不丟狀態），雲端 cron 走內網完整寫入。',
    startChain: '在每日報告中區分「本機降級執行」與「VPS 完整執行」兩種健康標記。',
    probe: 'grep -rn "降級\\|degrade" app/api/daily-report/route.ts',
  },
  {
    pillar: 'causality',
    endState: '每日報告每一則觀察都標示來源（人工／自動／情報），不混為一談。',
    startChain: '每日報告項目加 origin 欄位（manual/auto/intel）。',
    probe: 'grep -n "origin" app/api/daily-report/route.ts',
  },
  {
    pillar: 'immortal',
    endState: '每日報告每日重寫但保留昨日快照（append-only archive），可比較、可回溯。',
    startChain: '寫入前先歸檔昨日版本至 archive。',
    probe: 'grep -rn "archive" app/api/daily-report/generate/route.ts',
  },
  {
    pillar: 'circular',
    endState: '每日觀察回流為明日議程與 D1 報告的更新來源，形成每日閉環。',
    startChain: '每日報告結尾自動產生明日待辦，寫入 /api/omni-todo。',
    probe: 'grep -rn "omni-todo\\|todo" app/api/daily-report/generate/route.ts',
  },
];

export default D5_DAILY;
