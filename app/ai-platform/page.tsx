'use client';
import { useState, useEffect } from 'react';
import { 
  Sparkles, Search, ShieldCheck, MessageSquare, TrendingUp, Cpu, Code, Brain, ChevronRight, Zap, BarChart2, FileText, Globe, Activity, Server, Radio, ArrowUpRight, Database, Bot 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandBadge, BrandButton, BrandCard, BrandStatusDot, BrandProgress } from '../../components/brand';

const AI_APPS = [
  { id: 'greenwash', title: '綠漂風險掌控', icon: ShieldCheck, desc: '掃描文本中的誇大或不實永續聲明。', color: '#10B981', tag: 'GRI T2' },
  { id: 'gri-gen', title: 'GRI 自動織稿', icon: Code, desc: '自動生成符合 GRI 2021 標準的草稿。', color: '#003262', tag: 'SustainWrite' },
  { id: 'predictor', title: '碳排放預測', icon: TrendingUp, desc: '預測未來 12 個月的排放趨勢。', color: '#FDB515', tag: 'E-Hub' },
];

function ComputingRipple() {
  return (
    <div className="relative w-full h-full min-h-[300px] bg-[#003262] rounded-[40px] overflow-hidden flex items-center justify-center shadow-2xl">
      {[1, 2, 3].map((i) => (
        <motion.div key={i} className="absolute border border-blue-400/20 rounded-full" initial={{ width: 0, height: 0, opacity: 0.6 }} animate={{ width: 500, height: 500, opacity: 0 }} transition={{ duration: 4, repeat: Infinity, delay: i * 1.3 }} />
      ))}
      <div className="relative z-10 text-center space-y-4">
        <Globe size={40} className="text-blue-200 mx-auto animate-pulse" />
        <p className="text-[11px] font-black text-blue-200/50 uppercase tracking-[0.4em]">BlueCC Orchestration</p>
        <BrandStatusDot status="active" pulse size="sm" />
      </div>
    </div>
  );
}

const LOGS = [
  { time: '20:42:11', op: 'GREENWASH_SCAN', detail: '已掃描文本 "ESG永續發展承諾書"，無潛在綠漂風險。', node: 'Cloud_H100' },
  { time: '20:42:05', op: 'GRI_DRAFT_GEN', detail: '已自動生成 GRI 2-7 組織實體員工結構數據分析草案。', node: 'Local_Edge' },
  { time: '20:41:59', op: 'T5_ZKP_SEAL', detail: '已對 2026-Q1 碳足跡計算結果進行 ZKP 加密存證與 T5 封印。', node: 'Cloud_H100' },
  { time: '20:41:43', op: 'EMISSION_FORECAST', detail: '排放量預測模型更新，平均誤差率降低至 1.4%。', node: 'Local_Edge' }
];

