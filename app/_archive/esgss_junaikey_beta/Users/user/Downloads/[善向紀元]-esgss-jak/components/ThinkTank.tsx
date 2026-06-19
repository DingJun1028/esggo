
import React, { useState } from 'react';
import { Language, AgentSoul5D, SkillNode, EvolutionProposal } from '../types';
import { 
    Archive, Sparkles, ShieldCheck, Zap, Database, BrainCircuit, 
    Layers, Search, Terminal, RefreshCw, Loader2, Play, Lock, 
    ArrowRight, MessageSquare, Fingerprint, Activity, Code, List, Eye
} from 'lucide-react';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useToast } from '../contexts/ToastContext';

export const ThinkTank: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'matrix' | 'skills' | 'evolution' | 'rag'>('matrix');

  // Mock 5D Soul Data (依照 PDF 定義)
  const [souls] = useState<AgentSoul5D[]>([
      {
          id: 'jak-core',
          essence: { name: 'JunAiKey Core', tone: 'Technical / Authoritative', backstory: 'The original architect kernel.' },
          covenant: { prompt: 'You are the divine navigator...', safety: 'L15 Guardrails Active' },
          memory: { knowledgeBaseIds: ['esg-standard-v1'], retentionDays: 365 },
          authority: { skillIds: ['s1', 's2'], permissions: ['fs_write', 'api_call'] },
          foundation: { model: 'Gemini 3 Pro', temperature: 0.2, tokens: 128000 }
      }
  ]);

  const [skills] = useState<SkillNode[]>([
      { id: 's1', name: 'Quantum Ingestion', type: 'Active', description: 'Bypasses standard parsing for raw neural feed.', mastery: 85, status: 'Ready' },
      { id: 's2', name: 'MECE Refactoring', type: 'Passive', description: 'Automatically cleans output for logical symmetry.', mastery: 99, status: 'Ready' },
      { id: 's3', name: 'Ecosystem Bridge', type: 'Composite', description: 'Multi-SaaS sync sequence.', mastery: 40, status: 'Cooldown' }
  ]);

  const [proposals] = useState<EvolutionProposal[]>([
      { id: 'ep-01', pattern: 'Repeated CORS failure in Integration', suggestedSkill: 'Proxy_Auto_Config', confidence: 0.98, status: 'Pending' }
  ]);

  const handleApprove = (id: string) => {
      addToast('success', isZh ? `提案 ${id} 已批准並刻印至技能樹` : `Proposal ${id} approved & engraved`, 'HITL');
  };

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in overflow-hidden">
        <UniversalPageHeader 
            icon={Archive}
            title={{ zh: '萬能智庫：記憶聖所', en: 'Omnipotent Think Tank' }}
            description={{ zh: '全知之眼：管理 AI 靈魂、權能與永恆進化', en: 'All-Seeing Eye: Managing Souls, Authority & Evolution' }}
            language={language}
            tag={{ zh: '記憶核心 v1.2', en: 'MEM_SANCTUARY_V1.2' }}
        />

        {/* Tank Navigation */}
        <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/10 w-fit backdrop-blur-xl shrink-0 shadow-xl">
            {[
                { id: 'matrix', label: isZh ? '五維靈魂' : '5D Soul', icon: Fingerprint },
                { id: 'skills', label: isZh ? '權能樹' : 'Skills', icon: Zap },
                { id: 'evolution', label: isZh ? '審查聖殿' : 'Evolution', icon: RefreshCw },
                { id: 'rag', label: isZh ? '向量記憶' : 'Memory', icon: Database },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                </button>
            ))}
        </div>

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-hidden">
            
            {/* Main Content Area */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 overflow-hidden">
                {activeTab === 'matrix' && (
                    <div className="flex-1 glass-bento p-8 bg-slate-900/40 relative overflow-hidden flex flex-col shadow-2xl rounded-[3rem]">
                        <div className="flex justify-between items-center mb-8 shrink-0">
                            <h3 className="zh-main text-2xl text-white">五維靈魂架構 (ASCMS)</h3>
                            <span className="uni-mini bg-celestial-gold text-black shadow-lg tracking-widest">GOD_MODE</span>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                            {souls.map(soul => (
                                <div key={soul.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-6 bg-black/40 border border-white/5 rounded-[2.5rem] space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg"><Eye className="w-4 h-4"/></div>
                                            <span className="text-[10px] font-black text-gray-500 uppercase">Essence_Layer</span>
                                        </div>
                                        <div className="zh-main text-lg text-white">{soul.essence.name}</div>
                                        <p className="text-xs text-gray-400 leading-relaxed italic">"{soul.essence.backstory}"</p>
                                    </div>

                                    <div className="p-6 bg-black/40 border border-white/5 rounded-[2.5rem] space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><ShieldCheck className="w-4 h-4"/></div>
                                            <span className="text-[10px] font-black text-gray-500 uppercase">Covenant_Layer</span>
                                        </div>
                                        <div className="text-[10px] font-mono text-emerald-500 p-3 bg-black rounded-xl border border-white/5 h-20 overflow-hidden">
                                            {soul.covenant.prompt}
                                        </div>
                                    </div>

                                    <div className="p-6 bg-black/40 border border-white/5 rounded-[2.5rem] space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg"><Database className="w-4 h-4"/></div>
                                            <span className="text-[10px] font-black text-gray-500 uppercase">Memory_Layer</span>
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            {soul.memory.knowledgeBaseIds.map(kb => (
                                                <span key={kb} className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-white border border-white/10">{kb}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6 bg-black/40 border border-white/5 rounded-[2.5rem] space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg"><Zap className="w-4 h-4"/></div>
                                            <span className="text-[10px] font-black text-gray-500 uppercase">Authority_Layer</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="text-[10px] text-gray-400">Skills: {soul.authority.skillIds.length}</div>
                                            <div className="text-[10px] text-gray-400">Perms: {soul.authority.permissions.length}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'skills' && (
                    <div className="flex-1 glass-bento p-8 bg-slate-900/40 flex flex-col shadow-2xl rounded-[3rem]">
                        <h3 className="zh-main text-2xl text-white mb-8">權能層：技能樹 (Skill Tree)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto no-scrollbar pr-2">
                            {skills.map(skill => (
                                <div key={skill.id} className="p-6 bg-black/40 border border-white/5 rounded-[2rem] group hover:border-celestial-gold transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg bg-white/5 ${skill.status === 'Ready' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                <Code className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="zh-main text-white">{skill.name}</h4>
                                                <span className="en-sub !text-[8px] opacity-40">{skill.type}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-mono text-emerald-400">MASTERY {skill.mastery}%</div>
                                            <div className="uni-mini !bg-slate-800 !text-gray-500 !text-[8px] mt-1">{skill.status}</div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 leading-relaxed mb-4">{skill.description}</p>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-celestial-gold" style={{ width: `${skill.mastery}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'evolution' && (
                    <div className="flex-1 glass-bento p-8 bg-slate-900/40 flex flex-col shadow-2xl rounded-[3rem]">
                        <div className="flex justify-between items-center mb-8 shrink-0">
                            <h3 className="zh-main text-2xl text-white">審查聖殿 (Sanctuary of Review)</h3>
                            <div className="flex items-center gap-2 text-xs text-emerald-500 animate-pulse">
                                <Activity className="w-3 h-3" /> EVO_ENGINE_LISTENING
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            {proposals.map(prop => (
                                <div key={prop.id} className="p-8 bg-black/40 border-2 border-celestial-gold/30 rounded-[2.5rem] shadow-xl relative overflow-hidden animate-slide-up">
                                    <div className="absolute top-0 right-0 p-4 opacity-[0.05]"><Sparkles className="w-32 h-32 text-celestial-gold" /></div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <div className="uni-mini bg-celestial-gold text-black mb-2 uppercase">SKILL_PROPOSAL</div>
                                            <h4 className="zh-main text-2xl text-white">{prop.suggestedSkill}</h4>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-black text-emerald-400">CONFIDENCE: {(prop.confidence*100).toFixed(0)}%</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl mb-8">
                                        <span className="text-[9px] font-black text-gray-500 uppercase block mb-1">Detected_Pattern</span>
                                        <p className="text-sm text-gray-300 italic">{prop.pattern}</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <button 
                                            onClick={() => handleApprove(prop.id)}
                                            className="flex-1 py-4 bg-emerald-500 text-black font-black rounded-2xl hover:scale-[1.02] transition-all shadow-lg"
                                        >
                                            AUTHORIZE (批准)
                                        </button>
                                        <button className="px-8 py-4 bg-white/5 border border-white/10 text-rose-500 font-bold rounded-2xl hover:bg-rose-500/10 transition-all">
                                            VETO (否決)
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Side: Global Metrics & Terminal */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-hidden">
                <div className="glass-bento p-8 flex flex-col bg-slate-950 border-white/10 rounded-[3rem] shadow-2xl relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02]"><Activity className="w-48 h-48" /></div>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-2 relative z-10"><Terminal className="w-4 h-4" /> KERNEL_VITALS</h4>
                    
                    <div className="space-y-6 relative z-10">
                        <div className="p-5 bg-white/[0.02] rounded-3xl border border-white/5">
                            <div className="flex justify-between text-[10px] text-gray-500 uppercase font-black mb-2">Memory_Sanctuary_Recall</div>
                            <div className="text-3xl font-mono font-bold text-emerald-400">95.4%</div>
                        </div>
                        <div className="p-5 bg-white/[0.02] rounded-3xl border border-white/5">
                            <div className="flex justify-between text-[10px] text-gray-500 uppercase font-black mb-2">System_Negative_Entropy</div>
                            <div className="text-3xl font-mono font-bold text-celestial-gold">0.082</div>
                        </div>
                    </div>
                </div>

                <div className="glass-bento p-6 flex-1 flex flex-col bg-slate-900/40 border-white/5 rounded-[2.5rem] shadow-xl min-h-0 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="en-sub !text-[9px] text-emerald-500 flex items-center gap-2"><Activity className="w-3 h-3" /> Neural_Log_Relay</h4>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 font-mono text-[9px] text-gray-500 pr-2">
                        {[
                            { t: '14:32:11', m: 'Pattern recognition engine: scan complete.', c: 'text-gray-600' },
                            { t: '14:32:15', m: 'Entropy reduction optimization applied.', c: 'text-emerald-400' },
                            { t: '14:33:02', m: 'RAG retrieval: 142ms latency.', c: 'text-blue-400' },
                            { t: '14:33:45', m: 'Memory anchor engraved to block #5921.', c: 'text-celestial-gold' },
                            { t: '14:34:20', m: 'Awaiting God-Mode authorization...', c: 'text-amber-500 animate-pulse' },
                        ].map((log, i) => (
                            <div key={i} className="flex gap-2 pb-1 border-b border-white/[0.02]">
                                <span className="shrink-0 opacity-40">[{log.t}]</span>
                                <span className={log.c}>{log.m}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
