'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  CheckCircle, Leaf, Shield, Activity,
  FileText, Database, BarChart3, AlertTriangle,
  Zap, Target, Code, Sparkles, ArrowUpRight, Bot, Users, Brain, Info, Globe, RefreshCw, Lock, Cpu, X, HeartPulse, ShieldCheck, ClipboardCheck, Network, UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { 
  BrandProgress, BrandTimeline, BrandStatusDot 
} from '../../components/brand';
import { SwarmMonitor } from '../../components/ui/SwarmMonitor';
import { IntegrityPulse } from '../../components/ui/IntegrityPulse';
import { EnvironmentalTrajectory } from '../../components/brand/EnvironmentalTrajectory';
import { useDashboardStats } from '../../hooks/useDashboard';
import { useSystemEvolution } from '../../hooks/useSystemEvolution';
import { omniCore } from '../../lib/omni-core';
import { supabase } from '../../lib/supabase';
import { fadeIn, staggerContainer, slideIn } from '../../lib/animations';

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
    <Card hoverEffect className="h-full overflow-hidden flex flex-col bg-white/60 backdrop-blur-md border-white/60">
      <div className="p-6 border-b border-slate-100/60 flex items-center justify-between bg-[#003262]/5">
        <div>
          <h4 className="text-[10px] font-black text-[#003262] uppercase tracking-[0.2em]">Data Alchemy Furnace</h4>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Edge Compute • RLS Identity</p>
        </div>
        <Zap size={14} className="text-[#003262] animate-pulse" />
      </div>
      <div className="flex-1 p-6 flex flex-col justify-center items-center text-center space-y-4">
        {result ? (
          <div className="space-y-3 animate-in zoom-in-95 duration-500">
            <div className="text-3xl font-bold text-[#003262] font-mono">
              {result.total_emissions.toLocaleString()}
              <span className="text-xs ml-1 text-slate-400 font-sans uppercase font-bold">tCO₂e</span>
            </div>
            <Badge variant="verified">ALCHEMY_SUCCESS</Badge>
          </div>
        ) : (
          <div className="space-y-4">
             <div className="w-12 h-12 rounded-2xl bg-[#003262]/5 flex items-center justify-center mx-auto text-[#003262]">
                <Cpu size={24} />
             </div>
             <p className="text-[10px] text-slate-500 font-medium px-4">
                啟動邊緣運算煉金爐，繼承您的 5T 誠信標記進行跨表數據聚合。
             </p>
          </div>
        )}
        <Button 
          variant={result ? "glass" : "primary"} 
          size="sm" 
          onClick={runAlchemy} 
          isLoading={loading}
          className="rounded-xl h-10 text-[10px] font-bold uppercase tracking-widest w-full"
        >
          {result ? "重新煉金" : "啟動數據轉化"}
        </Button>
      </div>
    </Card>
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
    <Card className="h-full overflow-hidden flex flex-col bg-white/60 backdrop-blur-md border-white/60 mt-6">
      <div className="p-6 border-b border-slate-100/60 flex items-center justify-between bg-emerald-500/5">
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
    </Card>
  );
}

