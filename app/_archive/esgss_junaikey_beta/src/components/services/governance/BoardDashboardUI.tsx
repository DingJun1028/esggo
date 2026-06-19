import React, { useState } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
  Users,
  Zap,
  Shield,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { governanceManager, BoardKPI } from '../../../services/GovernanceManager';

export const BoardDashboardUI: React.FC<{ language: any; theme: string }> = ({
  language,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [kpis] = useState<BoardKPI[]>(() => governanceManager.getBoardKPIs());

  return (
    <div
      className={`flex flex-col h-full overflow-hidden ${isDark ? 'text-white' : 'text-slate-900'}`}
    >
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'} border border-indigo-500/30`}
          >
            <Crown size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Board Executive Suite</h2>
            <div className="text-[10px] font-mono opacity-50 uppercase tracking-widest">
              High-Level ESG Governance & Strategic KPIs
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <BoardStat icon={<Users size={14} />} label="STAKEHOLDERS" value="1.2M" isDark={isDark} />
          <BoardStat icon={<Zap size={14} />} label="ENERGY ALPHA" value="93%" isDark={isDark} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {kpis.map((kpi, i) => (
          <KPICard key={i} kpi={kpi} isDark={isDark} />
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden">
        {/* Growth Perspective */}
        <section
          className={`rounded-3xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'} p-6 flex flex-col`}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest opacity-60">
              Strategic Growth Map
            </h3>
            <div className="px-3 py-1 bg-indigo-500/10 rounded-full text-[10px] text-indigo-400 font-bold uppercase">
              M18 Projection
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <ProgressRow
              label="Operational Decarbonization"
              progress={82}
              color="bg-emerald-500"
              isDark={isDark}
            />
            <ProgressRow
              label="Social Equity Scaling"
              progress={55}
              color="bg-pink-500"
              isDark={isDark}
            />
            <ProgressRow
              label="Governance Transparency"
              progress={100}
              color="bg-indigo-500"
              isDark={isDark}
            />
          </div>

          <div
            className={`mt-8 p-4 rounded-2xl border ${isDark ? 'bg-slate-950/50 border-white/5' : 'bg-slate-50 border-slate-200'}`}
          >
            <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">
              <Shield size={12} /> Board Advisory
            </div>
            <p className="text-xs opacity-50 leading-relaxed italic">
              &quot;Accelerating Social Equity Scaling to align with Phase 12 goals will improve
              global ESG score by 4 points.&quot;
            </p>
          </div>
        </section>

        {/* Global Performance Radar Placeholder (Stylized) */}
        <section
          className={`rounded-3xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'} p-6 flex flex-col items-center justify-center relative overflow-hidden`}
        >
          <div className="absolute top-6 left-6 text-sm font-black uppercase tracking-widest opacity-60">
            Global Integrity Radar
          </div>
          <div className="relative w-48 h-48">
            {/* Fake Radar Rings */}
            <div className="absolute inset-0 border-2 border-indigo-500/10 rounded-full animate-ping shadow-[0_0_20px_rgba(99,102,241,0.3)]" />
            <div className="absolute inset-4 border border-indigo-500/20 rounded-full" />
            <div className="absolute inset-8 border border-indigo-500/30 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield size={48} className="text-indigo-400 blur-[1px]" />
            </div>
          </div>
          <div className="mt-8 text-center">
            <div className="text-3xl font-black mb-1 tracking-tighter">98.2</div>
            <div className="text-[10px] font-mono opacity-40 uppercase tracking-[0.2em]">
              INTEGRITY QUOTIENT
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const KPICard = ({ kpi, isDark }: { kpi: BoardKPI; isDark: boolean }) => (
  <div
    className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'} shadow-xl relative overflow-hidden group`}
  >
    <div
      className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-full -mr-8 -mt-8`}
    />
    <div className="mb-4 flex justify-between items-start">
      <span
        className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
          kpi.importance === 'CRITICAL'
            ? 'bg-red-500/20 text-red-400'
            : 'bg-indigo-500/20 text-indigo-400'
        }`}
      >
        {kpi.importance}
      </span>
      {kpi.trend === 'up' ? (
        <TrendingUp size={16} className="text-emerald-400" />
      ) : kpi.trend === 'down' ? (
        <TrendingDown size={16} className="text-red-400" />
      ) : (
        <Minus size={16} className="opacity-30" />
      )}
    </div>
    <div className="text-2xl font-black mb-1">{kpi.value}</div>
    <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{kpi.label}</div>
  </div>
);

const BoardStat = ({ icon, label, value, isDark }: any) => (
  <div className="text-right">
    <div className="flex items-center gap-1 justify-end text-[8px] font-black opacity-30 uppercase tracking-[0.2em] mb-0.5">
      {icon} {label}
    </div>
    <div className="text-sm font-black">{value}</div>
  </div>
);

const ProgressRow = ({ label, progress, color, isDark }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
      <span className="opacity-50">{label}</span>
      <span>{progress}%</span>
    </div>
    <div
      className={`h-1.5 w-full ${isDark ? 'bg-slate-800' : 'bg-slate-100'} rounded-full overflow-hidden`}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        className={`h-full ${color} shadow-[0_0_10px_rgba(0,0,0,0.2)]`}
      />
    </div>
  </div>
);

export default BoardDashboardUI;
