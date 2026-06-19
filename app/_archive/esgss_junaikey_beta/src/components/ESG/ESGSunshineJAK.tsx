/**
 * 🏢 ESG Sunshine JAK - 主應用入口 (v2.0)
 * --------------------------------------------------
 * [功能] 整合所有 ESG 模組，含新的衝擊雷達 (B3)
 * [語言] 全繁體中文
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  FileText,
  Radar,
  Newspaper,
  Bot,
  Menu,
  GraduationCap,
  Grip,
  ShieldCheck,
  Zap,
  Leaf,
  Activity,
  TrendingUp,
  Users,
} from 'lucide-react';
import { SideNavBar } from '@/components/layout/SideNavBar';
import { View, Language } from '@/types';
import { useESGStore } from '@/store/useESGStore';
import { useOmniResonance } from '@store/index';
import SustainabilityReport from './SustainabilityReport';
import { SupplyChainRadar } from './SupplyChainRadar';
import { ImpactRadar } from './ImpactRadar';
import { DailyESGNews } from './DailyESGNews';
import { AIDigitalTwin } from './AIDigitalTwin';
import { HolisticEducationAssessment } from './HolisticEducationAssessment';
import { CarbonAssetTrading } from './CarbonAssetTrading';
import { RegulatoryAlerts } from './RegulatoryAlerts';
import { SustainabilityMatrix } from './SustainabilityMatrix';
import { OmniCRM } from './OmniCRM';

type 模組類型 =
  | '首頁'
  | '診療室'
  | '戰情室'
  | '補給站'
  | '測評'
  | 'AI助理'
  | '碳權交易'
  | '法規監控'
  | '績效矩陣'
  | '奧秘CRM';
type 戰情室子模組 = '供應鏈' | '衝擊雷達' | '商情偵測';

// ============================================================================
// 子組件 (Helpers)
// ============================================================================

const 功能卡片: React.FC<{
  標題: string;
  描述: string;
  圖示: string;
  顏色: string;
  狀態?: string;
  onClick?: () => void;
}> = ({ 標題, 描述, 圖示, 顏色, 狀態, onClick }) => {
  const colorStyles: Record<string, string> = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 group-hover:border-cyan-500/50 group-hover:shadow-cyan-500/10',
    blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/20 group-hover:border-blue-500/50 group-hover:shadow-blue-500/10',
    indigo:
      'from-indigo-500/20 to-indigo-500/5 border-indigo-500/20 group-hover:border-indigo-500/50 group-hover:shadow-indigo-500/10',
    purple:
      'from-purple-500/20 to-purple-500/5 border-purple-500/20 group-hover:border-purple-500/50 group-hover:shadow-purple-500/10',
    amber:
      'from-amber-500/20 to-amber-500/5 border-amber-500/20 group-hover:border-amber-500/50 group-hover:shadow-amber-500/10',
    emerald:
      'from-emerald-500/20 to-emerald-400/5 border-emerald-500/20 group-hover:border-emerald-500/50 group-hover:shadow-emerald-500/10',
    rose: 'from-rose-500/20 to-rose-500/5 border-rose-500/20 group-hover:border-rose-500/50 group-hover:shadow-rose-500/10',
    sky: 'from-sky-500/20 to-sky-500/5 border-sky-500/20 group-hover:border-sky-500/50 group-hover:shadow-sky-500/10',
    orange:
      'from-orange-500/20 to-orange-500/5 border-orange-500/20 group-hover:border-orange-500/50 group-hover:shadow-orange-500/10',
    slate:
      'from-slate-500/20 to-slate-500/5 border-slate-500/20 group-hover:border-slate-500/50 group-hover:shadow-slate-500/10',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative group bg-gradient-to-br ${colorStyles[顏色] || colorStyles.slate} border rounded-[24px] p-5 cursor-pointer backdrop-blur-xl transition-all duration-300 shadow-2xl overflow-hidden`}
    >
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex justify-between items-start mb-6">
        <div className="text-3xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{圖示}</div>
        {狀態 && (
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-bold text-white/50 border border-white/10 tracking-widest uppercase">
            {狀態}
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
        {標題}
      </h3>
      <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{描述}</p>

      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-1 group-hover:translate-x-0">
        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white text-[10px]">
          →
        </div>
      </div>
    </motion.div>
  );
};

import { BentoLayout } from '@/components/layout/BentoLayout';
import { BentoCard } from '@/components/layout/BentoCard';
import { GuidanceOverlay } from '@/components/education/GuidanceOverlay';

const 首頁儀表板: React.FC<{
  切換模組: (m: 模組類型) => void;
  切換戰情室: (v: 戰情室子模組) => void;
}> = ({ 切換模組, 切換戰情室 }) => {
  const { totalCO2e, itEnergyKWh, anchoredCount, recentAnchors } = useESGStore();
  const { resonance, itkTotal } = useOmniResonance();
  const [showGuidance, setShowGuidance] = useState(false);

  return (
    <>
      <BentoLayout>
        {/* Header / Stats Block */}
        <BentoCard colSpan={12} rowSpan={2} title="JAK Tactic Central" subtitle="Global Best Practice" onGuidanceClick={() => setShowGuidance(true)}>
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 h-full">
            <div>
              <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tighter">
                永續戰略指揮中心
              </p>
              <div className="flex gap-4 mt-2">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">Total CO2e</span>
                  <span className="text-xl font-bold text-emerald-400">{totalCO2e.toLocaleString()} <span className="text-xs text-slate-500">t</span></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">Resonance</span>
                  <span className="text-xl font-bold text-yellow-400">{(resonance * 100).toFixed(1)}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">ITK</span>
                  <span className="text-xl font-bold text-purple-400">{itkTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="text-right hidden lg:block">
              <div className="bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-mono text-cyan-400 animate-pulse">
                SYSTEM: ONLINE
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Modules Grid */}
        <BentoCard colSpan={3} rowSpan={2} title="永續診療室" subtitle="Report & Health" icon={<FileText />} onClick={() => 切換模組('診療室')} className="cursor-pointer group hover:bg-white/5">
          <p className="text-xs text-slate-400 mt-2">查看永續報告與健檢結果</p>
          <div className="absolute bottom-4 right-4 text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">→</div>
        </BentoCard>

        <BentoCard colSpan={3} rowSpan={2} title="衝擊雷達" subtitle="Risk Analysis" icon={<Radar />} onClick={() => { 切換模組('戰情室'); 切換戰情室('衝擊雷達'); }} className="cursor-pointer group hover:bg-white/5">
          <p className="text-xs text-slate-400 mt-2">PESTEL 多因素風險分析</p>
          <div className="absolute bottom-4 right-4 text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">→</div>
        </BentoCard>

        <BentoCard colSpan={6} rowSpan={2} title="奧秘 CRM" subtitle="Omni-Channel" icon={<Users />} onClick={() => 切換模組('奧秘CRM')} className="cursor-pointer group hover:bg-white/5 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
          <div className="flex justify-between items-center h-full">
            <p className="text-sm text-slate-300">OmniTable 深度整合客戶管理與陌生開發</p>
            <div className="text-4xl opacity-20">🚀</div>
          </div>
        </BentoCard>

        {/* Second Row */}
        <BentoCard colSpan={3} rowSpan={2} title="資訊補給站" subtitle="Daily News" icon={<Newspaper />} onClick={() => 切換模組('補給站')} className="cursor-pointer group hover:bg-white/5" />
        <BentoCard colSpan={3} rowSpan={2} title="AI 數位分身" subtitle="24/7 Support" icon={<Bot />} onClick={() => 切換模組('AI助理')} className="cursor-pointer group hover:bg-white/5" />
        <BentoCard colSpan={3} rowSpan={2} title="碳權交易" subtitle="Global Carbon" icon={<Zap />} onClick={() => 切換模組('碳權交易')} className="cursor-pointer group hover:bg-white/5" />
        <BentoCard colSpan={3} rowSpan={2} title="法規監控" subtitle="Compliance" icon={<ShieldCheck />} onClick={() => 切換模組('法規監控')} className="cursor-pointer group hover:bg-white/5" />

        {/* Live Stream */}
        <BentoCard colSpan={12} rowSpan={2} title="Live Blockchain Stream" subtitle="Real-time Audit" icon={<Activity />}>
          <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
            {recentAnchors.slice(0, 5).map(anchor => (
              <div key={anchor.id} className="min-w-[200px] bg-black/20 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                <ShieldCheck size={16} className="text-cyan-400" />
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 truncate w-24">{anchor.id}</div>
                  <div className="text-[9px] text-slate-500">{anchor.type}</div>
                </div>
              </div>
            ))}
          </div>
        </BentoCard>

      </BentoLayout>

      <GuidanceOverlay
        isOpen={showGuidance}
        onClose={() => setShowGuidance(false)}
        title="JAK Tactic Central"
        description="這是您的永續戰略指揮中心。透過高密度的儀表板 (Bento Grid)，您可以一目了然地掌握碳排數據、合規風險與戰略資產。"
        learningPoints={[
          "左上角顯示核心 KPI：總碳排與共鳴指數。",
          "點擊任意模組卡片可進入深度操作介面。",
          "底部的 Live Stream 顯示區塊鏈即時存證紀錄。"
        ]}
      />
    </>
  );
};

