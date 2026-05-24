'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle, Leaf, Shield, Activity,
  FileText, Database, BarChart3, AlertTriangle,
  Zap, Target, Code, Sparkles, ArrowUpRight, Bot, Users, Brain, Info, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrandButton, BrandBadge, BrandCard, BrandCardHeader, BrandProgress, BrandTimeline, BrandStatusDot, BrandKpiCard
} from '../../components/brand';
import { EnvironmentalTrajectory } from '../../components/brand/EnvironmentalTrajectory';
import { useDashboardStats } from '../../hooks/useDashboard';
import { useSystemEvolution } from '../../hooks/useSystemEvolution';

export interface DashboardStatsData {
  complianceRate: number;
  carbonEmissions: number;
  griCoverage: number;
  auditCount: number;
}

const getKpis = (stats: any, loading: boolean) => [
  { key: 'compliance', icon: <CheckCircle size={18}/>, label: '合規完成率', value: stats?.complianceRate.toString() || (loading ? '…' : '92'), unit: '%', trend: '+5.2%', trendUp: true, color: '#10B981' },
  { key: 'carbon',     icon: <Leaf size={18}/>,        label: '碳排放量',   value: stats?.carbonEmissions.toLocaleString() || (loading ? '…' : '3,420'), unit: 'tCO₂e', trend: '-12%', trendUp: true, color: '#003262' },
  { key: 'gri',        icon: <Shield size={18}/>,      label: 'GRI 覆蓋率', value: stats?.griCoverage.toString() || (loading ? '…' : '88'), unit: '%', trend: '+8%', trendUp: true, color: '#3B7EA1' },
  { key: 'audit',      icon: <Activity size={18}/>,    label: '審計紀錄',   value: stats?.auditCount.toLocaleString() || (loading ? '…' : '1,284'), unit: '筆', trend: 'T5', trendUp: true, color: '#8B5CF6' },
];

const MODULES = [
  { href: '/environmental', label: '環境指揮', sub: 'GRI 302–306', pct: 82, color: '#10B981' },
  { href: '/social',        label: '社會影響', sub: 'GRI 401–414', pct: 74, color: '#3B82F6' },
  { href: '/governance',    label: '公司治理', sub: 'GRI 2, 205',  pct: 79, color: '#8B5CF6' },
  { href: '/materiality',   label: '重大性矩陣',sub: 'GRI 3-1~3-3', pct: 60, color: '#FDB515' },
  { href: '/vault',         label: '證據金庫', sub: '5T ZKP',      pct: 88, color: '#003262' },
];

const QUICK_ACTIONS = [
  { href: '/editor',       icon: <FileText size={18}/>,  label: '撰寫報告', color: '#003262' },
  { href: '/vault',        icon: <Database size={18}/>,  label: '上傳佐證', color: '#003262' },
  { href: '/swarm',        icon: <Users size={18}/>,     label: '代理蜂群', color: '#003262' },
  { href: '/intelligence', icon: <BarChart3 size={18}/>, label: '情報中心', color: '#003262' },
  { href: '/omni-skills',  icon: <Globe size={18}/>,     label: 'Omni 技能', color: '#003262' },
  { href: '/roadmap',      icon: <Target size={18}/>,    label: '淨零規劃', color: '#003262' },
  { href: '/terminal',     icon: <Code size={18}/>,      label: '終端主控', color: '#003262' },
];