export default function AIPlatformPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [perf, setPerf] = useState({ tflops: 42.5, tps: 184 });

  useEffect(() => {
    const t = setInterval(() => setPerf(p => ({ tflops: +(p.tflops + Math.random() - 0.5).toFixed(1), tps: Math.floor(p.tps + Math.random() * 10 - 5) })), 2000);
    return () => clearInterval(t);
  }, []);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: query, type: 'query' }) });
      const data = await res.json();
      setResult(data.content || 'AI 回應生成完畢');
    } catch { setResult('連線失敗'); }
    setLoading(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto p-8 lg:p-12 space-y-12 pb-24 fade-in">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <BrandBadge variant="gold" size="sm" className="font-black tracking-widest px-4 mb-4">COMPUTING_FABRIC v8.5</BrandBadge>
          <h1 className="text-5xl font-black text-[#003262] tracking-tighter uppercase">AI 整合平台</h1>
          <p className="text-slate-400 text-lg mt-2 font-medium">基於 BlueCC 協議的全域算力調度中心</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-4 bg-white/80 backdrop-blur-xl rounded-[24px] border border-white shadow-premium min-w-[140px]">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Load</p>
            <div className="flex items-baseline gap-1.5"><span className="text-2xl font-black text-[#003262] font-mono">{perf.tflops}</span><span className="text-[9px] font-black text-slate-300">TFLOPS</span></div>
          </div>
          <div className="px-6 py-4 bg-white/80 backdrop-blur-xl rounded-[24px] border border-white shadow-premium min-w-[140px]">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Inference</p>
            <div className="flex items-baseline gap-1.5"><span className="text-2xl font-black text-[#003262] font-mono">{perf.tps}</span><span className="text-[9px] font-black text-slate-300">TOK/S</span></div>
          </div>
        </div>
      </header>

      <section className="glass-panel rounded-[40px] p-10 shadow-extreme relative overflow-hidden">
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-4"><Search className="text-[#003262]" size={32} /><h2 className="text-2xl font-black text-[#003262] uppercase tracking-tight">Omni-Intelligence 搜尋</h2></div>
          <div className="relative">
            <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAsk()} placeholder="輸入指令或查詢..." className="w-full h-20 bg-white rounded-[24px] border border-slate-100 px-8 pr-44 text-lg font-bold text-[#003262] outline-none" />
            <div className="absolute right-3 top-3 bottom-3"><BrandButton variant="primary" className="h-full px-8 rounded-2xl font-black" onClick={handleAsk} loading={loading}>啟動 AI</BrandButton></div>
          </div>
          <AnimatePresence>{result && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 bg-slate-50/50 rounded-[32px] border border-white text-slate-700 italic">{result}</motion.div>}</AnimatePresence>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-4"><ComputingRipple /></div>
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <BrandCard padding="lg" className="bg-white/80 group rounded-[32px] border-none shadow-premium">
            <div className="flex items-center gap-4 mb-6"><Database className="text-[#003262]" size={20} /><h3 className="text-sm font-black text-[#003262] uppercase tracking-widest">主權知識庫</h3></div>
            <div className="space-y-3">{['GRI 2021 全庫', '5T 審計歷史'].map(i => <div key={i} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center"><span className="text-xs font-bold">{i}</span><BrandBadge variant="success" size="xs">SYNCED</BrandBadge></div>)}</div>
          </BrandCard>
          <BrandCard padding="lg" className="bg-white/80 group rounded-[32px] border-none shadow-premium">
            <div className="flex items-center gap-4 mb-6"><Server className="text-[#8B5CF6]" size={20} /><h3 className="text-sm font-black text-[#003262] uppercase tracking-widest">節點分配</h3></div>
            <div className="space-y-4">{[{ id: 'Cloud_H100', load: 78, c: '#3B82F6' }, { id: 'Local_Edge', load: 12, c: '#10B981' }].map(n => <div key={n.id} className="space-y-2"><div className="flex justify-between text-[10px] font-black uppercase"><span>{n.id}</span><span>{n.load}%</span></div><div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full" style={{ width: `${n.load}%`, backgroundColor: n.c }} /></div></div>)}</div>
          </BrandCard>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {AI_APPS.map(app => (
          <BrandCard key={app.id} padding="lg" className="bg-white/80 hover:bg-white hover:-translate-y-2 transition-all duration-500 rounded-[32px] border-none shadow-premium">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${app.color}10`, color: app.color }}><app.icon size={24} /></div>
            <h4 className="text-lg font-black text-[#003262] mb-2">{app.title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">{app.desc}</p>
            <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest">Launch <ArrowUpRight size={12} /></div>
          </BrandCard>
        ))}
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between px-4">
           <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2">
              <Bot size={12} className="text-[#003262]" /> ADK Framework Readiness
           </h4>
           <BrandBadge variant="outline" size="xs" className="border-slate-200 text-slate-400">Production_Candidate_v1</BrandBadge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[
             { label: '核心調度器 (Orchestrator)', val: 100, status: 'READY', desc: '任務分派、授權守門員與狀態機。' },
             { label: '技能註冊庫 (Skill Registry)', val: 100, status: 'READY', desc: '8 項核心 ESG 專家技能已上線。' },
             { label: '5T 誠信協議整合', val: 100, status: 'READY', desc: 'SHA-256 自動封印與 RAG 閉環。' },
             { label: '自癒自律機制 (Swarm)', val: 100, status: 'STABLE', desc: '跨 Agent 任務自主交接與狀態鏈路已完成。' },
             { label: 'LLM 串接核心 (Genkit)', val: 100, status: 'READY', desc: 'Gemini 2.0 介面已優化，具備 Context 壓縮能力。' },
             { label: '整體框架成熟度', val: 100, status: 'PRODUCTION', desc: '全域 Agent 協作標準化框架正式進入生產級。' },
           ].map((m, i) => (
             <BrandCard key={i} padding="lg" className="glass-panel border-none shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                   <h5 className="text-xs font-black text-[#003262] uppercase tracking-tight">{m.label}</h5>
                   <span className={`text-[9px] font-black px-2 py-0.5 rounded ${m.val === 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>{m.status}</span>
                </div>
                <div className="flex items-end justify-between mb-2">
                   <span className="text-2xl font-black text-[#003262] font-mono leading-none">{m.val}%</span>
                </div>
                <BrandProgress value={m.val} size="xs" color={m.val === 100 ? 'green' : 'blue'} animated={m.val < 100} className="mb-4" />
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{m.desc}</p>
             </BrandCard>
           ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between px-4">
           <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2">
              <Zap size={12} className="text-[#FDB515]" /> Live Swarm Collaboration Graph
           </h4>
        </div>
        <div className="bg-white/50 backdrop-blur-xl border border-white rounded-[40px] p-12 min-h-[400px] relative overflow-hidden flex items-center justify-center shadow-premium">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003262 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
           
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 lg:gap-24">
              <div className="w-48 text-center space-y-4">
                 <div className="w-24 h-24 rounded-[32px] bg-[#003262] mx-auto flex items-center justify-center shadow-xl relative">
                    <ShieldCheck size={40} className="text-[#FDB515]" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center text-white text-[10px] font-black">100</div>
                 </div>
                 <div>
                    <p className="text-xs font-black text-[#003262] uppercase tracking-widest">Compliance_Guard</p>
                    <p className="text-[9px] text-slate-400 font-bold">DETECTING GAPS</p>
                 </div>
              </div>

              <div className="hidden md:block w-32 h-px bg-gradient-to-r from-[#003262] to-[#FDB515] relative">
                 <motion.div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#FDB515]" animate={{ left: ['0%', '100%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
                 <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-[#003262] uppercase bg-white px-2 rounded-full border border-slate-100 shadow-sm">Autonomous_Handoff</div>
              </div>

              <div className="w-48 text-center space-y-4 opacity-60">
                 <div className="w-24 h-24 rounded-[32px] bg-white border border-slate-100 mx-auto flex items-center justify-center shadow-lg">
                    <Leaf size={40} className="text-slate-300" />
                 </div>
                 <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Carbon_Expert</p>
                    <p className="text-[9px] text-slate-300 font-bold">WAITING_FOR_DATA</p>
                 </div>
              </div>
           </div>
           
           <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-2 bg-[#003262]/5 border border-[#003262]/10 rounded-full">
              <BrandStatusDot status="active" size="sm" />
              <span className="text-[10px] font-black text-[#003262] uppercase tracking-[0.2em]">Swarm Protocol: Active Connection</span>
           </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="bg-[#0f172a] rounded-[32px] border border-slate-800 shadow-2xl overflow-hidden p-8 lg:p-12 relative">
           <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
           <div className="space-y-5 relative z-10">
              {LOGS.map((l, i) => (
                <div key={i} className="flex items-center gap-6 text-[12px] font-mono border-b border-slate-800/50 pb-5 last:border-0 last:pb-0 group">
                  <span className="text-slate-600 flex-shrink-0">[{l.time}]</span>
                  <div className="w-40 text-blue-400 font-black flex-shrink-0 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                     {l.op}
                  </div>
                  <span className="text-slate-400 flex-1">{l.detail}</span>
                  <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg text-slate-500 text-[10px]">
                     <Server size={10} /> {l.node}
                  </div>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
}
