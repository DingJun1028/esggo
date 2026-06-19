/**
 * 來源管理視圖組件
 * Intelligence Source View Component
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Globe, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  ExternalLink,
  Shield,
  Calculator,
  Database,
  FileCheck,
  Link as LinkIcon,
  Eye,
  EyeOff,
  Clock,
  Star
} from 'lucide-react';
import { 
  Source, 
} from '@/types/intelligence';
import { intelligenceDetectionService } from '@/services/IntelligenceDetectionService';

// ==========================================
// Props
// ==========================================

interface IntelligenceSourceViewProps {
  persona?: string;
}

// ==========================================
// Utility Functions
// ==========================================

/**
 * 來源類型標籤
 */
const SOURCE_TYPE_LABELS: Record<string, string> = {
  news: '新聞媒體',
  government: '政府機構',
  industry: '產業報告',
  academic: '學術研究',
  social: '社交媒體',
};

/**
 * 來源類型圖示
 */
const SOURCE_TYPE_ICONS: Record<string, string> = {
  news: '📰',
  government: '🏛️',
  industry: '📊',
  academic: '🎓',
  social: '💬',
};

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
 * 取得可信度等級
 */
function getReliabilityLevel(reliability: number): { label: string; color: string } {
  if (reliability >= 0.8) {
    return { label: '高', color: 'text-green-500' };
  } else if (reliability >= 0.6) {
    return { label: '中', color: 'text-yellow-500' };
  } else {
    return { label: '低', color: 'text-red-500' };
  }
}

// ==========================================
// Component
// ==========================================

/**
 * 來源管理視圖組件
 */
