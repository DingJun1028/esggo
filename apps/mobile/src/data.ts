// Sample ESG metrics shown in the mobile app. In a real app this would come
// from the gateway / API; here it demonstrates reuse of @esggo/shared tokens.
import { DESIGN_TOKENS } from '@esggo/shared';

export interface Metric {
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
}

export const metrics: Metric[] = [
  { label: '碳排強度', value: 12.4, unit: 'tCO₂e', change: -8.2, trend: 'down' },
  { label: '再生能源佔比', value: 63, unit: '%', change: 5.1, trend: 'up' },
  { label: '水資源回收率', value: 78, unit: '%', change: 2.3, trend: 'up' },
  { label: '供應鏈稽核覆蓋', value: 41, unit: '%', change: -1.2, trend: 'down' },
  { label: '職安事故率', value: 0.3, unit: '件/百萬工時', change: -12.0, trend: 'down' },
  { label: 'ZKP 憑證數', value: 1280, unit: '份', change: 18.5, trend: 'up' },
];

export const brand = DESIGN_TOKENS;
