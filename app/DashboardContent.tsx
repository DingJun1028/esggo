'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle, Leaf, Shield, Activity,
  FileText, Database, BarChart3, AlertTriangle,
  Zap, Target, Code, Sparkles, ArrowUpRight, Bot, Users, Brain, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrandButton, BrandBadge, BrandCard, BrandCardHeader, BrandProgress, BrandTimeline, BrandStatusDot
} from '../components/brand';
import { EnvironmentalTrajectory } from '../components/brand/EnvironmentalTrajectory';

export interface DashboardStatsData {
  complianceRate: number;
  carbonEmissions: number;
  griCoverage: number;
  auditCount: number;
}

const getKpis = (stats: DashboardStatsData | null, loading: boolean) => [
  { key: 'compliance', icon: <CheckCircle size={10}/>, label: '合規完成率', value: stats?.complianceRate.toString() || (loading ? '…' : '92'), unit: '%', trend: '+5.2%', trendUp: true, color: '#10B981' },
  { key: 'carbon',     icon: <Leaf size={10}/>,        label: '碳排放量',   value: stats?.carbonEmissions.toLocaleString() || (loading ? '…' : '3,420'), unit: 'tCO₂e', trend: '-12%', trendUp: true, color: '#003262' },
  { key: 'gri',        icon: <Shield size={10}/>,      label: 'GRI 覆蓋率', value: stats?.griCoverage.toString() || (loading ? '…' : '88'), unit: '%', trend: '+8%', trendUp: true, color: '#3B7EA1' },
  { key: 'audit',      icon: <Activity size={10}/>,    label: '審計紀錄',   value: stats?.auditCount.toLocaleString() || (loading ? '…' : '1,284'), unit: '筆', trend: 'T5', trendUp: true, color: '#8B5CF6' },
];

const MODULES = [
  { href: '/environmental', label: '環境指揮', sub: 'GRI 302–306', pct: 82, color: '#10B981' },
  { href: '/social',        label: '社會影響', sub: 'GRI 401–414', pct: 74, color: '#3B82F6' },
  { href: '/governance',    label: '公司治理', sub: 'GRI 2, 205',  pct: 79, color: '#8B5CF6' },
  { href: '/materiality',   label: '重大性矩陣',sub: 'GRI 3-1~3-3', pct: 60, color: '#FDB515' },
  { href: '/vault',         label: '證據金庫', sub: '5T ZKP',      pct: 88, color: '#003262' },
];

const QUICK_ACTIONS = [
  { href: '/editor',       icon: <FileText size={15}/>,  label: '撰寫報告' },
  { href: '/vault',        icon: <Database size={15}/>,  label: '上傳佐證' },
  { href: '/swarm',        icon: <Users size={15}/>,     label: '代理蜂群' },
  { href: '/intelligence', icon: <BarChart3 size={15}/>, label: '情報中心' },
  { href: '/roadmap',      icon: <Target size={15}/>,    label: '淨零規劃' },
  { href: '/terminal',     icon: <Code size={15}/>,      label: '終端主控' },
];

