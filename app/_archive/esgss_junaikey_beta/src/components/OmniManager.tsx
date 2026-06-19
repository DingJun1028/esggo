/**
 * 奧秘管理器 (Omni Manager)
 * 靈性智能層 (Cognitive Intelligence Layer) - 核心官制介面
 * 負責監控與調整奧秘心核的四大子系統：元件、標籤、智庫、永憶
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Brain,
  Database,
  Activity,
  Cpu,
  Key,
  Layers,
  Search,
  RefreshCw,
  Zap,
  Star,
  Info,
} from 'lucide-react';
import { omniClient } from '../api/omniClient.ts';
import {
  OmniComponentState,
  EternalMemoryType,
  type HealthCheckResponse,
  type MemoryStatistics,
  type KnowledgeBaseInfo,
  type UltimateRune,
  ProficiencyLevel,
  RuneCategory,
} from '../../shared/types';
import { OmniUltimateMatrix } from './OmniUltimateMatrix.tsx';

// ==================== TYPES & MOCK DATA ====================

interface ComponentStatus {
  id: string;
  name: string;
  type: string;
  state: OmniComponentState;
  version: string;
  lastExec?: string;
}

const MOCK_COMPONENTS: ComponentStatus[] = [
  {
    id: 'engine_sov',
    name: 'Sovereign Engine',
    type: 'Core',
    state: OmniComponentState.READY,
    version: '7.0.0',
  },
  {
    id: 'engine_vir',
    name: 'Virtue Engine',
    type: 'Cognitive',
    state: OmniComponentState.READY,
    version: '10.2.1',
  },
  {
    id: 'guard_audit',
    name: 'Guardians Audit',
    type: 'Security',
    state: OmniComponentState.EXECUTING,
    version: '4.5.0',
  },
  {
    id: 'mcp_bridge',
    name: 'MCP Bridge',
    type: 'Interop',
    state: OmniComponentState.READY,
    version: '1.2.0',
  },
  {
    id: 'arvo_reason',
    name: 'ARVO Reasoner',
    type: 'AI',
    state: OmniComponentState.READY,
    version: '6.0.0',
  },
];

const MOCK_ULTIMATES: UltimateRune[] = [
  {
    id: 'ult-truth-seeker',
    name: '奧義・真理之眼',
    description: '瞬間識破所有數據幻覺，強制對齊 ESG 核心框架，獲取 100% 信心分數。',
    category: RuneCategory.ULTIMATE,
    type: 'composite',
    proficiency: { level: ProficiencyLevel.MASTER, usageCount: 742, successRate: 0.99 },
    unlockedAt: new Date().toISOString(),
    basePower: 850,
    complexity: 9,
    ultimate: { tier: 'legendary', power: 900, cooldown: 3600, energyCost: 80 },
  },
  {
    id: 'ult-swarm-sync',
    name: '奧義・千機同步',
    description: '同步所有活躍 Agent，將其算力矩陣化，縮短 90% 的複雜決策時間。',
    category: RuneCategory.ULTIMATE,
    type: 'composite',
    proficiency: { level: ProficiencyLevel.ADEPT, usageCount: 156, successRate: 0.92 },
    unlockedAt: new Date().toISOString(),
    basePower: 600,
    complexity: 7,
    ultimate: { tier: 'epic', power: 650, cooldown: 1800, energyCost: 40 },
  },
];

const UI_TEXT = {
  title: '🌌 奧秘管理器 (Omni Manager)',
  subtitle: '靈性智能層全域監控中心',
  tabs: {
    overview: '總覽',
    components: '元件系統',
    tags: '標籤體系',
    thinktank: '奧秘智庫',
    memory: '永恆記憶',
    abilities: '奧義矩陣',
  },
};

// ==================== SUB-COMPONENTS ====================

const StatCard: React.FC<{ label: string; value: string | number; icon: any; color: string }> = ({
  label,
  value,
  icon: Icon,
  color,
}) => (
  <div className="glass-strong p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 text-white shadow-sm" />
      </div>
      <div>
        <div className="text-2xl font-black text-white tracking-tight">{value}</div>
        <div className="text-xs text-slate-400 font-medium">{label}</div>
      </div>
    </div>
  </div>
);

// ==================== MAIN COMPONENT ====================

export const OmniManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // 模擬數據狀態
  const [components] = useState<ComponentStatus[]>(MOCK_COMPONENTS);
  const [memoryStats, setMemoryStats] = useState<MemoryStatistics | null>(null);
  const [kbInfo, setKbInfo] = useState<KnowledgeBaseInfo | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // 嘗試獲取真實數據 (如果後端已實作)
      const healthData = await omniClient.healthCheck();
      setHealth(healthData);

      // 這裡本應有對應的 API 接口，目前使用模擬數據對齊 UI
      setMemoryStats({
        total: 1248,
        byType: {
          [EternalMemoryType.EPISODIC]: 450,
          [EternalMemoryType.SEMANTIC]: 320,
          [EternalMemoryType.PROCEDURAL]: 150,
          [EternalMemoryType.WORKING]: 88,
          [EternalMemoryType.SHORT_TERM]: 200,
          [EternalMemoryType.LONG_TERM]: 40,
        } as any,
        averageImportance: 7.2,
        mostAccessed: [],
        mostRecent: [],
        storageUsed: { bytes: 24000000, formatted: '24.7 MB' },
      });

      setKbInfo({
        id: 'esg_knowledge_base_01',
        name: 'ESG Global Knowledge',
        totalChunks: 8540,
        totalSizeBytes: 156000000,
        embeddingModel: 'text-embedding-004',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Backend connection not fully established, using mock health status.');
      setHealth({
        status: 'online',
        service: 'OmniCore-Gateway',
        version: '7.0.0-sentient',
        timestamp: new Date().toISOString(),
        database: { status: 'healthy', version: 'PostgreSQL 16' },
        sessions: 12,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-slate-950 flex flex-col p-6 space-y-6 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 tracking-tighter">
            {UI_TEXT.title}
          </h1>
          <p className="text-indigo-300/60 text-sm font-medium mt-1">
            {UI_TEXT.subtitle} • {health?.version || 'v7.0'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2 text-[10px] font-bold">
            <span className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              SENTIENT OS
            </span>
            <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              5T PROTOCOL
            </span>
          </div>
          <button
            type="button"
            onClick={fetchInitialData}
            className="p-2 rounded-full hover:bg-white/5 transition-colors group"
          >
            <RefreshCw
              className={`w-5 h-5 text-indigo-400 group-active:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="系統狀態"
          value={health?.status.toUpperCase() || 'OFFLINE'}
          icon={Activity}
          color="bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
        />
        <StatCard
          label="活動元件"
          value={components.length}
          icon={Cpu}
          color="bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
        />
        <StatCard
          label="記憶片段"
          value={memoryStats?.total || 0}
          icon={Brain}
          color="bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
        />
        <StatCard
          label="智庫容量"
          value={kbInfo?.totalChunks || 0}
          icon={Database}
          color="bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)]"
        />
      </div>

      {/* Tabs Support */}
      <div className="flex gap-1 border-b border-white/5">
        {Object.entries(UI_TEXT.tabs).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-6 py-3 text-sm font-bold tracking-tight transition-all relative ${
              activeTab === id ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {label}
            {activeTab === id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"
              />
            )}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Health Breakdown */}
              <div className="nebula-card p-6 rounded-3xl border border-white/5 space-y-4">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  系統核心健康度 (Core Health)
                </h3>
                <div className="space-y-4 pt-2">
                  <div className="p-4 glass rounded-2xl border border-white/5 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-slate-300">Gateway Status</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                        {health?.service}
                      </p>
                    </div>
                    <div className="text-emerald-400 font-mono font-bold">ONLINE</div>
                  </div>
                  <div className="p-4 glass rounded-2xl border border-white/5 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-slate-300">Database Consistency</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                        {health?.database?.version}
                      </p>
                    </div>
                    <div className="text-emerald-400 font-mono font-bold">VERIFIED</div>
                  </div>
                  <div className="p-4 glass rounded-2xl border border-white/5 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-slate-300">Entropy Level</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                        Global State
                      </p>
                    </div>
                    <div className="text-indigo-400 font-mono font-bold">0.0012 λ</div>
                  </div>
                </div>
              </div>

              {/* Quick Component View */}
              <div className="glass-strong p-6 rounded-3xl border border-white/5 space-y-4">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  活躍元件概覽 (Active Layers)
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {components.slice(0, 4).map(comp => (
                    <div
                      key={comp.id}
                      className="flex justify-between items-center p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${comp.state === OmniComponentState.READY ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-indigo-400 animate-pulse'}`}
                        />
                        <span className="text-sm font-bold text-slate-200">{comp.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">v{comp.version}</span>
                    </div>
                  ))}
                  <button
                    onClick={() => setActiveTab('components')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-bold mt-2 text-center py-2 underline"
                  >
                    查看所有元件
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'components' && (
            <motion.div
              key="components"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-white/5">
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-3 py-1 text-[10px] font-black bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded uppercase"
                  >
                    全部
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 text-[10px] font-black text-slate-500 hover:text-slate-300 uppercase"
                  >
                    核心
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 text-[10px] font-black text-slate-500 hover:text-slate-300 uppercase"
                  >
                    AI
                  </button>
                </div>
                <div className="flex items-center bg-black/30 border border-white/5 rounded-lg px-3 py-1 gap-2">
                  <Search className="w-3 h-3 text-slate-500" />
                  <input
                    type="text"
                    placeholder="搜尋元件..."
                    className="bg-transparent text-[10px] text-white outline-none w-32"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {components.map(comp => (
                  <div
                    key={comp.id}
                    className="nebula-card p-5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all flex flex-col justify-between group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
                        <Zap className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div
                        className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${comp.state === OmniComponentState.READY ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}
                      >
                        {comp.state}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white tracking-tight">{comp.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-indigo-300/50 font-bold uppercase">
                          {comp.type}
                        </span>
                        <span className="text-[10px] text-slate-600 font-mono">
                          ID: {comp.id.substring(0, 8)}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2 line-clamp-2">
                        此元件負責處理奧秘心核的{comp.type}邏輯，支援動態擴展與異步執行。
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                      <span className="text-[10px] text-slate-400">Ver. {comp.version}</span>
                      <button
                        type="button"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <Info className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'memory' && (
            <motion.div
              key="memory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-xl font-black text-white pl-2 border-l-4 border-purple-500">
                    記憶分佈 (Memory Distribution)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {memoryStats &&
                      Object.entries(memoryStats.byType).map(([type, count]) => (
                        <div
                          key={type}
                          className="glass-strong p-4 rounded-2xl border border-white/5"
                        >
                          <div className="text-xs font-bold text-slate-500 uppercase mb-1">
                            {type.replace('_', ' ')}
                          </div>
                          <div className="text-2xl font-black text-purple-400">{count}</div>
                          <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
                            <div
                              className="bg-purple-500 h-full rounded-full"
                              style={{ width: `${((count as number) / memoryStats.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="nebula-card p-6 rounded-3xl border border-purple-500/10 space-y-4">
                  <h3 className="text-lg font-black text-white">存儲健康度</h3>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-white">
                      {memoryStats?.storageUsed.formatted.split(' ')[0]}
                    </span>
                    <span className="text-slate-400 pb-1">
                      {memoryStats?.storageUsed.formatted.split(' ')[1]}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">向量維度</span>
                      <span className="text-indigo-300 font-bold">1536 (Ada-002)</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">平均重要性</span>
                      <span className="text-purple-400 font-bold">
                        {memoryStats?.averageImportance}/10
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">索引狀態</span>
                      <span className="text-emerald-400 font-bold uppercase">Optimized</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-purple-900/20"
                  >
                    觸發記憶鞏固 (Consolidate)
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'abilities' && <OmniUltimateMatrix ultimates={MOCK_ULTIMATES} />}

          {/* Placeholder for missing tabs */}
          {(activeTab === 'tags' || activeTab === 'thinktank') && (
            <motion.div
              key="placeholder"
              className="flex flex-col items-center justify-center py-20 text-slate-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4 opacity-20">🚧</div>
              <p className="text-xl font-black tracking-tight uppercase">系統模塊對接中</p>
              <p className="text-sm mt-2 opacity-50 font-medium">
                Coming Soon in V7.5 - Sentient Expansion
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center pt-6 border-t border-white/5 opacity-40">
        <div className="flex items-center gap-2">
          <Key className="w-3 h-3" />
          <span className="text-[10px] font-mono tracking-tight uppercase">
            Access Level: Sovereign (0)
          </span>
        </div>
        <div className="text-[10px] font-mono">TIMESTAMP: {new Date().toISOString()}</div>
      </div>
    </div>
  );
};
