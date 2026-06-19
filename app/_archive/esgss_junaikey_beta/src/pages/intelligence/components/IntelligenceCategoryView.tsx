/**
 * 類別管理視圖組件
 * Intelligence Category View Component
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
  FolderOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Palette,
  Calculator,
  Database,
  FileCheck,
  Link as LinkIcon,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  Category, 
  IntelligenceCategory,
  INTELLIGENCE_CATEGORY_LABELS,
} from '@/types/intelligence';
import { intelligenceDetectionService } from '@/services/IntelligenceDetectionService';

// ==========================================
// Props
// ==========================================

interface IntelligenceCategoryViewProps {
  persona?: string;
}

// ==========================================
// Utility Functions
// ==========================================

/**
 * 預設類別顏色
 */
const DEFAULT_CATEGORY_COLORS: Record<IntelligenceCategory, string> = {
  regulatory_update: '#ef4444',
  market_trend: '#3b82f6',
  competitor_activity: '#f59e0b',
  technology_innovation: '#8b5cf6',
  sustainability_initiative: '#10b981',
  policy_change: '#ec4899',
  industry_report: '#6366f1',
  news_event: '#14b8a6',
};

/**
 * 預設類別圖示
 */
const DEFAULT_CATEGORY_ICONS: Record<IntelligenceCategory, string> = {
  regulatory_update: '⚖️',
  market_trend: '📈',
  competitor_activity: '🎯',
  technology_innovation: '💡',
  sustainability_initiative: '🌱',
  policy_change: '📋',
  industry_report: '📊',
  news_event: '📰',
};

// ==========================================
// Component
// ==========================================

/**
 * 類別管理視圖組件
 */
const IntelligenceCategoryView: React.FC<IntelligenceCategoryViewProps> = ({ 
  persona = 'CEO',
}) => {
  // 狀態
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    color: '#3b82f6',
    icon: '📁',
  });

  // 載入類別列表
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await intelligenceDetectionService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入類別失敗');
    } finally {
      setLoading(false);
    }
  };

  // 處理搜尋
  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  // 處理新增類別
  const handleAddCategory = () => {
    setShowAddForm(true);
    setFormData({
      name: '',
      displayName: '',
      description: '',
      color: '#3b82f6',
      icon: '📁',
    });
  };

  // 處理編輯類別
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      displayName: category.displayName,
      description: category.description,
      color: category.color,
      icon: category.icon,
    });
  };

  // 處理刪除類別
  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('確定要刪除此類別嗎？')) return;
    
    try {
      // TODO: 實作刪除功能
      console.log('Delete category:', categoryId);
      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : '刪除類別失敗');
    }
  };

  // 處理儲存類別
  const handleSaveCategory = async () => {
    try {
      // TODO: 實作儲存功能
      console.log('Save category:', formData);
      setShowAddForm(false);
      setEditingCategory(null);
      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : '儲存類別失敗');
    }
  };

  // 處理取消編輯
  const handleCancelEdit = () => {
    setShowAddForm(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      displayName: '',
      description: '',
      color: '#3b82f6',
      icon: '📁',
    });
  };

  // 處理表單變更
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 篩選類別
  const filteredCategories = categories.filter(category => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        category.name.toLowerCase().includes(query) ||
        category.displayName.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // 顏色選項
  const colorOptions = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e',
  ];

  // 圖示選項
  const iconOptions = [
    '📁', '📂', '📋', '📊', '📈', '📉', '📰', '📄',
    '💡', '🎯', '⚖️', '🌱', '🔬', '💼', '🏢', '🏭',
  ];

  return (
    <div className="intelligence-category-view space-y-6">
      {/* 標題和操作按鈕 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FolderOpen className="h-6 w-6" />
            類別管理
          </h2>
          <p className="text-muted-foreground mt-1">
            管理情報類別和設定
          </p>
        </div>
        <Button onClick={handleAddCategory}>
          <Plus className="h-4 w-4 mr-2" />
          新增類別
        </Button>
      </div>

      {/* 搜尋框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜尋類別..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* 新增/編輯表單 */}
      {(showAddForm || editingCategory) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCategory ? '編輯類別' : '新增類別'}
            </CardTitle>
            <CardDescription>
              {editingCategory ? '修改類別資訊' : '建立新的情報類別'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 類別名稱 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">類別名稱</label>
                <Input
                  placeholder="例如: regulatory_update"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  disabled={!!editingCategory}
                />
              </div>

              {/* 顯示名稱 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">顯示名稱</label>
                <Input
                  placeholder="例如: 法規更新"
                  value={formData.displayName}
                  onChange={(e) => handleFormChange('displayName', e.target.value)}
                />
              </div>

              {/* 描述 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">描述</label>
                <Input
                  placeholder="類別描述"
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                />
              </div>

              {/* 顏色選擇 */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  顏色
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        formData.color === color ? 'border-primary scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleFormChange('color', color)}
                    />
                  ))}
                </div>
              </div>

              {/* 圖示選擇 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">圖示</label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xl transition-all ${
                        formData.icon === icon ? 'border-primary scale-110' : 'border-transparent'
                      }`}
                      onClick={() => handleFormChange('icon', icon)}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* 預覽 */}
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">預覽</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{formData.icon}</span>
                  <Badge
                    style={{
                      backgroundColor: formData.color,
                      color: '#ffffff',
                    }}
                  >
                    {formData.displayName || '顯示名稱'}
                  </Badge>
                </div>
              </div>

              {/* 操作按鈕 */}
              <div className="flex gap-2">
                <Button onClick={handleSaveCategory}>
                  {editingCategory ? '更新' : '建立'}
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

      {/* 類別列表 */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  {searchQuery ? '沒有符合條件的類別' : '暫無類別'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{category.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{category.displayName}</CardTitle>
                        <CardDescription className="text-xs">
                          {category.name}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 顏色指示器 */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-xs text-muted-foreground">
                      顏色代碼: {category.color}
                    </span>
                  </div>

                  {/* 描述 */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>

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

                  {/* 狀態 */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      {category.isActive ? (
                        <>
                          <Eye className="h-3 w-3 text-green-500" />
                          <span className="text-green-500">啟用</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">停用</span>
                        </>
                      )}
                    </div>
                    <span className="text-muted-foreground">ID: {category.id}</span>
                  </div>
                </CardContent>
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

export default IntelligenceCategoryView;
