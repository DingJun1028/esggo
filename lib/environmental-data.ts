/**
 * ESG GO | 環境數據中心持久化與邏輯
 */

export interface EnvRecord {
  id: string;
  type: 'Energy' | 'Water' | 'Waste';
  category: string;
  value: number;
  unit: string;
  date: string;
  evidenceId: string;
  status: 'Sealed' | 'Verified' | 'Pending';
  operator: string;
}

export const mockEnvRecords: EnvRecord[] = [
  { id: 'R1', type: 'Energy', category: '台電用電', value: 5240, unit: 'kWh', date: '2025-04-15', evidenceId: 'INV-202504-001', status: 'Sealed', operator: '陳建宏' },
  { id: 'R2', type: 'Water', category: '自來水', value: 84, unit: 'm3', date: '2025-04-12', evidenceId: 'WTR-202504-88', status: 'Verified', operator: '林小明' },
  { id: 'R3', type: 'Waste', category: '一般廢棄物', value: 120, unit: 'kg', date: '2025-04-10', evidenceId: 'WST-202504-05', status: 'Sealed', operator: '王大同' },
];

export const calculateCarbon = (type: string, value: number) => {
  // 模擬碳排係數 (以 2024 台灣電力排碳係數 0.495 kgCO2e/kWh 為例)
  if (type === 'Energy') return (value * 0.495).toFixed(2);
  return '0.00';
};