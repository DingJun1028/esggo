
import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import {
    Binary, Image as ImageIcon, Video, Mic, Sparkles, Wand2, Search, MapPin,
    Loader2, Upload, Play, Download, Trash2, Maximize2, Layers,
    ArrowRight, Globe, ShieldCheck, Cpu, Volume2, Film,
    Zap, Activity, ExternalLink, BrainCircuit, Database, PenTool,
    Fingerprint, Radio, Triangle, Atom, Info, Camera, VideoOff,
    Plus, GitBranch, Terminal, Flame, Eye, Link, Workflow,
    ArrowDown, ChevronRight, Gauge, RefreshCw, Settings,
    Layout
} from 'lucide-react';
import {
    ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
    PolarRadiusAxis, Radar, Tooltip
} from 'recharts';
import { Language, UniversalKnowledgeNode } from '../types';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';
import { runMcpAction, performWebSearch, analyzeMedia, streamChat } from '../services/ai-service';
import { universalIntelligence, SystemVital } from '../services/evolutionEngine';
import { marked } from 'marked';

// Constants moved outside component to prevent recreation
const CORES = [
    { id: 'perception', name: '感知', nameEn: 'Sense', icon: Radio, color: 'text-cyan-400' },
    { id: 'cognition', name: '認知', nameEn: 'Think', icon: BrainCircuit, color: 'text-amber-400' },
    { id: 'memory', name: '記憶', nameEn: 'Mem', icon: Database, color: 'text-purple-400' },
    { id: 'expression', name: '表達', nameEn: 'Gen', icon: PenTool, color: 'text-pink-400' },
] as const;