// ============================================================================
// 主應用組件
// ============================================================================

export const ESGSunshineJAK: React.FC = () => {
  const [當前模組, 設定當前模組] = useState<模組類型>('首頁');
  const [戰情室視角, 設定戰情室視角] = useState<戰情室子模組>('衝擊雷達');
  const [側邊欄展開, 設定側邊欄展開] = useState(true);
  const [language, setLanguage] = useState<Language>('zh-TW');
  const [currentView, setCurrentView] = useState<View>(View.TACTICAL);

  const 導航項目 = [
    { 識別碼: '首頁' as const, 標題: '首頁', 圖示: Home },
    { 識別碼: '診療室' as const, 標題: '永續診療室', 圖示: FileText },
    { 識別碼: '戰情室' as const, 標題: '永續戰情室', 圖示: Radar },
    { 識別碼: '補給站' as const, 標題: '資訊補給站', 圖示: Newspaper },
    { 識別碼: '測評' as const, 標題: '全人教育測評', 圖示: GraduationCap },
    { 識別碼: 'AI助理' as const, 標題: 'AI 數位分身', 圖示: Bot },
    { 識別碼: '奧秘CRM' as const, 標題: '奧秘 CRM', 圖示: Users },
  ];

  const 渲染內容 = () => {
    switch (當前模組) {
      case '診療室':
        return <SustainabilityReport />;
      case '戰情室':
        return (
          <div className="h-full flex flex-col">
            <div className="bg-slate-900 text-white p-4 border-b border-slate-700 flex items-center gap-4">
              <h2 className="font-bold text-xl tracking-wider text-cyan-400 flex items-center gap-2">
                <Radar size={24} /> WAR ROOM
              </h2>
              <div className="h-8 w-[1px] bg-slate-700" />
              <div className="flex gap-2">
                {[
                  { id: '衝擊雷達', label: 'B3 衝擊雷達 (Impact Radar)' },
                  { id: '供應鏈', label: 'B2 供應鏈雷達' },
                  { id: '商情偵測', label: 'B1 商情偵測' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => 設定戰情室視角(item.id as 戰情室子模組)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${戰情室視角 === item.id
                      ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(8,145,178,0.5)]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-slate-900">
              {戰情室視角 === '衝擊雷達' && <ImpactRadar />}
              {戰情室視角 === '供應鏈' && <SupplyChainRadar />}
              {戰情室視角 === '商情偵測' && (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <div className="text-center">
                    <Grip size={48} className="mx-auto mb-4 opacity-50" />
                    <p>商情偵測模組 (Coming Soon)</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case '補給站':
        return <DailyESGNews />;
      case '測評':
        return <HolisticEducationAssessment />;
      case 'AI助理':
        return <AIDigitalTwin />;
      case '碳權交易':
        return <CarbonAssetTrading />;
      case '法規監控':
        return <RegulatoryAlerts />;
      case '績效矩陣':
        return <SustainabilityMatrix />;
      case '奧秘CRM':
        return <OmniCRM />;
      default:
        return <首頁儀表板 切換模組={設定當前模組} 切換戰情室={設定戰情室視角} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] font-sans selection:bg-cyan-500/30 overflow-hidden">
      <SideNavBar
        currentView={currentView}
        onNavigate={v => setCurrentView(v as View)}
        language={language}
        onToggleLanguage={() => setLanguage(l => (l === 'zh-TW' ? 'en-US' : 'zh-TW'))}
      />

      <div className="flex-1 overflow-hidden relative bg-[#020617]">
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />
        </div>
        {渲染內容()}
      </div>
    </div>
  );
};
