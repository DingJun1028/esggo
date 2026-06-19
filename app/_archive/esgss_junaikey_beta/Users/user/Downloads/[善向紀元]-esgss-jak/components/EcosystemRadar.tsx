
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    Globe, Radio, Activity, Target, Zap, ShieldCheck, 
    ArrowRight, Loader2, Sparkles, TrendingUp, Info, Search,
    Scan, Layout, Box, Award, Compass, RefreshCw, Layers,
    Eye, Terminal, ChevronRight, Gauge
} from 'lucide-react';
import { Language, BenchmarkingNode, OptimizationPath } from '../types';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useToast } from '../contexts/ToastContext';
import { runMcpAction } from '../services/ai-service';
import { useCompany } from './providers/CompanyProvider';

export const EcosystemRadar: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { companyName } = useCompany();
  
  const [isScanning, setIsScanning] = useState(false);
  const [activeIndustry, setActiveIndustry] = useState('Technology');
  const [radarNodes, setRadarNodes] = useState<BenchmarkingNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<BenchmarkingNode | null>(null);
  const [evolutionPath, setEvolutionPath] = useState<OptimizationPath | null>(null);
  const [scanPulse, setScanPulse] = useState(0);

  // Generate mock nodes
  useEffect(() => {
      const nodes: BenchmarkingNode[] = Array.from({ length: 15 }).map((_, i) => ({
          id: `node-${i}`,
          distance: 0.3 + Math.random() * 0.6,
          angle: Math.random() * 360,
          efficiency: 60 + Math.random() * 35,
          compliance: 70 + Math.random() * 25,
          isTarget: Math.random() > 0.8,
          industry: 'Technology'
      }));
      setRadarNodes(nodes);

      const timer = setInterval(() => setScanPulse(p => (p + 1) % 100), 100);
      return () => clearInterval(timer);
  }, []);

  const handleRunBenchmarking = async () => {
    setIsScanning(true);
    setEvolutionPath(null);
    addToast('info', isZh ? '正在分析產業集體共鳴...' : 'Analyzing industry collective resonance...', 'Collective Engine');
    
    try {
        const res = await runMcpAction('perform_collective_benchmarking', {
            currentTenant: { name: companyName, efficiency: 78, compliance: 85 },
            industryNodes: radarNodes.map(n => ({ id: n.id, eff: n.efficiency, comp: n.compliance }))
        }, language);

        if (res.success) {
            setEvolutionPath(res.result.roadmap);
            addToast('success', isZh ? '進化路徑已顯化' : 'Evolution path manifested', 'System');
        }
    } catch (e) {
        addToast('error', 'Collective reasoning sequence interrupted.', 'Error');
    } finally {
        setIsScanning(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in overflow-hidden">
        <UniversalPageHeader 
            icon={Globe}
            title={{ zh: '全球生態對標雷達', en: 'Global Ecosystem Radar' }}
            description={{ zh: '跨企業群體智慧：識別標竿「成功基因」並自動化最優演化路徑', en: 'Collective Intelligence: Benchmarking & Evolutionary Pathfinding.' }}
            language={language}
            tag={{ zh: '群體內核 v1.0', en: 'COLLECTIVE_v1.0' }}
        />

        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 overflow-hidden">
            
            {/* 1. 生態雷達主體 (8/12) */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 min-h-0">
                <div className="flex-1 glass-bento bg-slate-950 border-emerald-500/20 rounded-[3rem] relative overflow-hidden flex flex-col shadow-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.03)_0%,transparent_80%)] pointer-events-none" />
                    
                    {/* Radar Canvas Simulation */}
                    <div className="flex-1 relative flex items-center justify-center p-20">
                        {/* Circular Grids */}
                        {[0.2, 0.4, 0.6, 0.8, 1.0].map(r => (
                            <div key={r} className="absolute rounded-full border border-white/5" style={{ width: `${r * 100}%`, height: `${r * 100}%` }} />
                        ))}
                        {/* Radar Sweep */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-500/5 to-transparent animate-[spin_10s_linear_infinite]" style={{ transformOrigin: 'center center' }} />
                        
                        {/* Nodes */}
                        {radarNodes.map(node => (
                            <div 
                                key={node.id}
                                onClick={() => setSelectedNode(node)}
                                className={`absolute w-3 h-3 rounded-full cursor-pointer transition-all duration-700
                                    ${node.isTarget ? 'bg-celestial-gold shadow-[0_0_15px_#fbbf24] animate-pulse scale-150' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'}
                                    ${selectedNode?.id === node.id ? 'ring-4 ring-white scale-150 z-20' : 'hover:scale-125'}
                                `}
                                style={{
                                    left: `${50 + Math.cos(node.angle * Math.PI / 180) * node.distance * 40}%`,
                                    top: `${50 + Math.sin(node.angle * Math.PI / 180) * node.distance * 40}%`
                                }}
                            />
                        ))}

                        {/* Central Node (Current Company) */}
                        <div className="relative z-10 w-16 h-16 rounded-3xl bg-white text-black flex items-center justify-center shadow-2xl border-4 border-emerald-500 animate-prism-pulse">
                            <Box className="w-8 h-8" />
                            <div className="absolute -bottom-8 whitespace-nowrap text-[9px] font-black text-white uppercase tracking-widest">{companyName} (ORIGIN)</div>
                        </div>
                    </div>

                    {/* HUD Controls */}
                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
                        <div className="p-5 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl pointer-events-auto space-y-4">
                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Industry_Focus</div>
                            <div className="flex gap-2">
                                {['Technology', 'Manufacturing', 'Finance'].map(ind => (
                                    <button 
                                        key={ind} 
                                        onClick={() => setActiveIndustry(ind)}
                                        className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${activeIndustry === ind ? 'bg-white text-black' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                                    >
                                        {ind}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button 
                            onClick={handleRunBenchmarking}
                            disabled={isScanning}
                            className="p-8 bg-emerald-500 text-black font-black rounded-[2.5rem] shadow-2xl hover:scale-105 active:scale-95 transition-all pointer-events-auto uppercase tracking-[0.3em] text-[11px] flex flex-col items-center gap-2 group"
                        >
                            {isScanning ? <Loader2 className="w-6 h-6 animate-spin"/> : <Scan className="w-6 h-6 group-hover:animate-pulse" />}
                            <span>INITIATE_COLLECTIVE_REASONING</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. 進化路徑與細節 (4/12) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-hidden">
                <div className="glass-bento p-8 bg-slate-950 border-white/10 rounded-[3rem] shadow-2xl shrink-0 flex flex-col relative overflow-hidden h-[350px]">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03]"><Target className="w-48 h-48 text-white" /></div>
                    <h4 className="zh-main text-lg text-white mb-6 relative z-10 flex items-center gap-3">
                        <Award className="w-5 h-5 text-celestial-gold" /> 進化標竿細節
                    </h4>
                    
                    {selectedNode ? (
                        <div className="space-y-6 relative z-10 animate-fade-in">
                            <div className="p-5 bg-white/5 rounded-3xl border border-white/10">
                                <div className="text-[10px] text-gray-500 uppercase font-black mb-4">Node_Genetic_Profile</div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div><div className="text-[9px] text-gray-600 mb-1 uppercase">Reduction_Eff</div><div className="text-2xl font-mono font-bold text-emerald-400">{selectedNode.efficiency.toFixed(1)}%</div></div>
                                    <div><div className="text-[9px] text-gray-600 mb-1 uppercase">Compliance_Sync</div><div className="text-2xl font-mono font-bold text-celestial-blue">{selectedNode.compliance.toFixed(1)}%</div></div>
                                </div>
                            </div>
                            <div className="p-5 bg-celestial-gold/10 border border-celestial-gold/30 rounded-3xl flex items-center gap-4">
                                <Sparkles className="w-6 h-6 text-celestial-gold animate-pulse" />
                                <div className="text-[11px] text-gray-200 leading-relaxed italic">"偵測到優質減碳基因：節能設備 ROI 高出平均 18%。建議執行數據摺疊分析。"</div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-10 text-center py-10">
                            <ChevronRight className="w-12 h-12 mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Select Node for Analysis</p>
                        </div>
                    )}
                </div>

                <div className="glass-bento p-8 flex-1 bg-slate-900/60 border-white/5 rounded-[3rem] shadow-xl flex flex-col min-h-0 overflow-hidden relative">
                    <div className="flex justify-between items-center mb-6 shrink-0">
                         <h4 className="zh-main text-[11px] text-emerald-400 uppercase tracking-[0.3em] flex items-center gap-3"><Compass className="w-4 h-4" /> EVOLUTION_NAVIGATOR</h4>
                         <div className="uni-mini bg-emerald-500/10 text-emerald-400 border-none px-2 !text-[7px]">ROI_MODE</div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-2">
                        {evolutionPath ? (
                            <div className="space-y-4 animate-slide-up">
                                {evolutionPath.steps.map((step, i) => (
                                    <div key={i} className="p-5 bg-black/40 border border-white/5 rounded-2xl flex justify-between items-center group hover:border-emerald-500/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-gray-500 group-hover:text-emerald-400 transition-colors">0{i+1}</div>
                                            <div>
                                                <div className="text-xs font-bold text-white mb-0.5">{step.title}</div>
                                                <div className="text-[9px] text-gray-600 uppercase">Est_ROI: <span className="text-emerald-400">{step.roi}x</span></div>
                                            </div>
                                        </div>
                                        <div className={`text-[8px] font-black px-2 py-0.5 rounded border ${step.difficulty === 'HIGH' ? 'text-rose-400 border-rose-500/30' : 'text-emerald-400 border-emerald-500/30'}`}>
                                            {step.difficulty}
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-4 border-t border-white/5 flex justify-between items-center px-2">
                                    <div className="text-[9px] font-black text-gray-500 uppercase">Projected_SROI</div>
                                    <div className="text-xl font-mono font-bold text-white">1:{evolutionPath.projectedSroi.toFixed(2)}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-10 text-center py-20 grayscale">
                                <RefreshCw className="w-20 h-20 mb-6" />
                                <p className="zh-main text-lg uppercase tracking-widest">Awaiting Golden Path</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