function GapGuardian() {
  const [gaps, setGaps] = useState<any[]>([]);

  const fetchGaps = useCallback(async () => {
    const { data } = await supabase.from('system_gaps_summary').select('*');
    setGaps(data || []);
  }, []);

  useEffect(() => {
    fetchGaps();
    const channel = supabase.channel('schema-db-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'environmental_data' }, () => fetchGaps()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchGaps]);

  return (
    <Card className="h-full overflow-hidden flex flex-col bg-white/60 backdrop-blur-md border-white/60">
      <div className="p-6 border-b border-slate-100/60 flex items-center justify-between bg-amber-500/5">
        <div>
          <h4 className="text-[10px] font-black text-amber-800 uppercase tracking-[0.2em]">GRI Gap Guardian</h4>
          <p className="text-[9px] font-bold text-amber-600/60 uppercase tracking-widest mt-0.5">Missing Disclosures Detector</p>
        </div>
        <AlertTriangle size={14} className="text-amber-500 animate-pulse" />
      </div>
      <div className="flex-1 p-4 space-y-2 max-h-[250px] overflow-y-auto no-scrollbar">
        {gaps.filter(g => g.status === 'MISSING').length > 0 ? gaps.filter(g => g.status === 'MISSING').map((g, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-white/60 border border-amber-100 rounded-xl shadow-sm">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-[10px] font-bold text-slate-700">{g.gri_tag}</span>
             </div>
             <Badge variant="warning" className="text-[8px] h-4">待補正</Badge>
          </div>
        )) : (
          <div className="py-8 text-center">
             <CheckCircle size={20} className="mx-auto text-emerald-400 mb-2" />
             <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">所有核心指標已齊備</p>
          </div>
        )}
      </div>
    </Card>
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
    const channel = supabase.channel('ai-alerts-sync').on('postgres_changes', { event: '*', schema: 'public', table: 'ai_alerts' }, () => fetchAlerts()).subscribe();
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
           "p-6 rounded-[32px] border shadow-xl relative overflow-hidden bg-white/60 backdrop-blur-xl",
           a.severity === 'critical' ? 'border-red-100' : 'border-amber-100'
         )}>
            <div className="flex items-start gap-4 relative z-10">
               <div className={cn(
                 "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                 a.severity === 'critical' ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-amber-500 text-white shadow-amber-500/20'
               )}>
                  <AlertTriangle size={24} />
               </div>
               <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <p className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      a.severity === 'critical' ? 'text-red-600' : 'text-amber-600'
                    )}>AI_Proactive_Warning</p>
                    <button onClick={() => handleResolve(a.id)} className="text-slate-400 hover:text-slate-600 p-1 transition-colors"><X size={14} /></button>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 tracking-tight">{a.title}</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{a.description}</p>
                  <div className="mt-4 p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center justify-between shadow-inner">
                     <div className="flex-1 min-w-0 mr-4">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">建議修正 Suggested Fix</p>
                        <p className="text-[10px] font-bold text-[#003262] truncate">{a.suggested_fix}</p>
                     </div>
                     <Button variant="primary" size="sm" className="h-8 px-4 rounded-xl text-[9px] font-bold" onClick={() => handleResolve(a.id)}>已處理</Button>
                  </div>
               </div>
            </div>
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
    const channel = supabase.channel('memory-changes').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user_memory' }, () => fetchMemories()).subscribe();
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
    <Card className="h-full overflow-hidden flex flex-col bg-white/60 backdrop-blur-md border-white/60 shadow-lg">
      <div className="p-6 border-b border-slate-100/60 flex items-center justify-between bg-white/40">
        <div>
          <h4 className="text-[10px] font-black text-[#003262] uppercase tracking-[0.2em]">5T Integrity Trace</h4>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Cloud Persistence</p>
        </div>
        <Button variant="glass" size="sm" className="w-8 h-8 p-0" onClick={handleConsolidate} disabled={loading}>
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </Button>
      </div>
      <div className="flex-1 p-4 space-y-3 overflow-y-auto no-scrollbar max-h-[280px]">
        {memories.length > 0 ? memories.map((m, idx) => (
          <div key={m.id || idx} className="p-3 bg-white/60 rounded-xl border border-white/80 shadow-sm flex flex-col gap-1.5 transition-all hover:bg-white hover:shadow-md group">
            <div className="flex items-center justify-between">
              <Badge variant={m.consolidated ? "verified" : "draft"} className="scale-75 origin-left">{m.consolidated ? "CONSOLIDATED" : "TRACE"}</Badge>
              <span className="text-[8px] font-black text-slate-300 uppercase">{new Date(m.timestamp).toLocaleTimeString()}</span>
            </div>
            <p className="text-[10px] font-bold text-[#003262]/80 line-clamp-2 leading-relaxed">{m.content}</p>
            <div className="flex items-center gap-1 opacity-20 group-hover:opacity-40 transition-opacity">
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
    </Card>
  );
}

const KPIS = [
  { key: 'compliance', icon: <CheckCircle size={18}/>, label: 'RBA 合規完成率', value: '94', unit: '%', trend: '+2.1%', trendUp: true, color: '#10B981' },
  { key: 'carbon',     icon: <Leaf size={18}/>,        label: '群光範疇三排放',   value: '12,840', unit: 'tCO₂e', trend: '-5%', trendUp: true, color: '#003262' },
  { key: 'ai-audit',   icon: <Brain size={18}/>,      label: 'AI 自動核對率', value: '82', unit: '%', trend: 'OCR', trendUp: true, color: '#8B5CF6' },
  { key: 'verified',   icon: <Shield size={18}/>,    label: '5T 實證項',   value: '1,562', unit: 'SEALED', trend: 'T5', trendUp: true, color: '#FDB515' },
];

const MODULES = [
  { href: '/environmental', label: '環境指揮', sub: 'GRI 302–306', pct: 82, color: '#10B981' },
  { href: '/social',        label: '社會影響', sub: 'GRI 401–414', pct: 74, color: '#3B82F6' },
  { href: '/supply-chain',  label: '供應鏈治理', sub: 'RBA v8.0', pct: 88, color: '#FDB515' },
  { href: '/vault',         label: '證據金庫', sub: '5T ZKP',      pct: 88, color: '#003262' },
];

const QUICK_ACTIONS = [
  { href: '/editor',       icon: <FileText size={18}/>,  label: '撰寫報告', color: '#003262' },
  { href: '/supply-chain', icon: <Network size={18}/>,   label: 'AI 稽核隊列', color: '#8B5CF6' },
  { href: '/audit-verify', icon: <ClipboardCheck size={18}/>, label: '遠距查驗', color: '#009E9D' },
  { href: '/audit-log',    icon: <Activity size={18}/>,  label: '審計日誌', color: '#003262' },
  { href: '/vault',        icon: <Database size={18}/>,  label: '佐證金庫', color: '#003262' },
  { href: '/swarm',        icon: <Users size={18}/>,     label: '代理蜂群', color: '#003262' },
  { href: '/terminal',     icon: <Code size={18}/>,      label: '終端主控', color: '#003262' },
];

function GovernanceLoopMonitor() {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    setActivities([
      { type: 'ai-audit', msg: 'AI 偵測到群光 S3 供應商 RBA 憑證異常，建議發起抽樣', time: '5 分鐘前', icon: <AlertTriangle size={14}/> },
      { type: 'governance', msg: '第三方稽核員 (SGS) 已登入遠距查驗環境', time: '15 分鐘前', icon: <UserCheck size={14}/> },
      { type: 'alchemy', msg: '範疇三碳數據煉金完成，已同步至 2024 永續報告書', time: '1 小時前', icon: <Sparkles size={14}/> },
    ]);
  }, []);

  return (
    <Card className="h-full overflow-hidden flex flex-col bg-slate-900 text-white border-none shadow-2xl">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
        <div>
          <h4 className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em]">Chicony Governance Loop</h4>
          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-0.5">Real-time AI Governance</p>
        </div>
        <RefreshCw size={14} className="text-blue-400 animate-spin-slow" />
      </div>
      <div className="flex-1 p-4 space-y-3">
        {activities.map((a, i) => (
          <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/10 flex gap-4 hover:bg-white/10 transition-all cursor-default group">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform", a.type === 'ai-audit' ? 'bg-red-50/20 text-red-400' : 'bg-blue-500/20 text-blue-400')}>
              {a.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-blue-100 leading-snug">{a.msg}</p>
              <p className="text-[9px] text-white/30 font-bold uppercase mt-1">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function DashboardContent() {
  const [now, setNow] = useState(new Date());
  const [trustScore, setTrustScore] = useState(90);
  const { stats, loading: statsLoading } = useDashboardStats();

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div 
      className="page-container space-y-10 lg:space-y-14 pb-24 relative z-10"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#003262]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FDB515]/5 rounded-full blur-[120px]" />
      </div>

      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 relative z-10">
        <motion.div variants={fadeIn} className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
             <Badge variant="verified" className="bg-[#FDB515] text-[#003262] border-none font-black tracking-widest px-4">CHICONY_EDITION</Badge>
             <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/60 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">AI Audit Core Live</span>
             </div>
             <div className="flex items-center gap-2 bg-[#003262] px-3 py-1 rounded-full text-white shadow-lg shadow-[#003262]/20">
                <ShieldCheck size={14} className="text-[#FDB515]" />
                <span className="text-[9px] font-black uppercase tracking-widest">Trust: {trustScore}</span>
             </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-6xl font-bold text-[#003262] tracking-tighter leading-none uppercase">群光電子治理主控台</h1>

            <p className="text-slate-500 text-lg lg:text-xl max-w-2xl font-medium leading-relaxed">
               AI+OCR 永續數據稽核 · RBA v8.0 供應鏈合規 · <span className="text-[#009E9D] font-bold italic underline decoration-wavy underline-offset-4">5T 誠信協議專版</span>
            </p>
          </div>
        </motion.div>
        <motion.div variants={fadeIn} className="flex items-stretch gap-4 min-w-[360px]">
          <div className="flex-1 px-6 py-4 bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm flex flex-col justify-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Global Real-time Sync</p>
            <p className="text-xl font-bold text-[#003262] font-mono leading-none tracking-tight">{now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <Button variant="primary" size="lg" className="h-full px-10 rounded-[28px] shadow-2xl shadow-[#003262]/20 gap-3 group">
            <Sparkles size={20} className="text-[#FDB515] group-hover:rotate-12 transition-transform" />
            <span className="font-bold tracking-tight text-base">啟動 AI 治理</span>
          </Button>
        </motion.div>
      </header>

      <motion.div variants={fadeIn} className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {KPIS.map((k, idx) => (
          <motion.div key={k.key} variants={slideIn} custom={idx}>
            <Card className="p-8 space-y-6 bg-white/60 backdrop-blur-md border-white/60 group hover:bg-white transition-all">
              <div className="flex items-center justify-between">
                 <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#003262] group-hover:scale-110 transition-transform shadow-inner">
                    {k.icon}
                 </div>
                 <Badge variant="verified" className="bg-emerald-50 text-emerald-600 border-emerald-100">{k.trend}</Badge>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{k.label}</p>
                 <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[#003262] tracking-tighter" style={{ color: k.color }}>{k.value}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{k.unit}</span>
                 </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-12 gap-8 lg:gap-12">
        <div className="col-span-12 lg:col-span-8">
          <Card hoverEffect className="h-full overflow-hidden bg-white/60 backdrop-blur-md border-white/60">
            <div className="p-8 lg:p-12 border-b border-slate-100/60 flex items-center justify-between">
               <div>
                  <h3 className="text-2xl font-bold text-[#003262] tracking-tight">群光全球排放與治理軌跡</h3>
                  <p className="text-sm text-slate-400 font-medium mt-1 uppercase tracking-widest">SBTi 1.5°C Strategy Alignment</p>
               </div>
               <Badge variant="verified">REAL_TIME_NODE_SYNC</Badge>
            </div>
            <div className="p-8 lg:p-12">
               <div className="h-[300px] lg:h-[420px] relative">
                  <EnvironmentalTrajectory title="" />
               </div>
               <div className="mt-10 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-start gap-6 group hover:bg-blue-50 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-[#003262] flex items-center justify-center text-white shrink-0 shadow-xl shadow-[#003262]/20">
                     <Brain size={24} />
                  </div>
                  <div className="space-y-1">
                     <p className="text-xs text-[#003262] font-black leading-tight uppercase tracking-[0.2em]">Chicony AI Insights</p>
                     <p className="text-base text-slate-600 leading-relaxed font-medium">
                        AI 模型分析顯示，供應鏈範疇三數據辨識度提升 <span className="text-[#009E9D] font-bold">24%</span>。目前偵測到 2 筆高風險 RBA 異常，已自動排入「人工複核隊列」。
                     </p>

                  </div>
               </div>
            </div>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          <GovernanceLoopMonitor />
          <AIRiskAlerter />
          <IntegrityTrace />
          <DataAlchemyWidget />
        </div>
      </div>

      <section className="space-y-10">
         <div className="flex items-center gap-6 px-2">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.5em] whitespace-nowrap">Governance Command Center</h3>
            <div className="flex-1 h-px bg-slate-200/60" />
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {QUICK_ACTIONS.map((a, idx) => (
              <motion.div key={a.href} variants={slideIn} custom={idx}>
                <Link href={a.href} className="group block h-full">
                  <Card hoverEffect className="p-6 text-center bg-white/60 backdrop-blur-md border-white/60 rounded-[32px] h-full transition-all group-hover:scale-[1.05] group-hover:bg-white">
                    <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 transition-all duration-500 group-hover:rotate-12 shadow-lg group-hover:shadow-xl" style={{ backgroundColor: `${a.color}10`, color: a.color }}>
                      {a.icon}
                    </div>
                    <p className="text-xs font-bold text-[#003262] tracking-tight">{a.label}</p>
                  </Card>
                </Link>
              </motion.div>
            ))}
         </div>
      </section>
    </motion.div>
  );
}
