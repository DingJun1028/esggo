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
  { year: 2030, target: 3000 }, // 2030 \u534a\u6e1b\u76ee\u6a19
];

export const reductionInitiatives = [
  { id: 1, name: '\u5168\u5ee0 LED \u7167\u660e\u66f4\u63db', impact: -120, cost: 'Low', status: 'Completed' },
  { id: 2, name: '\u5c4b\u9802\u592a\u964a\u80fd\u677f\u7b2c\u4e8c\u671f', impact: -450, cost: 'High', status: 'Ongoing' },
  { id: 3, name: '\u6c41\u51b7\u51dd\u7cfb\u7d71 AI \u512a\u5316', impact: -280, cost: 'Medium', status: 'Planned' },
];