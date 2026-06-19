/**
 * 📢 法規更新推播組件
 * --------------------------------------------------
 * [功能] ESG 相關法規即時追蹤與影響分析
 * [整合] AI 分析、訂閱機制、影響評估
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale,
  Bell,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Filter,
  Search,
  Tag,
  Calendar,
  Building2,
  Globe,
  TrendingUp,
  BookOpen,
  ChevronRight,
  Star,
  Clock,
} from 'lucide-react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// Types
// ============================================================================

export interface RegulatoryUpdate {
  id: string;
  title: string;
  summary: string;
  category: RegulationCategory;
  region: string;
  publishDate: Date;
  effectiveDate?: Date;
  source: string;
  sourceUrl: string;
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  affectedIndustries: string[];
  isRead: boolean;
  isStarred: boolean;
}

export type RegulationCategory =
  | 'carbon'
  | 'disclosure'
  | 'taxonomy'
  | 'due_diligence'
  | 'social'
  | 'governance'
  | 'other';

export interface ImpactAnalysis {
  regulationId: string;
  complianceGap: string[];
  requiredActions: string[];
  estimatedCost: string;
  deadline: Date;
  riskLevel: 'low' | 'medium' | 'high';
}

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_REGULATIONS: RegulatoryUpdate[] = [
  {
    id: 'reg-001',
    title: 'CSRD 企業永續報告指令生效',
    summary: '歐盟 CSRD 要求大型企業依據 ESRS 標準揭露永續資訊，適用範圍擴大至非歐盟企業子公司。',
    category: 'disclosure',
    region: '歐盟',
    publishDate: new Date('2024-01-01'),
    effectiveDate: new Date('2025-01-01'),
    source: '歐盟官方公報',
    sourceUrl: 'https://eur-lex.europa.eu/',
    impactLevel: 'critical',
    tags: ['CSRD', 'ESRS', '永續報告', '強制揭露'],
    affectedIndustries: ['all'],
    isRead: false,
    isStarred: true,
  },
  {
    id: 'reg-002',
    title: '台灣碳費徵收辦法公告',
    summary: '環境部公告碳費徵收對象與費率，年排放量達 2.5 萬公噸 CO₂e 以上之排放源納入管制。',
    category: 'carbon',
    region: '台灣',
    publishDate: new Date('2024-08-15'),
    effectiveDate: new Date('2025-01-01'),
    source: '環境部',
    sourceUrl: 'https://www.moenv.gov.tw/',
    impactLevel: 'high',
    tags: ['碳費', '碳定價', '排放管制'],
    affectedIndustries: ['製造業', '電力業', '鋼鐵業'],
    isRead: true,
    isStarred: false,
  },
  {
    id: 'reg-003',
    title: 'CBAM 過渡期申報要求',
    summary: '歐盟碳邊境調整機制過渡期開始，進口商須申報產品隱含碳排放量。',
    category: 'carbon',
    region: '歐盟',
    publishDate: new Date('2023-10-01'),
    effectiveDate: new Date('2026-01-01'),
    source: '歐盟執委會',
    sourceUrl: 'https://taxation-customs.ec.europa.eu/',
    impactLevel: 'high',
    tags: ['CBAM', '碳邊境稅', '貿易'],
    affectedIndustries: ['鋼鐵', '鋁業', '水泥', '肥料', '電力'],
    isRead: false,
    isStarred: true,
  },
  {
    id: 'reg-004',
    title: 'SEC 氣候揭露規則',
    summary: '美國 SEC 要求上市公司揭露氣候相關風險、溫室氣體排放及淨零轉型計畫。',
    category: 'disclosure',
    region: '美國',
    publishDate: new Date('2024-03-06'),
    effectiveDate: new Date('2025-01-01'),
    source: 'SEC',
    sourceUrl: 'https://www.sec.gov/',
    impactLevel: 'high',
    tags: ['SEC', '氣候揭露', '上市公司'],
    affectedIndustries: ['上市公司'],
    isRead: false,
    isStarred: false,
  },
  {
    id: 'reg-005',
    title: 'ISSB S1/S2 準則發布',
    summary: 'IFRS 永續揭露準則正式發布，建立全球統一的永續報告框架。',
    category: 'disclosure',
    region: '全球',
    publishDate: new Date('2023-06-26'),
    effectiveDate: new Date('2024-01-01'),
    source: 'ISSB',
    sourceUrl: 'https://www.ifrs.org/',
    impactLevel: 'critical',
    tags: ['ISSB', 'IFRS S1', 'IFRS S2', '全球標準'],
    affectedIndustries: ['all'],
    isRead: true,
    isStarred: true,
  },
];

const CATEGORY_CONFIG: Record<
  RegulationCategory,
  { label: string; color: string; icon: React.ReactNode }
> = {
  carbon: { label: '碳排放', color: 'green', icon: <TrendingUp size={14} /> },
  disclosure: { label: '資訊揭露', color: 'blue', icon: <BookOpen size={14} /> },
  taxonomy: { label: '永續分類', color: 'purple', icon: <Tag size={14} /> },
  due_diligence: { label: '盡職調查', color: 'orange', icon: <Search size={14} /> },
  social: { label: '社會責任', color: 'pink', icon: <Building2 size={14} /> },
  governance: { label: '公司治理', color: 'indigo', icon: <Scale size={14} /> },
  other: { label: '其他', color: 'gray', icon: <Globe size={14} /> },
};

// ============================================================================
// Main Component
// ============================================================================

interface RegulatoryAlertsProps {
  companyIndustries?: string[];
  subscribedRegions?: string[];
  onRegulationClick?: (reg: RegulatoryUpdate) => void;
}

export const RegulatoryAlerts: React.FC<RegulatoryAlertsProps> = ({
  companyIndustries = ['製造業'],
  subscribedRegions = ['台灣', '歐盟', '全球'],
  onRegulationClick,
}) => {
  const [regulations, setRegulations] = useState<RegulatoryUpdate[]>(MOCK_REGULATIONS);
  const [selectedCategory, setSelectedCategory] = useState<RegulationCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    omniLogger.info(LogCategory.SEC, '法規警示組件已啟動', {
      regions: subscribedRegions,
      industries: companyIndustries,
      source_origin: 'RegulatoryAlerts.mount',
    });
  }, [subscribedRegions, companyIndustries]);

  // Filter regulations
  const filteredRegs = regulations.filter(reg => {
    const matchesCategory = selectedCategory === 'all' || reg.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      reg.title.includes(searchQuery) ||
      reg.summary.includes(searchQuery) ||
      reg.tags.some(t => t.includes(searchQuery));
    const matchesUnread = !showUnreadOnly || !reg.isRead;
    const matchesRegion = subscribedRegions.includes(reg.region);
    return matchesCategory && matchesSearch && matchesUnread && matchesRegion;
  });

  // Stats
  const unreadCount = regulations.filter(r => !r.isRead).length;
  const criticalCount = regulations.filter(
    r => r.impactLevel === 'critical' || r.impactLevel === 'high'
  ).length;

  // Mark as read
  const markAsRead = (id: string) => {
    setRegulations(prev => prev.map(r => (r.id === id ? { ...r, isRead: true } : r)));
  };

  // Toggle star
  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRegulations(prev => prev.map(r => (r.id === id ? { ...r, isStarred: !r.isStarred } : r)));
  };

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-red-400 bg-red-500/20';
      case 'high':
        return 'text-orange-400 bg-orange-500/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20';
      default:
        return 'text-green-400 bg-green-500/20';
    }
  };

  return (
    <div className="frosted-panel rounded-2xl p-6 border border-blue-500/20 neon-border-cyan animate-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 relative">
            <Scale size={24} className="text-white" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900 animate-ping" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">全球法規預警系統</h2>
            <p className="text-sm text-slate-400">訂閱區域：{subscribedRegions.join(', ')}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
            <Bell size={14} className="text-red-400" />
            <span className="text-sm text-red-400 font-bold">{unreadCount}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <AlertTriangle size={14} className="text-orange-400" />
            <span className="text-sm text-orange-400 font-bold">{criticalCount}</span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜尋法規..."
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 outline-none"
          />
        </div>
        <button
          onClick={() => setShowUnreadOnly(!showUnreadOnly)}
          className={`px-3 py-2 rounded-lg text-sm transition-all ${
            showUnreadOnly
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}
        >
          僅顯示未讀
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
            selectedCategory === 'all'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          全部
        </button>
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key as RegulationCategory)}
            className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all ${
              selectedCategory === key
                ? `bg-${config.color}-500/20 text-${config.color}-400 border border-${config.color}-500/30`
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {config.icon}
            {config.label}
          </button>
        ))}
      </div>

      {/* Regulation List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {filteredRegs.map(reg => (
            <motion.div
              key={reg.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={() => {
                const trace_id = uuidv4();
                omniLogger.info(LogCategory.SEC, `用戶查看法規: ${reg.title}`, {
                  trace_id,
                  reg_id: reg.id,
                  region: reg.region,
                  source_origin: 'RegulatoryAlerts.onClick',
                });
                markAsRead(reg.id);
                setExpandedId(expandedId === reg.id ? null : reg.id);
                onRegulationClick?.(reg);
              }}
              className={`p-4 rounded-xl cursor-pointer transition-all ${
                reg.isRead
                  ? 'bg-slate-800/30 hover:bg-slate-800/50'
                  : 'bg-slate-800/70 hover:bg-slate-700/70 border-l-2 border-blue-500'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${getImpactColor(reg.impactLevel)}`}
                    >
                      {reg.impactLevel === 'critical'
                        ? '緊急'
                        : reg.impactLevel === 'high'
                          ? '重要'
                          : reg.impactLevel === 'medium'
                            ? '注意'
                            : '一般'}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300">
                      {reg.region}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-400 flex items-center gap-1">
                      {CATEGORY_CONFIG[reg.category].icon}
                      {CATEGORY_CONFIG[reg.category].label}
                    </span>
                  </div>
                  <h3 className={`font-medium ${reg.isRead ? 'text-slate-300' : 'text-white'}`}>
                    {reg.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{reg.summary}</p>
                </div>
                <button
                  onClick={e => toggleStar(reg.id, e)}
                  className="p-1 hover:bg-slate-700 rounded transition-all"
                >
                  <Star
                    size={16}
                    className={reg.isStarred ? 'text-yellow-400 fill-yellow-400' : 'text-slate-500'}
                  />
                </button>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  發布：{reg.publishDate.toLocaleDateString('zh-TW')}
                </span>
                {reg.effectiveDate && (
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    生效：{reg.effectiveDate.toLocaleDateString('zh-TW')}
                  </span>
                )}
                <a
                  href={reg.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-1 hover:text-blue-400 transition-all"
                >
                  <ExternalLink size={12} />
                  {reg.source}
                </a>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {reg.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-slate-700/50 rounded text-xs text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedId === reg.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-slate-700"
                  >
                    <h4 className="text-sm font-medium text-slate-300 mb-2">影響評估</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-800/50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">受影響產業</p>
                        <p className="text-sm text-slate-300">
                          {reg.affectedIndustries.join('、')}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-800/50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">建議行動</p>
                        <p className="text-sm text-slate-300">評估合規缺口、制定因應策略</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredRegs.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Scale size={32} className="mx-auto mb-2 opacity-50" />
            <p>無符合條件的法規更新</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegulatoryAlerts;
