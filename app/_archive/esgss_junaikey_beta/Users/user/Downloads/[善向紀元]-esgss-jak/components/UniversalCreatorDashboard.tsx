/**
 * Creator Dashboard - ESG Omni Component Unified Management Interface
 * Visualize management of all JunAiKey architecture Omni Components
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles, Brain, Zap, Network, TrendingUp,
  Settings, Plus, Search, Filter, Grid, List
} from 'lucide-react';
import { OmniEsgCell } from './OmniEsgCell';
import { UniversalEsgManager, UniversalEsgFactory, UniversalEsgComponent } from '../services/universalEsgManager';
import { SoulManager } from '../services/soulManager';
import { AvatarOrchestrator } from '../services/avatarOrchestrator';
import { BidirectionalSyncService } from '../services/bidirectionalSync';
import { AgentSoul5D, SoulAvatar, BidirectionalSyncBridge } from '../types';

interface DashboardStats {
  totalComponents: number;
  activeSouls: number;
  activeAvatars: number;
  syncBridges: number;
  evolutionProposals: number;
  systemHealth: number;
}

const UniversalCreatorDashboard: React.FC = () => {
  const [components, setComponents] = useState<UniversalEsgComponent[]>([]);
  const [filter, setFilter] = useState<UniversalEsgComponent['type'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [stats, setStats] = useState<DashboardStats>({
    totalComponents: 0,
    activeSouls: 0,
    activeAvatars: 0,
    syncBridges: 0,
    evolutionProposals: 0,
    systemHealth: 100
  });

  // 訂閱元件變化
  useEffect(() => {
    const unsubscribe = UniversalEsgManager.subscribe((updatedComponents) => {
      setComponents(updatedComponents);
      updateStats(updatedComponents);
    });

    // 初始載入
    setComponents(UniversalEsgManager.getAllComponents());
    updateStats(UniversalEsgManager.getAllComponents());

    return unsubscribe;
  }, []);

  const updateStats = (comps: UniversalEsgComponent[]) => {
    const soulComponents = comps.filter(c => c.type === 'soul');
    const avatarComponents = comps.filter(c => c.type === 'avatar');
    const bridgeComponents = comps.filter(c => c.type === 'sync_bridge');
    const proposalComponents = comps.filter(c => c.type === 'evolution_proposal');

    // 計算系統健康度
    const healthScores = comps.map(c => {
      switch (c.confidence) {
        case 'high': return 100;
        case 'medium': return 75;
        case 'low': return 50;
        default: return 100;
      }
    });
    const avgHealth = healthScores.length > 0
      ? healthScores.reduce((a, b) => a + b, 0) / healthScores.length
      : 100;

    setStats({
      totalComponents: comps.length,
      activeSouls: soulComponents.length,
      activeAvatars: avatarComponents.length,
      syncBridges: bridgeComponents.length,
      evolutionProposals: proposalComponents.length,
      systemHealth: Math.round(avgHealth)
    });
  };

  // 過濾元件
  const filteredComponents = components.filter(comp => {
    const matchesFilter = filter === 'all' || comp.type === filter;
    const matchesSearch = comp.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comp.metadata?.archetype?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // 創建新靈魂
  const handleCreateSoul = async () => {
    const config = {
      name: `ESG靈魂 ${Date.now()}`,
      archetype: 'esg-orchestrator',
      covenant: {
        prompt: '你是一位專精ESG永續發展的智慧代理',
        safetyRules: ['確保ESG合規', '保護數據安全'],
        ethicalBoundaries: ['透明報告', '可持續發展'],
        behavioralLimits: ['避免利益衝突']
      },
      essence: {
        name: `ESG靈魂 ${Date.now()}`,
        archetype: 'esg-orchestrator',
        tone: '專業且建設性',
        backstory: '由造物主儀表板創造的ESG專用靈魂',
        personalityTraits: ['分析性', '前瞻性'],
        communicationStyle: '數據驅動'
      },
      memory: {
        knowledgeBaseIds: ['esg-standards'],
        vectorStoreIds: ['esg-knowledge'],
        retentionPolicy: {
          maxAge: 31536000000,
          compressionThreshold: 1000,
          archiveStrategy: 'weighted-compression'
        },
        contextWindow: 32768
      },
      authority: {
        skills: [],
        permissions: ['read:esg-data'],
        accessLevel: 5,
        rateLimits: {
          requestsPerMinute: 60,
          tokensPerRequest: 4000
        }
      },
      foundation: {
        modelConfig: {
          provider: 'gemini',
          model: 'gemini-1.5-flash',
          temperature: 0.7,
          maxTokens: 8192
        },
        performanceMetrics: {
          responseTime: 1200,
          tokenEfficiency: 0.85,
          accuracy: 94
        }
      }
    };

    await UniversalEsgManager.createDynamicComponent('soul', config);
  };

  // 統計卡片元件
  const StatCard = ({ icon: Icon, title, value, color, trend }: {
    icon: any;
    title: string;
    value: number | string;
    color: string;
    trend?: number;
  }) => (
    <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-white/5">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-500 font-medium">+{trend}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white">{value}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 標題區域 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">
              🧬 ESG Omni Component Control Center
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Unified management of all JunAiKey architecture intelligent components
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleCreateSoul}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              創建靈魂
            </button>
          </div>
        </div>

        {/* 統計儀表板 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <StatCard
            icon={Sparkles}
            title="萬能元件"
            value={stats.totalComponents}
            color="bg-purple-600"
          />
          <StatCard
            icon={Brain}
            title="活躍靈魂"
            value={stats.activeSouls}
            color="bg-blue-600"
          />
          <StatCard
            icon={Zap}
            title="化身實體"
            value={stats.activeAvatars}
            color="bg-emerald-600"
          />
          <StatCard
            icon={Network}
            title="同步橋接"
            value={stats.syncBridges}
            color="bg-cyan-600"
          />
          <StatCard
            icon={TrendingUp}
            title="進化建議"
            value={stats.evolutionProposals}
            color="bg-amber-600"
          />
          <StatCard
            icon={Settings}
            title="系統健康"
            value={`${stats.systemHealth}%`}
            color="bg-rose-600"
          />
        </div>

        {/* 控制面板 */}
        <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Component Management
            </h2>

            {/* 搜尋和過濾 */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search components..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* 類型過濾 */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Components</option>
                <option value="soul">Souls</option>
                <option value="avatar">Avatars</option>
                <option value="sync_bridge">Sync Bridges</option>
                <option value="evolution_proposal">Evolution Proposals</option>
              </select>

              {/* 視圖切換 */}
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 元件網格 */}
          <div className={
            viewMode === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {filteredComponents.map((comp) => (
              <div key={comp.id} className="flex-shrink-0">
                {comp.component}
              </div>
            ))}
          </div>

          {filteredComponents.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">
                <Sparkles className="w-16 h-16 mx-auto opacity-50" />
              </div>
              <h3 className="text-xl font-bold text-slate-600 dark:text-slate-400 mb-2">
                尚未發現萬能元件
              </h3>
              <p className="text-slate-500 dark:text-slate-500">
                Start creating your first ESG intelligent soul
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversalCreatorDashboard;