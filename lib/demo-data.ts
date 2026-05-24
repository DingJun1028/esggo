import { isDemoMode } from './firebase';

export interface DemoMetric {
  id: string;
  category: 'GHG' | 'Energy' | 'Water' | 'Waste';
  metric_name: string;
  metric_value: number;
  unit: string;
  year: number;
  verified: boolean;
  hash_lock: string;
}

export const MOCK_ENVIRONMENTAL: DemoMetric[] = [
  { id: 'env_1', category: 'GHG', metric_name: '範疇一 (直接排放)', metric_value: 1247.5, unit: 'tCO2e', year: 2023, verified: true, hash_lock: 'sha256:00a1b2c3...' },
  { id: 'env_2', category: 'GHG', metric_name: '範疇二 (電力間接)', metric_value: 890.2, unit: 'tCO2e', year: 2023, verified: true, hash_lock: 'sha256:00b2c3d4...' },
  { id: 'env_3', category: 'Energy', metric_name: '總用電量', metric_value: 154200, unit: 'kWh', year: 2023, verified: true, hash_lock: 'sha256:00c3d4e5...' },
  { id: 'env_4', category: 'Water', metric_name: '總用水量', metric_value: 2450, unit: 'm3', year: 2023, verified: false, hash_lock: '' },
  { id: 'env_5', category: 'Waste', metric_name: '廢棄物回收率', metric_value: 68, unit: '%', year: 2023, verified: true, hash_lock: 'sha256:00d4e5f6...' },
];

export const MOCK_TASKS = [
  { id: 'task_1', title: '完成 2023 GRI 305 數據填報', status: 'done', priority: 'high', assignee: 'Alice', department: '環安衛' },
  { id: 'task_2', title: 'TCFD 氣候風險情境分析', status: 'in_progress', priority: 'critical', assignee: 'Bob', department: '永續委員會' },
  { id: 'task_3', title: '利害關係人問卷發放', status: 'todo', priority: 'medium', assignee: 'Charlie', department: '公關' },
];

export const MOCK_AUDIT = [
  { id: 'aud_1', action: 'SEAL', resource: 'GRI 305-1', user_name: 'System', created_at: new Date().toISOString() },
  { id: 'aud_2', action: 'UPDATE', resource: 'Energy Metric', user_name: 'Alice', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'aud_3', action: 'CREATE', resource: 'New Task', user_name: 'Bob', created_at: new Date(Date.now() - 7200000).toISOString() },
];

export async function getDemoData<T>(key: string, fallback: T[]): Promise<T[]> {
  if (!isDemoMode) return [];
  console.log(`[DemoData] Serving mock data for: ${key}`);
  return fallback;
}
