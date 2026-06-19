import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    History,
    Link,
    ArrowRightLeft,
    Sparkles,
    ShieldCheck,
    Trash2,
    Database,
    Clock,
    User,
    Bot,
    Server,
    Zap,
    AlertTriangle
} from 'lucide-react';
import { tagEvolutionService } from '@/utils/omniTagEvolutionService';
import { TagEvent } from '@/types/omniTag';
import OmniTagBadge from './OmniTagBadge';

/**
 * OmniTagLineageViewer: Visualizes the "Double-Ended Tracking" and "Data Lineage" 
 * of the generative tagging mechanism.
 */
const OmniTagLineageViewer: React.FC<{ resourceId?: string }> = ({ resourceId = 'res-001' }) => {
    const [events, setEvents] = useState<TagEvent[]>([]);
    const [activeTab, setActiveTab] = useState<'lineage' | 'tracking' | 'governance'>('lineage');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // Initial mock data seed
        tagEvolutionService.seedMockData();
    }, []);

    const simulateEvolution = async () => {
        setIsProcessing(true);
        // Simulate AI detection of "Security Risk in Data Nexus"
        const newTags = await tagEvolutionService.generateTags("Detected Security Risk in the Data Nexus storage.");

        newTags.forEach(tag => {
            tagEvolutionService.recordEvent({
                resourceId,
                tagString: tag,
                action: 'added',
                origin: 'AI-Evolution-Engine',
                metadata: { confidence: 0.88, context: 'Real-time Monitoring' }
            });
        });

        // Trigger weight-based cleanup simulation
        await tagEvolutionService.autoCleanupResources(0.5);

        setIsProcessing(false);
    };

    const getOriginIcon = (origin: string) => {
        if (origin.toLowerCase().includes('ai')) return <Bot size={12} className="text-purple-400" />;
        if (origin.toLowerCase().includes('user')) return <User size={12} className="text-blue-400" />;
        return <Server size={12} className="text-slate-500" />;
    };

    return (
        <div className="bg-slate-900/60 border border-white/10 rounded-[28px] overflow-hidden flex flex-col h-[600px] backdrop-blur-2xl">
            {/* Header Control */}
            <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
                        <History className="text-indigo-400" size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white leading-tight">標籤血緣與雙向追蹤 (Tag Lineage)</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Resource ID: {resourceId}</p>
                    </div>
                </div>

                <div className="flex bg-slate-950/50 p-1 rounded-xl border border-white/5">
                    <button
                        onClick={() => setActiveTab('lineage')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'lineage' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Link size={14} /> 血緣
                    </button>
                    <button
                        onClick={() => setActiveTab('tracking')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'tracking' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <ArrowRightLeft size={14} /> 雙向
                    </button>
                    <button
                        onClick={() => setActiveTab('governance')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'governance' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <ShieldCheck size={14} /> 治理
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden flex">
                {/* Timeline / Event Stream */}
                <div className="w-2/3 border-r border-white/5 p-6 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            Event Pulse Stream
                        </h4>
                        <button
                            onClick={simulateEvolution}
                            disabled={isProcessing}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 ${isProcessing ? 'bg-slate-800 border-white/5 text-slate-600' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white'}`}
                        >
                            <Sparkles size={12} className={isProcessing ? 'animate-spin' : ''} />
                            觸發智能演化
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Placeholder for real-time events */}
                        <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex flex-col gap-3 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-all" />
                            <div className="flex justify-between items-start relative z-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                        <Bot size={14} className="text-indigo-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-white">AI 生成式標註</div>
                                        <div className="text-[9px] text-slate-500 font-mono">T-432 ms ago</div>
                                    </div>
                                </div>
                                <div className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-widest border border-emerald-500/30">
                                    Added
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <OmniTagBadge tag="sys:sec:threat" size="xs" />
                                <OmniTagBadge tag="meta:risk:critical" size="xs" />
                            </div>
                        </div>

                        {/* More events would be rendered here from tagEvolutionService.events */}
                        <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                        <User size={14} className="text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-white">召喚神使手動校準</div>
                                        <div className="text-[9px] text-slate-500 font-mono">T-12 min ago</div>
                                    </div>
                                </div>
                                <div className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[9px] font-bold uppercase tracking-widest border border-amber-500/30">
                                    Updated
                                </div>
                            </div>
                            <div className="text-xs text-slate-400 italic font-medium">調整安全權重，降低誤報機率。</div>
                        </div>

                        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                                        <Zap size={14} className="text-amber-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-white">自動化權重清洗</div>
                                        <div className="text-[9px] text-slate-500 font-mono">T-1 hour ago</div>
                                    </div>
                                </div>
                                <div className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[9px] font-bold uppercase tracking-widest border border-red-500/30">
                                    Removed
                                </div>
                            </div>
                            <div className="flex gap-2 opacity-50 grayscale">
                                <OmniTagBadge tag="user:temp:test" size="xs" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Panel */}
                <div className="w-1/3 p-6 flex flex-col gap-6 bg-slate-950/20">
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">系統效能健康度</h4>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                            <div>
                                <div className="flex justify-between text-[10px] mb-1">
                                    <span className="text-slate-500 font-bold uppercase">追蹤即時性</span>
                                    <span className="text-emerald-400 font-mono">99.9%</span>
                                </div>
                                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[99%]" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] mb-1">
                                    <span className="text-slate-500 font-bold uppercase">AI 生成準確率</span>
                                    <span className="text-indigo-400 font-mono">92.4%</span>
                                </div>
                                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-[92%]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">當前追蹤資源</h4>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-xl">
                                <Database size={18} className="text-blue-400" />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-white">Data Nexus Storage</div>
                                <div className="text-[9px] text-slate-500">Infrastructure Core Item</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-center">
                            <div className="text-[18px] font-black text-white font-mono">1,240</div>
                            <div className="text-[8px] text-indigo-400 font-bold uppercase tracking-widest">永久事件數</div>
                        </div>
                        <div className="p-3 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 text-center">
                            <div className="text-[18px] font-black text-white font-mono">128</div>
                            <div className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest">活性標籤集</div>
                        </div>
                    </div>

                    <div className="mt-auto p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-3">
                        <AlertTriangle className="text-amber-400 shrink-0" size={16} />
                        <p className="text-[10px] text-amber-500 font-medium leading-tight">
                            系統偵測到 3 個低權重冗餘標籤，建議進行「手動權重校準」以降低存儲熵增。
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer Status */}
            <div className="px-6 py-3 border-t border-white/5 bg-slate-950/40 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        LIVE TRACKING ACTIVE
                    </span>
                    <span className="text-[10px] text-slate-600 font-mono">Event Bus: Kafka-Mirror Connected</span>
                </div>
                <div className="text-[10px] text-slate-700 font-medium italic italic">
                    符合 GDPR & ISO 27001 數據安全合規標準
                </div>
            </div>
        </div>
    );
};

export default OmniTagLineageViewer;
