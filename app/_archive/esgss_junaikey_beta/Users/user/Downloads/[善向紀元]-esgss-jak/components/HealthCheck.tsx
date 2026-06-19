
import React, { useState, useEffect } from 'react';
import { Language, View } from '../types';
import { 
    Stethoscope, CheckSquare, Search, Loader2, Sparkles, Eye, ShieldAlert, 
    TrendingUp, Microscope, ListChecks, Globe, Activity, ShieldCheck, 
    Zap, Fingerprint, Radio, Server, Database, Target, ArrowRight,
    MapPin, AlertTriangle, Scan, SearchCode, Workflow, Heart, CheckCircle
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { OmniEsgCell } from './OmniEsgCell';

// Fix: Use a standard interface for props to ensure onNavigate is correctly detected
interface HealthCheckProps {
  language: Language;
  onNavigate?: (view: View) => void;
}

export const HealthCheck: React.FC<HealthCheckProps> = ({ language, onNavigate }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState(0);
  const [activeTab, setActiveTab] = useState<'footprint' | 'compliance' | 'risk'>('footprint');

  const scanSteps = [
    { label: isZh ? '正在檢索全球官網敘事...' : 'Crawling global narratives...', icon: Globe },
    { label: isZh ? '分析多方利害關係人情緒...' : 'Analyzing stakeholder sentiment...', icon: Heart },
    { label: isZh ? '執行供應鏈地圖 AI 對標...' : 'Executing Supply Chain AI Grounding...', icon: MapPin },
    { label: isZh ? '生成 12A 維度健康報告...' : 'Generating 12A health report...', icon: ShieldCheck }
  ];

  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanStep(0);
    addToast('info', isZh ? '啟動全域足跡深度稽核...' : 'Initiating Global Footprint Audit...', 'Kernel');

    const interval = setInterval(() => {
        setScanProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                setIsScanning(false);
                addToast('success', isZh ? '全域足跡稽核完成，偵測到 3 處邏輯偏移' : 'Audit complete. 3 logic drifts detected.', 'System');
                return 100;
            }
            const next = prev + 2;
            if (next > (scanStep + 1) * 25) setScanStep(s => Math.min(s + 1, 3));
            return next;
        });
    }, 100);
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in overflow-hidden pb-4">
        <UniversalPageHeader 
            icon={Stethoscope}
            title={{ zh: 'ESG 萬能健檢終端', en: 'Universal ESG Health Auditor' }}
            description={{ zh: '基於外部足跡之深度解析：從官網敘事、媒體情緒到供應鏈地圖對標', en: 'Deep analysis of external footprints: Narrative, sentiment, and supply chain mapping.' }}
            language={language}
            tag={{ zh: '稽核內核 v16.1', en: 'AUDIT_CORE_V16.1' }}
        />

        <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/10 w-fit backdrop-blur-xl shrink-0">
            {[
                { id: 'footprint', label: isZh ? '足跡掃描' : 'Footprint', icon: Scan },
                { id: 'compliance', label: isZh ? '合規缺口' : 'Compliance', icon: ShieldAlert },
                { id: 'risk', label: isZh ? '風險地圖' : 'Risk Map', icon: Globe },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                </button>
            ))}
        </div>

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-hidden">
            {/* 左側：掃描主控台 (8/12) */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 min-h-0 overflow-hidden">
                <div className="flex-1 glass-bento p-10 flex flex-col bg-slate-900/40 relative overflow-hidden shadow-2xl rounded-[3.5rem]">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none"><Workflow className="w-80 h-80 text-celestial-blue" /></div>
                    
                    <div className="flex justify-between items-center mb-10 shrink-0 relative z-10">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-celestial-blue/20 rounded-[1.5rem] text-celestial-blue border border-celestial-blue/30 shadow-lg relative">
                                <SearchCode className={`w-8 h-8 ${isScanning ? 'animate-pulse' : ''}`} />
                                {isScanning && <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-ping" />}
                            </div>
                            <div>
                                <h3 className="zh-main text-2xl text-white tracking-tighter uppercase">{isZh ? '外部數位足跡稽核' : 'External Digital Audit'}</h3>
                                <span className="en-sub !mt-1 text-gray-500 font-black tracking-widest">SCAN_PROTOCOL_v2.4_ACTIVE</span>
                            </div>
                        </div>
                        <button 
                            onClick={handleStartScan}
                            disabled={isScanning}
                            className="px-10 py-4 bg-white text-black font-black rounded-2xl text-[11px] uppercase tracking-[0.3em] hover:bg-celestial-gold transition-all shadow-xl active:scale-95 disabled:opacity-30"
                        >
                            {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                            START_DEEP_SCAN
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar relative z-10">
                        {isScanning ? (
                            <div className="h-full flex flex-col items-center justify-center p-12 animate-fade-in">
                                <div className="relative mb-12">
                                    <div className="w-48 h-48 rounded-full border-4 border-white/5 flex items-center justify-center">
                                        <div className="w-40 h-40 rounded-full border-2 border-dashed border-celestial-blue/30 animate-[spin_8s_linear_infinite]" />
                                    </div>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-5xl font-mono font-black text-white tracking-tighter">{scanProgress}%</span>
                                        <span className="text-[9px] text-gray-600 font-black uppercase mt-1">Analyzing...</span>
                                    </div>
                                </div>
                                <div className="w-full max-w-md space-y-4">
                                    {scanSteps.map((step, i) => (
                                        <div key={i} className={`flex items-center gap-5 p-4 rounded-2xl border transition-all duration-700 ${scanStep >= i ? 'bg-white/5 border-white/10' : 'opacity-20 grayscale'}`}>
                                            <div className={`p-2.5 rounded-xl ${scanStep === i ? 'bg-celestial-blue text-white animate-pulse' : scanStep > i ? 'bg-emerald-500/20 text-emerald-400' : 'bg-black/40 text-gray-700'}`}>
                                                <step.icon className="w-5 h-5" />
                                            </div>
                                            <span className={`zh-main text-sm ${scanStep === i ? 'text-white' : 'text-gray-500'}`}>{step.label}</span>
                                            {scanStep > i && <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                                {[
                                    { title: "GRI 敘事不一致", level: "Critical", desc: "官網願景宣稱 2030 淨零，但年度報告僅揭露 Scope 1+2，存在重大透明度缺口。", color: "rose", hash: "GAP_01" },
                                    { title: "供應商 B 級風險偵測", level: "Warning", desc: "Sector B 區域供應商 A9 偵測到環境違規紀錄，可能產生 Scope 3 品牌連鎖風險。", color: "amber", hash: "RISK_08" },
                                    { title: "媒體情緒偏離", level: "Info", desc: "近期社群媒體對其勞工權益討論熱度上升，偵測到中性偏負面之情緒波動。", color: "blue", hash: "INF_42" },
                                ].map((alert, i) => (
                                    <div key={i} className="p-8 bg-black/60 border border-white/5 rounded-[3rem] hover:border-white/20 transition-all group relative overflow-hidden shadow-2xl">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`px-4 py-1 rounded-full bg-${alert.color}-500/10 text-${alert.color}-500 text-[10px] font-black uppercase border border-${alert.color}-500/20`}>{alert.level}</div>
                                            <span className="text-[10px] font-mono text-gray-800">SIG_{alert.hash}</span>
                                        </div>
                                        <h4 className="zh-main text-xl text-white mb-4 group-hover:text-celestial-gold transition-colors">{alert.title}</h4>
                                        <p className="text-sm text-gray-500 leading-relaxed font-light mb-6 italic">"{alert.desc}"</p>
                                        <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 flex items-start gap-4">
                                            <Sparkles className="w-5 h-5 text-celestial-gold shrink-0 mt-0.5" />
                                            <div className="text-[11px] text-gray-300 leading-relaxed">
                                                <b className="text-white not-italic uppercase text-[8px] block mb-1">AI_Tactical_Recommendation:</b>
                                                {isZh ? "建議執行「供應鏈透明度對標協定」並發布 Q3 特別透明度更新以穩定品牌信任。" : "Execute transparency protocol and release Q3 update."}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 右側：指標與診斷狀態 (4/12) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-hidden">
                <div className="glass-bento p-10 bg-slate-950 border-white/10 rounded-[3.5rem] shadow-2xl relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none"><Fingerprint className="w-64 h-64 text-white" /></div>
                    <h4 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.4em] mb-10 flex items-center gap-4 relative z-10">
                        <Activity className="w-5 h-5 text-emerald-500" /> GLOBAL_AUDIT_VITALS
                    </h4>
                    
                    <div className="space-y-8 relative z-10">
                        <div className="p-6 bg-white/[0.03] rounded-[2.5rem] border border-white/5 shadow-inner">
                            <div className="flex justify-between items-end mb-3">
                                <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Audit_Confidence</div>
                                <div className="text-2xl font-mono font-bold text-white">99.8%</div>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" style={{ width: '99.8%' }} />
                            </div>
                        </div>

                        <div className="p-6 bg-white/[0.03] rounded-[2.5rem] border border-white/5 shadow-inner">
                            <div className="flex justify-between items-end mb-3">
                                <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Data_Ingestion_Lat</div>
                                <div className="text-2xl font-mono font-bold text-celestial-blue">142ms</div>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-celestial-blue shadow-[0_0_10px_#3b82f6]" style={{ width: '85%' }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-bento p-8 flex-1 flex flex-col bg-slate-900/60 border-white/5 rounded-[3rem] shadow-2xl overflow-hidden min-h-0">
                    <div className="flex justify-between items-center mb-6 shrink-0">
                         <h4 className="zh-main text-lg text-white tracking-widest uppercase">Target_Registry</h4>
                         <span className="uni-mini bg-slate-800 text-gray-500">Live_Watchlist</span>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-1">
                        {['Supply_Chain_A9', 'Narrative_Node_01', 'Sentiment_Bus_X'].map((node, i) => (
                            <div key={i} className="p-4 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-celestial-gold transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white/5 rounded-lg text-gray-600 group-hover:text-celestial-gold transition-colors"><Radio className="w-4 h-4" /></div>
                                    <div className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">{node}</div>
                                </div>
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