export default function DashboardContent() {
  const [now, setNow] = useState(new Date());
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [growth, setGrowth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, gRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/ai/growth')
        ]);
        if (sRes.ok) setStats(await sRes.json());
        if (gRes.ok) setGrowth(await gRes.json());
      } catch (err) {
        console.error('fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const t = setInterval(() => { setNow(new Date()); fetchData(); }, 60000);
    return () => clearInterval(t);
  }, []);

  const KPIS = getKpis(stats, loading);

  return (
    <div className="page-container fade-in pb-8">

      {/* ─── Ultra-compact Header Bar ─────────────────────────────── */}
      <header className="page-header-bar mb-3">
        <div className="flex items-center gap-3">
          {/* T5 dots */}
          <div className="t5-micro-strip">
            {['T1','T2','T3','T4','T5'].map(t => (
              <div key={t} className="t5-dot" style={{ backgroundColor: '#003262' }} title={t} />
            ))}
          </div>
          <div>
            <h1 className="page-header-title">永續治理主控台</h1>
            <p className="section-label mt-0.5">OMNI_CORE v8.5 · Berkeley 5T 誠信協議</p>
          </div>
          <BrandBadge variant="gold" size="xs" className="hidden sm:flex font-black tracking-widest flex-shrink-0">LIVE</BrandBadge>
        </div>

        <div className="flex items-center gap-2">
          {/* Clock */}
          <div className="hidden md:flex flex-col items-end px-3 py-1.5 bg-white/70 rounded-lg border border-slate-100">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Real-time</span>
            <span className="text-sm font-black text-[#003262] font-mono leading-none">
              {now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          {/* Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100">
            <BrandStatusDot status="active" pulse size="xs" />
            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest hidden sm:block">Active</span>
          </div>
          <Link href="/hermes-orchestrator">
            <BrandButton variant="primary" size="sm" className="h-9 px-4 rounded-lg text-xs font-black gap-1.5">
              <Sparkles size={12} className="text-[#FDB515]" />
              啟動 AI
            </BrandButton>
          </Link>
        </div>
      </header>

      {/* ─── KPI Bar ──────────────────────────────────────────────── */}
      <div className="kpi-bar mb-3">
        {KPIS.map(k => (
          <div key={k.key} className="kpi-bar-cell">
            <div className="flex items-center gap-1 mb-0.5">
              <span style={{ color: k.color }} className="flex-shrink-0">{k.icon}</span>
              <span className="kpi-bar-label truncate">{k.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="kpi-bar-value" style={{ color: k.color }}>{k.value}</span>
              <span className="text-[9px] text-slate-400 font-bold">{k.unit}</span>
            </div>
            <span className={`text-[9px] font-black ${k.trendUp ? 'text-emerald-500' : 'text-red-400'}`}>{k.trend}</span>
          </div>
        ))}
        {/* Quick actions inline */}
        {QUICK_ACTIONS.map(a => (
          <Link key={a.href} href={a.href} className="kpi-bar-cell group cursor-pointer">
            <div className="flex flex-col items-center justify-center gap-1 py-1">
              <div className="w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center text-slate-500 group-hover:text-[#003262] transition-colors">
                {a.icon}
              </div>
              <span className="kpi-bar-label text-center">{a.label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* ─── AI Evolution Banner (Compact) ─────────────────────────── */}
      <AnimatePresence>
        {growth && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mb-3">
            <div className="flex items-center gap-3 px-4 py-2.5 bg-[#003262] rounded-xl overflow-hidden relative">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-[#FDB515] flex-shrink-0">
                <Brain size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-blue-300 uppercase tracking-widest">AI Evolution Insight</span>
                  <BrandBadge variant="gold" size="xs" className="text-[8px]">ACTIVE</BrandBadge>
                </div>
                <p className="text-white text-xs font-bold leading-tight truncate">
                  "{growth.analysis.growthSuggestion}"
                </p>
              </div>
              <div className="text-right flex-shrink-0 hidden md:block">
                <span className="text-[9px] font-black text-blue-300/60 uppercase tracking-widest block">Impact</span>
                <span className="text-base font-black text-[#FDB515] font-mono">{growth.analysis.impactScore}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Main Bento Grid ──────────────────────────────────────── */}
      <div className="bento">

        {/* Chart: 8 cols */}
        <div className="col-span-12 lg:col-span-8">
          <div className="section-card h-full">
            <div className="section-card-header">
              <div className="flex items-center gap-2">
                <BarChart3 size={13} className="text-[#003262]/60" />
                <div>
                  <p className="text-sm font-black text-[#003262] leading-none">全方位永續軌跡</p>
                  <p className="section-label mt-0.5">SBTi 1.5°C 目標情境</p>
                </div>
              </div>
              <BrandBadge variant="outline" size="xs" className="opacity-50 text-[9px]">REAL_TIME</BrandBadge>
            </div>
            <div className="section-card-body">
              <div className="h-[220px] lg:h-[300px] relative">
                <EnvironmentalTrajectory title="" />
              </div>
              {/* AI insight inline */}
              <div className="mt-3 flex items-center gap-3 px-3 py-2 bg-blue-50/50 rounded-lg border border-blue-100/50">
                <Info size={13} className="text-[#003262] flex-shrink-0" />
                <p className="text-xs text-slate-600 leading-tight">
                  排放軌跡優於預期 <span className="text-emerald-600 font-black">18%</span>，範疇二綠電採購發揮關鍵作用。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Module Progress: 4 cols */}
        <div className="col-span-12 lg:col-span-4">
          <div className="section-card h-full">
            <div className="section-card-header">
              <div className="flex items-center gap-2">
                <Zap size={13} className="text-[#003262]/60" />
                <div>
                  <p className="text-sm font-black text-[#003262] leading-none">模組就緒度</p>
                  <p className="section-label mt-0.5">GRI 核心進度</p>
                </div>
              </div>
            </div>
            <div className="section-card-body space-y-3">
              {MODULES.map(m => (
                <Link key={m.href} href={m.href} className="block group">
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <span className="text-xs font-black text-[#003262] group-hover:text-blue-600 transition-colors">{m.label}</span>
                      <span className="text-[9px] text-slate-400 font-bold ml-2">{m.sub}</span>
                    </div>
                    <span className="text-xs font-black font-mono" style={{ color: m.color }}>{m.pct}%</span>
                  </div>
                  <BrandProgress value={m.pct} color="auto" size="xs" animated />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* AI Panel: full width */}
        <div className="col-span-12">
          <div className="flex items-center gap-4 px-4 py-3 bg-[#003262] rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-[0.04] pointer-events-none">
              <Bot size={140} color="#fff" strokeWidth={0.5} />
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
              <Bot size={20} className="text-blue-300" />
            </div>
            <div className="flex-1 min-w-0 relative z-10">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-sm font-black text-white tracking-tight">OmniHermes 智慧洞察</h3>
                <BrandBadge variant="info" size="xs" className="bg-blue-400/20 text-blue-200 text-[8px] font-mono tracking-widest">LIVE</BrandBadge>
              </div>
              <p className="text-blue-100/70 text-xs leading-tight">
                歐盟委員會更新了 <strong className="text-white font-black">GRI 305</strong> 指引。建議微調範疇三盤查邏輯。
              </p>
            </div>
            <BrandButton 
              variant="secondary" 
              size="sm"
              className="h-9 px-5 rounded-lg text-xs font-black flex-shrink-0 relative z-10"
              onClick={() => window.location.href='/intelligence'}
            >
              深度分析 <ArrowUpRight size={12} className="ml-1" />
            </BrandButton>
          </div>
        </div>

      </div>
    </div>
  );
}
