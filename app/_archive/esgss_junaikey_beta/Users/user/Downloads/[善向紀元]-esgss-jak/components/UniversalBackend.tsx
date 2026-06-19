
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { universalIntelligence, SystemVital } from '../services/evolutionEngine';
import { kernelLogs$ } from '../services/logger';
import { 
    Activity, Database, Cpu, Network, Zap, Server, BrainCircuit, MemoryStick, 
    HardDrive, Box, ShieldCheck, FileText, CheckCircle, TrendingUp, History, 
    Search, Loader2, Sparkles, AlertCircle, ArrowUpRight, Share2, Terminal, Code2, ShieldAlert,
    FastForward, Layers, Layout, Globe, Settings, Cpu as Processor, BarChart3, LineChart as LineChartIcon
} from 'lucide-react';
import { 
    ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, 
    PolarRadiusAxis, Radar, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { Language, KernelLog } from '../types';

interface UniversalBackendProps {
    language: Language;
}

const MetricCard = React.memo(({ icon, label, value, subtext, color, progress }: any) => {
  const colorMap: Record<string, string> = {
    cyan: 'text-cyan-400 border-cyan-500/20 bg-cyan-500',
    emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500',
    purple: 'text-purple-400 border-purple-500/20 bg-purple-500',
    rose: 'text-rose-400 border-red-500/20 bg-red-500',
    blue: 'text-blue-400 border-blue-500/20 bg-blue-500',
    gold: 'text-celestial-gold border-amber-500/20 bg-amber-500',
  };

  return (
    <div className={`relative overflow-hidden bg-slate-900/40 border ${colorMap[color].split(' ')[1]} p-6 rounded-2xl hover:bg-slate-800/40 transition-all duration-500 group shadow-lg`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg bg-slate-950 ${colorMap[color].split(' ')[0]}`}>
          {icon}
        </div>
        <span className="text-xs font-black uppercase text-slate-500 tracking-widest">{label}</span>
      </div>
      <div className="text-3xl font-black text-white mb-1 font-mono tracking-tighter">{value}</div>
      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{subtext}</div>
      {progress !== undefined && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-800">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${colorMap[color].split(' ')[2]}`} 
            style={{ width: `${progress}%` }} 
          />
        </div>
      )}
    </div>
  );
});