export default function DashboardContent() {
  const [now, setNow] = useState(new Date());
  const { stats, loading: statsLoading } = useDashboardStats();
  const { growth, loading: growthLoading } = useSystemEvolution();

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const KPIS = getKpis(stats, statsLoading);

  return (
    <div className="page-container space-y-8 lg:space-y-12 pb-24 fade-in">
      
      {/* Compact Page Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-10">
        <div className="space-y-4 lg:space-y-6">
          <div className="flex flex-wrap items-center gap-3">
             <BrandBadge variant="gold" size="sm" className="font-black tracking-[0.15em] px-3 py-1 rounded-full shadow-lg shadow-[#FDB515]/5">OMNI_CORE v8.5</BrandBadge>
             <div className="flex items-center gap-2 bg-emerald-50/50 backdrop-blur-sm px-3 py-1 rounded-full border border-emerald-100/50">
                <BrandStatusDot status="active" pulse size="sm" />
                <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Node Active</span>
             </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl lg:text-5xl font-black text-[#003262] tracking-tight leading-none uppercase">
              永續治理主控台
            </h1>
            <p className="text-slate-400 text-base lg:text-lg max-w-2xl font-medium leading-relaxed">
              基於 Berkeley <span className="text-[#FDB515] font-black">5T 誠信協議</span> 的企業級 ESG 引擎
            </p>
          </div>
        </div>
        <div className="flex items-stretch gap-3 min-w-[320px]">
          <div className="flex-1 px-5 py-3 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm flex flex-col justify-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Real-time Sync</p>
            <p className="text-base font-black text-[#003262] font-mono leading-none">
              {now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <Link href="/hermes-orchestrator" className="group">
            <BrandButton variant="primary" className="h-full px-8 rounded-2xl shadow-xl shadow-[#003262]/10 transition-all flex items-center gap-2">
              <Sparkles size={16} className="text-[#FDB515]" /> 
              <span className="font-black tracking-tight text-sm">啟動 AI</span>
            </BrandButton>
          </Link>
        </div>
      </header>

      {/* Infinite Evolution Insight */}
      <AnimatePresence>
        {growth && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <BrandCard padding="none" className="bg-gradient-to-r from-[#003262] to-[#1a4a7a] border-none overflow-hidden shadow-extreme p-6 lg:p-8 group">
               <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-[#FDB515] flex-shrink-0 animate-pulse">
                     <Brain size={28} />
                  </div>
                  <div className="flex-1 text-center md:text-left space-y-1">
                     <div className="flex items-center justify-center md:justify-start gap-3">
                        <h4 className="text-sm font-black text-blue-200 uppercase tracking-[0.3em]">System Self-Evolution Insight</h4>
                        <BrandBadge variant="gold" size="xs" dot>EVOLUTION_ACTIVE</BrandBadge>
                     </div>
                     <p className="text-white text-base font-bold italic leading-relaxed">
                        "{growth.analysis.growthSuggestion}"
                     </p>
                  </div>
                  <div className="text-center md:text-right border-l border-white/10 pl-6 hidden md:block">
                     <p className="text-[9px] font-black text-blue-300/50 uppercase tracking-widest mb-1">Impact Score</p>
                     <p className="text-2xl font-black text-[#FDB515] font-mono">{growth.analysis.impactScore}%</p>
                  </div>
               </div>
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
            </BrandCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Compact Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
        {KPIS.map((k) => (
          <BrandKpiCard
            key={k.key}
            label={k.label}
            value={k.value}
            unit={k.unit}
            trend={k.trend}
            trendUp={k.trendUp}
            icon={k.icon}
            color={k.color}
            verified={true}
            className="p-5 lg:p-7 rounded-[1.5rem] lg:rounded-[2rem]"
          />
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6 lg:gap-10">
        <div className="col-span-12 lg:col-span-8">
          <BrandCard padding="none" className="glass-panel border-none h-full overflow-hidden group">
            <div className="p-6 lg:p-10 border-b border-slate-50 flex items-center justify-between">
              <BrandCardHeader title="全方位永續軌跡分析" subtitle="SBTi 1.5°C 目標情境" />
              <BrandBadge variant="outline" size="xs" className="opacity-40">REAL_TIME</BrandBadge>
            </div>
            <div className="p-6 lg:p-10">
              <div className="h-[240px] lg:h-[360px] relative"><EnvironmentalTrajectory title="" /></div>
              <div className="mt-8 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-start gap-4 transition-all hover:bg-blue-50/30 group">
                <div className="w-10 h-10 rounded-xl bg-[#003262] flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-[#003262]/20"><Info size={20} /></div>
                <div className="space-y-1">
                  <p className="text-xs text-[#003262] font-black leading-tight uppercase tracking-widest">AI 洞察</p>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">排放軌跡優於預期 <span className="text-emerald-600 font-black">18%</span>，範疇二綠電採購發揮關鍵作用。</p>
                </div>
              </div>
            </div>
          </BrandCard>
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-6 lg:space-y-8">
          <BrandCard padding="lg" className="glass-panel border-none h-full">
            <BrandCardHeader title="模組就緒度" subtitle="GRI 核心進度" />
            <div className="space-y-6 mt-6 lg:mt-8">
              {MODULES.map(m => (
                <Link key={m.href} href={m.href} className="block group">
                  <div className="flex justify-between items-end mb-2">
                    <div className="space-y-0.5">
                      <span className="text-xs font-black text-[#003262] group-hover:text-blue-600 transition-colors uppercase tracking-tight">{m.label}</span>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em]">{m.sub}</p>
                    </div>
                    <span className="text-sm font-black font-mono" style={{ color: m.color }}>{m.pct}%</span>
                  </div>
                  <BrandProgress value={m.pct} color="auto" size="sm" animated />
                </Link>
              ))}
            </div>
          </BrandCard>
        </div>
      </div>

      <section className="space-y-6 lg:space-y-8">
         <div className="flex items-center gap-4 px-2">
            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Quick Access</h3>
            <div className="flex-1 h-px bg-slate-100" />
         </div>
         <div className="grid grid-compact">
           {QUICK_ACTIONS.map(a => (
             <Link key={a.href} href={a.href} className="group">
               <BrandCard padding="md" hover className="text-center group-hover:border-blue-100 border-white bg-white/60 backdrop-blur-sm shadow-sm rounded-[1.5rem] transition-all duration-500 group-hover:-translate-y-1">
                 <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3 transition-all duration-500 group-hover:scale-110 shadow-sm" style={{ backgroundColor: `${a.color}08`, color: a.color }}>{a.icon}</div>
                 <p className="text-xs font-black text-[#003262] tracking-tight">{a.label}</p>
               </BrandCard>
             </Link>
           ))}
         </div>
      </section>

      <section className="relative group overflow-hidden rounded-[2rem] lg:rounded-[2.5rem]">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 opacity-50 animate-gradient-x" />
        <BrandCard padding="none" className="bg-[#003262] border-none shadow-3xl relative overflow-hidden p-8 lg:p-12">
           <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-[3000ms]"><Bot size={240} color="#fff" strokeWidth={0.5} /></div>
           <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white flex-shrink-0 backdrop-blur-md"><Bot size={32} className="text-blue-300" /></div>
              <div className="flex-1 space-y-2">
                 <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-black text-white tracking-tight">OmniHermes 智慧洞察</h3>
                    <BrandBadge variant="info" size="xs" className="bg-blue-400/20 text-blue-200 font-mono tracking-widest px-2">LIVE</BrandBadge>
                 </div>
                 <p className="text-blue-100/60 text-sm leading-relaxed max-w-3xl font-medium">歐盟委員會更新了 <strong className="text-white font-black uppercase">GRI 305</strong> 指引。建議微調範疇三盤查邏輯以確保合規性。</p>
              </div>
              <BrandButton variant="secondary" className="w-full lg:w-auto h-14 px-10 rounded-2xl font-black text-base shadow-2xl" onClick={() => window.location.href='/intelligence'}>查看深度分析</BrandButton>
           </div>
        </BrandCard>
      </section>
    </div>
  );
}
