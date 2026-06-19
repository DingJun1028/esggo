// 儀表板容器組件 - M2指標儀表板模組核心
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  RefreshCw, Settings, Share, Download, Edit3, Eye,
  Grid, Layout, Maximize2, Minimize2, Filter, Calendar, AlertTriangle
} from 'lucide-react';
import {
  DashboardConfig, WidgetConfig, DashboardState, DashboardEvent,
  DashboardPermissions, DashboardStats, FilterConfig
} from './types';
import { DashboardGrid } from './layout/DashboardGrid';
import { DashboardToolbar } from './tools/DashboardToolbar';
import { DataFilterPanel } from './tools/DataFilterPanel';
import { TimeRangeSelector } from './tools/TimeRangeSelector';
import { useDashboardData } from './hooks/useDashboardData';
import { useRealTimeUpdates } from './hooks/useRealTimeUpdates';
import { esgDataCollector } from '../../services/esgDataCollector';
import { realTimeDataSync } from '../../services/realTimeDataSync';
import { dataQualityController } from '../../services/dataQualityController';

interface DashboardContainerProps {
  config: DashboardConfig;
  permissions?: DashboardPermissions;
  onConfigChange?: (config: DashboardConfig) => void;
  onWidgetUpdate?: (widgetId: string, config: WidgetConfig) => void;
  onError?: (error: Error) => void;
  className?: string;
  isEditMode?: boolean;
  realTimeEnabled?: boolean;
  autoRefresh?: boolean;
}

