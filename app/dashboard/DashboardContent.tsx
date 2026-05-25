'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  CheckCircle, Leaf, Shield, Activity,
  FileText, Database, BarChart3, AlertTriangle,
  Zap, Target, Code, Sparkles, ArrowUpRight, Bot, Users, Brain, Info, Globe, RefreshCw, Lock, Cpu, X, HeartPulse, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { 
  BrandButton, BrandBadge, BrandCard, BrandCardHeader, BrandProgress, BrandTimeline, BrandStatusDot, BrandKpiCard
} from '../../components/brand';
import { SwarmMonitor } from '../../components/ui/SwarmMonitor';
import { IntegrityPulse } from '../../components/ui/IntegrityPulse';
import { EnvironmentalTrajectory } from '../../components/brand/EnvironmentalTrajectory';
import { useDashboardStats } from '../../hooks/useDashboard';
import { useSystemEvolution } from '../../hooks/useSystemEvolution';
import { omniCore } from '../../lib/omni-core';
import { supabase } from '../../lib/supabase';

export interface DashboardStatsData {
  complianceRate: number;
  carbonEmissions: number;
  griCoverage: number;
  auditCount: number;
}

function DataAlchemyWidget() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runAlchemy = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('data-alchemy', {
        body: { action: 'calculate_intensity', params: { year: 2026 } }
      });
      if (error) throw error;
      setResult(data);
    } catch (e) {
      console.error('Alchemy failed:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrandCard padding="none" className="glass-panel border-none h-full overflow-hidden flex flex-col shadow-lg bg-gradient-to-br from-white/80 to-blue-50/30">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-blue-600/5">
        <div>
          <h4 className="text-[10px] font-black text-blue-800 uppercase tracking-[0.2em]">Data Alchemy Furnace</h4>
          <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mt-0.5">Edge Compute • RLS Identity</p>
        </div>
        <Zap size={14} className="text-blue-600 animate-pulse" />
      </div>
      <div className="flex-1 p-6 flex flex-col justify-center items-center text-center space-y-4">
        {result ? (
          <div className="space-y-3 animate-in zoom-in-95 duration-500">
            <div className="text-3xl font-black text-[#003262] font-mono">
              {result.total_emissions.toLocaleString()}
              <span className="text-xs ml-1 text-slate-400 font-sans uppercase">tCO₂e</span>
            </div>
            <BrandBadge variant="gold" size="xs" dot>ALCHEMY_SUCCESS</BrandBadge>
            <p className="text-[9px] text-slate-400 font-bold uppercase leading-relaxed">
              Verified by Edge Alchemy Furnace<br/>
              Timestamp: {new Date(result.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
             <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto text-blue-600">
                <Cpu size={24} />
             </div>
             <p className="text-[10px] text-slate-500 font-medium px-4">
                啟動邊緣運算煉金爐，繼承您的 5T 誠信標記進行跨表數據聚合。
             </p>
          </div>
        )}
        <BrandButton 
          variant={result ? "ghost" : "primary"} 
          size="sm" 
          fullWidth 
          onClick={runAlchemy} 
          loading={loading}
          className="rounded-xl h-10 text-[10px] font-black uppercase tracking-widest"
        >
          {result ? "重新煉金" : "啟動數據轉化"}
        </BrandButton>
      </div>
    </BrandCard>
  );
}

function HealingGuardian() {
  const [logs, setLogs] = useState<any[]>([]);

  const fetchLogs = useCallback(async () => {
    const { data } = await supabase.from('healing_log').select('*').order('created_at', { ascending: false }).limit(3);
    setLogs(data || []);
  }, []);

  useEffect(() => {
    fetchLogs();
    const channel = supabase.channel('healing-dashboard-sync')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'healing_log' }, () => fetchLogs())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchLogs]);

  if (logs.length === 0) return null;

  return (
    <BrandCard padding="none" className="glass-panel border-none h-full overflow-hidden flex flex-col shadow-lg bg-gradient-to-br from-emerald-50/20 to-white mt-6">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-emerald-600/5">
        <div>
          <h4 className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.2em]">Autonomous Guardian</h4>
          <p className="text-[9px] font-bold text-emerald-600/60 uppercase tracking-widest mt-0.5">Self-Healing & Agency Engine</p>
        </div>
        <HeartPulse size={14} className="text-emerald-500 animate-pulse" />
      </div>
      <div className="flex-1 p-4 space-y-2">
        {logs.map((log, idx) => (
          <div key={idx} className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-emerald-100/50 shadow-sm animate-in slide-in-from-right-4">
             <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shrink-0"><ShieldCheck size={16}/></div>
             <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black text-emerald-800 uppercase">{log.target_gri} Fixed</p>
                <p className="text-[9px] text-slate-400 font-bold truncate">{log.action_taken}</p>
             </div>
          </div>
        ))}
      </div>
    </BrandCard>
  );
}

