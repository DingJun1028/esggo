/**
 * 標籤管理視圖組件
 * Intelligence Tag View Component
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
  Tag as TagIcon, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Hash,
  Calculator,
  Database,
  FileCheck,
  Link as LinkIcon,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { 
  Tag, 
  IntelligenceCategory,
  INTELLIGENCE_CATEGORY_LABELS,
} from '@/types/intelligence';
import { intelligenceDetectionService } from '@/services/IntelligenceDetectionService';

// ==========================================
// Props
// ==========================================

interface IntelligenceTagViewProps {
  persona?: string;
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
 * 取得使用熱度等級
 */
function getUsageLevel(usageCount: number): { label: string; color: string } {
  if (usageCount >= 50) {
    return { label: '熱門', color: 'text-red-500' };
  } else if (usageCount >= 20) {
    return { label: '常用', color: 'text-yellow-500' };
  } else if (usageCount >= 10) {
    return { label: '一般', color: 'text-blue-500' };
  } else {
    return { label: '少用', color: 'text-muted-foreground' };
  }
}

// ==========================================
// Component
// ==========================================

/**
 * 標籤管理視圖組件
 */
const IntelligenceTagView: React.FC<IntelligenceTagViewProps> = ({ 
  persona = 'CEO',
}) => {
  // 狀態
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'regulatory_update' as IntelligenceCategory,
  });

  // 載入標籤列表
  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await intelligenceDetectionService.getTags();
      setTags(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入標籤失敗');
    } finally {
      setLoading(false);
    }
  };

  // 處理搜尋
  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  // 處理類別篩選
  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
  };

  // 處理新增標籤
  const handleAddTag = () => {
    setShowAddForm(true);
    setFormData({
      name: '',
      category: 'regulatory_update',
    });
  };

  // 處理編輯標籤
  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      category: tag.category,
    });
  };

  // 處理刪除標籤
  const handleDeleteTag = async (tagId: string) => {
    if (!confirm('確定要刪除此標籤嗎？')) return;
    
    try {
      // TODO: 實作刪除功能
      console.log('Delete tag:', tagId);
      await loadTags();
    } catch (err) {
      setError(err instanceof Error ? err.message : '刪除標籤失敗');
    }
  };

  // 處理儲存標籤
  const handleSaveTag = async () => {
    try {
      // TODO: 實作儲存功能
      console.log('Save tag:', formData);
      setShowAddForm(false);
      setEditingTag(null);
      await loadTags();
    } catch (err) {
      setError(err instanceof Error ? err.message : '儲存標籤失敗');
    }
  };

  // 處理取消編輯
  const handleCancelEdit = () => {
    setShowAddForm(false);
    setEditingTag(null);
    setFormData({
      name: '',
      category: 'regulatory_update',
    });
  };

  // 處理表單變更
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 篩選標籤
  const filteredTags = tags.filter(tag => {
    // 搜尋篩選
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!tag.name.toLowerCase().includes(query)) {
        return false;
      }
    }

    // 類別篩選
    if (categoryFilter !== 'all' && tag.category !== categoryFilter) {
      return false;
    }

    return true;
  });

  // 統計資料
  const totalUsage = tags.reduce((sum, tag) => sum + tag.usageCount, 0);
  const averageUsage = tags.length > 0 ? Math.round(totalUsage / tags.length) : 0;

  return (
    <div className="intelligence-tag-view space-y-6">
      {/* 標題和操作按鈕 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TagIcon className="h-6 w-6" />
            標籤管理
          </h2>
          <p className="text-muted-foreground mt-1">
            管理情報標籤和分類
          </p>
        </div>
        <Button onClick={handleAddTag}>
          <Plus className="h-4 w-4 mr-2" />
          新增標籤
        </Button>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">總標籤數</p>
                <p className="text-2xl font-bold">{tags.length}</p>
              </div>
              <Hash className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">總使用次數</p>
                <p className="text-2xl font-bold">{totalUsage}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">平均使用次數</p>
                <p className="text-2xl font-bold">{averageUsage}</p>
              </div>
              <Calculator className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
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
                  placeholder="搜尋標籤..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* 類別篩選 */}
              <div className="space-y-2">
                <Select
                  value={categoryFilter}
                  onValueChange={handleCategoryFilterChange}
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 新增/編輯表單 */}
      {(showAddForm || editingTag) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingTag ? '編輯標籤' : '新增標籤'}
            </CardTitle>
            <CardDescription>
              {editingTag ? '修改標籤資訊' : '建立新的情報標籤'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 標籤名稱 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">標籤名稱</label>
                <Input
                  placeholder="例如: ESG"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                />
              </div>

              {/* 類別 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">關聯類別</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleFormChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇類別" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(IntelligenceCategory).map(category => (
                      <SelectItem key={category} value={category}>
                        {INTELLIGENCE_CATEGORY_LABELS[category]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 操作按鈕 */}
              <div className="flex gap-2">
                <Button onClick={handleSaveTag}>
                  {editingTag ? '更新' : '建立'}
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

      {/* 標籤列表 */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTags.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  {searchQuery || categoryFilter !== 'all' ? '沒有符合條件的標籤' : '暫無標籤'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTags.map((tag) => {
              const usageLevel = getUsageLevel(tag.usageCount);
              
              return (
                <Card key={tag.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Hash className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-lg">{tag.name}</CardTitle>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTag(tag)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTag(tag.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 類別 */}
                    <div>
                      <Badge variant="outline">
                        {INTELLIGENCE_CATEGORY_LABELS[tag.category]}
                      </Badge>
                    </div>

                    {/* 使用次數 */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          使用次數
                        </span>
                        <span className={`text-sm font-semibold ${usageLevel.color}`}>
                          {usageLevel.label} ({tag.usageCount})
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all bg-blue-500"
                          style={{
                            width: `${Math.min((tag.usageCount / 50) * 100, 100)}%`,
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
                    <div className="text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>建立時間: {formatDate(tag.createdAt)}</span>
                      </div>
                      <div className="mt-1">
                        <span>ID: {tag.id}</span>
                      </div>
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

export default IntelligenceTagView;
