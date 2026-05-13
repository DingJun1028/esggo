/**
 * ESG GO | 永續風險與韌性模擬數據模型
 * 遵循 TCFD 與 GRI 201-2 規範
 */

export interface RiskScenario {
  id: string;
  name: string;
  category: 'Physical' | 'Transition' | 'Social';
  probability: number; // 0-1
  impact: number; // 1-10
  mitigationStatus: number; // 0-100%
  financialRisk: number; // Million TWD
}

export const mockScenarios: RiskScenario[] = [
  { 
    id: 'SC-001', 
    name: '碳稅急劇上升 (Transition)', 
    category: 'Transition', 
    probability: 0.85, 
    impact: 9.2, 
    mitigationStatus: 45, 
    financialRisk: 120.5 
  },
  { 
    id: 'SC-002', 
    name: '極端降雨導致供應鏈中斷', 
    category: 'Physical', 
    probability: 0.40, 
    impact: 8.5, 
    mitigationStatus: 60, 
    financialRisk: 85.2 
  },
  { 
    id: 'SC-003', 
    name: '人才競爭與勞動力短缺', 
    category: 'Social', 
    probability: 0.65, 
    impact: 7.0, 
    mitigationStatus: 75, 
    financialRisk: 42.1 
  }
];

export const getRiskLevel = (impact: number) => {
  if (impact >= 8) return { label: 'CRITICAL', color: 'text-rose-600 bg-rose-50 border-rose-100' };
  if (impact >= 5) return { label: 'MODERATE', color: 'text-amber-600 bg-amber-50 border-amber-100' };
  return { label: 'LOW', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
};