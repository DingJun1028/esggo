'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle, Leaf, Shield, Activity, TrendingUp, TrendingDown,
  FileText, Database, ClipboardList, BarChart3, AlertTriangle,
  ChevronRight, Zap, Target, BookOpen, HeartPulse, Info, X, Users, Bot, Layers, Code, Sparkles, ArrowUpRight
} from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandCard, BrandCardHeader, BrandProgress, BrandKpiCard, BrandTimeline, BrandT5Strip, BrandStatusDot
} from '../components/brand';
import { EnvironmentalTrajectory } from '../components/brand/EnvironmentalTrajectory';

export interface DashboardStatsData {
  complianceRate: number;
  carbonEmissions: number;
  griCoverage: number;
  auditCount: number;
}

const getKpis = (stats: DashboardStatsData | null, loading: boolean) => [
  {
    key: 'compliance',
    icon: <CheckCircle size={20}/>,
    label: '合規完成率',
    value: stats?.complianceRate.toString() || (loading ? '...' : '92'),
    unit: '%',
    trend: '+5.2%',
    trendUp: true,
    color: '#10B981',
    formula: 'Metrics_Done / Total_Required_Metrics',
    sources: ['GRI 2021 指標庫', 'ESG 模組填報狀態'],
    verified: true,
  },
  {
    key: 'carbon',
    icon: <Leaf size={20}/>,
    label: '碳排放量',
    value: stats?.carbonEmissions.toLocaleString() || (loading ? '...' : '3,420'),
    unit: 'tCO₂e',
    trend: '-12%',
    trendUp: true,
    color: '#003262',
    formula: 'Activity_Data * Emission_Factor',
    sources: ['ISO 14064-1 盤查清冊', 'GRI 305-1/2/3'],
    verified: true,
  },
  {
    key: 'gri',
    icon: <Shield size={20}/>,
    label: 'GRI 覆蓋率',
    value: stats?.griCoverage.toString() || (loading ? '...' : '88'),
    unit: '%',
    trend: '+8%',
    trendUp: true,
    color: '#3B7EA1',
    formula: 'Evidence_Uploaded / GRI_Indicators',
    sources: ['Evidence Vault 佐證庫'],
    verified: true,
  },
  {
    key: 'audit',
    icon: <Activity size={20}/>,
    label: '審計記錄',
    value: stats?.auditCount.toLocaleString() || (loading ? '...' : '1,284'),
    unit: '筆',
    trend: 'T5 Tracked',
    trendUp: true,
    color: '#8B5CF6',
    formula: '∑(System_Events + Agent_Actions)',
    sources: ['audit_logs 資料表'],
    verified: true,
  },
];

const MODULES = [
  { href: '/environmental', label: '環境指揮', sub: 'GRI 302–306', pct: 82, color: '#10B981' },
  { href: '/social',        label: '社會影響', sub: 'GRI 401–414', pct: 74, color: '#3B82F6' },
  { href: '/governance',    label: '公司治理', sub: 'GRI 2, 205',  pct: 79, color: '#8B5CF6' },
  { href: '/materiality',   label: '重大性矩陣',sub: 'GRI 3-1~3-3', pct: 60, color: '#FDB515' },
  { href: '/vault',         label: '證據金庫',  sub: '5T ZKP',     pct: 88, color: '#003262' },
];

const ACTIVITY = [
  { id: '1', icon: <CheckCircle size={14}/>, color: '#10B981', title: '範疇二電力數據已 ZKP 封印', time: '3分鐘前', badge: <BrandBadge variant="success" size="xs">T4 Seal</BrandBadge> },
  { id: '2', icon: <Database size={14}/>,    color: '#3B82F6',  title: '台電帳單上傳至證據金庫', time: '18分鐘前', badge: <BrandBadge variant="info" size="xs">T1 Proof</BrandBadge> },
  { id: '3', icon: <Activity size={14}/>,    color: '#8B5CF6', title: 'GRI 305-1 審計日誌新增', time: '42分鐘前', badge: <BrandBadge variant="purple" size="xs">T5 Track</BrandBadge> },
  { id: '4', icon: <AlertTriangle size={14}/>,color: '#F59E0B', title: '供應商 ESG 評核逾期提醒', time: '1小時前', badge: <BrandBadge variant="warning" size="xs">T2 Alert</BrandBadge> },
];

const QUICK_ACTIONS = [
  { href: '/editor',       icon: <FileText size={20}/>,    label: '撰寫報告', color: '#003262' },
  { href: '/vault',        icon: <Database size={20}/>,    label: '上傳佐證', color: '#003262' },
  { href: '/swarm',        icon: <Users size={20}/>,       label: '代理蜂群', color: '#003262' },
  { href: '/intelligence', icon: <BarChart3 size={20}/>,   label: '情報中心', color: '#003262' },
  { href: '/roadmap',      icon: <Target size={20}/>,      label: '淨零規劃', color: '#003262' },
  { href: '/terminal',     icon: <Code size={20}/>,        label: '終端主控', color: '#003262' },
];