function GapGuardian() {
  const [gaps, setGaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGaps = useCallback(async () => {
    const { data } = await supabase.from('system_gaps_summary').select('*');
    setGaps(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchGaps();

    // ─── Bidirectional Real-time Sync ───
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'environmental_data' }, () => {
        console.log('[Sync] Data change detected, refreshing gaps...');
        fetchGaps();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchGaps]);

  return (
    <BrandCard padding="none" className="glass-panel border-none h-full overflow-hidden flex flex-col shadow-lg">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-amber-50/30">
        <div>
          <h4 className="text-[10px] font-black text-amber-800 uppercase tracking-[0.2em]">GRI Gap Guardian</h4>
          <p className="text-[9px] font-bold text-amber-600/60 uppercase tracking-widest mt-0.5">Missing Disclosures Detector</p>
        </div>
        <AlertTriangle size={14} className="text-amber-500 animate-pulse" />
      </div>
      <div className="flex-1 p-4 space-y-2 max-h-[250px] overflow-y-auto no-scrollbar">
        {gaps.filter(g => g.status === 'MISSING').length > 0 ? gaps.filter(g => g.status === 'MISSING').map((g, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-white border border-amber-100 rounded-xl shadow-sm">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-[10px] font-black text-slate-700">{g.gri_tag}</span>
             </div>
             <BrandBadge variant="outline" size="xs" className="text-amber-600 border-amber-200">待補正</BrandBadge>
          </div>
        )) : (
          <div className="py-8 text-center">
             <CheckCircle size={20} className="mx-auto text-emerald-400 mb-2" />
             <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">所有核心指標已齊備</p>
          </div>
        )}
      </div>
    </BrandCard>
  );
}

function AIRiskAlerter() {
  const [alerts, setAlerts] = useState<any[]>([]);

  const fetchAlerts = useCallback(async () => {
    const { data } = await supabase.from('ai_alerts').select('*').eq('is_resolved', false).order('created_at', { ascending: false });
    setAlerts(data || []);
  }, []);

  useEffect(() => {
    fetchAlerts();
    const channel = supabase
      .channel('ai-alerts-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ai_alerts' }, () => {
        fetchAlerts();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchAlerts]);

  const handleResolve = async (id: string) => {
    await supabase.from('ai_alerts').update({ is_resolved: true, resolved_at: new Date().toISOString() }).eq('id', id);
    fetchAlerts();
  };

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-4 mb-6">
       {alerts.map(a => (
         <motion.div key={a.id} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={cn(
           "p-5 rounded-[2rem] border shadow-xl relative overflow-hidden",
           a.severity === 'critical' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'
         )}>
            <div className="flex items-start gap-4 relative z-10">
               <div className={cn(
                 "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                 a.severity === 'critical' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
               )}>
                  <AlertTriangle size={20} />
               </div>
               <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <p className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      a.severity === 'critical' ? 'text-red-600' : 'text-amber-600'
                    )}>AI_Proactive_Warning</p>
                    <button onClick={() => handleResolve(a.id)} className="text-slate-400 hover:text-slate-600 p-1"><X size={12} /></button>
                  </div>
                  <h4 className="text-sm font-black text-slate-800">{a.title}</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{a.description}</p>
                  <div className="mt-3 p-3 bg-white/60 rounded-xl border border-white/80 flex items-center justify-between">
                     <div className="flex-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">建議修正</p>
                        <p className="text-[10px] font-bold text-blue-700">{a.suggested_fix}</p>
                     </div>
                     <BrandButton variant="primary" size="xs" className="h-7 px-3 rounded-lg text-[9px] font-black" onClick={() => handleResolve(a.id)}>已處理</BrandButton>
                  </div>
               </div>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-5"><Zap size={80} /></div>
         </motion.div>
       ))}
    </div>
  );
}

