/**
 * 每日簡報視圖組件
 * Intelligence Daily Brief View Component
 * 
 * @version 1.0.0
 * @date 2026-02-11
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Calendar, 
  Download, 
  Filter, 
  Search,
  ChevronRight,
  Lightbulb,
  CheckCircle,
  Clock,
  ArrowRight,
  Calculator,
  Database,
  FileCheck,
  Link as LinkIcon,
  Eye
} from 'lucide-react';
import { 
  DailyBrief, 
  PersonaType,
  IntelligenceItem,
} from '@/types/intelligence';
import { intelligenceDetectionService } from '@/services/IntelligenceDetectionService';

// ==========================================
// Props
// ==========================================

interface IntelligenceDailyBriefViewProps {
  persona?: PersonaType;
  onItemClick?: (item: IntelligenceItem) => void;
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

// ==========================================
// Component
// ==========================================

/**
 * 每日簡報視圖組件
 */
const IntelligenceDailyBriefView: React.FC<IntelligenceDailyBriefViewProps> = ({ 
  persona = PersonaType.CEO,
  onItemClick,
}) => {
  // 狀態
  const [briefs, setBriefs] = useState<DailyBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrief, setSelectedBrief] = useState<DailyBrief | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // 載入每日簡報
  useEffect(() => {
    loadBriefs();
  }, []);

  const loadBriefs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await intelligenceDetectionService.getDailyBriefs(1, 50);
      setBriefs(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入每日簡報失敗');
    } finally {
      setLoading(false);
    }
  };

  // 處理搜尋
  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  // 處理日期範圍篩選
  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };

  // 處理匯出
  const handleExport = async (brief: DailyBrief) => {
    // TODO: 實作匯出功能
    console.log('Export brief:', brief.id);
  };

  // 篩選簡報
  const filteredBriefs = briefs.filter(brief => {
    // 搜尋篩選
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        brief.title.toLowerCase().includes(query) ||
        brief.summary.toLowerCase().includes(query) ||
        brief.keyInsights.some(insight => insight.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    // 日期範圍篩選
    if (dateRange.start && brief.date < dateRange.start) return false;
    if (dateRange.end && brief.date > dateRange.end) return false;

    return true;
  });

  return (
    <div className="intelligence-daily-brief-view space-y-6">
      {/* 標題和操作按鈕 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            每日簡報
          </h2>
          <p className="text-muted-foreground mt-1">
            查看每日情報摘要和關鍵洞察
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            篩選
          </Button>
          <Button
            variant="outline"
            onClick={() => loadBriefs()}
          >
            重新載入
          </Button>
        </div>
      </div>

      {/* 篩選器 */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* 搜尋框 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜尋簡報..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* 日期範圍 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">開始日期</label>
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">結束日期</label>
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* 簡報列表 */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredBriefs.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  {searchQuery || dateRange.start || dateRange.end
                    ? '沒有符合條件的簡報'
                    : '暫無每日簡報'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredBriefs.map((brief) => (
              <Card key={brief.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {formatDate(brief.date)}
                        </span>
                      </div>
                      <CardTitle className="text-xl mb-2">{brief.title}</CardTitle>
                      <CardDescription>{brief.summary}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedBrief(selectedBrief?.id === brief.id ? null : brief)}
                    >
                      <ChevronRight className={`h-4 w-4 transition-transform ${selectedBrief?.id === brief.id ? 'rotate-90' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>

                {/* 展開內容 */}
                {selectedBrief?.id === brief.id && (
                  <CardContent className="space-y-6">
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
                            <p className="text-xs text-muted-foreground">簡報項目數: {brief.intelligenceItems.length}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Database className="h-4 w-4 text-green-500 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium">項目清晰</p>
                            <p className="text-xs text-muted-foreground">簡報 ID: {brief.id}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <LinkIcon className="h-4 w-4 text-purple-500 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium">連結可驗證</p>
                            <p className="text-xs text-muted-foreground">關聯情報: {brief.intelligenceItems.length} 項</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 關鍵洞察 */}
                    {brief.keyInsights.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <Lightbulb className="h-4 w-4" />
                          關鍵洞察
                        </h4>
                        <div className="space-y-2">
                          {brief.keyInsights.map((insight, index) => (
                            <div key={index} className="flex items-start gap-2 bg-muted/50 rounded-lg p-3">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <p className="text-sm">{insight}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 建議行動 */}
                    {brief.recommendedActions.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          建議行動
                        </h4>
                        <div className="space-y-2">
                          {brief.recommendedActions.map((action, index) => (
                            <div key={index} className="flex items-start gap-2 bg-muted/50 rounded-lg p-3">
                              <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <p className="text-sm">{action}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 詳細內容 */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">詳細內容</h4>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm whitespace-pre-wrap">{brief.content}</p>
                      </div>
                    </div>

                    {/* 元數據 */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>建立時間: {formatDateTime(brief.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          <span>情報項目: {brief.intelligenceItems.length} 項</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport(brief)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        匯出
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// Export
// ==========================================

export default IntelligenceDailyBriefView;
