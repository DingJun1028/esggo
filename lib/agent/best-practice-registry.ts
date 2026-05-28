import { z } from 'zod';

/**
 * BestPracticeRegistry: 最佳實踐精選智庫
 * 儲存經過驗證、高品質且符合 5T 標準的 ESG 治理策略。
 */
export const BestPracticeSchema = z.object({
  id: z.string().uuid(),
  category: z.enum(['E', 'S', 'G']),
  industry: z.string().describe('適用產業'),
  title: z.string().min(1),
  strategy: z.string().describe('策略詳情'),
  benchmark_source: z.string().describe('標竿來源 (如台積電, RE100)'),
  t5_compliance: z.object({
    traceable: z.boolean(),
    transparent: z.boolean(),
    tangible: z.boolean(),
    trackable: z.boolean(),
    trustworthy: z.boolean(),
  }),
  impact_score: z.number().min(0).max(100),
  tags: z.array(z.string()),
  last_verified: z.string(),
});

export type BestPractice = z.infer<typeof BestPracticeSchema>;

export const BEST_PRACTICE_REGISTRY: BestPractice[] = [
  {
    id: 'bp-001',
    category: 'E',
    industry: 'High-Tech Manufacturing',
    title: '自動化能源即時鏈路 (RE100 Standard)',
    strategy: '導入 API 層級的電費單自動化對接，取代人工填報，實現 T1 級別溯源。',
    benchmark_source: 'Apple / TSMC Supply Chain Requirements',
    t5_compliance: { traceable: true, transparent: true, tangible: true, trackable: true, trustworthy: true },
    impact_score: 95,
    tags: ['Energy', 'RE100', 'Automation'],
    last_verified: '2026-05-20',
  },
  {
    id: 'bp-002',
    category: 'S',
    industry: 'Software / Services',
    title: 'ZKP 薪資公平性審計 (Privacy-First DEI)',
    strategy: '利用零知識證明 (ZKP) 展示薪資中位數差異符合公平性要求，而不揭露個別員工薪資敏感數據。',
    benchmark_source: 'Google DEI Report Model',
    t5_compliance: { traceable: true, transparent: true, tangible: true, trackable: true, trustworthy: true },
    impact_score: 92,
    tags: ['DEI', 'Privacy', 'ZKP'],
    last_verified: '2026-05-22',
  },
  {
    id: 'bp-003',
    category: 'G',
    industry: 'General Corporate',
    title: '氣候風險連動薪酬 (SBTi-Linked LTI)',
    strategy: '將高階主管長期激勵計畫 (LTI) 與 SBTi 減碳達標率直接連動，確保治理目標具備實質約束力。',
    benchmark_source: 'SBTi Financial Institution Guide',
    t5_compliance: { traceable: true, transparent: true, tangible: true, trackable: true, trustworthy: true },
    impact_score: 88,
    tags: ['Governance', 'LTI', 'SBTi'],
    last_verified: '2026-05-25',
  }
];

export function getBestPractices(category?: 'E' | 'S' | 'G', industry?: string): BestPractice[] {
  return BEST_PRACTICE_REGISTRY.filter(bp => {
    const catMatch = !category || bp.category === category;
    const indMatch = !industry || bp.industry.includes(industry) || bp.industry === 'General Corporate';
    return catMatch && indMatch;
  }).sort((a, b) => b.impact_score - a.impact_score);
}
