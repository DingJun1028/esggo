import React, { useState, useEffect } from 'react';
import { adk, IAgentConfig } from '../../../core/omni-adk';
import { DigitalTwin } from '../../../lib/ncb-service';
import { omniLogger, LogCategory } from '../../../core/omniLogger';
import { Sparkles, Users, Activity, ShieldCheck, Cpu, Brain, Zap, Globe, Info } from 'lucide-react';
import { OmniMangaTutorial } from '../UI/OmniMangaTutorial';

const ADK_MANGA_PANELS = [
    {
        id: 1,
        src: '/assets/manga/adk-panel-1.png',
        title: '種子：數位覺醒',
        description: '將數位分身的意圖 (Seed) 投入系統，開啟共鳴之旅。',
        pill: 'SEED'
    },
    {
        id: 2,
        src: '/assets/manga/adk-panel-2.png',
        title: '儀軌：代理降臨',
        description: 'Trinity 聖三一代理降臨，為您的分身配置最強智慧矩陣。',
        pill: 'RITUAL'
    },
    {
        id: 3,
        src: '/assets/manga/adk-panel-3.png',
        title: '封印：5T 鎖定',
        description: '所有決策經過 5T 協議驗算，並以 Hash Lock 永久封印。',
        pill: 'STABILITY'
    },
    {
        id: 4,
        src: '/assets/manga/adk-panel-4.png',
        title: '自主：代主自行',
        description: '開啟自主通典，您的數位分身將在背景為您永續運作。',
        pill: 'AUTONOMY'
    }
];

interface ADKActivationPortalProps {
    twin: DigitalTwin;
    onActivated?: (sessionId: string, agents: IAgentConfig[]) => void;
}

