'use client';

import React, { useState } from 'react';
import { RegulationFilters, ReportFilters } from '@/types/esg-sonar';

interface FilterPanelProps {
  onFilterChange: (filters: Record<string, unknown>) => void;
  filterType: 'regulations' | 'reports';
  className?: string;
}

// 通用過濾器類型
type FilterState = Record<string, unknown>;

// 法規分類選項
const regulationCategories = [
  { value: 'ENVIRONMENTAL', label: '環境保護', icon: '🌿' },
  { value: 'SOCIAL', label: '社會責任', icon: '🤝' },
  { value: 'GOVERNANCE', label: '公司治理', icon: '⚖️' },
  { value: 'DISCLOSURE', label: '資訊揭露', icon: '📊' },
  { value: 'TAXONOMY', label: '分類標準', icon: '📋' },
  { value: 'OTHER', label: '其他', icon: '📌' }
];

// 法規狀態選項
const regulationStatuses = [
  { value: 'ACTIVE', label: '生效中', color: 'var(--esg-success)' },
  { value: 'AMENDED', label: '已修訂', color: 'var(--esg-warning)' },
  { value: 'REPEALED', label: '已廢止', color: 'var(--esg-error)' },
  { value: 'DRAFT', label: '草案', color: 'var(--esg-text-muted)' }
];

// 報告書類型選項
const reportTypes = [
  { value: 'ESG_REPORT', label: 'ESG 報告', icon: '📈' },
  { value: 'SUSTAINABILITY', label: '永續報告', icon: '🌱' },
  { value: 'ANNUAL_REPORT', label: '年報', icon: '📊' },
  { value: 'CARBON_INVENTORY', label: '碳盤查報告', icon: '🌿' },
  { value: 'INTEGRATED', label: '整合報告', icon: '🔗' },
  { value: 'OTHER', label: '其他', icon: '📄' }
];

// 報告書狀態選項
const reportStatuses = [
  { value: 'PENDING', label: '待處理', color: 'var(--esg-text-muted)' },
  { value: 'PROCESSING', label: '處理中', color: 'var(--esg-info)' },
  { value: 'COMPLETED', label: '已完成', color: 'var(--esg-success)' },
  { value: 'FAILED', label: '失敗', color: 'var(--esg-error)' },
  { value: 'ARCHIVED', label: '已歸檔', color: 'var(--esg-text-muted)' }
];

// 發布機關選項
const authorities = [
  '金管會',
  '環境部',
  '勞動部',
  '經濟部',
  '證交所',
  '櫃買中心',
  '中央銀行'
];

// 產業別選項
const industries = [
  '半導體',
  '電子',
  '金融',
  '鋼鐵',
  '化工',
  '製藥',
  '食品',
  '紡織',
  '營建',
  '傳產'
];