export const DashboardContainer: React.FC<DashboardContainerProps> = ({
  config,
  permissions = {
    canView: true,
    canEdit: false,
    canDelete: false,
    canShare: false,
    canExport: false,
    allowedWidgets: [],
    dataAccess: { read: ['*'], write: [] }
  },
  onConfigChange,
  onWidgetUpdate,
  onError,
  className = '',
  isEditMode = false,
  realTimeEnabled = true,
  autoRefresh = true
}) => {
  // 狀態管理
  const [state, setState] = useState<DashboardState>({
    isLoading: true,
    isEditing: isEditMode,
    selectedWidgets: [],
    filters: {},
    timeRange: {
      start: Date.now() - (30 * 24 * 60 * 60 * 1000), // 過去30天
      end: Date.now()
    },
    refreshTrigger: 0,
    errors: []
  });

  const [stats, setStats] = useState<DashboardStats>({
    totalWidgets: config.widgets.length,
    activeWidgets: config.widgets.filter(w => w.visible).length,
    totalDataPoints: 0,
    averageLoadTime: 0,
    refreshCount: 0,
    errorCount: 0,
    userInteractions: 0,
    dataSourceCount: new Set(config.widgets.map(w => w.dataSource.endpoint)).size,
    lastActivity: Date.now()
  });

  // Refs
  const refreshTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const loadStartTimeRef = useRef<number | undefined>(undefined);

  // 自訂Hooks
  const { data, loading, error, refresh } = useDashboardData(config, state.filters, state.timeRange);
  const { isConnected, lastUpdate } = useRealTimeUpdates(realTimeEnabled ? config.widgets : []);

  // 事件處理器
  const handleEvent = useCallback((event: DashboardEvent) => {
    setState(prev => {
      switch (event.type) {
        case 'FILTER_CHANGED':
          return {
            ...prev,
            filters: { ...prev.filters, [event.filterId]: event.value }
          };

        case 'TIME_RANGE_CHANGED':
          return {
            ...prev,
            timeRange: { start: event.start, end: event.end }
          };

        case 'ERROR_OCCURRED':
          return {
            ...prev,
            errors: [...prev.errors, event.error]
          };

        default:
          return prev;
      }
    });

    setStats(prev => ({
      ...prev,
      userInteractions: prev.userInteractions + 1,
      lastActivity: Date.now()
    }));
  }, []);

  // 手動刷新
  const handleRefresh = useCallback(async () => {
    loadStartTimeRef.current = Date.now();

    try {
      await refresh();
      setStats(prev => ({
        ...prev,
        refreshCount: prev.refreshCount + 1,
        lastActivity: Date.now()
      }));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Refresh failed');
      onError?.(error);
      setState(prev => ({
        ...prev,
        errors: [...prev.errors, {
          id: `error_${Date.now()}`,
          type: 'network_error',
          message: error.message,
          timestamp: Date.now(),
          retryable: true
        }]
      }));
    }
  }, [refresh, onError]);

  // 切換編輯模式
  const handleEditModeToggle = useCallback(() => {
    setState(prev => ({ ...prev, isEditing: !prev.isEditing }));
  }, []);

  // 配置變更處理
  const handleConfigChange = useCallback((newConfig: Partial<DashboardConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    onConfigChange?.(updatedConfig);
  }, [config, onConfigChange]);

  // 小部件更新處理
  const handleWidgetUpdate = useCallback((widgetId: string, widgetConfig: Partial<WidgetConfig>) => {
    const updatedWidgets = config.widgets.map(widget =>
      widget.id === widgetId ? { ...widget, ...widgetConfig } : widget
    );
    handleConfigChange({ widgets: updatedWidgets });
    onWidgetUpdate?.(widgetId, updatedWidgets.find(w => w.id === widgetId)!);
  }, [config.widgets, handleConfigChange, onWidgetUpdate]);

  // 導出儀表板
  const handleExport = useCallback(async (format: 'pdf' | 'png' | 'json' = 'json') => {
    try {
      switch (format) {
        case 'json':
          const exportData = {
            config,
            data,
            stats,
            timestamp: Date.now()
          };
          const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `dashboard-${config.name}-${Date.now()}.json`;
          a.click();
          URL.revokeObjectURL(url);
          break;

        case 'png':
          // 使用 html2canvas 等庫生成圖片
          console.log('PNG export not implemented yet');
          break;

        case 'pdf':
          // 使用 jsPDF 等庫生成PDF
          console.log('PDF export not implemented yet');
          break;
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Export failed');
      onError?.(error);
    }
  }, [config, data, stats, onError]);

  // 分享儀表板
  const handleShare = useCallback(async () => {
    try {
      const shareUrl = `${window.location.origin}/dashboard/${config.id}`;
      await navigator.share({
        title: config.name,
        ...(config.description ? { text: config.description } : {}),
        url: shareUrl
      });
    } catch (err) {
      // Fallback to clipboard
      const shareUrl = `${window.location.origin}/dashboard/${config.id}`;
      await navigator.clipboard.writeText(shareUrl);
      // 這裡可以顯示一個提示用戶已複製到剪貼簿的通知
    }
  }, [config]);

  // 初始化和清理
  useEffect(() => {
    loadStartTimeRef.current = Date.now();

    // 設置自動刷新
    if (autoRefresh && config.refreshInterval) {
      refreshTimerRef.current = setInterval(() => {
        handleRefresh();
      }, config.refreshInterval);
    }

    // 訂閱實時數據更新
    if (realTimeEnabled) {
      const unsubscribe = realTimeDataSync.subscribe('data_received', (updateData) => {
        // 處理實時數據更新
        setState(prev => ({ ...prev, refreshTrigger: prev.refreshTrigger + 1 }));
      });

      return () => {
        unsubscribe();
        if (refreshTimerRef.current) {
          clearInterval(refreshTimerRef.current);
        }
      };
    }

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [autoRefresh, config.refreshInterval, realTimeEnabled, handleRefresh]);

  // 更新統計信息
  useEffect(() => {
    if (loadStartTimeRef.current && !loading) {
      const loadTime = Date.now() - loadStartTimeRef.current;
      setStats(prev => ({
        ...prev,
        averageLoadTime: (prev.averageLoadTime + loadTime) / 2,
        totalDataPoints: Object.values(data).reduce((sum: number, dataset: any) =>
          sum + (Array.isArray(dataset) ? dataset.length : 1), 0
        )
      }));
    }
  }, [loading, data]);

  // 錯誤處理
  useEffect(() => {
    if (error) {
      setState(prev => ({
        ...prev,
        errors: [...prev.errors, {
          id: `error_${Date.now()}`,
          type: 'data_error',
          message: error.message,
          timestamp: Date.now(),
          retryable: true
        }]
      }));
      onError?.(error);
    }
  }, [error, onError]);

  // 權限檢查
  const canEdit = permissions.canEdit && state.isEditing;
  const canExport = permissions.canExport;
  const canShare = permissions.canShare;

  // 工具欄項目
  const toolbarItems = useMemo(() => [
    {
      id: 'refresh',
      icon: RefreshCw,
      label: '刷新',
      onClick: handleRefresh,
      disabled: loading,
      variant: 'primary' as const
    },
    {
      id: 'edit',
      icon: state.isEditing ? Eye : Edit3,
      label: state.isEditing ? '查看模式' : '編輯模式',
      onClick: handleEditModeToggle,
      disabled: !permissions.canEdit,
      variant: 'secondary' as const
    },
    {
      id: 'share',
      icon: Share,
      label: '分享',
      onClick: handleShare,
      disabled: !canShare,
      variant: 'secondary' as const
    },
    {
      id: 'export',
      icon: Download,
      label: '導出',
      onClick: () => handleExport('json'),
      disabled: !canExport,
      variant: 'secondary' as const,
      submenu: [
        { label: '導出為 JSON', onClick: () => handleExport('json') },
        { label: '導出為圖片', onClick: () => handleExport('png') },
        { label: '導出為 PDF', onClick: () => handleExport('pdf') }
      ]
    }
  ], [
    handleRefresh, loading, state.isEditing, handleEditModeToggle,
    permissions.canEdit, handleShare, canShare, handleExport, canExport
  ]);

  // 過濾器配置
  const filterConfigs: FilterConfig[] = useMemo(() => [
    {
      id: 'date_range',
      field: 'timestamp',
      type: 'date_range',
      label: '時間範圍',
      value: state.timeRange
    },
    {
      id: 'data_source',
      field: 'dataSource',
      type: 'select',
      label: '數據來源',
      value: null,
      options: Array.from(new Set(config.widgets.map(w => w.dataSource.endpoint)))
        .map(endpoint => ({ label: endpoint || 'Unknown', value: endpoint }))
    }
  ], [state.timeRange, config.widgets]);

  if (!permissions.canView) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        您沒有權限查看此儀表板
      </div>
    );
  }

  return (
    <div className={`dashboard-container ${className}`}>
      {/* 儀表板標題和工具欄 */}
      <div className="dashboard-header bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {config.name}
              </h1>
              {config.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {config.description}
                </p>
              )}
            </div>

            {/* 連接狀態指示器 */}
            {realTimeEnabled && (
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                <span className="text-xs text-gray-500">
                  {isConnected ? '實時連接' : '連接中斷'}
                </span>
              </div>
            )}
          </div>

          <DashboardToolbar items={toolbarItems} />
        </div>

        {/* 過濾器面板 */}
        <div className="mt-4 flex items-center gap-4">
          <DataFilterPanel
            filters={filterConfigs}
            onFilterChange={(filterId, value) => {
              handleEvent({ type: 'FILTER_CHANGED', filterId, value });
            }}
          />

          <TimeRangeSelector
            value={state.timeRange}
            onChange={(start, end) => {
              handleEvent({ type: 'TIME_RANGE_CHANGED', start, end });
            }}
          />
        </div>
      </div>

      {/* 儀表板網格 */}
      <div className="dashboard-content flex-1 overflow-auto">
        <DashboardGrid
          config={config}
          data={data}
          isEditMode={state.isEditing}
          onWidgetUpdate={handleWidgetUpdate}
          onLayoutChange={(layout) => handleConfigChange({ layout })}
          permissions={permissions}
        />
      </div>

      {/* 錯誤顯示 */}
      {state.errors.length > 0 && (
        <div className="dashboard-errors bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-800 dark:text-red-200">
              檢測到 {state.errors.length} 個錯誤
            </span>
          </div>

          <div className="space-y-1">
            {state.errors.slice(-3).map(error => (
              <div key={error.id} className="text-xs text-red-700 dark:text-red-300">
                {error.message}
              </div>
            ))}
          </div>

          <button
            onClick={() => setState(prev => ({ ...prev, errors: [] }))}
            className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
          >
            清除錯誤
          </button>
        </div>
      )}

      {/* 統計信息（開發模式下顯示） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="dashboard-stats bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
          <details className="text-xs">
            <summary className="cursor-pointer font-medium">儀表板統計</summary>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>小部件: {stats.totalWidgets}</div>
              <div>數據點: {stats.totalDataPoints}</div>
              <div>刷新次數: {stats.refreshCount}</div>
              <div>錯誤次數: {stats.errorCount}</div>
              <div>平均載入時間: {stats.averageLoadTime.toFixed(0)}ms</div>
              <div>用戶互動: {stats.userInteractions}</div>
              <div>數據源: {stats.dataSourceCount}</div>
              <div>最後活動: {new Date(stats.lastActivity).toLocaleTimeString()}</div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};