export const ADKActivationPortal: React.FC<ADKActivationPortalProps> = ({ twin, onActivated }) => {
    const [status, setStatus] = useState<'IDLE' | 'ACTIVATING' | 'ACTIVE'>('IDLE');
    const [agents, setAgents] = useState<IAgentConfig[]>([]);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isAutonomous, setIsAutonomous] = useState(false);
    const [actionLog, setActionLog] = useState<{ id: string; msg: string; time: string }[]>([]);

    useEffect(() => {
        if (status === 'ACTIVE') {
            omniLogger.info(LogCategory.SYSTEM, "UI: Subscribing to ADK Heartbeat...");
            const unsubscribe = adk.subscribe((event) => {
                if (event.type === 'AUTONOMOUS_ACTION' && isAutonomous) {
                    setActionLog(prev => [{
                        id: event.atom.uuid,
                        msg: event.msg,
                        time: event.time,
                        score: event.atom.payload.validationScore
                    }, ...prev].slice(0, 10));
                }
            });
            return () => unsubscribe();
        }
    }, [isAutonomous, status]);

    const handleActivate = async () => {
        setStatus('ACTIVATING');
        omniLogger.info(LogCategory.SYSTEM, `UI: Triggering real ADK activation for ${twin.nickname}`);
        
        try {
            const result = await adk.activateDigitalTwinGroup(twin);
            setAgents(result.agents);
            setSessionId(result.sessionId);
            setStatus('ACTIVE');

            if (onActivated) {
                onActivated(result.sessionId, result.agents);
            }
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, "Failed to activate ADK Group", error);
            setStatus('IDLE');
        }
    };

    const toggleAutonomous = async () => {
        if (!sessionId) return;
        
        const nextState = !isAutonomous;
        setIsAutonomous(nextState);
        
        if (nextState) {
            omniLogger.info(LogCategory.SYSTEM, "UI: Enabling Autonomous Mode");
            await adk.startAutonomousProtocol(twin);
            // 模擬動作紀錄
            setActionLog(prev => [{
                id: Math.random().toString(),
                msg: "啟動自主通典：感知環境中...",
                time: new Date().toLocaleTimeString()
            }, ...prev]);
        } else {
            omniLogger.info(LogCategory.SYSTEM, "UI: Disabling Autonomous Mode");
            adk.stopAutonomousProtocol(sessionId);
        }
    };

    const getAgentIcon = (role: string) => {
        // Trinity Domain
        if (role.includes('OmniOne')) return <Sparkles size={18} className="text-[#ffd700]" />;
        if (role.includes('OmniPriest')) return <ShieldCheck size={18} className="text-[#52C41A]" />;
        if (role.includes('OmniGemini')) return <Brain size={18} className="text-[#63a6b0]" />;
        
        // Personas
        if (role.includes('Thoth')) return <Sparkles size={18} className="text-purple-400" />;
        if (role.includes('King')) return <Zap size={18} className="text-amber-500" />;
        if (role.includes('JunAiKey')) return <Users size={18} className="text-blue-400" />;
        
        // Standards
        if (role.includes('Analyst')) return <Cpu size={18} />;
        if (role.includes('Critic')) return <Zap size={18} />;
        if (role.includes('Synthesizer')) return <Brain size={18} />;
        return <Globe size={18} />;
    };

    return (
        <div className="w-full">
            <OmniMangaTutorial 
                title="ADK 運作機制：服務即教學" 
                subtitle="The Secret of Autonomous Agency" 
                panels={ADK_MANGA_PANELS} 
            />
            
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-500 hover:shadow-[0_0_30px_rgba(99,166,176,0.3)]">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-gradient-to-br from-[#63a6b0] to-[#4a8a94] text-white shadow-lg">
                        <Users size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 tracking-tight">ADK 智慧代理群</h3>
                        <p className="text-sm text-gray-500 font-medium">Standardized Agentic Environment</p>
                    </div>
                </div>
                {status === 'ACTIVE' && (
                    <div className="px-3 py-1 rounded-full bg-[#52C41A]/10 text-[#52C41A] text-xs font-bold border border-[#52C41A]/20 flex items-center gap-1">
                        <ShieldCheck size={14} /> 已同步至 54686
                    </div>
                )}
            </div>

            <div className="bg-[#F0F2F5]/50 rounded-xl p-5 border border-white/40 mb-8 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#63a6b0] transition-all duration-300 group-hover:w-2" />
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <Sparkles size={18} className={`transition-all duration-1000 ${isAutonomous ? 'text-[#ffd700] scale-125' : 'text-gray-400'}`} />
                        <span className="text-sm font-bold text-gray-700">正在共鳴：{twin.nickname}</span>
                    </div>
                    {status === 'ACTIVE' && (
                        <div className="flex items-center gap-4">
                            <div 
                                onClick={toggleAutonomous}
                                className={`flex items-center gap-1 px-3 py-1 rounded-full cursor-pointer transition-all border ${
                                    isAutonomous 
                                    ? 'bg-[#63a6b0] text-white border-[#63a6b0] shadow-lg scale-105' 
                                    : 'bg-white text-[#63a6b0] border-[#63a6b0]/30 hover:bg-[#63a6b0]/5'
                                }`}
                            >
                                <Zap size={12} className={isAutonomous ? 'animate-pulse' : ''} />
                                <span className="text-[10px] font-bold">{isAutonomous ? '自主運行中' : '開啟自主操作'}</span>
                            </div>
                        </div>
                    )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed italic">
                    「{twin.nature_law.substring(0, 60)}...」
                </p>
                
                {isAutonomous && actionLog.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/40 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-bold text-[#63a6b0]">
                            <span>自主決策串流</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                        </div>
                        <div className="max-h-20 overflow-y-auto space-y-1.5 scrollbar-hide">
                            {actionLog.map(log => (
                                <div key={log.id} className="flex items-start gap-2 bg-white/40 p-1.5 rounded text-[9px] border border-white/60 animate-in fade-in slide-in-from-left-2">
                                    <span className="text-gray-400 font-mono">[{log.time}]</span>
                                    <div className="flex-1">
                                        <span className="text-gray-600 font-medium">{log.msg}</span>
                                        {(log as any).score && (
                                            <span className="ml-2 px-1 rounded bg-[#63a6b0]/10 text-[#63a6b0] font-bold">5T: {(log as any).score}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {status === 'IDLE' && (
                <button
                    onClick={handleActivate}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#63a6b0] to-[#4a8a94] text-white font-bold text-lg shadow-xl hover:shadow-[0_10px_20px_rgba(99,166,176,0.4)] hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    <Activity size={20} /> 開啟智慧分身代理群
                </button>
            )}

            {status === 'ACTIVATING' && (
                <div className="w-full py-4 rounded-xl bg-gray-100 text-gray-400 font-bold text-lg flex items-center justify-center gap-3 animate-pulse">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-[#63a6b0] rounded-full animate-spin" />
                    矩陣喚醒中...
                </div>
            )}

            {status === 'ACTIVE' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {agents.map((agent) => (
                            <div key={agent.id} className="p-4 rounded-lg bg-white border border-gray-100 shadow-sm flex flex-col gap-2 transition-all hover:border-[#63a6b0]/30 hover:shadow-md group/card">
                                <div className="flex items-center justify-between">
                                    <div className="w-8 h-8 rounded-full bg-[#63a6b0]/10 text-[#63a6b0] flex items-center justify-center">
                                        {getAgentIcon(agent.role)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="text-[8px] bg-[#63a6b0]/10 text-[#63a6b0] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                                            <ShieldCheck size={8} /> 5T
                                        </div>
                                        <span className="text-[9px] text-[#52C41A] font-bold tracking-widest uppercase px-2 py-0.5 bg-[#52C41A]/5 rounded-full">Active</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-800">{agent.role}</h4>
                                    <p className="text-[10px] text-gray-400 line-clamp-1 group-hover/card:line-clamp-none transition-all">{agent.goal}</p>
                                </div>
                                <div className="flex gap-1 flex-wrap mt-1">
                                    {agent.capabilities.slice(0, 3).map(cap => (
                                        <span key={cap} className="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold">{cap.replace('skill_', '')}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 bg-[#F0F2F5] rounded-lg text-center border border-dashed border-gray-200">
                        <span className="text-[10px] text-gray-400 font-mono tracking-tighter">Session: {sessionId}</span>
                    </div>
                </div>
            )}
        </div>
    </div>
);
};
