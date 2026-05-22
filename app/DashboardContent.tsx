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
    <div className="fade-in max-w-[1600px] mx-auto p-6 space-y-6">
      
      {/* ── Page Header ── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 pb-4 md:pb-6 border-b border-slate-100">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
             <BrandBadge variant="gold" size="sm" className="font-mono">OMNI_TERMINAL v8.5.1</BrandBadge>
             <BrandStatusDot status="active" pulse label="Sovereign Node Active" size="sm" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#003262] tracking-tight">永續治理主控台</h1>
          <p className="text-slate-500 text-sm max-w-2xl font-medium">
            基於 Berkeley 5T 誠信協議的企業級 ESG 治理引擎：數據實證、AI 調度與自動化揭露一體化中心。
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-center sm:text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">最後更新</p>
            <p className="text-sm font-bold text-[#003262]">
              {now.toLocaleDateString('zh-TW')} {now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <Link href="/hermes-orchestrator" className="w-full sm:w-auto">
            <BrandButton variant="primary" className="w-full sm:w-auto shadow-lg shadow-blue-900/10">
              <Zap size={16} /> 啟動 AI 任務
            </BrandButton>
          </Link>
        </div>
      </header>

      {/* ── 5T Protocol Strip ── */}
      <BrandCard padding="none" className="overflow-hidden border-blue-100">
        <BrandT5Strip 
          items={['T1','T2','T3','T4','T5'].map(code => ({ code: code as any, active: true }))}
          className="bg-blue-50/30"
        />
      </BrandCard>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {KPIS.map(k => (
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
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Trajectory Chart */}
        <div className="lg:col-span-8">
          <BrandCard padding="lg">
            <BrandCardHeader title="全方位永續軌跡分析" subtitle="實際排放量 vs SBTi 1.5°C 目標情境" />
            <div className="mt-4">
              <EnvironmentalTrajectory 
                title="" // Title is already in BrandCard
              />
            </div>
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
              <Info size={16} className="text-blue-600 mt-0.5" />
              <p className="text-xs text-slate-600 leading-relaxed">
                系統已自動根據 <strong>ISO 14064-1</strong> 實體盤查數據與 <strong>GRI 305-1</strong> 標準進行對齊。
                當前實際排放軌跡優於 BAU 趨勢 18%，但仍需加速範疇三減排以達成 2030 目標。
              </p>
            </div>
          </BrandCard>
        </div>

        {/* Module Completion */}
        <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6">
          <BrandCard padding="md">
            <BrandCardHeader title="模組就緒度" subtitle="GRI 核心揭露進度" />
            <div className="space-y-5 mt-4">
              {MODULES.map(m => (
                <Link key={m.href} href={m.href} className="block group">
                  <div className="flex justify-between items-end mb-1.5">
                    <div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700 transition-colors">{m.label}</span>
                      <span className="text-[10px] font-bold text-slate-400 ml-2 uppercase tracking-tight">{m.sub}</span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: m.color }}>{m.pct}%</span>
                  </div>
                  <BrandProgress value={m.pct} color="auto" size="sm" animated />
                </Link>
              ))}
            </div>
            <Link href="/health-check" className="mt-6 block">
              <BrandButton variant="ghost" fullWidth size="sm">
                查看詳細健檢分析 <ChevronRight size={14} />
              </BrandButton>
            </Link>
          </BrandCard>

          {/* Activity Feed */}
          <BrandCard padding="md" className="flex-1">
             <BrandCardHeader title="治理實證軌跡" subtitle="5T 不可篡改稽核流" />
             <div className="mt-4">
               <BrandTimeline items={ACTIVITY} />
             </div>
             <Link href="/audit-log" className="mt-4 block">
                <p className="text-[10px] font-bold text-blue-700 text-center hover:underline cursor-pointer uppercase tracking-widest">
                   查看完整審計日誌
                </p>
             </Link>
          </BrandCard>
        </div>
      </div>

      {/* ── Quick Actions Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {QUICK_ACTIONS.map(a => (
          <Link key={a.href} href={a.href} className="group">
            <BrandCard padding="sm" hover className="text-center group-hover:border-blue-600/30">
              <div 
                className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${a.color}12`, color: a.color }}
              >
                {a.icon}
              </div>
              <p className="text-xs font-bold text-slate-700">{a.label}</p>
            </BrandCard>
          </Link>
        ))}
      </div>

      {/* ── Intelligence Snippet ── */}
      <BrandCard padding="md" className="bg-slate-900 border-none shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Bot size={120} color="#fff" />
         </div>
         <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 flex-shrink-0">
               <Bot size={24} />
            </div>
            <div className="flex-1">
               <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-bold">OmniHermes 智慧洞察</h3>
                  <BrandBadge variant="info" size="xs" className="bg-blue-500/20 border-blue-400/30 text-blue-300">New</BrandBadge>
               </div>
               <p className="text-blue-100/70 text-sm leading-relaxed">
                  偵測到歐盟委員會昨日更新了 <strong>GRI 305: Emissions</strong> 的細則指引。建議對照當前範疇三盤查邏輯進行微調，
                  以確保 2024 年度報告具備最高合規性。
               </p>
            </div>
            <div className="w-full md:w-auto mt-2 md:mt-0">
               <BrandButton variant="secondary" className="w-full md:w-auto" onClick={() => window.location.href='/intelligence'}>
                  查看詳細分析
               </BrandButton>
            </div>
         </div>
      </BrandCard>

    </div>
  );
}
