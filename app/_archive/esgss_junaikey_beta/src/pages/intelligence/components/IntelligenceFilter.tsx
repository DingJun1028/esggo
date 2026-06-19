/**
 * 情報篩選器組件
 * Intelligence Filter Component
 * 
 * @version 1.0.0
 * @date 2026-02-11
 */

import React from 'react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Search, Filter } from 'lucide-react';
import { 
  IntelligenceFilterProps, 
  IntelligenceFilters,
  IntelligenceCategory,
  IntelligencePriority,
  IntelligenceImpactLevel,
  PersonaType,
  INTELLIGENCE_CATEGORY_LABELS,
  INTELLIGENCE_PRIORITY_LABELS,
  INTELLIGENCE_IMPACT_LEVEL_LABELS,
  PERSONA_TYPE_LABELS,
} from '@/types/intelligence';

// ==========================================
// Component
// ==========================================

/**
 * 情報篩選器組件
 */
const IntelligenceFilter: React.FC<IntelligenceFilterProps> = ({ 
  filters, 
  onFilterChange 
}) => {
  // 處理搜尋變更
  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value || undefined });
  };

  // 處理類別變更
  const handleCategoryChange = (value: string) => {
    onFilterChange({ 
      ...filters, 
      category: value === 'all' ? undefined : value as IntelligenceCategory 
    });
  };

  // 處理優先級變更
  const handlePriorityChange = (value: string) => {
    onFilterChange({ 
      ...filters, 
      priority: value === 'all' ? undefined : value as IntelligencePriority 
    });
  };

  // 處理影響等級變更
  const handleImpactLevelChange = (value: string) => {
    onFilterChange({ 
      ...filters, 
      impactLevel: value === 'all' ? undefined : value as IntelligenceImpactLevel 
    });
  };

  // 處理角色變更
  const handlePersonaChange = (value: string) => {
    onFilterChange({ 
      ...filters, 
      persona: value === 'all' ? undefined : value as PersonaType 
    });
  };

  // 清除所有篩選
  const handleClearAll = () => {
    onFilterChange({});
  };

  // 計算啟用的篩選數量
  const activeFilterCount = Object.values(filters).filter(
    value => value !== undefined && value !== '' && value !== null
  ).length;

  return (
    <div className="intelligence-filter">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* 標題和清除按鈕 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">篩選條件</h3>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary">{activeFilterCount}</Badge>
                )}
              </div>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-muted-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  清除全部
                </Button>
              )}
            </div>

            {/* 搜尋框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜尋情報..."
                value={filters.search || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* 篩選選項 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 類別篩選 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">類別</label>
                <Select
                  value={filters.category || 'all'}
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

              {/* 優先級篩選 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">優先級</label>
                <Select
                  value={filters.priority || 'all'}
                  onValueChange={handlePriorityChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇優先級" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部優先級</SelectItem>
                    {Object.values(IntelligencePriority).map(priority => (
                      <SelectItem key={priority} value={priority}>
                        {INTELLIGENCE_PRIORITY_LABELS[priority]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 影響等級篩選 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">影響等級</label>
                <Select
                  value={filters.impactLevel || 'all'}
                  onValueChange={handleImpactLevelChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇影響等級" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部等級</SelectItem>
                    {Object.values(IntelligenceImpactLevel).map(level => (
                      <SelectItem key={level} value={level}>
                        {INTELLIGENCE_IMPACT_LEVEL_LABELS[level]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 角色篩選 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">角色</label>
                <Select
                  value={filters.persona || 'all'}
                  onValueChange={handlePersonaChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇角色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部角色</SelectItem>
                    {Object.values(PersonaType).map(persona => (
                      <SelectItem key={persona} value={persona}>
                        {PERSONA_TYPE_LABELS[persona]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 啟用的篩選標籤 */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                {filters.category && (
                  <Badge variant="secondary" className="gap-1">
                    類別: {INTELLIGENCE_CATEGORY_LABELS[filters.category]}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleCategoryChange('all')}
                    />
                  </Badge>
                )}
                {filters.priority && (
                  <Badge variant="secondary" className="gap-1">
                    優先級: {INTELLIGENCE_PRIORITY_LABELS[filters.priority]}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handlePriorityChange('all')}
                    />
                  </Badge>
                )}
                {filters.impactLevel && (
                  <Badge variant="secondary" className="gap-1">
                    影響等級: {INTELLIGENCE_IMPACT_LEVEL_LABELS[filters.impactLevel]}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleImpactLevelChange('all')}
                    />
                  </Badge>
                )}
                {filters.persona && (
                  <Badge variant="secondary" className="gap-1">
                    角色: {PERSONA_TYPE_LABELS[filters.persona]}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handlePersonaChange('all')}
                    />
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ==========================================
// Export
// ==========================================

export default IntelligenceFilter;
