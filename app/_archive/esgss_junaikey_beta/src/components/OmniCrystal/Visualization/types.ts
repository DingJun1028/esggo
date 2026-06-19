/**
 * 📊 Visualization Type Definitions
 * --------------------------------------------------
 * [核心] 視覺化組件型別定義
 * [功能] 圖表、表格、布局配置
 */

// 圖表類型
export type ChartType = 'line' | 'bar' | 'pie' | 'area';

// 圖表數據點
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any; // 允許額外屬性
}

// 圖表配置
export interface ChartConfig {
  xKey?: string;
  yKey?: string;
  color?: string;
  colors?: string[]; // 用於圓餅圖等多色圖表
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  height?: number;
}

// 圖表數據
export interface ChartData {
  type: ChartType;
  data: ChartDataPoint[];
  config?: ChartConfig;
  title?: string;
}

// 表格數據
export interface TableData {
  headers: string[];
  rows: (string | number)[][];
  sortable?: boolean;
  highlightRow?: number; // 高亮特定行
}

// 兩欄布局配置
export interface TwoColumnLayoutProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  leftWidth?: string; // 預設 '50%'
  gap?: string; // 預設 '1rem'
}

// 視覺化響應
export interface VisualizationResponse {
  charts?: ChartData[];
  tables?: TableData[];
}
