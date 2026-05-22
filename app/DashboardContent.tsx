'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle, Leaf, Shield, Activity, TrendingUp, TrendingDown,
  FileText, Database, ClipboardList, BarChart3, AlertTriangle,
  ChevronRight, Zap, Target, BookOpen, HeartPulse, Info, X, Users, Bot, Layers, Code
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
    icon: <CheckCircle size={18}/>,
    label: '合規完成率',
    value: stats?.complianceRate.toString() || (loading ? '...' : '0'),
    unit: '%',
    trend: '+5.2%',
    trendUp: true,
    color: 'var(--green-500)',
    formula: '已完成 GRI 指標數 ÷ 適用 GRI 指標數 × 100',
    sources: ['GRI 2021 指標庫', 'ESG 模組填報狀態'],
    verified: true,
  },
  {
    key: 'carbon',
    icon: <Leaf size={18}/>,
    label: '碳排放量',
    value: stats?.carbonEmissions.toLocaleString() || (loading ? '...' : '0'),
    unit: 'tCO₂e',
    trend: '-12%',
    trendUp: false,
    color: 'var(--blue-600)',
    formula: '範疇一 + 範疇二 + 範疇三（已揭露部分）',
    sources: ['ISO 14064-1 盤查清冊', 'GRI 305-1/2/3'],
    verified: true,
  },
  {
    key: 'gri',
    icon: <Shield size={18}/>,
    label: 'GRI 覆蓋率',
    value: stats?.griCoverage.toString() || (loading ? '...' : '0'),
    unit: '%',
    trend: '+8%',
    trendUp: true,
    color: 'var(--blue-500)',
    formula: '已上傳佐證文件之 GRI 指標 ÷ 全部適用指標',
    sources: ['Evidence Vault 佐證庫'],
    verified: true,
  },
  {
    key: 'audit',
    icon: <Activity size={18}/>,
    label: '審計記錄',
    value: stats?.auditCount.toLocaleString() || (loading ? '...' : '0'),
    unit: '筆',
    trend: 'T5 追蹤',
    trendUp: true,
    color: 'var(--purple-500)',
    formula: '所有 audit_logs 記錄數（含 AI 操作）',
    sources: ['audit_logs 資料表'],
    verified: true,
  },
];

const MODULES = [
  { href: '/environmental', label: '環境指揮', sub: 'GRI 302–306', pct: 82, color: 'var(--green-500)' },
  { href: '/social',        label: '社會影響', sub: 'GRI 401–414', pct: 74, color: 'var(--blue-500)' },
  { href: '/governance',    label: '公司治理', sub: 'GRI 2, 205',  pct: 79, color: 'var(--purple-500)' },
  { href: '/materiality',   label: '重大性矩陣',sub: 'GRI 3-1~3-3', pct: 60, color: 'var(--gold-500)' },
  { href: '/vault',         label: '證據金庫',  sub: '5T ZKP',     pct: 88, color: 'var(--blue-600)' },
];

const ACTIVITY = [
  { id: '1', icon: <CheckCircle size={14}/>, color: 'var(--green-600)', title: '範疇二電力數據已 ZKP 封印', time: '3分鐘前', badge: <BrandBadge variant="success" size="xs">T4 Seal</BrandBadge> },
  { id: '2', icon: <Database size={14}/>,    color: 'var(--blue-600)',  title: '台電帳單上傳至證據金庫', time: '18分鐘前', badge: <BrandBadge variant="info" size="xs">T1 Proof</BrandBadge> },
  { id: '3', icon: <Activity size={14}/>,    color: 'var(--purple-600)', title: 'GRI 305-1 審計日誌新增', time: '42分鐘前', badge: <BrandBadge variant="purple" size="xs">T5 Track</BrandBadge> },
  { id: '4', icon: <AlertTriangle size={14}/>,color: 'var(--amber-600)', title: '供應商 ESG 評核逾期提醒', time: '1小時前', badge: <BrandBadge variant="warning" size="xs">T2 Alert</BrandBadge> },
];

