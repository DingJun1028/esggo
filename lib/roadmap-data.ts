/**
 * ESG GO | 淨零路徑規劃數據與 SBTi 邏輯
 */

export interface RoadmapTarget {
  year: number;
  target: number; // 預計排放量 (tCO2e)
  actual?: number; // 實際排放量
}

export const decarbonizationPath: RoadmapTarget[] = [
  { year: 2020, target: 5000, actual: 5000 },
  { year: 2021, target: 4800, actual: 4850 },
  { year: 2022, target: 4600, actual: 4580 },
  { year: 2023, target: 4400, actual: 4420 },
  { year: 2024, target: 4200, actual: 4150 },
  { year: 2025, target: 4000 },
  { year: 2026, target: 3800 },
  { year: 2027, target: 3600 },
  { year: 2028, target: 3400 },
  { year: 2029, target: 3200 },
  { year: 2030, target: 3000 }, // 2030 半減目標
];

export const reductionInitiatives = [
  { id: 1, name: '全廠 LED 照明更換', impact: -120, cost: 'Low', status: 'Completed' },
  { id: 2, name: '屋頂太陽能板第二期', impact: -450, cost: 'High', status: 'Ongoing' },
  { id: 3, name: '汽冷凝系統 AI 優化', impact: -280, cost: 'Medium', status: 'Planned' },
];