export function FilterPanel({ onFilterChange, filterType, className = '' }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({});
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    const newFilters = { ...filters, search: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCategoryToggle = (category: string) => {
    const currentCategories = (filters.categories as string[] || []);
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    
    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStatusToggle = (status: string) => {
    const currentStatuses = (filters.status as string[] || []);
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    
    const newFilters = { ...filters, status: newStatuses };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAuthorityToggle = (authority: string) => {
    const currentAuthorities = (filters.authorities as string[] || []);
    const newAuthorities = currentAuthorities.includes(authority)
      ? currentAuthorities.filter(a => a !== authority)
      : [...currentAuthorities, authority];
    
    const newFilters = { ...filters, authorities: newAuthorities };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleIndustryToggle = (industry: string) => {
    const currentIndustries = (filters.industries as string[] || []);
    const newIndustries = currentIndustries.includes(industry)
      ? currentIndustries.filter(i => i !== industry)
      : [...currentIndustries, industry];
    
    const newFilters = { ...filters, industries: newIndustries };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateChange = (field: 'dateFrom' | 'dateTo', value: string) => {
    const newFilters = { ...filters, [field]: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setFilters({});
    setSearchValue('');
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(v => 
    Array.isArray(v) ? v.length > 0 : v
  );

  return (
    <div className={`rounded-xl border bg-[var(--esg-card-bg)] border-[var(--esg-glass-border)] ${className}`}>
      {/* 標題和折疊 */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🔍</span>
          <h3 className="font-semibold text-[var(--esg-text-main)]">篩選條件</h3>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--esg-primary)] text-white">
              已套用
            </span>
          )}
        </div>
        <button className="text-[var(--esg-text-muted)] hover:text-[var(--esg-primary)] transition-colors">
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      {/* 篩選內容 */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-4">
          {/* 搜尋框 */}
          <div>
            <label className="block text-sm font-medium text-[var(--esg-text-sub)] mb-2">
              關鍵字搜尋
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--esg-text-muted)]">
                🔎
              </span>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="搜尋法規名稱、編號..."
                className="
                  w-full pl-10 pr-4 py-2 rounded-lg border 
                  bg-[var(--esg-surface)] border-[var(--esg-glass-border)]
                  text-[var(--esg-text-main)] placeholder-[var(--esg-text-muted)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--esg-primary)] focus:border-transparent
                  transition-all
                "
              />
            </div>
          </div>

          {/* 法規分類 */}
          <div>
            <label className="block text-sm font-medium text-[var(--esg-text-sub)] mb-2">
              ESG 分類
            </label>
            <div className="flex flex-wrap gap-2">
              {regulationCategories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryToggle(cat.value)}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                    border
                    ${(filters.categories as string[] || []).includes(cat.value)
                      ? 'bg-[var(--esg-primary)] text-white border-[var(--esg-primary)]'
                      : 'bg-[var(--esg-surface)] text-[var(--esg-text-sub)] border-[var(--esg-glass-border)] hover:border-[var(--esg-primary)]'
                    }
                  `}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 狀態 */}
          <div>
            <label className="block text-sm font-medium text-[var(--esg-text-sub)] mb-2">
              狀態
            </label>
            <div className="flex flex-wrap gap-2">
              {filterType === 'regulations' 
                ? regulationStatuses.map(status => (
                    <button
                      key={status.value}
                      onClick={() => handleStatusToggle(status.value)}
                      className={`
                        px-3 py-1.5 rounded-lg text-sm font-medium transition-all border
                        ${(filters.status as string[] || []).includes(status.value)
                          ? 'border-transparent'
                          : 'bg-[var(--esg-surface)] border-[var(--esg-glass-border)] hover:border-[var(--esg-primary)]'
                        }
                      `}
                      style={(filters.status as string[] || []).includes(status.value) ? {
                        backgroundColor: `${status.color}20`,
                        color: status.color,
                        borderColor: status.color
                      } : {}}
                    >
                      {status.label}
                    </button>
                  ))
                : reportStatuses.map(status => (
                    <button
                      key={status.value}
                      onClick={() => handleStatusToggle(status.value)}
                      className={`
                        px-3 py-1.5 rounded-lg text-sm font-medium transition-all border
                        ${(filters.status as string[] || []).includes(status.value)
                          ? 'border-transparent'
                          : 'bg-[var(--esg-surface)] border-[var(--esg-glass-border)] hover:border-[var(--esg-primary)]'
                        }
                      `}
                      style={(filters.status as string[] || []).includes(status.value) ? {
                        backgroundColor: `${status.color}20`,
                        color: status.color,
                        borderColor: status.color
                      } : {}}
                    >
                      {status.label}
                    </button>
                  ))
              }
            </div>
          </div>

          {/* 發布機關 */}
          {filterType === 'regulations' && (
            <div>
              <label className="block text-sm font-medium text-[var(--esg-text-sub)] mb-2">
                發布機關
              </label>
              <div className="flex flex-wrap gap-2">
                {authorities.map(auth => (
                  <button
                    key={auth}
                    onClick={() => handleAuthorityToggle(auth)}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                      ${(filters.authorities as string[] || []).includes(auth)
                        ? 'bg-[var(--esg-primary)] text-white'
                        : 'bg-[var(--esg-surface)] text-[var(--esg-text-sub)] border border-[var(--esg-glass-border)] hover:border-[var(--esg-primary)]'
                      }
                    `}
                  >
                    {auth}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 產業別 */}
          {filterType === 'reports' && (
            <div>
              <label className="block text-sm font-medium text-[var(--esg-text-sub)] mb-2">
                產業別
              </label>
              <div className="flex flex-wrap gap-2">
                {industries.map(ind => (
                  <button
                    key={ind}
                    onClick={() => handleIndustryToggle(ind)}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                      ${(filters.industries as string[] || []).includes(ind)
                        ? 'bg-[var(--esg-primary)] text-white'
                        : 'bg-[var(--esg-surface)] text-[var(--esg-text-sub)] border border-[var(--esg-glass-border)] hover:border-[var(--esg-primary)]'
                      }
                    `}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 日期範圍 */}
          <div>
            <label className="block text-sm font-medium text-[var(--esg-text-sub)] mb-2">
              發布日期範圍
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={(filters as RegulationFilters).dateFrom || ''}
                onChange={(e) => handleDateChange('dateFrom', e.target.value)}
                className="
                  flex-1 px-3 py-2 rounded-lg border
                  bg-[var(--esg-surface)] border-[var(--esg-glass-border)]
                  text-[var(--esg-text-main)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--esg-primary)]
                "
              />
              <span className="text-[var(--esg-text-muted)]">至</span>
              <input
                type="date"
                value={(filters as RegulationFilters).dateTo || ''}
                onChange={(e) => handleDateChange('dateTo', e.target.value)}
                className="
                  flex-1 px-3 py-2 rounded-lg border
                  bg-[var(--esg-surface)] border-[var(--esg-glass-border)]
                  text-[var(--esg-text-main)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--esg-primary)]
                "
              />
            </div>
          </div>

          {/* 重置按鈕 */}
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="
                w-full px-4 py-2 rounded-lg border border-[var(--esg-glass-border)]
                text-[var(--esg-text-sub)] hover:text-[var(--esg-primary)] hover:border-[var(--esg-primary)]
                transition-all
              "
            >
              清除所有篩選
            </button>
          )}
        </div>
      )}
    </div>
  );
}