const QUICK_ACTIONS = [
  { href: '/editor',       icon: <FileText size={18}/>,    label: '撰寫報告', color: 'var(--blue-700)' },
  { href: '/vault',        icon: <Database size={18}/>,    label: '上傳佐證', color: 'var(--blue-600)' },
  { href: '/swarm',        icon: <Users size={18}/>,       label: '代理蜂群', color: 'var(--purple-600)' },
  { href: '/intelligence', icon: <BarChart3 size={18}/>,   label: '情報中心', color: 'var(--blue-500)' },
  { href: '/roadmap',      icon: <Target size={18}/>,      label: '淨零規劃', color: 'var(--amber-600)' },
  { href: '/terminal',     icon: <Code size={18}/>,        label: '終端主控', color: 'var(--blue-800)' },
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
    <div className="fade-in max-w-[1600px] mx-auto p-6 space-y-8">
      
      {/* ── Page Header ── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200/60">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <BrandBadge variant="gold" size="sm" className="font-black tracking-widest px-3">OMNI_TERMINAL v8.5.1</BrandBadge>
             <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 shadow-sm shadow-emerald-500/5">
                <BrandStatusDot status="active" pulse size="sm" />
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Sovereign Node Active</span>
             </div>
          </div>
          <h1 className="text-4xl font-black text-[#003262] tracking-tight leading-none">永續治理主控台</h1>
          <p className="text-slate-500 text-sm max-w-2xl font-medium leading-relaxed">
            基於 Berkeley <span className="text-[#FDB515] font-bold">5T 誠信協議</span> 的企業級 ESG 治理引擎：數據實證、AI 調度與自動化揭露一體化中心。
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          <div className="px-5 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm text-center sm:text-right min-w-[180px]">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">最後更新 Last Update</p>
            <p className="text-base font-black text-[#003262] font-mono">
              {now.toLocaleDateString('zh-TW')} {now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <Link href="/hermes-orchestrator" className="w-full sm:w-auto">
            <BrandButton variant="primary" className="w-full sm:w-auto h-14 px-8 rounded-2xl shadow-xl shadow-[#003262]/20 hover:scale-105 transition-all">
              <Zap size={18} className="mr-2" /> 啟動 AI 任務
            </BrandButton>
          </Link>
        </div>
      </header>

      {/* ── 5T Protocol Strip ── */}
      <BrandCard padding="none" className="overflow-hidden border-blue-100/50 shadow-lg shadow-blue-900/5">
        <BrandT5Strip 
          items={['T1','T2','T3','T4','T5'].map(code => ({ code: code as any, active: true }))}
          className="bg-gradient-to-r from-blue-50/50 via-white to-blue-50/50"
        />
      </BrandCard>

      {/* ── KPI Bento Grid ── */}
      <div className="bento">
        {KPIS.map((k, idx) => (
          <div key={k.key} className="col-span-12 sm:col-span-6 lg:col-span-3">
             <BrandKpiCard
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
               className={`h-full border-t-4 ${idx % 2 === 0 ? 'border-[#003262]' : 'border-[#FDB515]'}`}
             />
          </div>
        ))}
      </div>

      <div className="bento">
        {/* Main Trajectory Chart */}
        <div className="col-span-12 lg:col-span-8">
          <BrandCard padding="lg" className="h-full glass-panel">
            <BrandCardHeader title="全方位永續軌跡分析" subtitle="實際排放量 vs SBTi 1.5°C 目標情境" />
            <div className="mt-8 h-[300px]">
              <EnvironmentalTrajectory 
                title="" // Title is already in BrandCard
              />
            </div>
            <div className="mt-8 p-5 bg-[#EBF2FA]/40 rounded-2xl border border-blue-100/50 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-blue-600/20">
                 <Info size={20} />
              </div>
              <p className="text-sm text-[#003262]/80 leading-relaxed font-medium">
                系統已自動根據 <strong className="text-blue-700">ISO 14064-1</strong> 實體盤查數據與 <strong className="text-blue-700">GRI 305-1</strong> 標準進行對齊。
                當前實際排放軌跡優於 BAU 趨勢 <span className="text-emerald-600 font-black">18%</span>，但仍需加速範疇三減排以達成 2030 目標。
              </p>
            </div>
          </BrandCard>
        </div>

        {/* Module Completion */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <BrandCard padding="md" className="glass-panel">
            <BrandCardHeader title="模組就緒度" subtitle="GRI 核心揭露進度" />
            <div className="space-y-6 mt-6">
              {MODULES.map(m => (
                <Link key={m.href} href={m.href} className="block group">
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-black text-slate-700 group-hover:text-blue-700 transition-colors uppercase tracking-tight">{m.label}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{m.sub}</span>
                    </div>
                    <span className="text-sm font-black font-mono" style={{ color: m.color }}>{m.pct}%</span>
                  </div>
                  <BrandProgress value={m.pct} color="auto" size="md" animated />
                </Link>
              ))}
            </div>
            <Link href="/health-check" className="mt-8 block">
              <BrandButton variant="ghost" fullWidth size="md" className="bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100">
                查看詳細健檢分析 <ChevronRight size={14} className="ml-2" />
              </BrandButton>
            </Link>
          </BrandCard>

          {/* Activity Feed */}
          <BrandCard padding="md" className="glass-panel border-purple-100/50">
             <BrandCardHeader title="治理實證軌跡" subtitle="5T 不可篡改稽核流" />
             <div className="mt-6">
               <BrandTimeline items={ACTIVITY} />
             </div>
             <Link href="/audit-log" className="mt-6 block border-t border-slate-100 pt-4">
                <p className="text-[10px] font-black text-blue-700 text-center hover:text-blue-900 cursor-pointer uppercase tracking-[0.2em] transition-colors">
                   VIEW FULL AUDIT LOG ❯
                </p>
             </Link>
          </BrandCard>
        </div>
      </div>

      {/* ── Quick Actions Grid ── */}
      <div>
         <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4 px-1">快速導覽 Quick Access</h3>
         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
           {QUICK_ACTIONS.map(a => (
             <Link key={a.href} href={a.href} className="group">
               <BrandCard padding="md" hover className="text-center group-hover:border-blue-600 border-slate-100/50 bg-white/60 backdrop-blur-md">
                 <div 
                   className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 transition-all group-hover:scale-110 group-hover:rotate-3 shadow-sm"
                   style={{ backgroundColor: `${a.color}12`, color: a.color, border: `1px solid ${a.color}20` }}
                 >
                   {a.icon}
                 </div>
                 <p className="text-[13px] font-black text-slate-700 tracking-tight group-hover:text-[#003262] transition-colors">{a.label}</p>
               </BrandCard>
             </Link>
           ))}
         </div>
      </div>

      {/* ── Intelligence Snippet ── */}
      <BrandCard padding="lg" className="bg-[#0f172a] border-none shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
            <Bot size={200} color="#fff" />
         </div>
         <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 flex-shrink-0 shadow-2xl shadow-blue-500/20">
               <Bot size={32} />
            </div>
            <div className="flex-1">
               <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">OmniHermes 智慧洞察</h3>
                  <BrandBadge variant="info" size="sm" className="bg-blue-500/20 border-blue-400/30 text-blue-300 font-mono tracking-widest">REAL_TIME</BrandBadge>
               </div>
               <p className="text-blue-100/60 text-base leading-relaxed max-w-4xl">
                  偵測到歐盟委員會昨日更新了 <strong className="text-white">GRI 305: Emissions</strong> 的細則指引。建議對照當前範疇三盤查邏輯進行微調，
                  以確保 2024 年度報告具備最高合規性。
               </p>
            </div>
            <div className="w-full md:w-auto mt-4 md:mt-0">
               <BrandButton variant="secondary" className="w-full md:w-auto h-12 px-8 rounded-xl font-bold hover:bg-white hover:text-slate-900 transition-all" onClick={() => window.location.href='/intelligence'}>
                  查看分析 ❯
               </BrandButton>
            </div>
         </div>
      </BrandCard>

    </div>
  );
}
