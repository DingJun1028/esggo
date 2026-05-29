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

/**
 * Auto-Evolution Best Practices - OmniAgent Enhancement Layer
 * 新增自主進化相關策略
 */
export const AUTO_EVOLUTION_BEST_PRACTICES: BestPractice[] = [
  {
    id: 'bp-ae-001',
    category: 'G',
    industry: 'General Corporate',
    title: '自主演化治理框架 (OmniAgent Evolution Protocol)',
    strategy: '建立自我演化閉環：從資料採集→模型推理→結果驗證→知識沉澱→治理升級，實現 AI 系統持續自優化。',
    benchmark_source: 'Google Agent Platform Autonomous Loop',
    t5_compliance: { traceable: true, transparent: true, tangible: true, trackable: true, trustworthy: true },
    impact_score: 98,
    tags: ['Evolution', 'Governance', 'Agent', 'Self-Optimization'],
    last_verified: '2026-05-29',
  },
  {
    id: 'bp-ae-002',
    category: 'E',
    industry: 'High-Tech Manufacturing',
    title: '量子進化能源優化 (Quantum Energy Evolution)',
    strategy: '採用量子式迭代演算法，持續優化能源消耗模型，達成每年 15% 減耗目標。',
    benchmark_source: 'Microsoft Quantum Sustainability Lab',
    t5_compliance: { traceable: true, transparent: true, tangible: true, trackable: true, trustworthy: true },
    impact_score: 89,
    tags: ['Energy', 'Quantum', 'Optimization', 'AI-Evolution'],
    last_verified: '2026-05-28',
  },
  {
    id: 'bp-ae-003',
    category: 'S',
    industry: 'Software / Services',
    title: 'ZKP 治癒循環 (ZKP Healing Loop)',
    strategy: '被動天賦自動觸發：偵測數據偏差→觸發萬能修復→重新封印→治理升級，保持系統誠信穩定。',
    benchmark_source: 'ENS Autonomous Recovery Protocol',
    t5_compliance: { traceable: true, transparent: true, tangible: true, trackable: true, trustworthy: true },
    impact_score: 94,
    tags: ['ZKP', 'Healing', 'Recovery', 'Autonomous'],
    last_verified: '2026-05-27',
  }
];

export function getAutoEvolutionPractices(industry?: string): BestPractice[] {
  return AUTO_EVOLUTION_BEST_PRACTICES.filter(bp => 
    !industry || bp.industry.includes(industry) || bp.industry === 'General Corporate'
  ).sort((a, b) => b.impact_score - a.impact_score);
}
