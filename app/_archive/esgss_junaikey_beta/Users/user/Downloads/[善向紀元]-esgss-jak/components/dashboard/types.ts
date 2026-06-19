// 儀表板組件庫類型定義

// 儀表板配置
export interface DashboardConfig {
  id: string;
  name: string;
  description?: string;
  layout: DashboardLayout;
  widgets: WidgetConfig[];
  filters: FilterConfig[];
  refreshInterval?: number; // 自動刷新間隔（毫秒）
  theme: 'light' | 'dark' | 'auto';
  permissions: {
    view: string[];
    edit: string[];
    delete: string[];
  };
  createdAt: number;
  updatedAt: number;
  createdBy: string;
}

// 儀表板佈局
export interface DashboardLayout {
  type: 'grid' | 'flex' | 'masonry';
  columns: number;
  gap: number;
  responsive: {
    mobile: { columns: number; gap: number };
    tablet: { columns: number; gap: number };
    desktop: { columns: number; gap: number };
  };
}

// 小部件配置
export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  description?: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  dataSource: DataSourceConfig;
  settings: Record<string, any>;
  style: WidgetStyle;
  interactions: WidgetInteraction[];
  refreshInterval?: number;
  cacheTimeout?: number;
  visible: boolean;
  permissions: {
    view: string[];
    edit: string[];
  };
}

// 小部件類型
export type WidgetType =
  | 'metric_card'
  | 'chart'
  | 'kpi'
  | 'trend'
  | 'comparison'
  | 'distribution'
  | 'correlation'
  | 'time_series'
  | 'heatmap'
  | 'gauge'
  | 'progress'
  | 'status_indicator'
  | 'alert'
  | 'summary'
  | 'custom';

// 數據源配置
export interface DataSourceConfig {
  type: 'api' | 'database' | 'file' | 'static' | 'real_time';
  endpoint?: string;
  query?: string;
  params?: Record<string, any>;
  filters?: FilterConfig[];
  transformations?: DataTransformation[];
  refreshStrategy: 'manual' | 'auto' | 'real_time';
}

// 數據轉換
export interface DataTransformation {
  id: string;
  type: 'map' | 'filter' | 'aggregate' | 'sort' | 'group' | 'pivot';
  config: Record<string, any>;
}

// 過濾器配置
export interface FilterConfig {
  id: string;
  field: string;
  type: 'select' | 'multiselect' | 'range' | 'date_range' | 'text' | 'number';
  label: string;
  value: any;
  options?: FilterOption[];
  validation?: {
    required: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// 過濾器選項
export interface FilterOption {
  label: string;
  value: any;
  count?: number;
  color?: string;
}

// 小部件樣式
export interface WidgetStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  shadow?: boolean;
  padding?: number;
  margin?: number;
  fontSize?: number;
  fontWeight?: number;
  textColor?: string;
  accentColor?: string;
}

// 小部件互動
export interface WidgetInteraction {
  id: string;
  type: 'click' | 'hover' | 'drag' | 'resize' | 'filter_change';
  target?: string; // 目標小部件ID
  action: 'navigate' | 'filter' | 'drill_down' | 'popup' | 'export';
  config: Record<string, any>;
}

// 指標數據
export interface MetricData {
  id: string;
  label: string;
  value: number | string;
  subValue?: string;
  previousValue?: number | string;
  change?: number;
  changePercent?: number;
  trend: 'up' | 'down' | 'stable';
  unit?: string;
  format?: 'number' | 'currency' | 'percentage' | 'text';
  precision?: number;
  color?: string;
  icon?: string;
  metadata?: Record<string, any>;
}

// 圖表數據
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
  options?: Record<string, any>;
}

