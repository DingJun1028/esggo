/**
 * D2 商情中心 · 域層終始矩陣 canonical
 * 產物形態：外部情報 → 時效物，不需凍結（每分鐘都會變）
 * source_origin: docs/ESGGO-ROUTE-INVENTORY.md
 */

import type { DomainCell } from './d1.report.matrix';

export const D2_MARKET: DomainCell[] = [
  {
    pillar: 'memory',
    endState: '外部情報統一收斂至單一情報閘（intelligence gateway），sonar 與 zenrows 降級為該閘的 provider。',
    startChain: '在 /api/reconnaissance/gateway 建立單一入口，sonar/* 與 zenrows/fetch 改為內部 provider。',
    probe: 'grep -q "sonar" app/api/reconnaissance/gateway/route.ts',
  },
  {
    pillar: 'time',
    endState: '情報帶時間戳與有效期，過期即自動降權，戰情室不顯示陳舊情報。',
    startChain: '為 sonar 抓取結果補 fetchedAt 與 ttl 欄位。',
    probe: 'grep -rn "fetchedAt" app/api/sonar/crawl/route.ts',
  },
  {
    pillar: 'space',
    endState: '本機可離線爬取（zenrows／crawler），雲端可連續巡檢（cron），共用同一份情報 schema。',
    startChain: '將 src/crawlers 與 src/data/esg-sources 的輸出格式統一為 IntelligenceRecord。',
    probe: 'src/data/esg-sources/index.ts 匯出 IntelligenceRecord 型別',
  },
  {
    pillar: 'causality',
    endState: '每條情報可追至原始 URL 與抓取時間，無來源者不入庫。',
    startChain: '情報記錄必填 source_url 與 fetched_at，缺者丟棄。',
    probe: 'grep -rn "source_url" app/api/sonar/radar/route.ts',
  },
  {
    pillar: 'immortal',
    endState: '情報不入 Hash Lock 凍結池（避免每分鐘重算 hash），但原始快照檔以唯讀保存。',
    startChain: '明確在 5T 守門中把情報類排除於 frozen 檢查，並留下排除理由紀錄。',
    probe: 'scripts/verify-domain-matrix.mjs 報告 D2 frozen=false 且理由非空',
  },
  {
    pillar: 'circular',
    endState: '情報中的法規／標準變動自動轉為永續報告的議題更新與閱覽室的知識卡。',
    startChain: '將 /api/esg/best-practices 的輸出接到情報入庫流程。',
    probe: 'grep -rn "best-practices" app/api/sonar/knowledge/route.ts',
  },
];

export default D2_MARKET;
