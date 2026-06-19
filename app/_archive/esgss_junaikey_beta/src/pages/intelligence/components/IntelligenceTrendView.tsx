/**
 * 趨勢預測視圖組件
 * Intelligence Trend View Component
 * 
 * @version 1.0.0
 * @date 2026-02-11
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  TrendingUp, 
  Download, 
  Filter, 
  LineChart,
  BarChart3,
  Activity,
  Calculator,
  Database,
  FileCheck,
  Link as LinkIcon,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { 
  TrendPrediction, 
  PersonaType,
  IntelligenceCategory,
  INTELLIGENCE_CATEGORY_LABELS,
  INTELLIGENCE_IMPACT_LEVEL_LABELS,
} from '@/types/intelligence';
import { intelligenceDetectionService } from '@/services/IntelligenceDetectionService';

// ==========================================
// Props
// ==========================================

interface IntelligenceTrendViewProps {
  persona?: PersonaType;
  onItemClick?: (item: any) => void;
}

// ==========================================
// Utility Functions
// ==========================================

/**
 * 格式化日期
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 格式化完整日期時間
 */
function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * 取得趨勢圖示
 */
function getTrendIcon(currentValue: number, previousValue: number) {
  if (currentValue > previousValue) {
    return <ArrowUp className="h-4 w-4 text-green-500" />;
  } else if (currentValue < previousValue) {
    return <ArrowDown className="h-4 w-4 text-red-500" />;
  }
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

/**
 * 取得趨勢變化百分比
 */
function getTrendChange(currentValue: number, previousValue: number): number {
  if (previousValue === 0) return 0;
  return ((currentValue - previousValue) / previousValue) * 100;
}

// ==========================================
// Component
// ==========================================

/**
 * 趨勢預測視圖組件
 */
const IntelligenceTrendView: React.FC<IntelligenceTrendViewProps> = ({ 
  persona = PersonaType.CEO,
  onItemClick,
}) => {
  // 狀態
  const [trends, setTrends] = useState<TrendPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTrend, setSelectedTrend] = useState<TrendPrediction | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // 載入趨勢預測
  useEffect(() => {
    loadTrends();
  }, [selectedCategory]);

  const loadTrends = async () => {
    try {
      setLoading(true);
      setError(null);
      const category = selectedCategory === 'all' ? undefined : selectedCategory as IntelligenceCategory;
      const data = await intelligenceDetectionService.getTrendPredictions(category);
      setTrends(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入趨勢預測失敗');
    } finally {
      setLoading(false);
    }
  };

  // 處理類別變更
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  // 處理時間範圍變更
  const handleTimeRangeChange = (value: '7d' | '30d' | '90d' | '1y') => {
    setTimeRange(value);
  };

  // 處理匯出
  const handleExport = async (trend: TrendPrediction) => {
    // TODO: 實作匯出功能
    console.log('Export trend:', trend.id);
  };

  // 篩選趨勢
  const filteredTrends = trends.filter(trend => {
    if (selectedCategory !== 'all' && trend.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  // 簡單的圖表渲染組件
  const SimpleChart: React.FC<{ data: { date: string; value: number }[] }> = ({ data }) => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;

    return (
      <div className="relative h-48 w-full">
        <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
          {/* 網格線 */}
          {[0, 25, 50, 75, 100].map((percent) => (
            <line
              key={percent}
              x1="0"
              y1={percent * 1.5}
              x2="400"
              y2={percent * 1.5}
              stroke="rgba(148, 163, 184, 0.2)"
              strokeWidth="1"
            />
          ))}
          
          {/* 趨勢線 */}
          <polyline
            fill="none"
            stroke="rgb(59, 130, 246)"
            strokeWidth="2"
            points={data.map((d, i) => {
              const x = (i / (data.length - 1)) * 400;
              const normalizedValue = (d.value - minValue) / range;
              const y = 150 - (normalizedValue * 130 + 10);
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* 數據點 */}
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 400;
            const normalizedValue = (d.value - minValue) / range;
            const y = 150 - (normalizedValue * 130 + 10);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill="rgb(59, 130, 246)"
                className="hover:r-6 transition-all cursor-pointer"
              />
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="intelligence-trend-view space-y-6">
      {/* 標題和操作按鈕 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            趨勢預測
          </h2>
          <p className="text-muted-foreground mt-1">
            查看情報趨勢分析和預測
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => loadTrends()}
          >
            重新載入
          </Button>
        </div>
      </div>

      {/* 篩選器 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">篩選條件</span>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 類別篩選 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">類別</label>
                <Select
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇類別" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部類別</SelectItem>
                    {Object.values(IntelligenceCategory).map(category => (
                      <SelectItem key={category} value={category}>
                        {INTELLIGENCE_CATEGORY_LABELS[category]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 時間範圍篩選 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">時間範圍</label>
                <Select
                  value={timeRange}
                  onValueChange={handleTimeRangeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇時間範圍" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">最近 7 天</SelectItem>
                    <SelectItem value="30d">最近 30 天</SelectItem>
                    <SelectItem value="90d">最近 90 天</SelectItem>
                    <SelectItem value="1y">最近 1 年</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 載入狀態 */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">載入中...</p>
          </div>
        </div>
      )}

      {/* 錯誤狀態 */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* 趨勢列表 */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredTrends.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  暫無趨勢預測資料
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTrends.map((trend) => {
              const latestValue = trend.dataPoints[trend.dataPoints.length - 1]?.value || 0;
              const previousValue = trend.dataPoints[trend.dataPoints.length - 2]?.value || 0;
              const trendChange = getTrendChange(latestValue, previousValue);

              return (
                <Card key={trend.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">
                            {INTELLIGENCE_CATEGORY_LABELS[trend.category]}
                          </Badge>
                          <Badge variant="outline">
                            {INTELLIGENCE_IMPACT_LEVEL_LABELS[trend.impact]}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Activity className="h-3 w-3" />
                            <span>信心度: {(trend.confidence * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                        <CardTitle className="text-xl mb-2">{trend.title}</CardTitle>
                        <CardDescription>{trend.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(latestValue, previousValue)}
                        <span className={`text-sm font-medium ${trendChange > 0 ? 'text-green-500' : trendChange < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {trendChange > 0 ? '+' : ''}{trendChange.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* 趨勢圖表 */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <LineChart className="h-4 w-4" />
                          趨勢圖表
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          時間範圍: {trend.timeframe}
                        </span>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <SimpleChart data={trend.dataPoints} />
                      </div>
                    </div>

                    {/* 5T 原則證據區塊 */}
                    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <FileCheck className="h-4 w-4" />
                        5T 原則證據
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="flex items-start gap-2">
                          <Calculator className="h-4 w-4 text-blue-500 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium">公式透明</p>
                            <p className="text-xs text-muted-foreground">數據點: {trend.dataPoints.length} 個</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Database className="h-4 w-4 text-green-500 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium">項目清晰</p>
                            <p className="text-xs text-muted-foreground">趨勢 ID: {trend.id}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <LinkIcon className="h-4 w-4 text-purple-500 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium">連結可驗證</p>
                            <p className="text-xs text-muted-foreground">最新值: {latestValue.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 數據摘要 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">最新數值</p>
                        <p className="text-lg font-semibold">{latestValue.toFixed(2)}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">最高數值</p>
                        <p className="text-lg font-semibold">
                          {Math.max(...trend.dataPoints.map(d => d.value)).toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">最低數值</p>
                        <p className="text-lg font-semibold">
                          {Math.min(...trend.dataPoints.map(d => d.value)).toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">平均數值</p>
                        <p className="text-lg font-semibold">
                          {(trend.dataPoints.reduce((sum, d) => sum + d.value, 0) / trend.dataPoints.length).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* 元數據 */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-4">
                        <span>建立時間: {formatDateTime(trend.createdAt)}</span>
                        <span>更新時間: {formatDateTime(trend.updatedAt)}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport(trend)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        匯出
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// Export
// ==========================================

export default IntelligenceTrendView;