// 圖表數據集
export interface ChartDataset {
  label: string;
  data: (number | null)[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
  pointRadius?: number;
  pointBackgroundColor?: string | string[];
  metadata?: Record<string, any>[];
}

// 時間序列數據
export interface TimeSeriesData {
  timestamps: number[];
  series: TimeSeries[];
  metadata?: Record<string, any>;
}

// 時間序列
export interface TimeSeries {
  id: string;
  name: string;
  data: (number | null)[];
  color?: string;
  type?: 'line' | 'area' | 'bar';
  yAxis?: 'left' | 'right';
  visible?: boolean;
}

// 熱力圖數據
export interface HeatmapData {
  xLabels: string[];
  yLabels: string[];
  values: number[][];
  colors?: string[];
  thresholds?: HeatmapThreshold[];
}

// 熱力圖閾值
export interface HeatmapThreshold {
  min: number;
  max: number;
  color: string;
  label?: string;
}

// 儀表板狀態
export interface DashboardState {
  isLoading: boolean;
  isEditing: boolean;
  selectedWidgets: string[];
  filters: Record<string, any>;
  timeRange: {
    start: number;
    end: number;
  };
  refreshTrigger: number;
  errors: DashboardError[];
}

// 儀表板錯誤
export interface DashboardError {
  id: string;
  widgetId?: string;
  type: 'data_error' | 'config_error' | 'network_error' | 'permission_error';
  message: string;
  timestamp: number;
  retryable: boolean;
}

// 儀表板事件
export type DashboardEvent =
  | { type: 'WIDGET_ADDED'; widgetId: string }
  | { type: 'WIDGET_REMOVED'; widgetId: string }
  | { type: 'WIDGET_UPDATED'; widgetId: string }
  | { type: 'FILTER_CHANGED'; filterId: string; value: any }
  | { type: 'TIME_RANGE_CHANGED'; start: number; end: number }
  | { type: 'DATA_REFRESHED'; widgetIds: string[] }
  | { type: 'ERROR_OCCURRED'; error: DashboardError }
  | { type: 'LAYOUT_CHANGED'; layout: DashboardLayout };

// 儀表板主題
export interface DashboardTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// 儀表板權限
export interface DashboardPermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
  canExport: boolean;
  allowedWidgets: WidgetType[];
  dataAccess: {
    read: string[];
    write: string[];
  };
}

// 儀表板統計
export interface DashboardStats {
  totalWidgets: number;
  activeWidgets: number;
  totalDataPoints: number;
  averageLoadTime: number;
  refreshCount: number;
  errorCount: number;
  userInteractions: number;
  dataSourceCount: number;
  lastActivity: number;
}

// 儀表板配置預設
export const DEFAULT_DASHBOARD_CONFIG: Partial<DashboardConfig> = {
  layout: {
    type: 'grid',
    columns: 12,
    gap: 16,
    responsive: {
      mobile: { columns: 1, gap: 8 },
      tablet: { columns: 2, gap: 12 },
      desktop: { columns: 12, gap: 16 }
    }
  },
  theme: 'auto',
  refreshInterval: 300000, // 5分鐘
  permissions: {
    view: ['*'],
    edit: ['admin', 'editor'],
    delete: ['admin']
  }
};

// 小部件配置預設
export const DEFAULT_WIDGET_CONFIG: Partial<WidgetConfig> = {
  style: {
    borderRadius: 8,
    shadow: true,
    padding: 16
  },
  visible: true,
  refreshInterval: 60000, // 1分鐘
  cacheTimeout: 300000, // 5分鐘
  permissions: {
    view: ['*'],
    edit: ['admin', 'editor']
  }
};

// 常用顏色方案
export const COLOR_PALETTES = {
  default: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4'],
  esg: {
    environmental: ['#10B981', '#059669', '#047857', '#064E3B'],
    social: ['#F59E0B', '#D97706', '#B45309', '#92400E'],
    governance: ['#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF']
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  }
};

// 圖表類型映射
export const CHART_TYPES = {
  bar: '柱狀圖',
  line: '線圖',
  pie: '圓餅圖',
  area: '面積圖',
  scatter: '散點圖',
  radar: '雷達圖',
  donut: '環形圖',
  histogram: '直方圖',
  heatmap: '熱力圖',
  gauge: '儀表圖'
} as const;

// 數據格式化選項
export const FORMAT_OPTIONS = {
  number: {
    locale: 'zh-TW',
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  },
  currency: {
    locale: 'zh-TW',
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  },
  percentage: {
    locale: 'zh-TW',
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  },
  date: {
    locale: 'zh-TW',
    options: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
  },
  datetime: {
    locale: 'zh-TW',
    options: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  }
} as const;