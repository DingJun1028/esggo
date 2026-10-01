/**
 * 域層終始矩陣 · 註冊表（Domain Registry）
 * 5 域 × 6 柱 = 30 格。每格須同時具備 endState / startChain / probe，
 * 缺一即為敘事值，不算通過（scripts/verify-domain-matrix.mjs 守門）。
 *
 * source_origin: docs/ESGGO-ROUTE-INVENTORY.md
 * co_authors: [萬能蜂后(01), 萬能架構蜂(09), 萬能數據蜂(10), 萬能質控蜂(30)]
 */

import { PILLARS, type Pillar, type DomainCell } from './d1.report.matrix';
import D1_REPORT from './d1.report.matrix';
import D2_MARKET from './d2.market.matrix';
import D3_WARROOM from './d3.warroom.matrix';
import D4_READING from './d4.reading.matrix';
import D5_DAILY from './d5.daily.matrix';

export { PILLARS };
export type { Pillar, DomainCell };

export type DomainId = 'D1' | 'D2' | 'D3' | 'D4' | 'D5';

export interface Domain {
  id: DomainId;
  name: string;      // 中文名
  nameEn: string;
  artifactForm: string; // 產物形態（MECE 互斥性基準）
  frozen: boolean;      // 是否需 Hash Lock 定稿
  frozenReason: string; // frozen=false 時必須給出理由（不得留空）
  canonical: string;    // 該域 canonical 檔案路徑
  cells: DomainCell[];
}

export const DOMAINS: Domain[] = [
  {
    id: 'D1',
    name: '永續報告',
    nameEn: 'Sustainability Report',
    artifactForm: '對外正式文件',
    frozen: true,
    frozenReason: '',
    canonical: 'src/matrix/d1.report.matrix.ts',
    cells: D1_REPORT,
  },
  {
    id: 'D2',
    name: '商情中心',
    nameEn: 'Market Intelligence',
    artifactForm: '外部情報',
    frozen: false,
    frozenReason: '情報具時效性，每分鐘變動；若凍結將使 hash 每分鐘失效，凍結無意義。',
    canonical: 'src/matrix/d2.market.matrix.ts',
    cells: D2_MARKET,
  },
  {
    id: 'D3',
    name: 'ESG 戰情室',
    nameEn: 'ESG War Room',
    artifactForm: '內部儀表狀態',
    frozen: false,
    frozenReason: '儀表為瞬時狀態投影，非事實記錄；凍結會使戰情室無法反映現況。',
    canonical: 'src/matrix/d3.warroom.matrix.ts',
    cells: D3_WARROOM,
  },
  {
    id: 'D4',
    name: '永續閱覽室',
    nameEn: 'Sustainability Reading Room',
    artifactForm: '知識累積',
    frozen: true,
    frozenReason: '',
    canonical: 'src/matrix/d4.reading.matrix.ts',
    cells: D4_READING,
  },
  {
    id: 'D5',
    name: '每日 ESGGO',
    nameEn: 'Daily ESGGO',
    artifactForm: '每日觀察',
    frozen: false,
    frozenReason: '每日重寫之觀察層；歷史以 append-only archive 保留，不需凍結當日版本。',
    canonical: 'src/matrix/d5.daily.matrix.ts',
    cells: D5_DAILY,
  },
];

/** 30 格扁平視圖，供守門與報告使用 */
export const MATRIX_30: { domain: DomainId; domainName: string; pillar: Pillar; cell: DomainCell }[] =
  DOMAINS.flatMap((d) =>
    d.cells.map((c) => ({ domain: d.id, domainName: d.name, pillar: c.pillar, cell: c })),
  );

export default DOMAINS;