const UniversalBackend: React.FC<UniversalBackendProps> = ({ language }) => {
  const [vitals, setVitals] = useState<SystemVital | null>(null);
  const [vitalsHistory, setVitalsHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'monitor' | 'ragflow' | 'registry'>('monitor');
  const [kLogs, setKLogs] = useState<KernelLog[]>([]);
  const isZh = language === 'zh-TW';
  const reflexEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sub1 = universalIntelligence.vitals$.subscribe(v => {
        setVitals(v);
        setVitalsHistory(prev => {
            const next = [...prev, {
                time: new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
                cpu: Math.min(100, v.contextLoad * 5 + (Math.random() * 5)),
                mem: Math.min(100, (v.integrityScore * 0.8) + (Math.random() * 10)),
                load: v.activeThreads * 10
            }];
            return next.slice(-20);
        });
    });
    
    const subKLogs = kernelLogs$.subscribe(setKLogs);
    
    return () => { sub1.unsubscribe(); subKLogs.unsubscribe(); };
  }, []);

  useEffect(() => {
      reflexEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [kLogs]);

  const radarData = useMemo(() => {
    if (!vitals) return [];
    return [
        { subject: isZh ? '完整性' : 'Integrity', A: vitals.integrityScore, fullMark: 100 },
        { subject: isZh ? '負熵值' : 'Neg-Entropy', A: (1 - vitals.entropy) * 100, fullMark: 100 },
        { subject: isZh ? '感知力' : 'Perception', A: vitals.trinity.perception, fullMark: 100 },
        { subject: isZh ? '認知力' : 'Cognition', A: vitals.trinity.cognition, fullMark: 100 },
        { subject: isZh ? '行動力' : 'Action', A: vitals.trinity.action, fullMark: 100 },
    ];
  }, [vitals, isZh]);

  const pageData = {
      title: { zh: 'AIOS 萬能核心中樞', en: 'AIOS Nexus Core' },
      desc: { zh: '系統健康矩陣：內核參數監控與 Docker 組件狀態', en: 'System Health Matrix: Kernel Vitals & Docker Service Monitor' },
      tag: { zh: '核心版本 v16.1', en: 'KERNEL_V16.1' }
  };

  if (!vitals) return <div className="flex h-screen items-center justify-center text-cyan-500 font-mono animate-pulse">AIOS Kernel Handshaking...</div>;

  return (
    <div className="relative w-full min-h-screen bg-[#020617] overflow-hidden font-mono text-cyan-400 selection:bg-cyan-500/30 flex flex-col">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className="px-8 pt-8 shrink-0 z-10">
          <UniversalPageHeader icon={BrainCircuit} title={pageData.title} description={pageData.desc} language={language} tag={pageData.tag} />
      </div>

      <div className="flex gap-4 border-b border-white/10 px-8 py-4 z-10 shrink-0">
          {[
              { id: 'monitor', label: isZh ? '全域監控' : 'Monitor', icon: Activity },
              { id: 'ragflow', label: isZh ? 'RAG 參數' : 'RAG Params', icon: Database },
              { id: 'registry', label: isZh ? '組件狀態' : 'Registry', icon: HardDrive }
          ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)} 
                className={`px-4 py-2 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${activeTab === tab.id ? 'text-celestial-gold border-celestial-gold' : 'text-gray-500 border-transparent hover:text-white'}`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
          ))}
      </div>

      <div className="flex-1 overflow-y-auto p-8 relative z-10 no-scrollbar">
        {activeTab === 'monitor' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <MetricCard icon={<Processor className="w-5 h-5" />} label={isZh ? "量子同步率" : "Neural Sync"} value={`${vitals.integrityScore.toFixed(1)}%`} subtext={isZh ? "跨模態一致性" : "Consistency"} color="cyan" progress={vitals.integrityScore} />
                    <MetricCard icon={<TrendingUp className="w-5 h-5" />} label={isZh ? "系統熵值" : "Kernel Entropy"} value={vitals.entropy.toFixed(4)} subtext={isZh ? "負熵優化中" : "Optimizing Entropy"} color="purple" progress={vitals.entropy * 100} />
                    <MetricCard icon={<Zap className="w-5 h-5" />} label={isZh ? "響應延遲" : "Latency"} value="12ms" subtext={isZh ? "核心神經傳導" : "Reflex Delay"} color="emerald" progress={12} />
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-slate-900/60 shadow-2xl h-full flex flex-col relative overflow-hidden min-h-[400px]">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none"><Activity className="w-40 h-40" /></div>
                        <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3 relative z-10">
                            <BarChart3 className="w-4 h-4" /> SYSTEM_VITAL_RADAR
                        </h3>
                        
                        <div className="flex-1 min-h-[250px] w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar 
                                        name="Kernel Health" 
                                        dataKey="A" 
                                        stroke="#06b6d4" 
                                        fill="#06b6d4" 
                                        fillOpacity={0.4} 
                                        animationBegin={0} 
                                        animationDuration={1500} 
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '10px' }}
                                        itemStyle={{ color: '#06b6d4' }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="glass-panel p-6 rounded-[2.5rem] border border-white/10 bg-slate-900/40 shadow-2xl h-[300px] relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2"><LineChartIcon className="w-4 h-4 text-celestial-gold" /> Temporal Load Pulse</h3>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-1.5 text-[8px] font-black uppercase text-cyan-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> CPU
                                </div>
                                <div className="flex items-center gap-1.5 text-[8px] font-black uppercase text-celestial-gold">
                                    <div className="w-1.5 h-1.5 rounded-full bg-celestial-gold" /> MEM
                                </div>
                            </div>
                        </div>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <LineChart data={vitalsHistory}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="time" hide />
                                    <YAxis domain={[0, 100]} hide />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                                    />
                                    <Line type="monotone" dataKey="cpu" stroke="#06b6d4" strokeWidth={2} dot={false} isAnimationActive={false} />
                                    <Line type="monotone" dataKey="mem" stroke="#fbbf24" strokeWidth={2} dot={false} isAnimationActive={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-[2.5rem] border border-white/10 bg-black/60 flex flex-col h-[300px] overflow-hidden shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2"><Share2 className="w-4 h-4" /> Kernel Trace (Live)</h3>
                            <div className="text-[10px] text-emerald-500 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE_PULSE</div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2 font-mono text-[10px]">
                            {kLogs.map((log) => (
                                <div key={log.id} className="p-2 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col gap-1 hover:bg-white/[0.05] transition-all">
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-2">
                                            <span className="text-gray-700">[{new Date(log.timestamp).toLocaleTimeString([], {hour12: false})}]</span>
                                            <span className={`font-black uppercase shrink-0 ${log.level === 'SUCCESS' ? 'text-emerald-400' : log.level === 'ERROR' ? 'text-rose-400' : log.level === 'WARNING' ? 'text-amber-400' : 'text-cyan-400'}`}>{log.level}</span>
                                            <span className="text-gray-500">@{log.source}</span>
                                        </div>
                                        <span className="text-white font-bold">{log.operation}</span>
                                    </div>
                                    <div className="text-gray-600 truncate opacity-60">
                                        {JSON.stringify(log.metadata)}
                                    </div>
                                </div>
                            ))}
                            <div ref={reflexEndRef} />
                        </div>
                    </div>
                </div>
            </div>
        )}
        {/* ... rest of the file stays the same */}
      </div>
    </div>
  );
};

export default UniversalBackend;
