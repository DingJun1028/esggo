'use client';
import { useState, useEffect } from 'react';
import { 
  Sparkles, Search, ShieldCheck, MessageSquare, TrendingUp, 
  Cpu, Code, Brain, ChevronRight, Zap, BarChart2, FileText, 
  Globe, Activity, Server, Radio, ArrowUpRight, Database, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandBadge, BrandButton, BrandCard, BrandStatusDot } from '../../components/brand';

const AI_APPS = [
  { id: 'greenwash', title: '綠漂風險掌控', icon: ShieldCheck, desc: '掃描文本中的誇大或不實永續聲明，提供修正建議。', color: '#10B981', tag: 'GRI T2' },
  { id: 'gri-gen', title: 'GRI 自動織稿', icon: Code, desc: '根據數據自動生成符合 GRI 2021 標準的章節草稿。', color: '#003262', tag: 'SustainWrite' },
  { id: 'sentiment', title: '利害關係人輿情', icon: MessageSquare, desc: '分析社群與新聞，評估企業 ESG 聲譽。', color: '#8B5CF6', tag: 'S-Hub' },
  { id: 'predictor', title: '碳排放預測', icon: TrendingUp, desc: '基於歷史數據，預測未來 12 個月的排放趨勢。', color: '#FDB515', tag: 'E-Hub' },
  { id: 'compliance', title: '合規差距分析', icon: BarChart2, desc: '對照 GRI/SASB/TCFD 自動識別揭露缺口。', color: '#3B7EA1', tag: 'Compliance' },
  { id: 'summary', title: '報告摘要生成', icon: FileText, desc: '一鍵生成執行摘要，適合董事會或投資者閱讀。', color: '#EA580C', tag: 'Publish' },
];

const LOGS = [
  { time: '14:32:18', op: 'GREENWASH_SCAN', detail: '分析 GRI 2-23 政策聲明，偵測到 2 項潛在風險。', node: 'blue-edge-04' },
  { time: '14:31:55', op: 'GRI_GEN', detail: '為 GRI 302-1 章節生成 1,200 字草稿完成。', node: 'cloud-h100-alpha' },
  { time: '14:30:40', op: 'CARBON_FORECAST', detail: '2024 Q3 範疇一排放預測：1,180 tCO₂e。', node: 'local-audit-node' },
];

function ComputingRipple() {
  return (
    <div className="relative w-full h-full min-h-[300px] bg-[#003262] rounded-[40px] overflow-hidden flex items-center justify-center group shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-transparent" />
      
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute border border-blue-400/20 rounded-full"
          initial={{ width: 0, height: 0, opacity: 0.6 }}
          animate={{ width: 600, height: 600, opacity: 0 }}
          transition={{ duration: 5, repeat: Infinity, delay: i * 1.25, ease: "easeOut" }}
        />
      ))}
      
      <div className="relative z-10 text-center space-y-6 p-8">
        <div className="flex justify-center">
           <motion.div 
             animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
             transition={{ duration: 4, repeat: Infinity }}
             className="w-20 h-20 rounded-[24px] bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-white shadow-2xl"
           >
              <Globe size={40} className="text-blue-200" />
           </motion.div>
        </div>
        <div className="space-y-2">
           <p className="text-[11px] font-black text-blue-200/50 uppercase tracking-[0.5em]">BlueCC Orchestration</p>
           <h3 className="text-2xl font-black text-white tracking-tight">混合雲全域調度中</h3>
        </div>
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
           <BrandStatusDot status="active" pulse size="sm" />
           <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">12 High-Perf Nodes Online</span>
        </div>
      </div>

      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
    </div>
  );
}