// Sub-components for better performance
const CoreButton: React.FC<{
    core: {
        id: string;
        name: string;
        nameEn: string;
        icon: React.ComponentType<any>;
        color: string;
    };
    isSelected: boolean;
    onToggle: () => void;
}> = memo(({ core, isSelected, onToggle }) => (
    <button
        onClick={onToggle}
        className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-1.5 ${
            isSelected
                ? 'bg-white/10 border-white/30 scale-[1.03] shadow-lg'
                : 'bg-black/20 border-white/5 opacity-30 grayscale'
        }`}
    >
        <core.icon className={`w-4 h-4 ${core.color}`} />
        <span className="text-[7px] font-black text-gray-500 uppercase">{core.name}</span>
    </button>
));

export const HypercubeAiLab: React.FC<{ language: Language }> = memo(({ language }) => {
    const isZh = language === 'zh-TW';
    const { addToast } = useToast();
    const { addNote } = useCompany();
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeTool, setActiveTool] = useState<'image' | 'video' | 'intel'>('intel');
    const [resultText, setResultText] = useState<string | null>(null);
    const [synergyChain, setSynergyChain] = useState<string[]>(['perception', 'cognition', 'expression']);
    const [vitals, setVitals] = useState<SystemVital | null>(null);
    const [nodes, setNodes] = useState<UniversalKnowledgeNode[]>([]);
    const [prompt, setPrompt] = useState('');

    useEffect(() => {
        const subV = universalIntelligence.vitals$.subscribe(setVitals);
        const subNodes = setInterval(() => {
            const saved = localStorage.getItem('jun_aikey_v16_os');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.nodes) setNodes(Object.values(parsed.nodes));
            }
        }, 2000);
        return () => { subV.unsubscribe(); clearInterval(subNodes); };
    }, []);

    // Use memoized cores data
    const cores = useMemo(() =>
        CORES.map(core => ({
            ...core,
            name: isZh ? core.name : core.nameEn
        })), [isZh]
    );

    const radarData = useMemo(() => {
        if (!vitals) return [];
        return [
            { subject: 'Integrity', A: vitals.integrityScore }, { subject: 'Entropy', A: (1 - vitals.entropy) * 100 },
            { subject: 'Synergy', A: vitals.synergyLevel * 100 }, { subject: 'Sense', A: vitals.trinity.perception },
            { subject: 'Think', A: vitals.trinity.cognition }, { subject: 'Action', A: vitals.trinity.action },
        ];
    }, [vitals]);

    const handleExecute = useCallback(async () => {
        if (!prompt) return;
        setIsProcessing(true); setResultText(null);
        universalIntelligence.triggerSynergy(synergyChain);
        try {
            await new Promise(r => setTimeout(r, 1200));
            const res = await analyzeMedia("", prompt, "image/png");
            setResultText(res);
            addNote(res, ['Hypercube_Manifest'], `顯化: ${activeTool}`, `## AIOS 互補顯化\n\n${res}`, undefined, 'Hypercube_Lab');
            addToast('reward', isZh ? '顯化完成並自動備份' : 'Manifested & Auto-Synced', 'Synergy');
        } catch (e: any) { addToast('error', e.message, 'Fault'); }
        finally { setIsProcessing(false); }
    }, [prompt, synergyChain, activeTool, addNote, addToast, isZh]);

    const toggleCore = useCallback((coreId: string) => {
        setSynergyChain(prev => prev.includes(coreId) ? prev.filter(c => c !== coreId) : [...prev, coreId]);
    }, []);

    return (
        <div className="h-full flex flex-col min-h-0 overflow-hidden space-y-2">
            <div className="shrink-0 pb-1 border-b border-white/5">
                <UniversalPageHeader 
                    icon={Binary}
                    title={{ zh: '超立方指揮中心', en: 'Hypercube Command' }}
                    description={{ zh: '[萬能超立方互補協議]：感知、認知與表達的終極共鳴', en: 'Universal Complementary Protocol: At-a-glance Mission Control.' }}
                    language={language}
                    tag={{ zh: '互補內核 v16.1', en: 'SYNERGY_v16.1' }}
                />
            </div>

            {/* 指揮中心主畫布佈局 - 三欄 MECE 編排 */}
            <div className="flex-1 grid grid-cols-12 gap-3 min-h-0 overflow-hidden">
                
                {/* 左側：核心編排與輸入控制 (3/12) */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-3 min-h-0">
                    <div className="h-[200px] glass-bento p-5 bg-slate-900/60 border-white/10 rounded-3xl flex flex-col shadow-xl shrink-0">
                        <h4 className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-4 flex justify-between">CORE_ORCHESTRATION <Activity className="w-3 h-3 text-emerald-500"/></h4>
                        <div className="grid grid-cols-2 gap-2 flex-1 items-center">
                            {cores.map(core => (
                                <CoreButton
                                    key={core.id}
                                    core={core}
                                    isSelected={synergyChain.includes(core.id)}
                                    onToggle={() => toggleCore(core.id)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 glass-bento p-6 bg-slate-900/40 border-white/5 rounded-[2.2rem] shadow-2xl flex flex-col gap-4 min-h-0">
                        <div className="space-y-2 flex-1 flex flex-col min-h-0">
                             <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><BrainCircuit className="w-3 h-3 text-celestial-gold" /> Shard_Intent</label>
                             <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full flex-1 bg-black/60 border border-white/10 rounded-2xl p-4 text-[11px] text-white focus:border-celestial-gold outline-none resize-none shadow-inner leading-relaxed" placeholder="描述顯化意圖..." />
                        </div>
                        <div className="p-3 bg-black/40 border border-white/5 rounded-xl flex justify-between items-center group cursor-pointer hover:bg-white/5 transition-all shrink-0">
                             <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Manifest_Type</span>
                             <select value={activeTool} onChange={e => setActiveTool(e.target.value as any)} className="bg-transparent text-[9px] text-white font-bold outline-none cursor-pointer">
                                <option value="intel">AI_Analysis</option>
                                <option value="image">Forge_Image</option>
                             </select>
                        </div>
                        <button onClick={handleExecute} disabled={isProcessing || !prompt} className="w-full py-4 bg-white text-black font-black rounded-xl flex items-center justify-center gap-2 text-[9px] uppercase tracking-widest shadow-xl hover:bg-celestial-gold active:scale-95 disabled:opacity-30 shrink-0">
                            {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Zap className="w-3.5 h-3.5"/>} EXECUTE_PROTOCOL
                        </button>
                    </div>
                </div>

                {/* 中央：巨型顯化畫布 (6/12) */}
                <div className="col-span-12 lg:col-span-6 flex flex-col min-h-0 overflow-hidden">
                    <div className="flex-1 glass-bento bg-slate-950 border-white/10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.03)_0%,transparent_70%)] pointer-events-none" />
                        <div className="p-5 border-b border-white/5 bg-white/[0.01] flex justify-between items-center shrink-0 z-10">
                             <div className="flex items-center gap-3">
                                 <Terminal className="w-4 h-4 text-gray-700" />
                                 <span className="zh-main text-xs text-white uppercase tracking-widest">Manifestation_Wall</span>
                             </div>
                             <div className="uni-mini !bg-black/60 !text-celestial-gold border-celestial-gold/30 px-3 !text-[7px]">OMNI_L16.1</div>
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col relative">
                            {isProcessing ? (
                                <div className="h-full flex flex-col items-center justify-center gap-6 animate-fade-in relative z-10">
                                    <div className="relative">
                                        <div className="w-32 h-32 rounded-full border-4 border-white/5 border-t-celestial-gold animate-spin shadow-2xl" />
                                        <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-celestial-gold animate-ai-pulse" />
                                    </div>
                                    <p className="zh-main text-white text-lg tracking-tighter animate-pulse uppercase">Resonating_Dimensions...</p>
                                </div>
                            ) : resultText ? (
                                <div className="w-full bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] animate-fade-in relative shadow-2xl min-h-full">
                                    <div className="markdown-body prose prose-invert prose-sm text-gray-300 leading-relaxed font-light">
                                        <div dangerouslySetInnerHTML={{ __html: marked.parse(resultText) as string }} />
                                    </div>
                                    <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center opacity-40">
                                        <span className="text-[7px] font-mono text-gray-700 tracking-widest">0x8B32F02...</span>
                                        <button className="p-1.5 hover:bg-white/10 rounded-lg text-white"><Download className="w-3 h-3"/></button>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center opacity-5 grayscale text-center select-none">
                                    <Atom className="w-32 h-32 text-gray-700 animate-spin-slow mb-6" />
                                    <h4 className="zh-main text-4xl text-white uppercase tracking-[0.4em] mb-2">Aeterna_Waiting</h4>
                                    <p className="text-gray-600 text-sm font-light italic">"Initiate protocol to manifest truth."</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between shrink-0 relative z-10 px-8">
                             <div className="flex gap-8">
                                 <div className="flex flex-col">
                                     <span className="text-[7px] font-black text-gray-700 uppercase mb-0.5">Efficiency</span>
                                     <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold text-xs"><Gauge className="w-2.5 h-2.5"/> 99.4%</div>
                                 </div>
                                 <div className="flex flex-col">
                                     <span className="text-[7px] font-black text-gray-700 uppercase mb-0.5">Latency</span>
                                     <div className="flex items-center gap-1.5 text-blue-400 font-mono font-bold text-xs"><Activity className="w-2.5 h-2.5"/> 12ms</div>
                                 </div>
                             </div>
                             <div className="flex gap-2">
                                 <button className="p-2 bg-white/5 rounded-xl text-gray-600 hover:text-white transition-all"><Settings className="w-3.5 h-3.5"/></button>
                             </div>
                        </div>
                    </div>
                </div>

                {/* 右側：神經狀態熱圖 (3/12) */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-3 min-h-0 overflow-hidden">
                    <div className="flex-1 glass-bento p-5 bg-slate-950 border-emerald-500/20 rounded-[2rem] shadow-2xl flex flex-col relative overflow-hidden">
                        <h4 className="zh-main text-[9px] text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10"><Activity className="w-3 h-3" /> Neural_Vitals_Heat</h4>
                        <div className="flex-1 min-h-0 w-full relative z-10" style={{ minHeight: '200px', minWidth: '200px' }}>
                            <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.03)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 7, fontWeight: 900 }} />
                                    <Radar name="Vitals" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="h-[260px] glass-bento p-5 bg-slate-900/60 border-white/5 rounded-3xl flex flex-col min-h-0 overflow-hidden shadow-xl shrink-0">
                        <h4 className="text-[8px] font-black text-gray-700 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Active_Memory_Shards</h4>
                        <div className="flex-1 overflow-y-auto no-scrollbar space-y-1.5 pr-1">
                            {nodes.sort((a,b) => (b.growth?.heat||0) - (a.growth?.heat||0)).slice(0, 8).map(node => (
                                <div key={node.id} className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between group hover:bg-white/5 transition-all">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: (node.growth?.heat||0) > 10 ? '#10b981' : '#334155' }} />
                                        <div className="text-[8px] font-bold text-gray-600 truncate group-hover:text-gray-300 transition-colors uppercase">{node.label.text}</div>
                                    </div>
                                    <span className="text-[7px] font-mono text-emerald-500/60 font-black">{(node.growth?.heat||0).toFixed(1)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
});