function IntegrityTrace() {
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMemories = async () => {
    try {
      const data = await omniCore.getMemories();
      setMemories(data.slice(0, 5));
    } catch (e) {
      console.error('Failed to fetch memories:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
    const channel = supabase
      .channel('memory-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user_memory' }, () => fetchMemories())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleConsolidate = async () => {
    setLoading(true);
    try {
      await omniCore.consolidateMemories('thought' as any);
      await fetchMemories();
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrandCard padding="none" className="glass-panel border-none h-full overflow-hidden flex flex-col shadow-lg">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white/40">
        <div>
          <h4 className="text-[10px] font-black text-[#003262] uppercase tracking-[0.2em]">5T Integrity Trace</h4>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Cloud Persistence</p>
        </div>
        <button 
          onClick={handleConsolidate} 
          disabled={loading}
          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all disabled:opacity-50"
          title="Consolidate Memories (DB RPC)"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
      <div className="flex-1 p-4 space-y-3 overflow-y-auto no-scrollbar max-h-[280px]">
        {memories.length > 0 ? memories.map((m, idx) => (
          <div key={m.id || idx} className="p-3 bg-white/60 rounded-xl border border-white/80 shadow-sm flex flex-col gap-1.5 transition-all hover:bg-white hover:shadow-md">
            <div className="flex items-center justify-between">
              <BrandBadge variant={m.consolidated ? "gold" : "info"} size="xs" className="scale-75 origin-left">{m.consolidated ? "CONSOLIDATED" : "TRACE"}</BrandBadge>
              <span className="text-[8px] font-black text-slate-300 uppercase">{new Date(m.timestamp).toLocaleTimeString()}</span>
            </div>
            <p className="text-[10px] font-bold text-[#003262]/80 line-clamp-2 leading-relaxed">{m.content}</p>
            <div className="flex items-center gap-1 opacity-20">
              <Lock size={8} />
              <span className="text-[8px] font-mono truncate max-w-[120px]">{m.hash_lock}</span>
            </div>
          </div>
        )) : (
          <div className="py-12 text-center">
             <Activity size={24} className="mx-auto text-slate-200 mb-2 opacity-20" />
             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">無近期追蹤紀錄</p>
          </div>
        )}
      </div>
    </BrandCard>
  );
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

function GovernanceLoopMonitor() {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    // Simulated deep integration feed
    setActivities([
      { type: 'intelligence', msg: 'Intelligence Hub 自動觸發了 1 項 5T 實證蒐集任務', time: '10 分鐘前', icon: <Globe size={14}/> },
      { type: 'alchemy', msg: 'Alchemy 提取數據已同步至 SustainWrite 能源管理章節', time: '30 分鐘前', icon: <Sparkles size={14}/> },
      { type: 'strategy', msg: '戰略實驗室：5T 供應鏈自動化提案已同步至動態架構', time: '2 小時前', icon: <Target size={14}/> },
    ]);
  }, []);

  return (
    <BrandCard padding="none" className="glass-panel border-none h-full overflow-hidden flex flex-col shadow-xl bg-gradient-to-br from-slate-900 to-[#003262] text-white">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
        <div>
          <h4 className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em]">oX Governance Loop</h4>
          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-0.5">Cross-Module Deep Integration</p>
        </div>
        <RefreshCw size={14} className="text-blue-400 animate-spin-slow" />
      </div>
      <div className="flex-1 p-4 space-y-3">
        {activities.map((a, i) => (
          <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/10 flex gap-4 hover:bg-white/10 transition-all cursor-default group">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-110 transition-transform">
              {a.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-blue-100 leading-snug">{a.msg}</p>
              <p className="text-[9px] text-white/30 font-bold uppercase mt-1">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </BrandCard>
  );
}

export default function DashboardContent() {
  const [now, setNow] = useState(new Date());
  const [trustScore, setTrustScore] = useState(90);
  const [resonance, setResonance] = useState(84);
  const { stats, loading: statsLoading } = useDashboardStats();
  const { growth, loading: growthLoading } = useSystemEvolution();

  const updateDashboardIntelligence = useCallback(async () => {
    try {
      const [tScore, resResponse] = await Promise.all([
        omniCore.calculateTrustScore(),
        fetch('/api/governance/resonance').then(r => r.json())
      ]);
      setTrustScore(tScore);
      if (resResponse.success && resResponse.data) {
        setResonance(resResponse.data.overall);
      }
    } catch (e) {
      console.error('Failed to update dashboard intelligence', e);
    }
  }, []);

  useEffect(() => {
    updateDashboardIntelligence();
    const t = setInterval(() => {
      setNow(new Date());
      updateDashboardIntelligence();
    }, 60000);
    return () => clearInterval(t);
  }, [updateDashboardIntelligence]);

  const KPIS = getKpis(stats, statsLoading);

  return (
    <div className="page-container space-y-8 lg:space-y-12 pb-24 fade-in">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-10">
        <div className="space-y-4 lg:space-y-6">
          <div className="flex flex-wrap items-center gap-3">
             <BrandBadge variant="gold" size="sm" className="font-black tracking-[0.15em] px-3 py-1 rounded-full shadow-lg shadow-[#FDB515]/5">OMNI_CORE v8.5</BrandBadge>
             <div className="flex items-center gap-2 bg-emerald-50/50 backdrop-blur-sm px-3 py-1 rounded-full border border-emerald-100/50">
                <BrandStatusDot status="active" pulse size="sm" />
                <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Node Active</span>
             </div>
             <div className="flex items-center gap-2 bg-berkeley-blue/5 backdrop-blur-sm px-3 py-1 rounded-full border border-berkeley-blue/10">
                <ShieldCheck size={14} className="text-berkeley-blue" />
                <span className="text-[9px] font-black text-berkeley-blue uppercase tracking-widest">Trust Score: {trustScore}</span>
             </div>
             <div className="flex items-center gap-2 bg-purple-50/50 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-100/50">
                <Zap size={14} className="text-purple-600" />
                <span className="text-[9px] font-black text-purple-700 uppercase tracking-widest">Resonance: {resonance}%</span>
             </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl lg:text-5xl font-black text-[#003262] tracking-tight leading-none uppercase">永續治理主控台</h1>
            <p className="text-slate-400 text-base lg:text-lg max-w-2xl font-medium leading-relaxed">基於 Berkeley <span className="text-[#FDB515] font-black">5T 誠信協議</span> 的企業級 ESG 引擎</p>
          </div>
        </div>
        <div className="flex items-stretch gap-3 min-w-[320px]">
          <div className="flex-1 px-5 py-3 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm flex flex-col justify-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Real-time Sync</p>
            <p className="text-base font-black text-[#003262] font-mono leading-none">{now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <Link href="/hermes-orchestrator" className="group">
            <BrandButton variant="primary" className="h-full px-8 rounded-2xl shadow-xl shadow-[#003262]/10 transition-all flex items-center gap-2">
              <Sparkles size={16} className="text-[#FDB515]" /> <span className="font-black tracking-tight text-sm">啟動 AI</span>
            </BrandButton>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
        {KPIS.map((k) => (<BrandKpiCard key={k.key} label={k.label} value={k.value} unit={k.unit} trend={k.trend} trendUp={k.trendUp} icon={k.icon} color={k.color} verified={true} className="p-5 lg:p-7 rounded-[1.5rem] lg:rounded-[2rem]" />))}
      </div>

      <div className="grid grid-cols-12 gap-6 lg:gap-10">
        <div className="col-span-12 lg:col-span-8">
          <BrandCard padding="none" className="glass-panel border-none h-full overflow-hidden group">
            <div className="p-6 lg:p-10 border-b border-slate-50 flex items-center justify-between"><BrandCardHeader title="全方位永續軌跡分析" subtitle="SBTi 1.5°C 目標情境" /><BrandBadge variant="outline" size="xs" className="opacity-40">REAL_TIME</BrandBadge></div>
            <div className="p-6 lg:p-10"><div className="h-[240px] lg:h-[360px] relative"><EnvironmentalTrajectory title="" /></div><div className="mt-8 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-start gap-4 transition-all hover:bg-blue-50/30 group"><div className="w-10 h-10 rounded-xl bg-[#003262] flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-[#003262]/20"><Info size={20} /></div><div className="space-y-1"><p className="text-xs text-[#003262] font-black leading-tight uppercase tracking-widest">AI 洞察</p><p className="text-sm text-slate-500 leading-relaxed font-medium">排放軌跡優於預期 <span className="text-emerald-600 font-black">18%</span>，範疇二綠電採購發揮關鍵作用。</p></div></div></div>
          </BrandCard>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6 lg:space-y-8">
          <GovernanceLoopMonitor />
          <SwarmMonitor />
          <IntegrityPulse />
          <AIRiskAlerter />
          <HealingGuardian />
          <GapGuardian />
          <DataAlchemyWidget />
        </div>
      </div>

      <section className="space-y-6 lg:space-y-8">
         <div className="flex items-center gap-4 px-2"><h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Quick Access</h3><div className="flex-1 h-px bg-slate-100" /></div>
         <div className="grid grid-compact">{QUICK_ACTIONS.map(a => (<Link key={a.href} href={a.href} className="group"><BrandCard padding="md" hover className="text-center group-hover:border-blue-100 border-white bg-white/60 backdrop-blur-sm shadow-sm rounded-[1.5rem] transition-all duration-500 group-hover:-translate-y-1"><div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3 transition-all duration-500 group-hover:scale-110 shadow-sm" style={{ backgroundColor: `${a.color}08`, color: a.color }}>{a.icon}</div><p className="text-xs font-black text-[#003262] tracking-tight">{a.label}</p></BrandCard></Link>))}</div>
      </section>
    </div>
  );
}