export default function AIPlatformPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [performance, setPerformance] = useState({ tflops: 42.5, tps: 184, latency: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setPerformance(prev => ({
        tflops: +(prev.tflops + (Math.random() * 2 - 1)).toFixed(1),
        tps: Math.floor(prev.tps + (Math.random() * 10 - 5)),
        latency: Math.floor(40 + Math.random() * 15)
      }));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query, type: 'query' }),
      });
      const data = await res.json();
      setResult(data.content || data.error || '無法獲取回應');
    } catch {
      setResult('AI 服務連線失敗，請稍後重試。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-8 lg:p-14 space-y-14 pb-32 fade-in">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-12">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
             <BrandBadge variant="gold" size="sm" className="font-black tracking-[0.2em] px-5 py-1.5 rounded-full shadow-lg shadow-[#FDB515]/10">COMPUTING_FABRIC v8.5.1</BrandBadge>
             <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-5 py-1.5 rounded-full border border-white shadow-sm">
                <Cpu size={16} className="text-[#003262]" />
                <span className="text-[10px] font-black text-[#003262] uppercase tracking-[0.3em]">Omni-Orchestrator Active</span>
             </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-6xl font-black text-[#003262] tracking-tighter leading-none uppercase">
              AI 整合平台
            </h1>
            <p className="text-slate-400 text-xl max-w-3xl font-medium leading-relaxed">
              基於 **BlueCC** 混合雲協議與 **5T 誠信體系** 的全域算力調度中心。
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-stretch gap-5">
           {[
             { label: 'Cluster Load', value: performance.tflops, unit: 'TFLOPS', icon: <Activity size={12}/> },
             { label: 'Inference', value: performance.tps, unit: 'TOK/SEC', icon: <Zap size={12}/> },
             { label: 'Latency', value: performance.latency, unit: 'MS', icon: <Radio size={12}/> }
           ].map((stat, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="px-8 py-6 bg-white/80 backdrop-blur-xl rounded-[32px] border border-white shadow-premium flex flex-col justify-center min-w-[180px] group hover:scale-105 transition-all duration-500"
             >
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2 group-hover:text-[#003262] transition-colors">
                   {stat.icon} {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                   <span className="text-4xl font-black text-[#003262] font-mono tracking-tighter">{stat.value}</span>
                   <span className="text-[11px] font-black text-slate-300 uppercase">{stat.unit}</span>
                </div>
             </motion.div>
           ))}
        </div>
      </header>

      <section className="relative group">
        <div className="absolute -inset-2 bg-gradient-to-r from-[#003262]/10 via-[#FDB515]/5 to-[#003262]/10 rounded-[48px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative glass-panel rounded-[48px] border-none p-12 lg:p-16 overflow-hidden shadow-extreme">
           <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none group-hover:scale-125 transition-transform duration-[3000ms] group-hover:opacity-[0.08]">
              <Brain size={400} color="#003262" strokeWidth={0.5} />
           </div>
           
           <div className="flex flex-col lg:flex-row gap-16 relative z-10">
              <div className="flex-1 space-y-10">
                 <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-[28px] bg-[#003262] flex items-center justify-center text-white shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-700">
                       <Search size={40} />
                    </div>
                    <div>
                       <h2 className="text-4xl font-black text-[#003262] tracking-tighter uppercase">Omni-Intelligence 搜尋</h2>
                       <p className="text-slate-400 font-bold italic mt-1 tracking-wide">Cross-Reference GRI Standards, Benchmarks & 5T Records</p>
                    </div>
                 </div>
                 
                 <div className="relative">
                    <input 
                       value={query}
                       onChange={e => setQuery(e.target.value)}
                       onKeyDown={e => e.key === 'Enter' && handleAsk()}
                       placeholder="輸入指令，例如：分析本季範疇一碳排與 ISO 14064-1 的合規差異..."
                       className="w-full h-24 bg-white/50 backdrop-blur-sm rounded-[32px] border border-slate-100 px-10 pr-56 text-xl font-bold text-[#003262] shadow-inner focus:bg-white focus:ring-[20px] focus:ring-blue-500/5 transition-all outline-none"
                    />
                    <div className="absolute right-4 top-4 bottom-4">
                       <BrandButton 
                        variant="primary" 
                        className="h-full px-12 rounded-[24px] shadow-2xl shadow-[#003262]/20 font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                        onClick={handleAsk}
                        loading={loading}
                       >
                          {loading ? 'AGENT_PROCESSING...' : '啟動 AI 任務'}
                       </BrandButton>
                    </div>
                 </div>

                 <AnimatePresence>
                    {result && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="p-10 bg-slate-50/50 backdrop-blur-md rounded-[40px] border border-white shadow-inner text-slate-700 leading-relaxed font-medium italic relative overflow-hidden"
                      >
                         <div className="absolute top-0 left-0 w-1.5 h-full bg-[#FDB515]" />
                         <div className="flex items-start gap-6">
                            <Sparkles size={24} className="text-[#FDB515] mt-1 flex-shrink-0" />
                            <div className="whitespace-pre-wrap text-lg">{result}</div>
                         </div>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>
           </div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-12">
         <div className="col-span-12 lg:col-span-5 h-full min-h-[400px]">
            <ComputingRipple />
         </div>
         
         <div className="col-span-12 lg:col-span-7 flex flex-col gap-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 h-full">
               <BrandCard padding="lg" className="border-none shadow-premium bg-white/80 group rounded-[40px] hover:bg-white transition-all duration-700">
                  <div className="flex items-center gap-5 mb-8">
                     <div className="w-14 h-14 rounded-3xl bg-blue-50 flex items-center justify-center text-[#003262] group-hover:rotate-12 transition-transform duration-500 shadow-sm"><Database size={24} /></div>
                     <div>
                        <h3 className="text-base font-black text-[#003262] uppercase tracking-widest">主權知識倉庫</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Sovereign RAG Vector</p>
                     </div>
                  </div>
                  <div className="space-y-4">
                     {['GRI 2021 指標全庫', '企業內部審計歷史 (T5)', 'SBTi 1.5°C 情境數據'].map((item, idx) => (
                       <div key={idx} className="p-5 bg-slate-50/50 rounded-2xl flex items-center justify-between border border-transparent hover:border-blue-100 hover:bg-white transition-all duration-300 group/item">
                          <span className="text-sm font-bold text-slate-600 group-hover/item:text-[#003262]">{item}</span>
                          <BrandBadge variant="success" size="xs" className="px-3">SYNCED</BrandBadge>
                       </div>
                     ))}
                  </div>
               </BrandCard>

               <BrandCard padding="lg" className="border-none shadow-premium bg-white/80 group rounded-[40px] hover:bg-white transition-all duration-700">
                  <div className="flex items-center gap-5 mb-8">
                     <div className="w-14 h-14 rounded-3xl bg-purple-50 flex items-center justify-center text-[#8B5CF6] group-hover:rotate-12 transition-transform duration-500 shadow-sm"><Server size={24} /></div>
                     <div>
                        <h3 className="text-base font-black text-[#003262] uppercase tracking-widest">算力節點分配</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Elastic GPU Resource</p>
                     </div>
                  </div>
                  <div className="space-y-6">
                     {[
                       { id: 'Cloud_H100_01', type: 'NVIDIA H100', load: 78, color: '#3B82F6' },
                       { id: 'Local_Audit_V', type: 'Private Edge', load: 12, color: '#10B981' },
                       { id: 'Edge_Node_Taipei', type: 'TPU v4', load: 45, color: '#FDB515' }
                     ].map(n => (
                       <div key={n.id} className="space-y-3">
                          <div className="flex justify-between items-center text-[10px] font-black">
                             <span className="text-slate-400 uppercase tracking-widest">{n.id} <span className="opacity-40 ml-1">/ {n.type}</span></span>
                             <span className="font-mono" style={{ color: n.color }}>{n.load}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${n.load}%` }}
                               transition={{ duration: 1.5, ease: "easeOut" }}
                               className="h-full rounded-full shadow-lg" 
                               style={{ backgroundColor: n.color }} 
                             />
                          </div>
                       </div>
                     ))}
                  </div>
               </BrandCard>
            </div>
         </div>
      </div>

      <section className="space-y-10">
         <div className="flex items-center gap-6">
            <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.5em] whitespace-nowrap">Integrated AI Modules</h3>
            <div className="flex-1 h-px bg-slate-100" />
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
           {AI_APPS.map(app => (
             <button key={app.id} className="group text-left focus:outline-none focus:ring-0">
               <BrandCard padding="lg" className="h-full border-none shadow-premium bg-white/80 hover:bg-white hover:-translate-y-3 transition-all duration-500 rounded-[40px] p-8">
                 <div className="flex items-start gap-6">
                   <div 
                     className="w-16 h-16 rounded-[22px] flex items-center justify-center flex-shrink-0 transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 shadow-sm"
                     style={{ backgroundColor: `${app.color}08`, color: app.color, border: `1px solid ${app.color}15` }}
                   >
                     <app.icon size={32} />
                   </div>
                   <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <h4 className="text-xl font-black text-[#003262] tracking-tight">{app.title}</h4>
                        <BrandBadge variant="outline" size="xs" className="px-3 border-slate-200 text-slate-400 font-black tracking-widest">{app.tag}</BrandBadge>
                     </div>
                     <p className="text-sm text-slate-500 leading-relaxed font-medium">{app.desc}</p>
                     <div className="pt-2 flex items-center gap-3 text-[11px] font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-700">
                        Launch Engine <ArrowUpRight size={14} />
                     </div>
                   </div>
                 </div>
               </BrandCard>
             </button>
           ))}
         </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between px-4">
           <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.5em] flex items-center gap-3">
              <Radio size={14} className="text-red-500 animate-pulse" /> Live Execution Stream
           </h4>
           <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Protocol: 5T_SECURE_V1</span>
              <div className="h-1 w-20 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-1/3 animate-shimmer"/></div>
           </div>
        </div>
        <div className="bg-[#0f172a] rounded-[40px] border border-slate-800 shadow-3xl overflow-hidden p-10 lg:p-14 relative">
           <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
           
           <div className="space-y-6 relative z-10">
              {LOGS.map((l, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="flex items-center gap-8 text-[13px] font-mono border-b border-slate-800/50 pb-6 last:border-0 last:pb-0 group"
                >
                  <span className="text-slate-600 flex-shrink-0 font-bold">[{l.time}]</span>
                  <div className="w-48 text-blue-400 font-black flex-shrink-0 flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                     {l.op}
                  </div>
                  <span className="text-slate-400 flex-1 group-hover:text-white transition-colors">{l.detail}</span>
                  <div className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-white/5 rounded-xl text-slate-500 text-[10px] border border-white/5 group-hover:border-white/10 transition-all font-black uppercase tracking-widest">
                     <Server size={12} /> {l.node}
                  </div>
                </motion.div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
}