export default function DashboardContent() {
  const [now, setNow] = useState(new Date());
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
    const t = setInterval(() => {
      setNow(new Date());
      fetchStats();
    }, 60000);
    return () => clearInterval(t);
  }, []);

  const KPIS = getKpis(stats, loading);

  return (
    <div className="fade-in max-w-[1500px] mx-auto p-8 lg:p-12 space-y-12 pb-24">
      
      {/* ── Page Header ── */}
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
             <BrandBadge variant="gold" size="sm" className="font-black tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg shadow-[#FDB515]/10">OMNI_CORE v8.5</BrandBadge>
             <div className="flex items-center gap-2.5 bg-emerald-50/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-emerald-100/50 shadow-sm transition-all hover:bg-emerald-50">
                <BrandStatusDot status="active" pulse size="sm" />
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Sovereign Node Active</span>
             </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-[#003262] tracking-tight leading-none">
              永續治理主控台
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed">
              基於 Berkeley <span className="text-[#FDB515] font-black">5T 誠信協議</span> 的企業級 ESG 治理引擎
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 min-w-[400px]">
          <div className="flex-1 px-6 py-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm transition-all hover:shadow-md">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-1.5">Real-time Synchronization</p>
            <div className="flex items-center justify-between">
              <p className="text-lg font-black text-[#003262] font-mono leading-none">
                {now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            </div>
          </div>
          <Link href="/hermes-orchestrator" className="group">
            <BrandButton variant="primary" className="h-16 px-10 rounded-2xl shadow-2xl shadow-[#003262]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3">
              <Sparkles size={20} className="text-[#FDB515] animate-pulse" /> 
              <span className="font-black tracking-tight">啟動 AI 調度</span>
              <ArrowUpRight size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
            </BrandButton>
          </Link>
        </div>
      </header>

      {/* ── 5T Protocol Visual Strip ── */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/5 via-gold-400/5 to-purple-600/5 rounded-[20px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <BrandCard padding="none" className="overflow-hidden relative z-10 border-white/40 bg-white/20 backdrop-blur-sm shadow-xl shadow-blue-900/5">
          <BrandT5Strip 
            items={['T1','T2','T3','T4','T5'].map(code => ({ code: code as any, active: true }))}
            className="bg-gradient-to-r from-white/40 via-white/80 to-white/40"
          />
        </BrandCard>
      </div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
        {KPIS.map((k, idx) => (
          <BrandKpiCard
            key={k.key}
            label={k.label}
            value={k.value}
            unit={k.unit}
            trend={k.trend}
            trendUp={k.trendUp}
            icon={k.icon}
            color={k.color}
            verified={k.verified}
            formula={k.formula}
            sources={k.sources}
            className={`transition-all duration-500 hover:scale-[1.02] border-none shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-md`}
          />
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8 lg:gap-10">
        {/* Main Chart Section */}
        <div className="col-span-12 lg:col-span-8">
          <BrandCard padding="none" className="h-full border-none shadow-2xl shadow-slate-200/60 bg-white overflow-hidden group">
            <div className="p-8 lg:p-10 border-b border-slate-50">
              <BrandCardHeader 
                title="全方位永續軌跡分析" 
                subtitle="基於實體盤查數據與 SBTi 1.5°C 目標情境" 
              />
            </div>
            <div className="p-8 lg:p-10">
              <div className="h-[360px] relative">
                <EnvironmentalTrajectory title="" />
              </div>
              <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-5 transition-all hover:bg-blue-50/30 hover:border-blue-100 group">
                <div className="w-12 h-12 rounded-xl bg-[#003262] flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-[#003262]/20 group-hover:rotate-6 transition-transform">
                   <Info size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-base text-[#003262] font-black leading-tight">AI 洞察報告</p>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    系統已自動根據 <strong className="text-blue-700 font-black tracking-tight">ISO 14064-1</strong> 盤查數據與 <strong className="text-blue-700 font-black tracking-tight">GRI 305-1</strong> 標準進行對齊。
                    當前排放軌跡優於預期 <span className="text-emerald-600 font-black">18%</span>，但需關注範疇三減排策略。
                  </p>
                </div>
              </div>
            </div>
          </BrandCard>
        </div>

        {/* Sidebar Info Section */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <BrandCard padding="lg" className="border-none shadow-2xl shadow-slate-200/60 bg-white/80 backdrop-blur-md">
            <BrandCardHeader title="模組就緒度" subtitle="GRI 核心揭露進度" />
            <div className="space-y-8 mt-8">
              {MODULES.map(m => (
                <Link key={m.href} href={m.href} className="block group">
                  <div className="flex justify-between items-end mb-2.5">
                    <div className="space-y-0.5">
                      <span className="text-[14px] font-black text-[#003262] group-hover:text-blue-600 transition-colors uppercase tracking-tight">{m.label}</span>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">{m.sub}</p>
                    </div>
                    <span className="text-base font-black font-mono" style={{ color: m.color }}>{m.pct}%</span>
                  </div>
                  <BrandProgress value={m.pct} color="auto" size="md" animated />
                </Link>
              ))}
            </div>
            <Link href="/health-check" className="mt-10 block">
              <BrandButton variant="ghost" fullWidth size="lg" className="bg-slate-50/50 hover:bg-slate-100 rounded-2xl border-slate-100 transition-all font-bold">
                展開完整治理報告 <ChevronRight size={16} className="ml-2 opacity-40" />
              </BrandButton>
            </Link>
          </BrandCard>

          <BrandCard padding="lg" className="border-none shadow-2xl shadow-slate-200/60 bg-white/80 backdrop-blur-md overflow-hidden relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
             <BrandCardHeader title="實證軌跡" subtitle="5T 不可篡改稽核流" />
             <div className="mt-8 relative z-10">
               <BrandTimeline items={ACTIVITY} />
             </div>
             <Link href="/audit-log" className="mt-8 block border-t border-slate-50 pt-6 group">
                <p className="text-[11px] font-black text-blue-600 text-center group-hover:text-blue-800 cursor-pointer uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2">
                   VIEW FULL LOGS <ArrowUpRight size={12} className="opacity-40 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </p>
             </Link>
          </BrandCard>
        </div>
      </div>

      {/* ── Quick Actions Grid ── */}
      <section className="space-y-8">
         <div className="flex items-center gap-4">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Quick Access / 快速導覽</h3>
            <div className="flex-1 h-px bg-slate-100" />
         </div>
         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
           {QUICK_ACTIONS.map(a => (
             <Link key={a.href} href={a.href} className="group">
               <BrandCard padding="lg" hover className="text-center group-hover:border-blue-200 border-white bg-white/60 backdrop-blur-sm shadow-xl shadow-slate-200/40 rounded-[24px] transition-all duration-500 group-hover:-translate-y-2">
                 <div 
                   className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm"
                   style={{ backgroundColor: `${a.color}08`, color: a.color, border: `1px solid ${a.color}15` }}
                 >
                   {a.icon}
                 </div>
                 <p className="text-[14px] font-black text-[#003262] tracking-tight transition-colors">{a.label}</p>
                 <div className="w-6 h-1 bg-[#FDB515] mx-auto mt-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
               </BrandCard>
             </Link>
           ))}
         </div>
      </section>

      {/* ── AI Intelligence Panel ── */}
      <section className="relative group overflow-hidden rounded-[32px]">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-20 group-hover:opacity-30 transition-opacity duration-700 animate-gradient-x" />
        <BrandCard padding="none" className="bg-[#003262] border-none shadow-3xl relative overflow-hidden p-10 lg:p-14">
           {/* Decorative Elements */}
           <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-[2000ms]">
              <Bot size={300} color="#fff" strokeWidth={0.5} />
           </div>
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-[120px] -ml-48 -mb-48" />
           
           <div className="flex flex-col lg:flex-row lg:items-center gap-12 relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white flex-shrink-0 shadow-2xl group-hover:rotate-12 transition-transform duration-500 backdrop-blur-md">
                 <Bot size={40} className="text-blue-300" />
              </div>
              <div className="flex-1 space-y-4">
                 <div className="flex items-center gap-4">
                    <h3 className="text-3xl font-black text-white tracking-tight">OmniHermes 智慧洞察</h3>
                    <BrandBadge variant="info" size="sm" className="bg-blue-400/20 border-blue-300/30 text-blue-200 font-mono tracking-[0.2em] px-3">LIVE_FEED</BrandBadge>
                 </div>
                 <p className="text-blue-100/70 text-lg leading-relaxed max-w-4xl font-medium">
                    偵測到歐盟委員會更新了 <strong className="text-white font-black">GRI 305: Emissions</strong> 的指引。
                    建議對照當前範疇三盤查邏輯進行微調，以確保 2024 年度報告具備最高合規性與前瞻性。
                 </p>
              </div>
              <div className="w-full lg:w-auto">
                 <BrandButton 
                  variant="secondary" 
                  className="w-full lg:w-auto h-16 px-12 rounded-2xl font-black text-lg hover:bg-white hover:text-[#003262] transition-all shadow-2xl shadow-black/20"
                  onClick={() => window.location.href='/intelligence'}
                 >
                    查看深度分析
                 </BrandButton>
              </div>
           </div>
        </BrandCard>
      </section>

    </div>
  );
}

