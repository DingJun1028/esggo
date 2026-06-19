/**
 * 🧭 北極星儀表板 / North Star Dashboard
 * --------------------------------------------------
 * [系列] MVP 核心服務 (MVP Core Services)
 * [TC] 以「服務即教學」為核心，展示 24 項 MECE 服務矩陣。
 * [EN] MVP Core service showcasing the 24 MECE service matrix.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Compass, Zap, Shield, Target, Activity, Star, Eye, Share2, RefreshCw, AlertCircle, Lock } from 'lucide-react';
import { OmniEsgCell } from '../../omni/interaction/visuals/OmniEsgCell/OmniEsgCell';
import { BentoCard } from '../ui/BentoCard';

// ============================================================================
// 類型定義
// ============================================================================

interface ServiceData {
  id: string;
  name: string;
  category: 'environmental' | 'social' | 'governance';
  icon: React.ReactNode;
  status: 'ready' | 'in-progress' | 'locked';
  lastAccessed?: string;
}

interface DashboardState {
  resonance: number;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// ============================================================================
// 模擬數據
// ============================================================================

const MECE_SERVICES_INITIAL: ServiceData[] = [
  // 環境永續 (E1-E8)
  { id: 'E1', name: '個人生態羅盤', category: 'environmental', icon: <Compass size={14} />, status: 'ready' },
  { id: 'E2', name: '碳足跡計算器', category: 'environmental', icon: <Activity size={14} />, status: 'ready' },
  { id: 'E3', name: '影響修復實驗室', category: 'environmental', icon: <Zap size={14} />, status: 'ready' },
  { id: 'E4', name: '綠色金融中心', category: 'environmental', icon: <Star size={14} />, status: 'locked' },
  { id: 'E5', name: '市場情報中心', category: 'environmental', icon: <Eye size={14} />, status: 'in-progress' },
  { id: 'E6', name: '行星網格系統', category: 'environmental', icon: <Activity size={14} />, status: 'locked' },
  { id: 'E7', name: '環境預測引擎', category: 'environmental', icon: <Zap size={14} />, status: 'locked' },
  { id: 'E8', name: '自然解決方案', category: 'environmental', icon: <Shield size={14} />, status: 'ready' },

  // 社會責任 (S1-S8)
  { id: 'S1', name: '多元包容追蹤器', category: 'social', icon: <Share2 size={14} />, status: 'ready' },
  { id: 'S2', name: '勞工權益監控', category: 'social', icon: <Shield size={14} />, status: 'ready' },
  { id: 'S3', name: '社區影響中心', category: 'social', icon: <Activity size={14} />, status: 'ready' },
  { id: 'S4', name: '社會創新實驗室', category: 'social', icon: <Zap size={14} />, status: 'in-progress' },
  { id: 'S5', name: '人力資本分析', category: 'social', icon: <Activity size={14} />, status: 'locked' },
  { id: 'S6', name: '利害關係人參與', category: 'social', icon: <Share2 size={14} />, status: 'ready' },
  { id: 'S7', name: '供應鏈道德追蹤', category: 'social', icon: <Shield size={14} />, status: 'locked' },
  { id: 'S8', name: '幸福指數儀表板', category: 'social', icon: <Star size={14} />, status: 'ready' },

  // 公司治理 (G1-G8)
  { id: 'G1', name: '審議副駕駛', category: 'governance', icon: <Compass size={14} />, status: 'ready' },
  { id: 'G2', name: '證據保險庫', category: 'governance', icon: <Shield size={14} />, status: 'ready' },
  { id: 'G3', name: '誠信護照', category: 'governance', icon: <Star size={14} />, status: 'ready' },
  { id: 'G4', name: '合規雷達', category: 'governance', icon: <Eye size={14} />, status: 'in-progress' },
  { id: 'G5', name: '風險情報系統', category: 'governance', icon: <Activity size={14} />, status: 'locked' },
  { id: 'G6', name: '透明度引擎', category: 'governance', icon: <Eye size={14} />, status: 'ready' },
  { id: 'G7', name: '自動化報告生成', category: 'governance', icon: <Activity size={14} />, status: 'ready' },
  { id: 'G8', name: '利害關係人投票', category: 'governance', icon: <Share2 size={14} />, status: 'locked' },
];

// ============================================================================
// 輔助函數
// ============================================================================

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'environmental': return 'border-[#0ab8b2]/20 bg-[#0ab8b2]/5 hover:bg-[#0ab8b2]/10 hover:border-[#0ab8b2]/40';
    case 'social': return 'border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/40';
    case 'governance': return 'border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-500/40';
    default: return 'border-white/10';
  }
};

const getCategoryBadgeColor = (category: string) => {
  switch (category) {
    case 'environmental': return 'bg-[#0ab8b0]';
    case 'social': return 'bg-blue-500';
    case 'governance': return 'bg-purple-500';
    default: return 'bg-slate-500';
  }
};

// ============================================================================
// Loading 組件
// ============================================================================

const DashboardLoader: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-96 gap-4">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-[#63a6b0]/30 rounded-full" />
      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#63a6b0] rounded-full animate-spin border-t-transparent" />
    </div>
    <p className="text-slate-400 text-sm animate-pulse">正在載入儀表板...</p>
  </div>
);

// ============================================================================
// Error 組件
// ============================================================================

const DashboardError: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center h-96 gap-4">
    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
      <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
      <p className="text-red-400 text-sm text-center">{message}</p>
    </div>
    <button
      onClick={onRetry}
      className="flex items-center gap-2 px-4 py-2 bg-[#63a6b0]/20 border border-[#63a6b0]/50 rounded-lg text-[#63a6b0] hover:bg-[#63a6b0]/30 transition-colors"
    >
      <RefreshCw className="w-4 h-4" />
      重試
    </button>
  </div>
);

// ============================================================================
// 主組件
// ============================================================================

export const NorthStarDashboard: React.FC = () => {
  const [services, setServices] = useState<ServiceData[]>(MECE_SERVICES_INITIAL);
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    resonance: 91.8,
    isLoading: true,
    error: null,
    lastUpdated: new Date().toISOString(),
  });

  // 模擬載入數據
  useEffect(() => {
    const loadData = async () => {
      try {
        // 模擬 API 延遲
        await new Promise(resolve => setTimeout(resolve, 1500));
        setDashboardState(prev => ({ ...prev, isLoading: false }));
      } catch (err) {
        setDashboardState(prev => ({
          ...prev,
          isLoading: false,
          error: '無法載入儀表板數據',
        }));
      }
    };
    loadData();
  }, []);

  // 處理服務點擊
  const handleServiceClick = useCallback((service: ServiceData) => {
    if (service.status === 'locked') {
      // 顯示鎖定提示
      console.log(`服務 ${service.id} 尚未解鎖`);
      return;
    }
    // 導航到對應服務
    console.log(`導航到服務: ${service.name}`);
  }, []);

  // 手動刷新
  const handleRefresh = useCallback(async () => {
    setDashboardState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDashboardState(prev => ({
        ...prev,
        isLoading: false,
        lastUpdated: new Date().toISOString(),
      }));
    } catch (err) {
      setDashboardState(prev => ({
        ...prev,
        isLoading: false,
        error: '刷新失敗',
      }));
    }
  }, []);

  // 渲染 loading 狀態
  if (dashboardState.isLoading) {
    return <DashboardLoader />;
  }

  // 渲染錯誤狀態
  if (dashboardState.error) {
    return <DashboardError message={dashboardState.error} onRetry={handleRefresh} />;
  }

  return (
    <div className="flex flex-col gap-6 w-full h-full pb-10">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">
          最後更新: {dashboardState.lastUpdated ? new Date(dashboardState.lastUpdated).toLocaleString() : '-'}
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          刷新
        </button>
      </div>

      {/* Top Section: Impact DNA & North Star Metric */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 shrink-0">
        {/* North Star Central Metric */}
        <div className="md:col-span-4 bg-[#0a1a1a] rounded-3xl border border-[#63a6b0]/30 p-8 flex flex-col items-center justify-center relative overflow-hidden group shadow-[0_0_30px_rgba(99,166,176,0.1)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#63a6b0]/5 to-transparent pointer-events-none" />
          <Compass className="text-[#63a6b0]/40 absolute -top-10 -left-10 w-40 h-40 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />

          <div className="relative z-10 text-center space-y-2">
            <div className="text-[10px] font-black text-[#63a6b0] uppercase tracking-widest">系統共鳴率 (RESONANCE)</div>
            <div className="text-7xl font-black text-white tracking-tighter shadow-sm">
              {dashboardState.resonance.toFixed(1)}
              <span className="text-[#63a6b0]">%</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">北極星一致性百分比</p>
          </div>

          <div className="mt-8 flex gap-2 relative z-10">
            <div className="px-3 py-1 bg-[#63a6b0]/20 rounded-full text-[9px] font-bold text-[#63a6b0] border border-[#63a6b0]/30 uppercase">Active Persona: Sovereign</div>
            <div className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-bold text-slate-400 border border-white/5 uppercase">Tier: Pro</div>
          </div>
        </div>

        {/* Impact DNA / Persona Matrix */}
        <div className="md:col-span-8 bg-[#0a0f0f]/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="text-[#ffd700]" size={18} />
                影響力 DNA (Impact DNA)
              </h3>
              <p className="text-xs text-slate-500">基於 5T 協議的個人角色屬性演算</p>
            </div>
            <div className="flex gap-4">
              <div className="text-right">
                <div className="text-[10px] text-slate-500 uppercase">智慧 (Intel)</div>
                <div className="text-lg font-bold text-white">8.5 / 10</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-500 uppercase">同理 (Empathy)</div>
                <div className="text-lg font-bold text-white">7.2 / 10</div>
              </div>
            </div>
          </div>

          {/* Simple visualization of attributes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['智 (Wisdom)', '仁 (Humanity)', '勇 (Courage)', '誠 (Integrity)'].map((attr, i) => (
              <div key={attr} className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-3">
                <div className="text-[10px] font-mono text-slate-400 uppercase">{attr}</div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${60 + i * 10}%` }}
                    className="h-full bg-gradient-to-r from-[#63a6b0] to-[#ffd700]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MECE 24-Service Matrix Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-[#63a6b0] to-transparent rounded-full" />
            <h3 className="text-lg font-bold text-white tracking-tight">MECE 服務矩陣 (Service Matrix)</h3>
          </div>
          <div className="flex gap-4 text-[10px] font-mono">
            <div className="flex items-center gap-2 text-slate-500">
              <div className="w-2 h-2 rounded-full bg-[#0ab8b2]" /> 環境 (E)
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <div className="w-2 h-2 rounded-full bg-blue-500" /> 社會 (S)
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <div className="w-2 h-2 rounded-full bg-purple-500" /> 治理 (G)
            </div>
          </div>
        </div>

        {/* 24-Cell Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-8 gap-3">
          {services.map((service) => (
            <div
              key={service.id}
              className={`group cursor-pointer ${service.status === 'locked' ? 'opacity-50' : ''}`}
              onClick={() => handleServiceClick(service)}
            >
              <div className={`p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden h-28 flex flex-col justify-between
                                ${getCategoryColor(service.category)}`}>

                {/* Lock overlay */}
                {service.status === 'locked' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                    <Lock className="w-6 h-6 text-slate-500" />
                  </div>
                )}

                <div className="absolute -top-4 -right-4 opacity-5 text-white group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>

                <div className="flex justify-between items-start relative z-0">
                  <span className="text-[10px] font-black font-mono opacity-40">{service.id}</span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Tangible" />
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Traceable" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-800" title="Trackable" />
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-white/90 group-hover:text-white transition-colors">{service.name}</div>
                  <div className="text-[9px] text-slate-500 font-medium uppercase mt-1">
                    {service.status === 'ready' && 'Ready'}
                    {service.status === 'in-progress' && 'In Progress'}
                    {service.status === 'locked' && 'Locked'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NorthStarDashboard;