const IntelligenceSourceView: React.FC<IntelligenceSourceViewProps> = ({ 
  persona = 'CEO',
}) => {
  // 狀態
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [editingSource, setEditingSource] = useState<Source | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    type: 'news' as 'news' | 'government' | 'industry' | 'academic' | 'social',
    reliability: 0.8,
  });

  // 載入來源列表
  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await intelligenceDetectionService.getSources();
      setSources(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入來源失敗');
    } finally {
      setLoading(false);
    }
  };

  // 處理搜尋
  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  // 處理類型篩選
  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
  };

  // 處理新增來源
  const handleAddSource = () => {
    setShowAddForm(true);
    setFormData({
      name: '',
      url: '',
      type: 'news',
      reliability: 0.8,
    });
  };

  // 處理編輯來源
  const handleEditSource = (source: Source) => {
    setEditingSource(source);
    setFormData({
      name: source.name,
      url: source.url,
      type: source.type,
      reliability: source.reliability,
    });
  };

  // 處理刪除來源
  const handleDeleteSource = async (sourceId: string) => {
    if (!confirm('確定要刪除此來源嗎？')) return;
    
    try {
      // TODO: 實作刪除功能
      console.log('Delete source:', sourceId);
      await loadSources();
    } catch (err) {
      setError(err instanceof Error ? err.message : '刪除來源失敗');
    }
  };

  // 處理儲存來源
  const handleSaveSource = async () => {
    try {
      // TODO: 實作儲存功能
      console.log('Save source:', formData);
      setShowAddForm(false);
      setEditingSource(null);
      await loadSources();
    } catch (err) {
      setError(err instanceof Error ? err.message : '儲存來源失敗');
    }
  };

  // 處理取消編輯
  const handleCancelEdit = () => {
    setShowAddForm(false);
    setEditingSource(null);
    setFormData({
      name: '',
      url: '',
      type: 'news',
      reliability: 0.8,
    });
  };

  // 處理表單變更
  const handleFormChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 篩選來源
  const filteredSources = sources.filter(source => {
    // 搜尋篩選
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!source.name.toLowerCase().includes(query) && !source.url.toLowerCase().includes(query)) {
        return false;
      }
    }

    // 類型篩選
    if (typeFilter !== 'all' && source.type !== typeFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="intelligence-source-view space-y-6">
      {/* 標題和操作按鈕 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6" />
            來源管理
          </h2>
          <p className="text-muted-foreground mt-1">
            管理情報來源和可信度設定
          </p>
        </div>
        <Button onClick={handleAddSource}>
          <Plus className="h-4 w-4 mr-2" />
          新增來源
        </Button>
      </div>

      {/* 篩選器 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">篩選條件</span>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 搜尋框 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜尋來源..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* 類別篩選 */}
              <div className="space-y-2">
                <Select
                  value={typeFilter}
                  onValueChange={handleTypeFilterChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇類別" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部類別</SelectItem>
                    {Object.entries(SOURCE_TYPE_LABELS).map(([type, label]) => (
                      <SelectItem key={type} value={type}>
                        {SOURCE_TYPE_ICONS[type]} {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 新增/編輯表單 */}
      {(showAddForm || editingSource) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingSource ? '編輯來源' : '新增來源'}
            </CardTitle>
            <CardDescription>
              {editingSource ? '修改來源資訊' : '建立新的情報來源'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 來源名稱 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">來源名稱</label>
                <Input
                  placeholder="例如: 經濟日報"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                />
              </div>

              {/* 來源 URL */}
              <div className="space-y-2">
                <label className="text-sm font-medium">來源 URL</label>
                <Input
                  placeholder="https://example.com"
                  value={formData.url}
                  onChange={(e) => handleFormChange('url', e.target.value)}
                />
              </div>

              {/* 來源類型 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">來源類型</label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleFormChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇類型" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SOURCE_TYPE_LABELS).map(([type, label]) => (
                      <SelectItem key={type} value={type}>
                        {SOURCE_TYPE_ICONS[type]} {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 可信度 */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  可信度 ({(formData.reliability * 100).toFixed(0)}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.reliability}
                  onChange={(e) => handleFormChange('reliability', parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>低 (0%)</span>
                  <span>中 (50%)</span>
                  <span>高 (100%)</span>
                </div>
              </div>

              {/* 操作按鈕 */}
              <div className="flex gap-2">
                <Button onClick={handleSaveSource}>
                  {editingSource ? '更新' : '建立'}
                </Button>
                <Button variant="outline" onClick={handleCancelEdit}>
                  取消
                </Button>
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

      {/* 來源列表 */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSources.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  {searchQuery || typeFilter !== 'all' ? '沒有符合條件的來源' : '暫無來源'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredSources.map((source) => {
              const reliabilityLevel = getReliabilityLevel(source.reliability);
              
              return (
                <Card key={source.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{SOURCE_TYPE_ICONS[source.type]}</span>
                        <div>
                          <CardTitle className="text-lg">{source.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {SOURCE_TYPE_LABELS[source.type]}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSource(source)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSource(source.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* URL */}
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline truncate"
                      >
                        {source.url}
                      </a>
                    </div>

                    {/* 可信度 */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          可信度
                        </span>
                        <span className={`text-sm font-semibold ${reliabilityLevel.color}`}>
                          {reliabilityLevel.label} ({(source.reliability * 100).toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${source.reliability * 100}%`,
                            backgroundColor: source.reliability >= 0.8 ? '#22c55e' : source.reliability >= 0.6 ? '#eab308' : '#ef4444',
                          }}
                        />
                      </div>
                    </div>

                    {/* 5T 原則證據區塊 */}
                    <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                      <h4 className="text-xs font-medium flex items-center gap-2">
                        <FileCheck className="h-3 w-3" />
                        5T 原則證據
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex items-center gap-1">
                          <Calculator className="h-3 w-3 text-blue-500" />
                          <span className="text-xs text-muted-foreground">公式透明</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Database className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-muted-foreground">項目清晰</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <LinkIcon className="h-3 w-3 text-purple-500" />
                          <span className="text-xs text-muted-foreground">連結可驗證</span>
                        </div>
                      </div>
                    </div>

                    {/* 元數據 */}
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {source.isActive ? (
                            <>
                              <Eye className="h-3 w-3 text-green-500" />
                              <span className="text-green-500">啟用</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3" />
                              <span>停用</span>
                            </>
                          )}
                        </div>
                        <span>ID: {source.id}</span>
                      </div>
                      {source.lastCrawledAt && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>最後爬取: {formatDate(source.lastCrawledAt)}</span>
                        </div>
                      )}
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

export default IntelligenceSourceView;
